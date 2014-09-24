'use strict';
var embedDisqus = function(settings) {
  var type = "embed";
  if (settings.just_count)
    type = 'count';

  var dsq = document.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = 'http://' + settings.shortname + '.disqus.com/'+ type +'.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  $(document).on("click", ".disqus_show_comments", function() {
	  var old =$("#disqus_thread");
	  if (old.length) {
		  old[0].className = "disqus_show_comments";
		  old[0].id = '';
		  old.append($("<a>Show Comments</a>"));
	  }
	  this.innerHTML = "";
	  this.className = "disqus-thread";
	  this.id = "disqus_thread";
	  $(this).append($('<a href="/post/' + this.dataset.id + '#disqus_thread" class="comments"></a>'));
	  var data= this.dataset;
	  DISQUS.reset({
		  reload: true,
		  config: function () {
			  this.page.identifier = data.id;
			  this.page.url = document.location.href + '#' + data.id;
			  this.language = "en";
		  }
	  });
  });
}

