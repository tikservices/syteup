function github(settings) {
    var user_r = new XMLHttpRequest(),
	repos_r = new XMLHttpRequest(),
        context = {};

    user_r.open('GET', settings.api_url + 'users/' +  settings.client_id, false);
    user_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.user = JSON.parse(this.responseText);
    };

    repos_r.open('GET', settings.api_url + 'users/' + settings.client_id + '/repos', false);
    repos_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.repos = JSON.parse(this.responseText);
    }

    user_r.send();
    repos_r.send()

    context['repos'].sort(function(r1, r2) { return r1.updated_at > r2.updated_at });
    return context;
}
define(function() {return github;});
