'use strict';

function setupYoutube(url, el, settings) {
    var href = el.href;

    if ($('#youtube-profile').length > 0) {
        window.location = href;
        return;
    }

    var spinner = new Spinner(spin_opts).spin();
    $('#youtube-link').append(spinner.el);

    require(["views/youtube.js", "text!templates/youtube-profile.html"],
        function(youtube, youtube_view) {
            youtube(settings).then(function(youtube_data) {
                if (youtube_data.message || youtube_data.length === 0) {
                    window.location = href;
                    return;
                }

                var template = Handlebars.compile(youtube_view);

                youtube_data.statistics.url = settings.url;
                youtube_data.channel.url = settings.url;

                $.each(youtube_data.activities, function(i, t) {
                    t.publishedAt = moment.utc(t.publishedAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
                    t.img = t.thumbnails['default'].url;
                    if (t.type === 'playlistItem')
                        t.type = 'add to playlist';
                    else if (t.type === 'bulletin')
                        t.type = 'post';
                });


                $(template(youtube_data)).modal().on('hidden.bs.modal', function() {
                    $(this).remove();
                    if (currSelection === 'youtube') {
                        adjustSelection('home');
                    }
                });

                spinner.stop();
            });
        });
}