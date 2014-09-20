function foursquare(settings){
	var context = {},
	user_r = new XMLHttpRequest(),
	checkins_r = new XMLHttpRequest();

    user_r = requests.get('{0}users/self?oauth_token={1}&v=20120812'.format(
        settings.FOURSQUARE_API_URL,
        settings.FOURSQUARE_ACCESS_TOKEN))

    user_data = json.loads(user_r.text)
    user_response = user_data.get('response', {})
    user_info = user_response.get('user', None)

    checkins_r = requests.get('{0}users/self/checkins?oauth_token={1}&v=20120812'.format(
        settings.FOURSQUARE_API_URL,
        settings.FOURSQUARE_ACCESS_TOKEN))

    checkins_data = json.loads(checkins_r.text)
    checkins_response = checkins_data.get('response', {})
    checkins = checkins_response.get('checkins', None)

    if not settings.FOURSQUARE_SHOW_CURRENT_DAY:
        valid_checkins = []
        now = datetime.datetime.now()
        for c in checkins['items']:
            created_at = c.get('createdAt', None)
            if created_at:
                created_at_dt = datetime.datetime.fromtimestamp(int(created_at))
                if (now - created_at_dt) > datetime.timedelta(days=1):
                    valid_checkins.append(c)
        checkins['items'] = valid_checkins

    context = {'user': user_info, 'checkins': checkins}

    return HttpResponse(content=json.dumps(context), status=checkins_r.status_code,
                        content_type=checkins_r.headers['content-type'])
