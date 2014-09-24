
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
  })

     var spinner = new Spinner(spin_opts).spin();
     $('#gplus-link').append(spinner.el);

     require(["views/gplus.js", "text!templates/gplus-profile.html"], 
        function(gplus, gplus_view) {
		gplus(settings).then(function(gplus_data) {

		       	var template = Handlebars.compile(gplus_view);

			$.each(gplus_data.activities, function(i, t) {
				t.replies = t.object.replies.totalItems;
				t.plusoners = t.object.plusoners.totalItems;
				t.resharers = t.object.resharers.totalItems;
				t.published = t.published.substr(0, 10) + ' ' + t.published.substr(11, 5);


			});

	    		$(template(gplus_data)).modal().on('hidden', function () {
				$(this).remove();
				if (currSelection === 'gplus') {
		      			adjustSelection('home');
				}
	    		})

	    		spinner.stop();
		});
	});
}

