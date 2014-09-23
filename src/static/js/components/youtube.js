
function setupYoutube(url, el, settings) {
  var href = el.href;

  if ($('#youtube-profile').length > 0) {
    window.location = href;
    return;
  }

  var params = url.attr('path').split('/').filter(function(w) {
      if (w.length)
          return true;
      return false;
  })

     var spinner = new Spinner(spin_opts).spin();
     $('#youtube-link').append(spinner.el);

     require(["views/youtube.js", "text!templates/youtube-profile.html"], 
        function(youtube, youtube_view) {
		youtube(settings).then(function(youtube_data) {
			youtube_data.statistics.url = settings.url;
			youtube_data.channel.url = settings.url;

			$.each(youtube_data.activities, function(i, t) {
				t.publishedAt = t.publishedAt.substr(0,	10) + ' ' + t.publishedAt.substr(11, 5); //moment.unix(t.publishedAt).fromNow();
				t.img = t.thumbnails.default.url;
				if (t.type == 'playlistItem')
					t.type = 'add to playlist';
				else if (t.type == 'bulletin')
					t.type = 'post';
			});

		       	var template = Handlebars.compile(youtube_view);

	    		$(template(youtube_data)).modal().on('hidden', function () {
				$(this).remove();
				if (currSelection === 'youtube') {
		      			adjustSelection('home');
				}
	    		})

	    		spinner.stop();
		});
	});
}

