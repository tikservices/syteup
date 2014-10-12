(function(window) {
    "use strict";

    function setupGoogleAnalytics(settings) {
        /*
        // OLD VERSION
                var _gaq = _gaq || [];
                _gaq.push(["_setAccount", settings["tracking_id"]]);
                _gaq.push(["_trackPageview"]);
                var ga = document.createElement("script");
                ga.type = "text/javascript";
                ga.async = true;
                ga.src = ("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(ga, s);
        */

        // NEW VERSION (from Google Analytics Admin panel)
        (function(i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments);
            };
            i[r].l = 1 * new Date();
            a = s.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.async = true;
            a.src = ("https:" === document.location.protocol ? "https:" : "http:") + g;
            m.parentNode.insertBefore(a, m);
        })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
        window.ga("create", settings["tracking_id"], "auto");
        window.ga("send", "pageview");

    }
    window.googleAnalyticsPlugin = {
        setup: setupGoogleAnalytics
    };
})(window);
