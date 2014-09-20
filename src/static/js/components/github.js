
function setupGithub(url, el, settings) {
  var href = el.href;

  if ($('#github-profile').length > 0) {
    window.location = href;
    return;
  }

  var params = url.attr('path').split('/').filter(function(w) {
      if (w.length)
          return true;
      return false;
  });

//  if (params.length == 1) {
     var username = settings["client_id"];

     var spinner = new Spinner(spin_opts).spin();
     $('#github-link').append(spinner.el);

     require(["views/github.js", "text!templates/github-profile.html"],
        function(github, github_view) {
		var github_data = github(settings);
            if (github_data.error || github_data.length == 0) {
                window.location = href;
                return;
            }

            var template = Handlebars.compile(github_view);
            github_data.user.following = numberWithCommas(github_data.user.following)
            github_data.user.followers = numberWithCommas(github_data.user.followers)

            $(template(github_data)).modal().on('hidden', function () {
                $(this).remove();
                if (currSelection === 'github') {
                  adjustSelection('home');
                }
            })

            spinner.stop();

        });

     return;
//  }

  window.location = href;
}
