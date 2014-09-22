function stackoverflow(settings) {
	return Promise.all([
			asyncGet(settings.api_url + 'users/' + settings.userid + "?site=stackoverflow"),
			asyncGet(settings.api_url + 'users/' + settings.userid + '/timeline?site=stackoverflow')
	]).then(function(res){
		return Promise.resolve({
			user: res[0]["items"][0],
			timeline: res[1]['items']
		});
	});
}
define(function() { return stackoverflow;});
