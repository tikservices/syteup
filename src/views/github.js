'use strict';

function github(settings) {
    var context = {};
    return Promise.all([
        asyncGet(settings.api_url + 'users/' + settings.client_id),
        asyncGet(settings.api_url + 'users/' + settings.client_id + '/repos')
    ]).then(function(res) {
        return new Promise(function(resolve, reject) {
            context.user = res[0];
            context.repos = res[1];
            context['repos'].sort(function(r1, r2) {
                return r1.updated_at < r2.updated_at;
            });
            resolve(context);
        });
    });
}
define(function() {
    return github;
});