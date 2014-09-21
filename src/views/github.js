function github(settings) {
	var context = {};
	syncGet(settings.api_url + 'users/' +  settings.client_id, function(res) {
    		context.user = res;
	});
	syncGet(settings.api_url + 'users/' +  settings.client_id + '/repos' , function(res) {
    		context.repos = res;
	});
    	context['repos'].sort(function(r1, r2) { return r1.updated_at < r2.updated_at });
    	return context;
}
define(function() {return github;});
