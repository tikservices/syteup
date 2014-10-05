'use strict';

function bitbucket(settings) {
    var context = {};
    return Promise.all([
        asyncGet(settings.api_url + 'users/' + settings.username + "?jsoncallback=mainRequest"),
        asyncGet(settings.api_url + 'users/' + settings.username + "/followers?jsoncallback=followersRequest")
    ]).then(function(res) {
        context = res[0];
        context['user']['followers'] = res[1]['count'];
        context['user']['public_repos'] = context['repositories'].length;
        context['repositories'].sort(function(r1, r2) {
            return r1.utc_last_updated < r2.utc_last_updated;
        });

        if (settings.show_forks) {
            return Promise.all(
                context['repositories'].map(function(repo) {
                    return asyncGet(settings.api_url + "repositories/" + settings.username + '/' + repo['slug'] + '?jsoncallback=forksRequest');
                })).then(function(forks) {
                var i = 0;
                forks.forEach(function(fork) {
                    context['repositories'][i++]['forks_count'] = fork['forks_count'];
                });
                return Promise.resolve(context);
            });

        } else {
            return Promise.resolve(context);
        }
    });
}
define(function() {
    return bitbucket;
});
