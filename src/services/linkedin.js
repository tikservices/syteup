(function (window) {
    "use strict";
    var DISPLAY_NAME = "LinkedIn";
    var API_URL = "https://api.linkedin.com/v1";
    function setupLinkedin(linkedinData, settings) {
        linkedinData.profile["profile_url"] = "http://linkedin.com/profile/view?id=" + linkedinData.profile["id"];
        linkedinData.profile["numGroups"] = linkedinData.groups["_count"];
        linkedinData.profile["numNetworkUpdates"] = linkedinData.network_updates["_total"];
        linkedinData.profile["location_name"] = linkedinData.profile["location"]["name"];
        return linkedinData;
    }
    function fetchData(settings) {
        var profile_selectors = [
                "id",
                "first-name",
                "last-name",
                "headline",
                "location",
                "num-connections",
                "skills",
                "educations",
                "picture-url",
                "summary",
                "positions",
                "industry",
                "site-standard-profile-request"
            ].join();
        var network_upd_types = [
                "APPS",
                "CMPY",
                "CONN",
                "JOBS",
                "JGRP",
                "PICT",
                "PFOL",
                "PRFX",
                "RECU",
                "PRFU",
                "SHAR",
                "VIRL"
            ].join();
        return Promise.all([
            asyncGet(API_URL + "/people::(" + settings.username + "):(" + profile_selectors + ")", { oauth_token: settings.token }),
            asyncGet(API_URL + "/people/id=" + settings.username + "/group-memberships:(group:(id,name),membership-state)", { oauth_token: settings.token }),
            asyncGet(API_URL + "/people/id=" + settings.username + "/network/updates?type=" + network_upd_types, { oauth_token: settings.token })
        ]).then(function (res) {
            return Promise.resolve({
                profile: res[0],
                groups: res[1],
                network_updates: res[2]
            });
        });
    }
    window.linkedinService = {
        displayName: DISPLAY_NAME,
        template: "linkedin.html",
        setup: setupLinkedin,
        fetch: fetchData
    };
}(window));