function linkedin(settings) {
	var profile_r = new XMLHttpRequest(),
	    groups_r = new XMLHttpRequest(),
	    network_updates_r = new XMLHttpRequest(),
	    context = {};
	var profile_selectors = ['id', 'first-name', 'last-name', 'headline', 'location',
	'num-connections', 'skills', 'educations', 'picture-url', 'summary', 'positions',
	'industry', 'site-standard-profile-request'].join();
	var network_upd_types = ['APPS', 'CMPY', 'CONN', 'JOBS', 'JGRP', 'PICT', 'PFOL',
	'PRFX', 'RECU', 'PRFU', 'SHAR', 'VIRL'].join();
	profile_r.open('GET', 'https://api.linkedin.com/v1/people::(' + settings.username + '):(' + profile_selectors + ')', false);
	profile_r.onload = function() {
		if ( this.status != 200 ) return;
		context.profile = this.response;
	};
	groups_r.open('GET', 'https://api.linkedin.com/v1/people/id=' + settings.username +
		'/group-memberships:(group:(id,name),membership-state)', false);
	groups_r.onload = function() {
		if ( this.status != 200) return;
		context.groups = this.response;
	};
	network_updates_r.open('GET', 'https://api.linkedin.com/v1/people/id=' +
		settings.username + '/network/updates?type=' + network_upd_types , false);
	network_updates_r.onload = function() {
		if ( this.status != 200 ) return;
		context.network_updates = this.response;
	};

	profile_r.setRequestHeader('oauth_token', settings.token);
	groups_r.setRequestHeader('oauth_token', settings.token);
	network_updates_r.setRequestHeader('oauth_token', settings.token);

	profile_r.send();
	groups_r.send();
	network_updates_r.send();

	return context;
}
define(function(){return linkedin;});
