(function(window) {
    /* global ga */
    "use strict";

    function setupGoogleAnalytics(settings) {
        // load google analytics.js
        var ga = window.ga = window.ga || function() {
            ga.q = ga.q || [];
            ga.q.push(arguments);
        };
        var link = document.createElement("script");
        var firstScript = document.getElementsByTagName("script")[0];
        link.async = true;
        link.src = "https://www.google-analytics.com/analytics.js";
        link.onreadystatechange = link.onload = link.onabort = link.onerror = link.onhashchange = function(e) {
            console.log("analytics.js loadt state:", this.readyState || e);
        };
        firstScript.parentNode.insertBefore(link, firstScript);
        // push actions
        if (window.location.host === "localhost" || window.location.host === "172.0.0.1" || window.location.host === "")
            ga("create", settings["tracking_id"], {
                "cookieDomain": "none"
            });
        else
            ga("create", settings["tracking_id"], "auto");
        ga(function() {
            console.log("YAH!!!!! analytics.js library done loading");
        });

        ga("set", "forceSSL", true);
        ga("set", "anonymizeIp", true);

        ga("send", "pageview", {
            "title": "Syteup",
            "page": "index.html",
            "hitCallback": function() {
                console.log("YEH!!! analytics.js done sending data");
            }
        });
        //ga('send', 'timing', 'jQuery', 'Load Library', 20, 'Google CDN')
        //ga('send', 'exception', {
        //  'exDescription': 'DatabaseError',
        //    'exFatal': false,
        //      'appName', 'myApp',
        //        'appVersion', '1.0'
        //        });
        // ga('send', 'event', 'image2', 'clicked')
    }

    window.googleAnalyticsPlugin = {
        setup: setupGoogleAnalytics
    };
})(window);
