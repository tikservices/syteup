# Syteup

**Syteup** (a complete rewrite of [Syte](https://github.com/rigoneri/syte)) is a
really simple but powerful packaged personal site that has social integrations
like GitHub, Dribbble, Instagram, Tumblr, Wordpress,
Linkedin, Last.fm, SoundCloud, Bitbucket, StackOverflow, Flickr.

# Demo

You can see Syteup in action on [my personal website](http://lejenome.github.io/).

A more up to date but less stable version is available
[here](http://lejenome.github.io/syteup/demo).

## Social Integrations

### Blog

Syteup use [Tumblr](http://tumblr.com), [Wordpress.com](http://wordpress.com/)
or [Blogger](https://www.blogger.com/) for blogging and your blog will be the
primary page of the site.

![Syteyp Wordpress](docs/imgs/screenshot-blog-wordpress.png)

### Social Services

Suteup currently support many different social services:

**[Github](https://github.com/)**

![Syteyp Github](docs/imgs/screenshot-github.png)

**[Flickr](https://www.flickr.com/)**

![Syteyp Flickr](docs/imgs/screenshot-flickr.png)

**[SoundCloud](https://soundcloud.com/)**

![Syteyp SoundCloud](docs/imgs/screenshot-soundcloud.png)

**[Last.fm](http://www.last.fm/)**

![Syteyp Last.fm](docs/imgs/screenshot-lastfm.png)

**[StackOverflow](http://stackoverflow.com/)**

![Syteyp StackOverflow](docs/imgs/screenshot-stackoverflow.png)

**[Bitbucket](https://bitbucket.org/)**

![Syteyp Bitbucket](docs/imgs/screenshot-bitbucket.png)

**[Dribbble](https://dribbble.com/)**

![Syteyp Dribbble](docs/imgs/screenshot-dribbble.png)

**[Instagram](http://instagram.com/)**

![Syteyp Instagram](docs/imgs/screenshot-instagram.png)

**[Youtube](https://www.youtube.com/)**

![Syteyp Youtube](docs/imgs/screenshot-youtube.png)

**[LinkedIn](https://www.linkedin.com/)**

![Syteyp LinkedIn](docs/imgs/screenshot-linkedin.png)

**[Facebook](https://www.facebook.com/)**

![Syteyp Facebook](docs/imgs/screenshot-facebook.png)

**[Google+](https://plus.google.com/)**

![Syteyp Google+](docs/imgs/screenshot-gplus.png)

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

First, you need to setup Syteup requirements by runnig the following commands:
```shell
npm install
bower update
```
then, you needs to setup the
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

You can also use make command for custom src and dist folder and config file
too.
```shell
make -j1 SRC=~/syteup/src DIST=/srv/website/www CONF=~/my_config.json
```

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


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/lejenome/syteup/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Coverage Status](https://img.shields.io/coveralls/lejenome/syteup.svg)](https://coveralls.io/r/lejenome/syteup)
[![Dependency Status](https://gemnasium.com/lejenome/syteup.svg)](https://gemnasium.com/lejenome/syteup)
