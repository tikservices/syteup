function soundcloud(settings){
	var context = {'user_tracks': {'show_artwork': settings.show_artwork,
		'player_color' : settings.player_color}};

	syncGet(settings.api_url + "users/" + settings.username +".json?client_id=" + settings.client_id, function(res) {
		context.user_profile = res;
	});
	syncGet(settings.api_url + "users/" + settings.username +"/tracks.json?client_id=" + settings.client_id, function(res) {
		context.user_tracks.tracks = res;
	});
	return context;
}
define(function(){return soundcloud;});
