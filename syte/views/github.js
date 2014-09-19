function github(username) {
    var user_r = new XMLHttpRequest(),
	repos_r = new XMLHttpRequest(),
        context = {};

    user_r.open('GET', settings.GITHUB_API_URL + 'users/' +  username, true);
    user_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.user = this.reponse;
    };

    repos_r.open('GET', settings.GITHUB_API_URL + 'users/' + username + '/repos', true);
    repos_r.onload = function() {
	    if (this.status != 200 ) return;
	    context.user = this.reponse;
    }

    user_r.send();
    repos_r.send()

    context['repos'].sort(function(r1, r2) { return r1.updated_at > r2.updated_at });
    return context;
}
define(function() {return github;});
