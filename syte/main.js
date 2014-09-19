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
	document.getElementById("field-email").href = "mailto:" + settings["fields"]["email"] +
	       	"?subject=Hello";

	//SERVICES SETTINGS
	document.twitter_integration_enabled = settings["services"]["twitter"] || false;
	document.github_integration_enabled = settings["services"]["github"] || false;
	document.dribbble_integration_enabled = settings["services"]["dribbble"] || false;
	document.instagram_integration_enabled = settings["services"]["instagram"] || false;
  	document.lastfm_integration_enabled = settings["services"]["lastfm"] || false;
	document.disqus_integration_enabled = settings["services"]["disqus"] || false;
 	document.soundcloud_integration_enabled = settings["services"]["soundcloud"] || false;
        document.bitbucket_integration_enabled = settings["services"]["bitbucket"] || false;
	document.foursquare_integration_enabled = settings["services"]["foursquare"] || false;
	document.tent_integration_enabled = settings["services"]["tent"] || false;
	document.steam_integration_enabled = settings["services"]["steam"] || false;
	document.stackoverflow_integration_enabled = settings["services"]["stackoverflow"] || false;
	document.flickr_integration_enabled = settings["services"]["flickr"] || false;
	document.linkedin_integration_enabled = settings["services"]["linkedin"] || false;
	if (settings["services"]["disqus"])
		document.disqus_shortname = settings["services_settings"]["disqus"]["shotname"];
	if (settings["services"]["flickr"])
		document.flickr_id = settings["services_settings"]["flickr"]["id"];
	if(settings["services"]["tent"]) {
		document.tent_entity_uri = settings["services_settings"]["tent"]["entity_uri"],
		document.tent_feed_uri = settings["services_settings"]["tent"]["feed_url"];
	}

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


