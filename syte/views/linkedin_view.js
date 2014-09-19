function linkedin_view(request) {
	var profile_r = new XMLHttpRequest(),
	    group_r = new XMLHttpRequest(),
	    network_updates_r = new XMLHttpRequest(),
	    context = {};
	profile_selectors = ['id', 'first-name', 'last-name', 'headline', 'location',
	'num-connections', 'skills', 'educations', 'picture-url', 'summary', 'positions',
	'industry', 'site-standard-profile-request'].joint(',');
	network_upd_types = ['APPS', 'CMPY', 'CONN', 'JOBS', 'JGRP', 'PICT', 'PFOL',
	'PRFX', 'RECU', 'PRFU', 'SHAR', 'VIRL'].join(',');
	profile_r.open('GET', 'https://api.linkedin.com/v1/people::(' + user + '):(' + profile_selectors ')', true);
	profile_r.onload = function() {
		if ( this.status != 200 ) return;
		context.profile = this.response;
	};
	group_r.open('GET', 'https://api.linkedin.com/v1/people/id=' + user +
		'/group-memberships:(group:(id,name),membership-state)', true);
	grour_r.onload = function() {
		if ( this.status != 200) return;
		context.groups = this.response;
	};
	network_updates_r.open('GET', 'https://api.linkedin.com/v1/people/id=' +
		user + '/network/updates?type=' + network_upd_types , true);
	network_updates_r.onload = function() {
		if ( this.status != 200 ) return;
		context.network_updates = this.response;
	};
	
	profile_r.setRequestHeader('oauth_token', settings.LINKEDIN_TOKEN);
	groups_r.setRequestHeader('oauth_token', settings.LINKEDIN_TOKEN);
	network_updates_r.setRequestHeader('oauth_token', settings.LINKEDIN_TOKEN);

	profile_r.send();
	groups_r.send();
	network_updates_r.send();

	return context;
}
