# Syteup

**Syteup** (a complete rewrite of [Syte](https://github.com/rigoneri/syte)) is a
really simple but powerful packaged personal site that has social integrations
like GitHub, Dribbble, Instagram, Tumblr, Wordpress,
Linkedin, Last.fm, SoundCloud, Bitbucket, StackOverflow, Flickr.
You can see it in action on [my personalsite](http://lejenome.github.io/).

## Social Integrations

### Blog

Syteup use [Tumblr](http://tumblr.com), [Wordpress.com](http://wordpress.com/)
or [Blogger](https://www.blogger.com/) for blogging and your blog will be the
primary page of the site.

### Social Services

Suteup currently support many different social services:
[Github](https://github.com/), [Flickr](https://www.flickr.com/),
[SoundCloud](https://soundcloud.com/), [Last.fm](http://www.last.fm/),
[StackOverflow](http://stackoverflow.com/), [Bitbucket](https://bitbucket.org/),
[Dribbble](https://dribbble.com/), [Instagram](http://instagram.com/),
[Youtube](https://www.youtube.com/), [LinkedIn](https://www.linkedin.com/),
[Facebook](https://www.facebook.com/), [Google+](https://plus.google.com/),...

Some other services integration is planed. For more up to date list of currently
supported services and planed services isavailable on
[TODO.md](https://github.com/lejenome/syteup/tree/master/TODO.md) file.

NOTE: Some services can not be supported as accessing them from client side will
give crackers full access to your account (e.g: Twitter, Foursquare) or the service provider does not support
server side requirements (e.g: neither SOP nor jsonp are supported by Steam,...),
if you want them to be implemented, ask the service provider to supported limited
permission access tokens or other needed requirements.

## Installation

Syteup dose not require  any specific server side future as it is server-less
moder HTML5 webapp.

You needs to setup the
[src/config.json](https://github.com/lejenome/syteup/tree/master/src/config.json)
file for your needs as explained on the
flowing section then run
```shell
npm run pre-commit
```
which will update the
[dist/](https://github.com/lejenome/syteup/blob/master/dist/)
folder with your new settings. Then copy the contents of [dist/](https://github.com/lejenome/syteup/blob/master/dist/)
folder to you server and then everything is ready.

## Setup

```
TODO
```

## Credit

[Syteup](https://github.com/lejenome/syteup) is developed by
[lejenome](https://github.com/lejenome) ([Moez Bouhlel](http://lejenome.github.io/))
based on [Syte](https://github.com/rigoneri/syte) by [Rigo](https://github.com/rigoneri)
(rodrigo neri).
Thanks to [The Contributors](https://github.com/lejenome/syteup/graphs/contributors)
for booth the old Syte code and Syteup code.

## Licence

This program is free software; it is distributed under the MIT Licence.

Copyright (c) 2014, Moez Bouhlel (bmoez.j@gmail.com) & [The
Contributors](https://github.com/lejenome/syteup/graphs/contributors)
