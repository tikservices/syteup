(function (window) {
    "use strict";
    function setupSharethis(settings) {
        var switchTo5x = true;
        var jsfile = document.createElement("script");
        jsfile.src = "http://w.sharethis.com/button/buttons.js";
        jsfile.type = "text/javascript";
        //jsfile.async = true;
        document.body.appendChild(jsfile);
        stLight.options({ publisher: settings["publisher_key"] });
    }
    window.sharethisPlugin = { setup: setupSharethis };
}(window));