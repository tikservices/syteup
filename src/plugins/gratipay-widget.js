(function (window) {
    "use strict";
    function setup(settings) {
        window.grtpAPI = "https://grtp.co/v1/";
        var script = document.createElement("script");
        script.src = "https://grtp.co/v1.js";
        script.dataset.gratipayUsername = settings.username;
        var par = document.getElementById("header-widgets");
        par.appendChild(script);
    }
    window.gratipayWidgetPlugin = { setup: setup };
}(window));