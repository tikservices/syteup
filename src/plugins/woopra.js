(function (window) {
    "use strict";
    function setupWoopra(settings) {
        var wsc = document.createElement("script");
        wsc.src = document.location.protocol + "//static.woopra.com/js/woopra.js";
        wsc.type = "text/javascript";
        wsc.async = true;
        var ssc = document.getElementsByTagName("script")[0];
        ssc.parentNode.insertBefore(wsc, ssc);
        window.woopraReady = function (tracker) {
            tracker.setDomain(settings["tracking_url"]);
            tracker.setIdleTimeout(settings["idle_timeout"]);
            if (settings["include_query"])
                tracker.trackPageview({
                    type: "pageview",
                    url: window.location.pathname + window.location.search,
                    title: document.title
                });
            else
                tracker.track();
            return false;
        };
    }
    window.woopraPlugin = { setup: setupWoopra };
}(window));