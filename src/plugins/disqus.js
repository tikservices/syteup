(function (window) {
    /* global DISQUS */
    "use strict";
    function embedDisqus(settings) {
        var type = "embed";
        if (settings.just_count)
            type = "count";
        var dsq = document.createElement("script");
        dsq.type = "text/javascript";
        dsq.async = true;
        dsq.src = "http://" + settings.shortname + ".disqus.com/" + type + ".js";
        (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
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
    window.disqusPlugin = { setup: setupDisqus };
}(window));