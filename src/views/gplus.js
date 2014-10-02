'use strict';

function gplus(settings) {
    var context = {};
    return Promise.all([
        asyncGet(settings.api_url + "people/" + settings.user_id + "?fields=circledByCount%2CcurrentLocation%2CdisplayName%2Cimage%2Furl%2Cnickname%2Coccupation%2CplacesLived%2CplusOneCount%2Ctagline%2Curl&key=" + settings.api_key),
        asyncGet(settings.api_url + "people/" + settings.user_id + "/activities/public?maxResults=20&fields=items(annotation%2Cobject(actor(displayName%2Curl)%2Cattachments(content%2CdisplayName%2Cimage%2CobjectType%2Cthumbnails)%2Ccontent%2CobjectType%2Cplusoners%2FtotalItems%2Creplies%2FtotalItems%2Cresharers%2FtotalItems%2Curl)%2Cpublished%2Ctitle%2Curl%2Cverb)%2CnextPageToken&key=" + settings.api_key)
    ]).then(function(res) {
        context.newt_page = res[1]['nextPageToken'];
        if (!res[0]['currentLocation'] && res[0]['placesLived'])
            res[0]['currentLocation'] = res[0]['placesLived'][0]['value'];
        context.user_info = res[0];

        context.activities = res[1]['items'];

        return Promise.resolve(context);
    });
}
define(function() {
    return gplus;
});