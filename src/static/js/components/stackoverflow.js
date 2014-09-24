'use strict';
function setupStackoverflow(url, el, settings) {
  var href = el.href;

  if ($('#stackoverflow-profile').length > 0) {
    window.location = href;
    return;
  }

  var params = url.attr('path').split('/').filter(function(w) {
      if (w.length)
          return true;
      return false;
  })

     var spinner = new Spinner(spin_opts).spin();
     $('#stackoverflow-link').append(spinner.el);

     require(["views/stackoverflow.js", "text!templates/stackoverflow-view.html"], 
        function(stackoverflow, stackoverflow_view) {
		stackoverflow(settings).then(function(stackoverflow_data){
	    		if (stackoverflow_data.error || stackoverflow_data.length == 0) {
				window.location = href;
				return;
	    		}

	    		var template = Handlebars.compile(stackoverflow_view);


	    		var user = stackoverflow_data.user;
	    		var badge_count = user.badge_counts.bronze + user.badge_counts.silver + user.badge_counts.gold;
	    		user.badge_count = badge_count;
	    		user.about_me = (user.about_me || "").replace(/(<([^>]+)>)/ig,"");

	    		var timeline = stackoverflow_data.timeline;
	    		$.each(timeline, function(i, t){
		  		t.creation_date = moment.unix(t.creation_date).fromNow();
		  		if(t.action === "comment") {
					t.action = "commented";
		  		}
		  		if(t.detail && t.detail.length > 140) {
					t.detail = $.trim(t.detail).substring(0, 140).split(" ").slice(0, -1).join(" ") + "...";
		  		}
	    		});

			var template_data = {
				"user": user,
				"timeline": timeline
	    		}

	   		$(template(template_data)).modal().on('hidden', function () {
				$(this).remove();
		 		if (currSelection === 'stackoverflow') {
		      			adjustSelection('home');
				}
	    		})

	    		spinner.stop();
		});
	});

}
