"use strict";
asyncGet("config.json", {}).then(function (settings) {
    //FIELDS SETTINGS
    function getHostname(url) {
        var parser = document.createElement("a");
        parser.href = url;
        return parser.hostname;
    }
    document.getElementById("field-realname").textContent = settings["fields"]["realname"];
    document.getElementById("field-description").textContent = settings["fields"]["description"];
    document.getElementById("field-url").textContent = getHostname(settings["fields"]["url"]);
    document.head.getElementsByTagName("title")[0].textContent = settings["fields"]["username"] + " [" + settings["fields"]["realname"] + "]";
    document.getElementById("meta-description").content = settings["fields"]["realname"] + " : " + settings["fields"]["description"];
    //SERVICES SETTINGS
    if (settings["services"]["flickr"])
        window.flickr_id = settings["services_settings"]["flickr"]["id"];
    if (settings["services"]["tent"]) {
        window.tent_entity_uri = settings["services_settings"]["tent"]["entity_uri"];
        window.tent_feed_uri = settings["services_settings"]["tent"]["feed_url"];
    }
    $(function () {
        new Promise(function (resolve, reject) {
            setupLinks(settings);
            resolve();
        }).then(setupBlog(settings)).then(function () {
            document.getElementById("profiles-style").media = "all";
            setupPlugins(settings);
        });
    });
}).catch(function (error) {
    console.error("ERROR: Main Promise Rejected! To bad to break a vow");
    alertError(error).catch(function () {
        alert("ERROR! " + error);
    });
});