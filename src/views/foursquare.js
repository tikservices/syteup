'use strict';

function foursquare(settings) {

    return Promise.all([
        asyncGet(settings.api_url + "users/self?v=20120812&oauth_token=" + settings.access_token),
        asyncGet(settings.api_url + "users/self/checkins?v=20120812&oauth_token=" + settings.access_token)
    ]).then(function(res) {
        console.log(res);
        var checkins = res[1]['response']['checkins'];
        /*
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
        			*/
        return Promise.resolve({
            user: res[0]['response']['user'],
            checkins: checkins
        });
    });
}
define(function() {
    return foursquare;
});