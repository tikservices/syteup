var config_r = new XMLHttpRequest(),
    settings = {};
config_r.open('GET', 'config.json', true);
config_r.onload = function() {
	if ( this.status != 200 ) alert("FATAL! CAN'T LOAD CONFIG FILE");
	settings = JSON.parse(this.responseText);

	//FIELDS SETTINGS
	document.getElementById("field-realname").textContent = settings["fields"]["realname"];
	document.getElementById("field-description").textContent = settings["fields"]["description"];
	document.getElementById("field-url").textContent = settings["fields"]["url"];
/*	document.getElementById("field-email").href = "mailto:" + settings["fields"]["email"] +
	       	"?subject=Hello";*/
	document.head.getElementsByTagName("title")[0].textContent = settings["fields"]["username"] +
		" [" + settings["fields"]["realname"] + "]";

	document.head.getElementsByTagName("meta")[0].content =  settings["fields"]["realname"] +
		" : " + settings["fields"]["description"];

	//SERVICES SETTINGS
	if (settings["services"]["disqus"])
		document.disqus_shortname = settings["services_settings"]["disqus"]["shotname"];
	if (settings["services"]["flickr"])
		document.flickr_id = settings["services_settings"]["flickr"]["id"];
	if(settings["services"]["tent"]) {
		document.tent_entity_uri = settings["services_settings"]["tent"]["entity_uri"],
		document.tent_feed_uri = settings["services_settings"]["tent"]["feed_url"];
	}

	//SETUP LINKS & BLOG
	if (settings["blog_platform"] === "wordpress") {
		var postOffset = 0,
			wpDomain = settings["blogs_settings"]["wordpress"]["blog_url"];
	} else {
		var postOffset = 0;
	}

	$(function() {
		setupLinks(settings);
	      	fetchBlogPosts(postOffset, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"]);
 		if (settings["services"]["disqus"])
		      $('body').bind('blog-post-loaded', function() {
			      embedDisqus(true);
		      });
	});

	var resultsLoaded = false,
    		reachedEnd    = false, // set to true if no more blog posts left.
		scrollWait    = false,
		scrollWaitDur = 250;

	$(window).scroll(function() {
	      	if(!reachedEnd && !resultsLoaded && !scrollWait &&
			  	($(window).scrollTop() + $(window).height() > $(document).height()/1.2)) {
		  	resultsLoaded = true;
		  	postOffset += 20;
			fetchBlogPosts(postOffset, settings["blogs_settings"][settings["blog_platform"]], settings["blog_platform"]);
		  	scrollWait = true;
		  	// Only load posts at most every scrollWaitDur milliseconds.
			setTimeout(function() { scrollWait = false; }, scrollWaitDur);
	      	}
	      	if(resultsLoaded && ($(window).scrollTop() +
				    	$(window).height() < $(document).height()/1.2)) {
		  	resultsLoaded = false;
	      	}
	});

	//PLUGINS SETTINGS
	if (settings["plugins"]["woopra"]) {
		function woopraReady(tracker) {
			tracker.setDomain(settings["plugins_settings"]["woopra"]["tracking_url"]);
			tracker.setIdleTimeout(settings["plugins_settings"]["woopra"]["idle_timeout"]);

			if (settings["plugins_settings"]["woopra"]["include_query"])
				tracker.trackPageview({type:'pageview',url:window.location.pathname+window.location.search,title:document.title});
			else
				tracker.track();
			return false;
		}
		(function() {
			var wsc = document.createElement('script');
			wsc.src = document.location.protocol+'//static.woopra.com/js/woopra.js';
			wsc.type = 'text/javascript';
			wsc.async = true;
			var ssc = document.getElementsByTagName('script')[0];
			ssc.parentNode.insertBefore(wsc, ssc);
		})();
	}
	if (settings["plugins"]["google_analytics"]) {
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', settings["plugins_settings"]["google_analytics"]["tracking_id"]]);
		_gaq.push(['_trackPageview']);
		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	}
	if (settings["plugins"]["sharethis"]) {
		var switchTo5x = true;

		var jsfile  = document.createElement('script');
		jsfile.src = "http://w.sharethis.com/button/buttons.js"
		jsfile.type = 'text/javascript';
//		jsfile.async = true;
		document.body.appendChild(jsfile);
		stLight.options({publisher: settings["plugins_settings"]["sharethis"]["publisher_key"]});
	}
	if (settings["plugins"]["rss"]) {
		var rss = document.createElement('link');
		rss.rel = "alternate";
		rss.type = "application/rss+xml";
		rss.title = "RSS";
		rss.href = settings["plugins_settings"]["rss"]["url"];
		document.head.appendChild(rss);
	}
};
config_r.send();


