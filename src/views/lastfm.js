function lastfm(settings) {
	var context = {};
	syncGet(settings.api_url + '?method=user.getinfo&user=' + settings.username + '&format=json&api_key=' + settings.api_key, function(res) {
		context.user_info = res;
	});
	syncGet(settings.api_url + '?method=user.getrecenttracks&user=' + settings.username + '&format=json&api_key=' + settings.api_key, function(res) {
		context.recenttracks = res;
	});
	return context;
}
define(function(){return lastfm;});
