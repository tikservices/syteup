'use strict';

function setupFacebook(url, el, settings) {
    var href = el.href;

    if ($('#facebook-profile').length > 0) {
        window.location = href;
        return;
    }

    var params = url.attr('path').split('/').filter(function(w) {
        if (w.length)
            return true;
        return false;
    });

    var spinner = new Spinner(spin_opts).spin();
    $('#facebook-link').append(spinner.el);

    require(["views/facebook.js", "text!templates/facebook-profile.html"],
        function(facebook, facebook_view) {
            facebook(settings).then(function(facebook_data) {
                if (facebook_data.error)
                    return;

                var template = Handlebars.compile(facebook_view);

                facebook_data.url = "https://facebook.com/" + settings.username;
                facebook_data.image = "static/imgs/pic.png";

                facebook_data.posts = facebook_data.statuses.data.concat(facebook_data.links.data);

                facebook_data.posts.sort(function(p1, p2) {
                    return (p1.updated_time || p1.created_time) < (p2.updated_time || p2.created_time);
                });

                facebook_data.posts.forEach(function(p) {
                    p.url = facebook_data.url + "/posts/" + p.id;
                    p.updated_time = moment.utc(p.updated_time || p.created_time, 'YYYY-MM-DD HH:mm:ss').fromNow();
                    if (p.likes)
                        p.likes = p.likes.data.length;
                    else
                        p.likes = 0;
                    if (p.comments)
                        p.comments = p.comments.data.length;
                    else
                        p.comments = 0;
                    if (p.sharedposts)
                        p.sharedposts = p.sharedposts.data.length;
                    else
                        p.sharedposts = 0;
                    if (p.message && p.message.length > 200)
                        p.message = p.message.substr(0, 197) + "...";


                });

                $(template(facebook_data)).modal().on('hidden', function() {
                    $(this).remove();
                    if (currSelection === 'facebook') {
                        adjustSelection('home');
                    }
                });

                spinner.stop();
            });
        });
}