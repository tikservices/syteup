(function (window) {
    "use strict";
    function setupSegment(settings) {
        window.analytics = window.analytics || [];
        window.analytics.methods = [
            "identify",
            "group",
            "track",
            "page",
            "pageview",
            "alias",
            "ready",
            "on",
            "once",
            "off",
            "trackLink",
            "trackForm",
            "trackClick",
            "trackSubmit"
        ];
        window.analytics.factory = function (method) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(method);
                window.analytics.push(args);
                return window.analytics;
            };
        };
        for (var i = 0; i < window.analytics.methods.length; i++) {
            var key = window.analytics.methods[i];
            window.analytics[key] = window.analytics.factory(key);
        }
        window.analytics.load = function (key) {
            if (document.getElementById("analytics-js"))
                return;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = "analytics-js";
            script.async = true;
            script.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
            var first = document.getElementsByTagName("script")[0];
            first.parentNode.insertBefore(script, first);
        };
        // Add a version to keep track of what's in the wild.
        window.analytics.SNIPPET_VERSION = "2.0.9";
        // Load Analytics.js with your key, which will automatically
        // load the tools you've enabled for your account. Boosh!
        window.analytics.load(settings["write_key"]);
        // Make the first page call to load the integrations. If
        // you'd like to manually name or tag the page, edit or
        // move this call however you'd like.
        window.analytics.page();
    }
    window.segmentPlugin = { setup: setupSegment };
}(window));