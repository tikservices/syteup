'use strict';

function setupSteam(url, el, settings) {
    var href = el.href;

    if ($('#steam-profile').length > 0) {
        window.location = href;
        return;
    }

    var params = url.attr('path').split('/').filter(function(w) {
        if (w.length)
            return true;
        return false;
    });

    var spinner = new Spinner(spin_opts).spin();
    $('#steam-link').append(spinner.el);

    require(["views/steam.js", "text!templates/steam-profile.html"],
        function(steam, steam_view) {
            var steam_data = steam(settings);
            if (steam_data.error || steam_data.length === 0) {
                window.location = href;
                return;
            }

            var template = Handlebars.compile(steam_view);

            var template_data = {
                "user": steam_data.user,
                "recent_games": steam_data.recent_games
            };

            $(template(template_data)).modal().on('hidden.bs.modal', function() {
                $(this).remove();
                if (currSelection === 'steam') {
                    adjustSelection('home');
                }
            });

            spinner.stop();
        });

    return;
}
