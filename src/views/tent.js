function tent(settings) {
    return Promise.all([
		    asyncGet(settings.entity_url + "/posts?entities=" + settings.url),
	    	    asyncGet(settings.entity_url + "/discover?entities=" + settings.url),
		    asyncGet(settings.entity_url + "/followers?entities=" + settings.url),
		    asyncGet(settings.entity_url + "/followings?entities=" + settings.url),
		    asyncGet(settings.entity_url + "/posts/count?entities=" + settings.url)
		    ]);
}
define(function(){return tent});
