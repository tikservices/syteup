'use strict';

function setupGplus(url, el, settings) {
    var href = el.href;

    if ($('#gplus-profile').length > 0) {
        window.location = href;
        return;
    }

    var params = url.attr('path').split('/').filter(function(w) {
        if (w.length)
            return true;
        return false;
    });

    var spinner = new Spinner(spin_opts).spin();
    $('#gplus-link').append(spinner.el);

    require(["views/gplus.js", "text!templates/gplus-profile.html"],
        function(gplus, gplus_view) {
            gplus(settings).then(function(gplus_data) {

                var template = Handlebars.compile(gplus_view);

                $.each(gplus_data.activities, function(i, t) {
                    if (t.verb === "post")
                        t.verb = "posted";
                    else if (t.verb === "share")
                        t.verb = "shared";
                    if (t.title.length > 60)
                        t.title = t.title.substr(0, 57) + '...';
                    t.replies = t.object.replies.totalItems;
                    t.plusoners = t.object.plusoners.totalItems;
                    t.resharers = t.object.resharers.totalItems;
                    t.published = moment.utc(t.published, 'YYYY-MM-DD HH:mm:ss').fromNow();
                    if (t.object.attachments && t.object.attachments[0].image) {
                        t.object.image = t.object.attachments[0].image.url;
                    } else if (t.object.content) {
                        t.object.content = (new DOMParser()).parseFromString("<div>" + t.object.content + "</div>", "text/xml").documentElement.textContent;
                        if (t.object.content.length > 200)
                            t.object.content = t.object.content.substr(0, 197) + '...';
                    }


                });

                $(template(gplus_data)).modal().on('hidden.bs.modal', function() {
                    $(this).remove();
                    if (currSelection === 'gplus') {
                        adjustSelection('home');
                    }
                });

                spinner.stop();
            });
        });
}