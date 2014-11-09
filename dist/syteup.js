"use strict";
//Global configs and functions shared between js
window.UNKNOWN_ERROR = -1;
window.NO_MORE_DATA = -2;
window.MODULE_NOT_FOUND = -3;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
window.spin_opts = {
    lines: 9,
    length: 5,
    width: 2,
    radius: 4,
    rotate: 9,
    color: "#4c4c4c",
    speed: 1.5,
    trail: 40,
    shadow: false,
    hwaccel: true,
    className: "spinner",
    zIndex: 2000000000,
    left: "90%"
};
function formatModuleName(module) {
    return module.replace(/_(.)/g, function (match, p1) {
        return p1.toUpperCase();
    });
}
function formatModulePath(module) {
    return module.replace(/_(.)/g, function (match, p1) {
        return "-" + p1;
    });
}
function alertError(error, errorMessage) {
    return asyncText("templates/alert.html").then(function (view) {
        var template = Handlebars.compile(view);
        $(template({
            error: error,
            error_message: errorMessage
        })).modal().on("hidden.bs.modal", function () {
            $(this).remove();
        });
        return Promise.resolve();
    });
}
/*
function syncGet(url, success, headers, failure) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function () {
        if (this.status !== 200) {
            if (failure)
                failure();
            return;
        }
        success(JSON.parse(this.responseText));
    };
    xhr.onerror = function () {
        if (failure)
            failure();
    };
    if (headers) {
        for (var header in headers) {
            if (headers.hasOwnProperty(header))
                xhr.setRequestHeader(header, headers[header]);
        }
    }
    xhr.send();
}
*/
function asyncText(url, headers) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        if (xhr.overrideMimeType)
            xhr.overrideMimeType("text/plain");
        xhr.onload = function () {
            if (this.status !== 200) {
                reject(this.status);
                return;
            }
            resolve(this.responseText);
        };
        xhr.onerror = function () {
            reject();
        };
        if (headers) {
            for (var header in headers) {
                if (headers.hasOwnProperty(header))
                    xhr.setRequestHeader(header, headers[header]);
            }
        }
        xhr.send();
    });
}
function asyncGet(url, headers, jsonp) {
    if (headers)
        return asyncText(url, headers).then(function (res) {
            return Promise.resolve(JSON.parse(res));
        });
    else
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                jsonp: jsonp,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                dataType: "jsonp",
                async: false,
                success: function (res) {
                    if ("meta" in res && Object.keys(res).length === 2)
                        if ("data" in res)
                            res = res.data;
                        else if ("response" in res)
                            res = res.response;
                    resolve(res);
                },
                error: function (xhr, status) {
                    reject(status);
                }
            });
        });
}
function loadJS(src, obj, data, parentEl) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = src.replace(/^\/\//, "https:" === document.location.protocol ? "https://" : "http://");
        if (obj)
            for (var opt in obj)
                if (obj.hasOwnProperty(opt))
                    script[opt] = obj[opt];
        if (data)
            for (var el in data)
                if (data.hasOwnProperty(el))
                    script.dataset[el] = data[el];
        function onload(e) {
            /* jshint validthis:true */
            this.removeEventListener("load", onload);
            this.removeEventListener("loadend", onload);
            this.removeEventListener("afterscriptexecute", onload);
            resolve();
        }
        script.addEventListener("load", onload);
        script.addEventListener("loadend", onload);
        script.addEventListener("afterscriptexecute", onload);
        (parentEl || document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
    });
}
function exportM(obj, name) {
    //	if(window.System) {
    //	        /*jshint esnext:true*/
    //		export default obj;
    //	} else
    if (typeof module !== "undefined" && module.export) {
        module.export[name] = obj;
    } else if (typeof define === "function" && define.amd) {
        define(name, function () {
            return obj;
        });
    } else {
        window[name] = obj;
    }
}
function exportBlog(blog, name) {
    exportM(blog, formatModuleName(name) + "Blog");
}
function exportService(service, name) {
    exportM(service, formatModuleName(name) + "Service");
}
function exportPlugin(plugin, name) {
    exportM(plugin, formatModuleName(name) + "Plugin");
}
function importM(name, path) {
    return new Promise(function (resolve, reject) {
        if (window[name]) {
            resolve(window[name]);    //		} else if (window.System) {
                                      //			/*global System*/
                                      //			System.import(path).then(function(_) {
                                      //				resolve(_[name] || _);
                                      //			});
        } else if (typeof define === "function" && define.amd) {
            require([path], function (_) {
                resolve(_[name], _);
            });
        } else if (typeof module !== "undefined" && module.exports) {
            var _module = require(path);
            resolve(_module[name] || _module);
        } else {
            loadJS(path + ".js").then(function () {
                resolve(window[name]);
            });
        }
    });
}"use strict";
var postOffset, postsOpts;
function setupBlog(settings) {
    registerPostLinkClick(settings);
    registerTagLinkClick(settings);
    registerHomeItemClick(settings);
    window.sharethis_enabled = settings["blogs_settings"]["plugins"]["sharethis"] || false;
    if (settings["blogs_settings"]["plugins"]["disqus"])
        window.disqusPlugin.setup(settings["plugins_settings"]["disqus"]);
    window.reachedEnd = false;
    if (location.hash.substr(0, 7) === "#!post/")
        postsOpts = { id: location.hash.slice(7).split("#")[0] };
    else if (location.hash.substr(0, 6) === "#!tag/")
        postsOpts = { tag: location.hash.slice(6).split("#")[0] };
    return fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function (offset) {
        postOffset = offset;
        if (window.sharethis_enabled)
            window.sharethisPlugin.setup(settings["plugins_settings"]["sharethis"]);
        return Promise.resolve();
    });
}
function registerPostLinkClick(settings) {
    $(document).on("click", ".post-link", function () {
        if (this.dataset["id"]) {
            postsOpts = { id: this.dataset["id"] };
            fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts);
        }
        postOffset = 0;
    });
}
function registerTagLinkClick(settings) {
    $(document).on("click", ".tag-link", function () {
        if (this.textContent) {
            window.reachedEnd = false;
            postsOpts = { tag: this.textContent };
            fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function (offset) {
                postOffset = offset;
            });
        }
    });
}
function registerHomeItemClick(settings) {
    $("#home-item-link").on("click", function () {
        if (location.hash.substr(0, 2) !== "#!")
            return;
        location.hash = "";
        postsOpts = undefined;
        window.reachedEnd = false;
        fetchBlogPosts(0, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"]).then(function (offset) {
            postOffset = offset;
        });
    });
}
function registerScroll(settings) {
    var resultsLoaded = false, scrollWait = false, scrollWaitDur = 250;
    $(window).scroll(function () {
        if (!window.reachedEnd && !resultsLoaded && !scrollWait && postOffset && $(window).scrollTop() + $(window).height() > $(document).height() / 1.2) {
            resultsLoaded = true;
            scrollWait = true;
            fetchBlogPosts(postOffset, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"], postsOpts).then(function (offset) {
                postOffset = offset;
                scrollWait = false;
            });
            // Only load posts at most every scrollWaitDur milliseconds.
            setTimeout(function () {
                scrollWait = false;
            }, scrollWaitDur);
        }
        if (resultsLoaded && $(window).scrollTop() + $(window).height() < $(document).height() / 1.2) {
            resultsLoaded = false;
        }
    });
}"use strict";
/** renderBlogPosts
     *
     * Takes the response from the blog platform and renders it using
     * our Handlebars template.
     */
