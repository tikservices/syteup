function stackoverflow(settings) {
        var user_r = new XMLHttpRequest(),
	    timeline_r = new XMLHttpRequest(),
	    context = {};
        user_r.open('GET', settings.api_url + 'users/' + settings.userid + "?site=stackoverflow" , false);
        user_r.onload = function() {
            if ( this.status != 200 ) return;
            context.user = JSON.parse(this.responseText)["items"][0];
	};

       	timeline_r.open('GET', settings.api_url + 'users/' + settings.userid + '/timeline?site=stackoverflow', false);
        timeline_r.onload = function() {
            if ( this.status != 200 ) return;
            context.timeline = JSON.parse(this.responseText)["items"];
	};

	user_r.send();
	timeline_r.send();

	return context;
}
define(function() { return stackoverflow;});
