function lastfm(settings) {
	var context = {},
	user_r= new XMLHttpRequest(),
	tracks_r = new XMLHttpRequest();

	user_r.open('GET', settings.api_url + '?method=user.getinfo&user=' +
		       	settings.username + '&format=json&api_key=' + settings.api_key, false);
	user_r.onload = function() {
		if(this.status!=200) return;
		context.user_info = JSON.parse(this.responseText);
	};

	tracks_r.open('GET', settings.api_url + '?method=user.getrecenttracks&user=' +
		       	settings.username + '&format=json&api_key=' + settings.api_key, false);
	tracks_r.onload = function() {
		if(this.status!=200) return;
		context.recenttracks = JSON.parse(this.responseText);
	};
	user_r.send();
	tracks_r.send();
	return context;
}
define(function(){return lastfm;});
