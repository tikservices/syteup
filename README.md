# Syteup

**Syteup** (a complete rewrite of [Syte](https://github.com/rigoneri/syte)) is a
really simple but powerful packaged personal site that has social integrations
like Twitter, GitHub, Dribbble, Instagram, Foursquare, Tumblr, Wordpress,
Linkedin, Spotify/Last.fm, SoundCloud, Bitbucket, StackOverflow, Flickr and
Steam. You can see it in action on [my personal
site](http://lejenome.github.io/).

## Social Integrations

### Blog

Syteup use [Tumblr](http://tumblr.com), [Wordpress.com](http://wordpress.com/)
or [Blogger](https://www.blogger.com/) for blogging and your blog will be the
primary page of the site.

### Social Services

Suteup currently support many different social services: Github, Flickr,
SoundCloud, Last.fm, StackOverflow, Bitbucket, Dribbble, Instagram, Youtube,
LinkedIn, Facebook, Google+,...

Some other services integrations is planed. For more uptodate list of currently
supported services and planed services isavailable on
[TODO.md](https://github.com/lejenome/syteup/tree/master/TODO.md)) file.

NOTE: Some services can not be supported as accessing them from client side will
give crackers full access to your account (e.g: Twitter, Foursquare), if you want
them to be implemented, ask the service provider to supported limited permission
access tokens.

## Installation

Syteup dosen't require  any specific server side futures as its server-less
webapp.

You needs to setup the
[src/config.json](https://github.com/lejenome/syteup/tree/master/src/config.json)
file for your needs as explained on the
flowing section then run ```npm run pre-commit``` which will update the
[dist/](https://github.com/lejenome/syteup/blob/master/dist/)
folder with your new settings. Then copy [dist/](https://github.com/lejenome/syteup/blob/master/dist/)
folder to you server and then everything is ready.

## Setup

```TODO```

## Credit

[Syteup](https://github.com/lejenome/syteup) is developed by
[lejenome](https://github.com/lejenome) ([Moez Bouhlel](http://lejenome.github.io/))
based on [Syte](https://github.com/rigoneri/syte) by [Rigo](https://github.com/rigoneri)
(rodrigo neri).
Thanks for [The Contributors](https://github.com/lejenome/syteup/graphs/contributors) for booth the old Syte code and Syteup code.

## Licence

This program is free software; it is distributed under the MIT Licence.

Copyright (c) 2014, Moez Bouhlel (bmoez.j@gmail.com) & [The
Contributors](https://github.com/lejenome/syteup/graphs/contributors)
