(function(window) {
    "use strict";
    var DISPLAY_NAME = "Instagram";
    var API_URL = "https://api.instagram.com/v1/";
    var nextId;

    function setupInstagram(instagramData, settings) {
        nextId = undefined; // if we already showed instagram profile, clean max_id

        if (instagramData.media === 0) {
            return;
        }

        var user_counts = instagramData.user["counts"];

        user_counts.media = numberWithCommas(user_counts.media);
        user_counts.followed_by = numberWithCommas(user_counts.followed_by);
        user_counts.follows = numberWithCommas(user_counts.follows);

        $.each(instagramData.media, function(i, p) {
            p.formated_date = moment.unix(parseInt(p.created_time)).fromNow();
        });
        return instagramData;
    }

    function setupInstagramMore(instagramData, settings) {
        $.each(instagramData.media, function(i, p) {
            p.formated_date = moment.unix(parseInt(p.created_time)).fromNow();
        });
        return instagramData;
    }

    function fetchData(settings) {
        if (nextId) //just show more instagram photos
            return asyncGet(API_URL + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token + "&max_id=" + settings.next_id)
            .then(function(res) {
                return Promise.resolve({
                    "media": res["data"],
                    "pagination": res["pagination"]
                });
            });
        else
            return Promise.all([
                asyncGet(API_URL + "users/" + settings.user_id + "/?access_token=" + settings.access_token),
                asyncGet(API_URL + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token)
            ]).then(function(res) {
                return Promise.resolve({
                    "user": res[0], //data was exported to the root by asyncGet function
                    "media": res[1]["data"],
                    "pagination": res[1]["pagination"]
                });
            });
    }

    function fetchMore(settings) {
        if (nextId)
            return fetchData(settings);
        else
            return Promise.reject(NO_MORE_DATA);
    }
    window.instagramService = {
        setup: setupInstagram,
        fetch: fetchData,
        displayName: DISPLAY_NAME,
        fetchMore: fetchMore,
        setupMore: setupInstagramMore,
        template: "templates/instagram-view.html",
        templateMore: "templates/instagram-view-more.html",
        supportMore: true
    };
})(window);
