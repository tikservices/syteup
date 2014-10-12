"use strict";
var settings = {};

function woopraReady(tracker) {
    tracker.setDomain(settings["plugins_settings"]["woopra"]["tracking_url"]);
    tracker.setIdleTimeout(settings["plugins_settings"]["woopra"]["idle_timeout"]);
    if (settings["plugins_settings"]["woopra"]["include_query"])
        tracker.trackPageview({
            type: "pageview",
            url: window.location.pathname + window.location.search,
            title: document.title
        });
    else
        tracker.track();
    return false;
}

function setupBlog(settings) {
    var postOffset, postsOpts;
    $(document).on("click", ".post-link", function() {
        if (this.dataset["id"]) {
            postsOpts = {
                id: this.dataset["id"]
            };
            fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts);
        }
        postOffset = 0;
    });
    $(document).on("click", ".tag-link", function() {
        if (this.textContent) {
            window.reachedEnd = false;
            postsOpts = {
                tag: this.textContent
            };
            fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function(offset) {
                postOffset = offset;
            });
        }
    });
    $("#home-link").on("click", function() {
        if (location.hash.substr(0, 2) !== "#!") return;
        location.hash = "";
        postsOpts = undefined;
        window.reachedEnd = false;
        fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"]).then(function(offset) {
            postOffset = offset;
        });
    });

    //SETUP LINKS & BLOG
    window.disqus_enabled = settings["blogs_settings"]["plugins"]["disqus"] || false;
    window.sharethis_enabled = settings["blogs_settings"]["plugins"]["sharethis"] || false;
    if (window.disqus_enabled) {
        window.disqus_just_count = settings["plugins_settings"]["disqus"]["just_count"];
        window.disqus_shortname = settings["plugins_settings"]["disqus"]["shortname"];
    }

    window.reachedEnd = false; // set to true if no more blog posts left.
    if (location.hash.substr(0, 7) === "#!post/")
        postsOpts = {
            id: location.hash.slice(7).split("#")[0]
        };
    else if (location.hash.substr(0, 6) === "#!tag/")
        postsOpts = {
            tag: location.hash.slice(6).split("#")[0]
        };
    return fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function(offset) {
        postOffset = offset;

        var resultsLoaded = false,
            scrollWait = false,
            scrollWaitDur = 250;
        $(window).scroll(function() {
            if (!window.reachedEnd && !resultsLoaded && !scrollWait &&
                ($(window).scrollTop() + $(window).height() > $(document).height() / 1.2)) {
                resultsLoaded = true;
                scrollWait = true;
                fetchBlogPosts(postOffset, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function(offset) {
                    postOffset = offset;
                    scrollWait = false;
                });
                // Only load posts at most every scrollWaitDur milliseconds.
                setTimeout(function() {
                    scrollWait = false;
                }, scrollWaitDur);

            }
            if (resultsLoaded && ($(window).scrollTop() +
                    $(window).height() < $(document).height() / 1.2)) {
                resultsLoaded = false;
            }
        });
        if (window.disqus_enabled)
            $("body").bind("blog-post-loaded", function() {
                embedDisqus(settings["plugins_settings"]["disqus"]);
            });
        if (window.sharethis_enabled) {
            var switchTo5x = true;
            var jsfile = document.createElement("script");
            jsfile.src = "http://w.sharethis.com/button/buttons.js";
            jsfile.type = "text/javascript";
            //jsfile.async = true;
            document.body.appendChild(jsfile);
            stLight.options({
                publisher: settings["plugins_settings"]["sharethis"]["publisher_key"]
            });
        }
        return Promise.resolve();
    });
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "config.json", true);
if (xhr.overrideMimeType)
    xhr.overrideMimeType("text/plain");
xhr.onload = function() {
    if (this.status !== 200 && this.status !== 0 /*local request*/ ) alert("FATAL! CAN'T LOAD CONFIG FILE");
    settings = JSON.parse(this.responseText);

    //FIELDS SETTINGS
    document.getElementById("field-realname").textContent = settings["fields"]["realname"];
    document.getElementById("field-description").textContent = settings["fields"]["description"];
    document.getElementById("field-url").textContent = settings["fields"]["url"];
    document.head.getElementsByTagName("title")[0].textContent = settings["fields"]["username"] +
        " [" + settings["fields"]["realname"] + "]";

    document.head.getElementsByTagName("meta")[0].content = settings["fields"]["realname"] +
        " : " + settings["fields"]["description"];

    //SERVICES SETTINGS
    if (settings["services"]["flickr"])
        window.flickr_id = settings["services_settings"]["flickr"]["id"];
    if (settings["services"]["tent"]) {
        window.tent_entity_uri = settings["services_settings"]["tent"]["entity_uri"];
        window.tent_feed_uri = settings["services_settings"]["tent"]["feed_url"];
    }

    $(function() {
        new Promise(function(resolve, reject) {
                setupLinks(settings);
                resolve();
            }).then(setupBlog(settings))
            .then(setupPlugins(settings));
    });
};
xhr.send();
