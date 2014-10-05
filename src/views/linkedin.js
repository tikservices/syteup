'use strict';

function linkedin(settings) {
    var profile_selectors = ['id', 'first-name', 'last-name', 'headline', 'location',
        'num-connections', 'skills', 'educations', 'picture-url', 'summary', 'positions',
        'industry', 'site-standard-profile-request'
    ].join();
    var network_upd_types = ['APPS', 'CMPY', 'CONN', 'JOBS', 'JGRP', 'PICT', 'PFOL',
        'PRFX', 'RECU', 'PRFU', 'SHAR', 'VIRL'
    ].join();
    return Promise.all([
        asyncGet('https://api.linkedin.com/v1/people::(' + settings.username + '):(' + profile_selectors + ')', {
            oauth_token: settings.token
        }),
        asyncGet('https://api.linkedin.com/v1/people/id=' + settings.username + '/group-memberships:(group:(id,name),membership-state)', {
            oauth_token: settings.token
        }),
        asyncGet('https://api.linkedin.com/v1/people/id=' + settings.username + '/network/updates?type=' + network_upd_types, {
            oauth_token: settings.token
        })
    ]).then(function(res) {
        return Promise.resolve({
            profile: res[0],
            groups: res[1],
            network_updates: res[2]
        });
    });


}
define(function() {
    return linkedin;
});
