(function(window) {
    "use strict";

    function setupGoogleAnalytics(settings) {
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
