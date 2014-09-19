function stackoverflow(request, userid) {
        var user_r = new XMLHttpRequest(),
	    timeline_r = new XMLHttpRequest(),
	    context = {};
        user_r.open('GET', settings.STACKOVERFLOW_API_URL + 'users/' + userid, true);
        user_r.onload = function() {
            if ( this.status != 200 ) return;
            context.user = this.response["users"][0];
	};

       	timeline_r.open('GET', settings.STACKOVERFLOW_API_URL + 'users/' + userid + '/timeline', true);
        timeline_r.onload = function() {
            if ( this.status != 200 ) return;
            context.timeline = this.response["user_timelines"];
	};

	user_r.send();
	timeline_r.send();

	return context;
}
