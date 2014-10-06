"use strict";

function dribbble(settings) {
    return asyncGet(settings.api_url + settings.username + "/shots");
}
define(function() {
    return dribbble;
});
