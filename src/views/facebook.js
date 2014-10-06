"use strict";

function facebook(settings) {
    return asyncGet(settings.api_url + "me?fields=statuses.limit(10){message,updated_time,comments{id},likes{id},sharedposts},links.limit(10){comments{id},likes{id},sharedposts{id},picture,link,name,created_time},id,about,link,name,website,work&method=get&access_token=" + settings.access_token).then(function(res) {
        return Promise.resolve(res);
    });
}
define(function() {
    return facebook;
});
