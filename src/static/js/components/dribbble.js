'use strict';

function setupDribbble(url, el, settings) {
    var href = el.href;

    if ($('#dribbble-profile').length > 0) {
        window.location = href;
        return;
    }

    var params = url.attr('path').split('/').filter(function(w) {
        if (w.length)
            return true;
        return false;
    });

    var spinner = new Spinner(spin_opts).spin();
    $('#dribbble-link').append(spinner.el);

    require(["views/dribbble.js", "text!templates/dribbble-view.html"],
        function(dribbble, dribbble_view) {
            dribbble(settings).then(function(dribbble_data) {
                if (dribbble_data.message || dribbble_data.length === 0) {
                    window.location = href;
                    return;
                }

                var template = Handlebars.compile(dribbble_view);

                var user = dribbble_data.shots[0].player;
                user.following_count = numberWithCommas(user.following_count);
                user.followers_count = numberWithCommas(user.followers_count);
                user.likes_count = numberWithCommas(user.likes_count);

                var template_data = {
                    "user": user,
                    "shots": dribbble_data.shots
                };

                $(template(template_data)).modal().on('hidden.bs.modal', function() {
                    $(this).remove();
                    if (currSelection === 'dribbble') {
                        adjustSelection('home');
                    }
                });

                spinner.stop();
            });
        });
}