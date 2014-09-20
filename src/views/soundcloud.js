function soundcloud(settings){
	var context = {'user_tracks': {'show_artwork': settings.show_artwork,
		'player_color' : settings.player_color}},
	 profile_r = new XMLHttpRequest(),
	tracks_r = new XMLHttpRequest();

	profile_r.open('GET', settings.api_url + "users/" + settings.username +
			".json?client_id=" + settings.client_id, false);
	profile_r.onload = function() {
		if(this.status != 200) return ;
		context.user_profile = JSON.parse(this.responseText);
	}
	tracks_r.open('GET', settings.api_url + "users/" + settings.username +
			"/tracks.json?client_id=" + settings.client_id, false);
	tracks_r.onload = function() {
		if(this.status != 200) return ;
		context.user_tracks.tracks = JSON.parse(this.responseText);
	}

	profile_r.send();
	tracks_r.send();
	return context;
}
define(function(){return soundcloud;});