function renderBlogPosts(posts, clearPosts) {
    if (posts.length === 0) {
        window.reachedEnd = true;
    }
    Promise.all([
        asyncText("templates/blog-post-text.html"),
        asyncText("templates/blog-post-photo.html"),
        asyncText("templates/blog-post-link.html"),
        asyncText("templates/blog-post-video.html"),
        asyncText("templates/blog-post-audio.html"),
        asyncText("templates/blog-post-quote.html")
    ]).then(function (res) {
        var text_template = Handlebars.compile(res[0]), photo_template = Handlebars.compile(res[1]), link_template = Handlebars.compile(res[2]), video_template = Handlebars.compile(res[3]), audio_template = Handlebars.compile(res[4]), quote_template = Handlebars.compile(res[5]);
        $(".loading").remove();
        if (clearPosts)
            $("#blog-posts").empty();
        if (posts.length === 1 && window.disqus_enabled)
            posts[0].disqus_open = true;
        posts = posts.forEach(function (p) {
            p.formated_date = moment.utc(p.date, "YYYY-MM-DD HH:mm:ss").local().format("MMMM DD, YYYY");
            if (window.disqus_enabled)
                p.disqus_enabled = true;
            p.disqus_just_count = window.disqus_just_count;
            if (p.type === "text") {
                var idx = p.body.indexOf("<!-- more -->");
                if (idx > 0) {
                    p.body = p.body.substring(0, idx);
                    p.show_more = true;
                }
                $("#blog-posts").append(text_template(p));
            } else if (p.type === "photo")
                $("#blog-posts").append(photo_template(p));
            else if (p.type === "link")
                $("#blog-posts").append(link_template(p));
            else if (p.type === "video")
                $("#blog-posts").append(video_template(p));
            else if (p.type === "audio")
                $("#blog-posts").append(audio_template(p));
            else if (p.type === "quote")
                $("#blog-posts").append(quote_template(p));
        });
        prettyPrint();
        setTimeout(setupBlogHeaderScroll, 1000);
        adjustSelection("home");
        document.body.dispatchEvent(new CustomEvent("blog-post-loaded"));
    });
}
/**
     * fetchBlogPosts
     *
     * @param {(Number|String)} offset The offset at which to start loading posts.
     * @param {Object} settings current blogging platform settings from config.json
     * @param {String} platform argument to specify which blog platform to fetch from. Defaults to 'tumblr'.
     * @param {Object} posts_options Optional set searched post options
     */
