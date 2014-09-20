function bitbucket(settings) {
	var context = {},
	r = new XMLHttpRequest(),
	r_followers = new XMLHttpRequest(),
	r_forks = new XMLHttpRequest();
    r.open('GET', settings.api_url + 'users/' + settings.username , false);
    r.onload = function() {
	    if ( this.status != 200 ) return ;
	    context = JSON.parse(this.responseText);
    };

    r_followers.open("GET", settings.api_url + "users/" + settings.username + "/followers/", false);
    r_followers.onload = function() {
	    if (this.status != 200) return;
	    context['user']['followers'] = JSON.parse(this.responseText)['count'];
    }

    r.send();
    r_followers.send();

    context['user']['public_repos'] = context['repositories'].length;
    context['repositories'].sort(function(r1, r2) { return r1.utc_last_updated < r2.utc_last_updated;});

    if (settings.show_forks) {
	    var i;
	    for (i=0; i< context['repositories'].length; i++) {
		    var r_forks =new XMLHttpRequest();
		    r_forks.open('GET', settings.api_url + "repositories/" + settings.username +
				    '/' + context['repositories'][i]['slug'], false);
		    r_forks.onload = function() {
			    if (this.status!=200 ) return;
			    context['repositories'][i]['forks_count'] = JSON.parse(this.response)['forks_count'];
		    };
		    r_forks.send();

	    }
    }

    return context;
}
define(function(){return bitbucket;});
