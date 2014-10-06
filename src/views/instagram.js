"use strict";

function instagram(settings) {
    if (settings.next_id) //just show more instagram photos
        return asyncGet(settings.api_url + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token + "&max_id=" + settings.next_id)
        .then(function(res) {
            return Promise.resolve({
                "media": res["data"],
                "pagination": res["pagination"]
            });
        });
    else
        return Promise.all([
            asyncGet(settings.api_url + "users/" + settings.user_id + "/?access_token=" + settings.access_token),
            asyncGet(settings.api_url + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token)
        ]).then(function(res) {
            return Promise.resolve({
                "user": res[0], //data was exported to the root by asyncGet function
                "media": res[1]["data"],
                "pagination": res[1]["pagination"]
            });
        });
}
define(function() {
    return instagram;
});