function fetchBlogPosts(offset, settings, platform, posts_options) {
    //Not sure how my old self wrote this code and how it stills runs
    if (posts_options && posts_options.id)
        window.reachedEnd = true;
    return importM(formatModuleName(platform) + "Blog", "blogs/" + formatModulePath(platform)).then(function ($blog) {
        //    var $blog = window[formatModuleName(platform) + "Blog"];
        if (!$blog)
            return Promise.reject(MODULE_NOT_FOUND);
        var posts;
        if (posts_options && posts_options.id)
            posts = $blog.fetchPost(settings, posts_options.id);
        else if (posts_options && posts_options.tag)
            if (offset)
                posts = $blog.fetchTagMore(settings, posts_options.tag);
            else
                posts = $blog.fetchTag(settings, posts_options.tag);
        else if (offset)
            posts = $blog.fetchMore(settings);
        else
            posts = $blog.fetch(settings);
        return posts.then(function (data) {
            if (!data || data.length === 0)
                return Promise.resolve(false);
            renderBlogPosts(data, posts_options && posts_options.id || !offset);
            return Promise.resolve(true);
        }).catch(function (error) {
            alertError(error);
            return Promise.resolve(false);
        });
    });
}
function setupBlogHeaderScroll() {
    if (window.isMobileView)
        return;
    $(".blog-section article hgroup h3 a").click(function (e) {
        if (!this.hash)
            return;
        $("html, body").stop().animate({ scrollTop: $(this.hash).offset().top }, 500, "linear");
        e.preventDefault();
    });
    var dateHeight = $("#blog-posts article hgroup h3 a")[0].scrollHeight;
    $(window).scroll(function () {
        var scrollTop = window.scrollY;
        var first = false;
        $("#blog-posts article").each(function () {
            if (window.scrollY < this.offsetTop)
                this.className = "";    //return; }
            else if (window.scrollY > this.offsetTop + this.scrollHeight - dateHeight)
                this.className = "passed";
            else
                this.className = "current";
        });
    });
}"use strict";
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
}"use strict";
asyncGet("config.json", {}).then(function (settings) {
    //FIELDS SETTINGS
    document.getElementById("field-realname").textContent = settings["fields"]["realname"];
    document.getElementById("field-description").textContent = settings["fields"]["description"];
    document.getElementById("field-url").textContent = settings["fields"]["url"];
    document.head.getElementsByTagName("title")[0].textContent = settings["fields"]["username"] + " [" + settings["fields"]["realname"] + "]";
    document.head.getElementsByTagName("meta")[0].content = settings["fields"]["realname"] + " : " + settings["fields"]["description"];
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
        }).then(setupBlog(settings)).then(setupPlugins(settings));
    });
}).catch(function (error) {
    console.error("ERROR: Main Promise Rejected! To bad to break a vow");
    alertError(error).catch(function () {
        alert("ERROR! " + error);
    });
});"use strict";
var isMobileView = false;
if (typeof window.matchMedia !== "undefined") {
    var mediaQuery = window.matchMedia("(max-width:799px)");
    if (mediaQuery.matches) {
        isMobileView = true;
    }
}
$(function () {
    $("#mobile-nav-btn").click(function () {
        $(".main-section").toggleClass("nav-opened");
    });
});"use strict";
function setupPlugins(settings) {
    return Promise.all(pluginsPromises(settings));
}
function pluginsPromises(settings) {
    return Object.keys(settings["plugins"]).filter(function (plugin) {
        return settings["plugins"][plugin];
    }).map(function (plugin) {
        return setupPlugin(plugin, settings["plugins_settings"][plugin]).then(console.log.bind(console, "Plugin Setuped:", plugin)).catch(console.error.bind(console, "Plugin Not Found", plugin));
    });
}
function setupPlugin(plugin, settings) {
    return new Promise(function (resolve, reject) {
        importM(formatModuleName(plugin) + "Plugin", "plugins/" + formatModulePath(plugin)).then(function ($plugin) {
            if ($plugin) {
                $plugin.setup(settings);
                resolve();
            } else {
                reject(MODULE_NOT_FOUND);
            }
        });
    });
}"use strict";
function setupService(service, url, el, settings) {
    return importM(formatModuleName(service) + "Service", "services/" + formatModulePath(service)).then(function ($service) {
        var href = el.href;
        // just open url in case of errors
        if ($("#" + service + "-profile").length > 0) {
            window.location = href;
            return;
        }
        if (!$service) {
            console.error("Service Not Found:", service);
            window.location = href;
            return;
        }
        // show spinner
        var spinner = new Spinner(spin_opts).spin();
        $("#" + service + "-item-link").append(spinner.el);
        var promises = [
            $service.fetch(settings),
            asyncText("templates/" + $service.template)
        ];
        if ($service.supportMore)
            promises.push(asyncText("templates/" + $service.templateMore));
        // request templates && fetch service data
        return Promise.all(promises).then(function (results) {
            var serviceData = results[0], view = results[1], viewMore = results[2];
            var $modal;
            if (!serviceData || serviceData.error) {
                window.location = href;
                return;
            }
            // compile the current view template
            var template = Handlebars.compile(view);
            // setup the template data
            serviceData = $service.setup(serviceData, settings);
            if (!serviceData) {
                window.location = href;
                return;
            }
            $modal = $(template(serviceData)).modal().on("hidden.bs.modal", function () {
                $(this).remove();
                if (currSelection === service) {
                    adjustSelection("home");
                }
            });
            // If service support fetching more data
            if ($service.supportMore) {
                var moreTemplate = Handlebars.compile(viewMore);
                $modal.find("#load-more-data").click(function (e) {
                    var spinnerMore = new Spinner(spin_opts).spin();
                    $(this).append(spinnerMore.el);
                    // fetch more service data && add it to the modal
                    $service.fetchMore(settings).then(function (serviceMoreData) {
                        serviceMoreData = $service.setupMore(serviceMoreData, settings);
                        $("." + service + " .profile-data").append(moreTemplate(serviceMoreData));
                        spinnerMore.stop();
                    }).catch(function (error) {
                        if (error === NO_MORE_DATA) {
                            $(this).remove();
                        }
                        spinnerMore.stop();
                    });
                });
            }
            spinner.stop();
            console.info("Service Setuped:", service);
        }).catch(function (error) {
            //TODO
            alertError(error);
            console.error("Service Not Setuped:", service);
        });
    });
}(function (window) {
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
            loadJS("//cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js", { id: "analytics-js" });
        };
        // Add a version to keep track of what's in the wild.
        window.analytics.SNIPPET_VERSION = "2.0.9";
        // Load Analytics.js with your key, which will automatically
        // load the tools you've enabled for your account. Boosh!
        window.analytics.load(settings["write_key"]);
        // Make the first page call to load the integrations. If
        // you'd like to manually name or tag the page, edit or
        // move this call however you'd like.
        window.analytics.page({ title: "Syteup" });
    }
    exportPlugin({ setup: setupSegment }, "segment");
}(window));(function (window) {
    "use strict";
    function setupRss(settings) {
        var rss = document.createElement("link");
        rss.rel = "alternate";
        rss.type = "application/rss+xml";
        rss.title = "RSS";
        rss.href = settings["url"];
        document.head.appendChild(rss);
    }
    exportPlugin({ setup: setupRss }, "rss");
}(window));(function (window) {
    "use strict";
    function setupControlPanel(settings) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        style.sheet.insertRule(".control-panel-btn { display: inline-block; margin: 5px;}", 0);
        style.sheet.insertRule(".control-panel-btn a { line-height: 25px; padding: 5px; margin: 0; border: solid 1px;}", 0);
        style.sheet.insertRule(".control-panel-btn a.clicked {background-color: green}", 0);
        style.sheet.insertRule(".control-panel-btn a.unclicked {background-color: red}", 0);
        $("body").bind("blog-post-loaded", function () {
            if (!$("#control-panel")[0])
                return;
            $.each($(".main-nav li a"), function (i, e) {
                $("#control-panel").append("<div class='control-panel-btn'><a class='clicked' data-id='" + e.id + "'>#" + e.id + "</a></div>");
            });
            $(".control-panel-btn a").click(function () {
                var id = this.dataset["id"];
                if (this.className === "clicked") {
                    this.className = "unclicked";
                    $("#" + id).parent().hide(300);
                } else {
                    this.className = "clicked";
                    $("#" + id).parent().show(300);
                }
            });
            $("#control-panel").removeAttr("id");
        });
    }
    exportPlugin({ setup: setupControlPanel }, "control_panel");
}(window));(function (window) {
    "use strict";
    function setup(settings) {
        window.grtpAPI = "https://grtp.co/v1/";
        loadJS("//grtp.co/v1.js", {}, { gratipayUsername: settings.username }, document.getElementById("header-widgets"));
    }
    exportPlugin({ setup: setup }, "gratipay_widget");
}(window));(function (window) {
    /* global DISQUS */
    "use strict";
    function embedDisqus(settings) {
        var type = "embed";
        if (settings.just_count)
            type = "count";
        loadJS("//" + settings.shortname + ".disqus.com/" + type + ".js");
        $(document).on("click", ".disqus_show_comments", function () {
            var old = $("#disqus_thread");
            if (old.length) {
                old[0].className = "disqus_show_comments";
                old[0].id = "";
                old.append($("<a>Show Comments</a>"));
            }
            this.innerHTML = "";
            this.className = "disqus-thread";
            this.id = "disqus_thread";
            $(this).append($("<a href='/post/" + this.dataset.id + "#disqus_thread' class='comments'></a>"));
            var data = this.dataset;
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = data.id;
                    this.page.url = window.location.origin + window.location.pathname + "#!post/" + data.id;
                    this.language = "en";
                }
            });
        });
    }
    function setupDisqus(settings) {
        window.disqus_enabled = true;
        window.disqus_just_count = settings["just_count"];
        window.disqus_shortname = settings["shortname"];
        $("body").bind("blog-post-loaded", function () {
            embedDisqus(settings);
        });
    }
    exportPlugin({ setup: setupDisqus }, "disqus");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Instagram";
    var API_URL = "https://api.instagram.com/v1/";
    var nextId;
    function setupInstagram(instagramData, settings) {
        if (instagramData.media === 0) {
            return;
        }
        var user_counts = instagramData.user["counts"];
        user_counts.media = numberWithCommas(user_counts.media);
        user_counts.followed_by = numberWithCommas(user_counts.followed_by);
        user_counts.follows = numberWithCommas(user_counts.follows);
        $.each(instagramData.media, function (i, p) {
            p.formated_date = moment.unix(parseInt(p.created_time)).fromNow();
        });
        return instagramData;
    }
    function setupInstagramMore(instagramData, settings) {
        $.each(instagramData.media, function (i, p) {
            p.formated_date = moment.unix(parseInt(p.created_time)).fromNow();
        });
        return instagramData;
    }
    function fetchData(settings) {
        return Promise.all([
            asyncGet(API_URL + "users/" + settings.user_id + "/?access_token=" + settings.access_token),
            asyncGet(API_URL + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token)
        ]).then(function (res) {
            nextId = res[1]["pagination"]["next_max_id"];
            return Promise.resolve({
                "user": res[0],
                "media": res[1]["data"],
                "pagination": nextId
            });
        });
    }
    function fetchMore(settings) {
        if (nextId)
            return asyncGet(API_URL + "users/" + settings.user_id + "/media/recent/?access_token=" + settings.access_token + "&max_id=" + nextId).then(function (res) {
                nextId = res["pagination"]["next_max_id"];
                return Promise.resolve({
                    "media": res["data"],
                    "pagination": nextId
                });
            });
        else
            return Promise.reject(NO_MORE_DATA);
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "instagram.html",
        templateMore: "instagram-more.html",
        setup: setupInstagram,
        fetch: fetchData,
        supportMore: true,
        fetchMore: fetchMore,
        setupMore: setupInstagramMore
    }, "instagram");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Dribbble";
    var API_URL = "https://api.dribbble.com/players/";
    function setupDribbble(dribbbleData, settings) {
        var user = dribbbleData.shots[0].player;
        user.following_count = numberWithCommas(user.following_count);
        user.followers_count = numberWithCommas(user.followers_count);
        user.likes_count = numberWithCommas(user.likes_count);
        return {
            "user": user,
            "shots": dribbbleData.shots
        };
    }
    function fetchData(settings) {
        return asyncGet(API_URL + settings.username + "/shots");
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "dribbble.html",
        setup: setupDribbble,
        fetch: fetchData
    }, "dribbble");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Flickr";
    function setupFlickr(flickrData, settings) {
        if (flickrData.items === 0) {
            return;
        }
        flickrData.title = flickrData.title.substring(13);
        $.each(flickrData.items, function (i, p) {
            p.formated_date = moment.unix(Date.parse(p.date_taken) / 1000).fromNow();
        });
        return flickrData;
    }
    function fetchData(settings) {
        return asyncGet("http://api.flickr.com/services/feeds/photos_public.gne?id=" + settings.client_id + "&format=json&lang=en-us", undefined, "jsoncallback");
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "flickr.html",
        setup: setupFlickr,
        fetch: fetchData
    }, "flickr");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Bitbucket";
    var API_URL = "https://api.bitbucket.org/1.0/";
    function setupBitbucket(bitbucketData, settings) {
        bitbucketData.user.followers = numberWithCommas(bitbucketData.user.followers);
        return bitbucketData;
    }
    function fetchData(settings) {
        var context = {};
        return Promise.all([
            asyncGet(API_URL + "users/" + settings.username + "?jsoncallback=mainRequest"),
            asyncGet(API_URL + "users/" + settings.username + "/followers?jsoncallback=followersRequest")
        ]).then(function (res) {
            context = res[0];
            context["user"]["followers"] = res[1]["count"];
            context["user"]["public_repos"] = context["repositories"].length;
            context["repositories"].sort(function (r1, r2) {
                return r1.utc_last_updated < r2.utc_last_updated;
            });
            if (settings.show_forks) {
                return Promise.all(context["repositories"].map(function (repo) {
                    return asyncGet(API_URL + "repositories/" + settings.username + "/" + repo["slug"] + "?jsoncallback=forksRequest");
                })).then(function (forks) {
                    var i = 0;
                    forks.forEach(function (fork) {
                        context["repositories"][i++]["forks_count"] = fork["forks_count"];
                    });
                    return Promise.resolve(context);
                });
            } else {
                return Promise.resolve(context);
            }
        });
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "bitbucket.html",
        setup: setupBitbucket,
        fetch: fetchData
    }, "bitbucket");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Last.fm";
    var API_URL = "https://ws.audioscrobbler.com/2.0/";
    function setupLastfm(lastfmData, settings) {
        /* Add extra helper to parse out the #text fields in context passed to
         * handlebars.  The '#' character is reserved by the handlebars templating
         * language itself so cannot reference '#text' easily in the template. */
        Handlebars.registerHelper("text", function (obj) {
            try {
                return obj["#text"];
            } catch (err) {
                return "";
            }
        });
        Handlebars.registerHelper("image_url", function (obj) {
            try {
                return obj[0]["#text"];
            } catch (err) {
                return "";
            }
        });
        Handlebars.registerHelper("avatar_url", function (obj) {
            try {
                return obj[1]["#text"];
            } catch (err) {
                return "";
            }
        });
        lastfmData.user_info.user.formatted_plays = numberWithCommas(lastfmData.user_info.user.playcount);
        lastfmData.user_info.user.formatted_playlists = numberWithCommas(lastfmData.user_info.user.playlists);
        lastfmData.user_info.user.formatted_register_date = moment.utc(lastfmData.user_info.user.registered["#text"], "YYYY-MM-DD HH:mm").format("MM/DD/YYYY");
        $.each(lastfmData.recenttracks.recenttracks.track, function (i, t) {
            // Lastfm can be really finicky with data and return garbage if
            // the track is currently playing
            var date;
            try {
                date = t.date["#text"];
            } catch (err) {
                t.formatted_date = "Now Playing";
                return true;    // equivalent to "continue" with a normal for loop
            }
            t.formatted_date = moment.utc(date, "DD MMM YYYY, HH:mm").fromNow();
        });
        return lastfmData;
    }
    function fetchData(settings) {
        return Promise.all([
            asyncGet(API_URL + "?method=user.getinfo&user=" + settings.username + "&format=json&api_key=" + settings.api_key),
            asyncGet(API_URL + "?method=user.getrecenttracks&user=" + settings.username + "&format=json&api_key=" + settings.api_key)
        ]).then(function (res) {
            return Promise.resolve({
                user_info: res[0],
                recenttracks: res[1]
            });
        });
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "lastfm.html",
        setup: setupLastfm,
        fetch: fetchData
    }, "lastfm");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Youtube";
    var API_URL = "https://www.googleapis.com/youtube/v3/";
    function setupYoutube(youtubeData, settings) {
        if (youtubeData.message || youtubeData.activities.length === 0) {
            return;
        }
        youtubeData.statistics.url = settings.url;
        youtubeData.channel.url = settings.url;
        $.each(youtubeData.activities, function (i, t) {
            t.publishedAt = moment.utc(t.publishedAt, "YYYY-MM-DD HH:mm:ss").fromNow();
            t.img = t.thumbnails["default"].url;
            if (t.type === "playlistItem")
                t.type = "add to playlist";
            else if (t.type === "bulletin")
                t.type = "post";
        });
        return youtubeData;
    }
    function fetchData(settings) {
        var context = {};
        return asyncGet(API_URL + "channels?part=statistics%2Csnippet&forUsername=" + settings.username + "&key=" + settings.api_key).then(function (channels) {
            context.channel = channels["items"][0]["snippet"];
            context.statistics = channels["items"][0]["statistics"];
            context.id = channels["items"][0]["id"];
            context.username = settings.username;
            return asyncGet(API_URL + "activities?part=snippet%2CcontentDetails&channelId=" + context.id + "&maxResults=20&fields=items(contentDetails%2Csnippet)%2CnextPageToken&key=" + settings.api_key).then(function (activities) {
                context.next_page = activities["nextPageToken"];
                context.activities = activities["items"].map(function (item) {
                    var resource = item["contentDetails"][item["snippet"]["type"]];
                    if ("videoId" in resource)
                        item["snippet"]["url"] = "https://www.youtube.com/watch?v=" + resource["videoId"];
                    else if (resource["resourceId"]["channelId"])
                        item["snippet"]["url"] = "https://www.youtube.com/channel/" + resource["resourceId"]["channelId"];
                    else if (resource["resourceId"]["videoId"])
                        item["snippet"]["url"] = "https://www.youtube.com/watch?v=" + resource["resourceId"]["videoId"];
                    return item["snippet"];
                });
                return Promise.resolve(context);
            });
        });
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "youtube.html",
        setup: setupYoutube,
        fetch: fetchData
    }, "youtube");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "SoundCloud";
    var API_URL = "https://api.soundcloud.com/";
    function setupSoundcloud(soundcloudData, settings) {
        return soundcloudData;
    }
    function fetchData(settings) {
        return Promise.all([
            asyncGet(API_URL + "users/" + settings.username + ".json?client_id=" + settings.client_id),
            asyncGet(API_URL + "users/" + settings.username + "/tracks.json?client_id=" + settings.client_id)
        ]).then(function (res) {
            return {
                "user_tracks": {
                    "show_artwork": settings.show_artwork,
                    "player_color": settings.player_color,
                    "tracks": res[1]
                },
                "user_profile": res[0]
            };
        });
    }
    exportService({
        displayName: DISPLAY_NAME,
        template: "soundcloud.html",
        setup: setupSoundcloud,
        fetch: fetchData
    }, "soundcloud");
}(window));(function (window) {
    "use strict";
    var API_URL = "https://public-api.wordpress.com/rest/v1";
    var nextId = 0;
    function getPosts(settings, postId, tag, offset) {
        var post_id = "";
        var params = "";
        if (postId)
            post_id += postId;
        else if (tag)
            params += "?tag=" + tag.replace(/\s/g, "-");
        else if (settings.tag_slug)
            params += "?tag=" + settings.tag_slug.replace(/\s/g, "-");
        if (offset && nextId)
            params += (params ? "&" : "?") + "offset=" + nextId;
        var wpApiUrl = [
            API_URL,
            "/sites/",
            settings.blog_url,
            "/posts/",
            post_id,
            params
        ].join("");
        return asyncGet(wpApiUrl).then(function (data) {
            if (data.error)
                data = {
                    found: 0,
                    posts: []
                };
            else if (postId)
                data = {
                    found: 1,
                    posts: [data]
                };
            $.each(data.posts, function (i, p) {
                var newTags = [];
                p.id = p.ID;
                p.body = p.content;
                p.content = null;
                if (p.type === "post") {
                    p.type = "text";
                }
                for (var tag in p.tags) {
                    if (p.tags.hasOwnProperty(tag))
                        newTags.push(tag);
                }
                p.tags = newTags;
                // TODO: figure out how to preserve timezone info and make it
                // consistent with python's datetime.strptime
                if (p.date.lastIndexOf("+") > 0) {
                    p.date = p.date.substring(0, p.date.lastIndexOf("+"));
                } else {
                    p.date = p.date.substring(0, p.date.lastIndexOf("-"));
                }
            });
            nextId += 20;
            return Promise.resolve(data.posts);
        });
    }
    function fetchPosts(settings) {
        nextId = 0;
        return getPosts(settings, undefined, undefined, false);
    }
    function fetchMorePosts(settings) {
        return getPosts(settings, undefined, undefined, true);
    }
    function fetchOnePost(settings, postId) {
        nextId = 0;
        return getPosts(settings, postId, undefined, false);
    }
    function fetchBlogTag(settings, tag) {
        nextId = 0;
        return getPosts(settings, undefined, tag, false);
    }
    function fetchBlogTagMore(settings, tag) {
        return getPosts(settings, undefined, tag, true);
    }
    exportBlog({
        fetch: fetchPosts,
        fetchMore: fetchMorePosts,
        fetchPost: fetchOnePost,
        fetchTag: fetchBlogTag,
        fetchTagMore: fetchBlogTagMore
    }, "wordpress");
}(window));(function (window) {
    "use strict";
    var DISPLAY_NAME = "Contact";
    function setupContact(data, settings) {
        if (data.tel)
            data.tel_uri = "tel:+" + data.tel.match(/\((.*)\) (.*)/).slice(1).join("");
        if (data.mobile)
            data.mobile_uri = "tel:+" + data.mobile.match(/\((.*)\) (.*)/).slice(1).join("");
        if (data.fax)
            data.fax_uri = "fax:+" + data.fax.match(/\((.*)\) (.*)/).slice(1).join("");
        return data;
    }
    function fetchContact(settings) {
        var context = [];
        if (settings.pgp_url)
            context.push(asyncText(settings.pgp_url));
        if (settings.ssh_url)
            context.push(asyncText(settings.ssh_url));
        if (context.length > 0) {
            return Promise.all(context).then(function (res) {
                var data = settings;
                if (settings.pgp_url) {
                    data.pubkey = res[0];
                    data.sshkey = res[1];
                } else {
                    data.sshkey = res[0];
                }
                return Promise.resolve(data);
            });
        } else {
            return Promise.resolve(settings);
        }
    }
    exportService({
        displayName: DISPLAY_NAME,
        setup: setupContact,
        fetch: fetchContact,
        template: "syteup-contact.html"
    }, "syteup_contact");
}(window));