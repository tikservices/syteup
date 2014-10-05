'use strict';

function lastfm(settings) {
    return Promise.all([
        asyncGet(settings.api_url + '?method=user.getinfo&user=' + settings.username + '&format=json&api_key=' + settings.api_key),
        asyncGet(settings.api_url + '?method=user.getrecenttracks&user=' + settings.username + '&format=json&api_key=' + settings.api_key)
    ]).then(function(res) {
        return Promise.resolve({
            user_info: res[0],
            recenttracks: res[1]
        });

    });
}
define(function() {
    return lastfm;
});
