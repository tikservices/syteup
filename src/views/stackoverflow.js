function stackoverflow(settings) {
	var context = {};

	syncGet(settings.api_url + 'users/' + settings.userid + "?site=stackoverflow" , function(res){
		context.user = res["items"][0];
	});
	syncGet(settings.api_url + 'users/' + settings.userid + '/timeline?site=stackoverflow', function(res) {
		context.timeline = res['items'];
	});
	return context;
}
define(function() { return stackoverflow;});
