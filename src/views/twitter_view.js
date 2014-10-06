"use strict";

function twitter(settings) {
    var context = {},
        timeline_r = new XMLHttpRequest();

    timeline_r.open("GET", settings.api_url + "statuses/user_timeline.json?" +
        "count=50&include_rts=true&exclude_replies=true&screen_name=" + settings.username, false);

    //************************************************.............?????????



    timeline_r.onload = function() {
        if (this.status !== 200) return;
        context = JSON.parse(this.responseText);
    };
    timeline_r.send();

    /*    statuses_in_dict = []
        for s in statuses:
            statuses_in_dict.append(json.loads(s.AsJsonString()))

        return HttpResponse(content=json.dumps(statuses_in_dict),
                            status=200,
                            content_type="application/json")
    			*/
    return context;
}
define(function() {
    return twitter;
});
