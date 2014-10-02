'use strict';

function youtube(settings) {
    var context = {};
    return asyncGet(settings.api_url + 'channels?part=statistics%2Csnippet&forUsername=' + settings.username + '&key=' + settings.api_key)
        .then(function(channels) {
            context.channel = channels['items'][0]['snippet'];
            context.statistics = channels['items'][0]['statistics'];
            context.id = channels['items'][0]['id'];
            context.username = settings.username;
            return asyncGet(settings.api_url + 'activities?part=snippet%2CcontentDetails&channelId=' + context.id + '&maxResults=20&fields=items(contentDetails%2Csnippet)%2CnextPageToken&key=' + settings.api_key)
                .then(function(activities) {
                    context.next_page = activities['nextPageToken'];
                    context.activities = activities['items'].map(function(item) {
                        var resource = item['contentDetails'][item['snippet']['type']];
                        if ("videoId" in resource)
                            item['snippet']['url'] = "https://www.youtube.com/watch?v=" + resource["videoId"];
                        else if (resource['resourceId']['channelId'])
                            item['snippet']['url'] = "https://www.youtube.com/channel/" + resource['resourceId']["channelId"];
                        else if (resource['resourceId']['videoId'])
                            item['snippet']['url'] = "https://www.youtube.com/watch?v=" + resource['resourceId']["videoId"];
                        return item["snippet"];
                    });
                    return Promise.resolve(context);
                });
        });
}
define(function() {
    return youtube;
});