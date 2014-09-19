function Twitter(username) {

    statuses = api.GetUserTimeline(username, include_rts=True, 
        exclude_replies=True, count=50)

    statuses_in_dict = []
    for s in statuses:
        statuses_in_dict.append(json.loads(s.AsJsonString()))

    return HttpResponse(content=json.dumps(statuses_in_dict),
                        status=200,
                        content_type='application/json')
