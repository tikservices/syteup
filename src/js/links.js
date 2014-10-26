"use strict";
var $url;
var allComponents = [], enabledServices = [];
window.currSelection = "home";
function setupLinks(settings) {
    allComponents = Object.keys(settings.services);
    allComponents.forEach(function (service) {
        if (settings["services"][service])
            enabledServices.push(service);
    });
    if (typeof settings["fields"]["contact"] === "object") {
        enabledServices.push("syteup_contact");
        settings["services_settings"]["syteup_contact"] = settings["fields"]["contact"];
        settings["services_settings"]["syteup_contact"]["url"] = "mailto:" + settings["fields"]["contact"]["email"];
    }
    //CREATE LINKS ITEMS FOR ENABLED SERVICES
    var main_nav = document.getElementsByClassName("main-nav")[0];
    main_nav.innerHTML = "";
    if (settings["blog_platform"].length)
        addLinkItem(main_nav, "/", "home-item-link", "Home");
    var i;
    for (i = 0; i < enabledServices.length; i++) {
        var service = enabledServices[i];
        var $service = window[formatModuleName(service) + "Service"];
        var text;
        if ($service)
            text = $service.displayName;
        else
            text = service[0].toUpperCase() + service.slice(1);
        addLinkItem(main_nav, settings["services_settings"][service]["url"], service + "-item-link", text);
    }
    if (typeof settings["fields"]["contact"] === "string")
        addLinkItem(main_nav, "mailto:" + settings["fields"]["contact"] + "?subject=Hello", "contact-item-link", "Contact");
    linkClickHandler(settings);
}
function addLinkItem(main_nav, href, id, text) {
    var li, link;
    li = document.createElement("li");
    link = document.createElement("a");
    link.href = href;
    link.id = id;
    link.textContent = text;
    li.appendChild(link);
    main_nav.appendChild(li);
}
function linkClickHandler(settings) {
    $(".main-nav a").click(function (e) {
        if (e.which === 2)
            return;
        e.preventDefault();
        e.stopPropagation();
        if (this.href === $url)
            return;
        $url = this.href;
        if (this.id === "home-item-link") {
            adjustSelection("home");
            return;
        } else {
            var i;
            for (i = 0; i < enabledServices.length; i++) {
                var service = enabledServices[i];
                if (this.id === service + "-item-link") {
                    adjustSelection(service, setupService.bind(this, service, $url, this, settings["services_settings"][service]));
                    return;
                }
            }
        }
        window.location = this.href;
    });
}
function adjustSelection(component, callback) {
    var transition, $currProfileEl;
    if (currSelection !== "home") {
        $currProfileEl = $("#" + currSelection + "-profile");
        transition = $.support.transition && $currProfileEl.hasClass("fade");
        $currProfileEl.modal("hide");
        if (callback) {
            if (transition) {
                $currProfileEl.one($.support.transition.end, callback);
            } else {
                callback();
            }
        }
    } else if (callback) {
        callback();
    }
    $(".main-nav").children("li").removeClass("sel");
    $("#" + component + "-item-link").parent().addClass("sel");
    if (component === "home")
        $url = null;
    window.currSelection = component;
}