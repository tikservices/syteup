"use strict";

function flickr(settings) {
    return asyncGet("http://api.flickr.com/services/feeds/photos_public.gne?id=" + settings.client_id + "&format=json&lang=en-us", {}, "jsoncallback");
}
define(function() {
    return flickr;
});
