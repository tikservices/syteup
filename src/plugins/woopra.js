(function(window) {
    "use strict";

    function setupWoopra(settings) {
        var wsc = document.createElement("script");
        wsc.src = document.location.protocol + "//static.woopra.com/js/woopra.js";
        wsc.type = "text/javascript";
        wsc.async = true;
        var ssc = document.getElementsByTagName("script")[0];
        ssc.parentNode.insertBefore(wsc, ssc);
    }
    window.woopraPlugin = {
        setup: setupWoopra
    };
})(window);
