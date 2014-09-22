function soundcloud(settings){
	return Promise.all([
			asyncGet(settings.api_url + "users/" + settings.username +".json?client_id=" + settings.client_id),
			asyncGet(settings.api_url + "users/" + settings.username +"/tracks.json?client_id=" + settings.client_id)

	]).then(function(res){
		return {
			'user_tracks': {
				'show_artwork': settings.show_artwork,
				'player_color': settings.player_color,
				'tracks': res[1]
			},
			'user_profile': res[0]
		};
	});
}
define(function(){return soundcloud;});
