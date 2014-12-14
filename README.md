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
then, you needs to rename
[src/config.json.sample](https://github.com/lejenome/syteup/tree/master/src/config.json.sample)
file to `config.json` and customize it for your needs as explained on the
flowing section then run
```shell
npm run dist
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

**IN PROGRESS**

### General Setup

```
TODO
```

### Blog Setup

Set `blog_platform` to the bloggin platform that you will use, availbale platforms
are **"tumblr"** and **"blogger"** and **"wordpress"**.

Next, you need to setup the options of the choosen platform on the
`blogs_settings.<platform_name>` object as follow:

#### Wordpress

```javascript
    "wordpress": {
      "blog_url": String, // the url of your wordpress.com blog
      "tag_slug": String // [optional] tags of posts to import (space separated)
    }
```

#### Blogger

```javascript
    "blogger": {
      "blog_url": String, // your blog url
      "blog_id": String, // your blog id number (you can use https://developers.google.com/apis-explorer/#p/blogger/v3/blogger.blogs.getByUrl)
      "api_key": String, // your api key (NEED MORE DOCUMENTATION)
      "tag_slug": String // [optional] tags of posts to import (comma separated)
    }
```

#### Tumblr

```javascript
    "tumblr": {
      "blog_url": String, // your blog url
      "api_key": String, // your api key (NEED MORE DOCUMENTATION)
      "tag_slug": String // [optional] tag of posts to import (just one tag)
    }
```

### Services Setup

For every service you would to enable, you should set `services.<service_name>` on
`config.json` file to `true` and setup it options object
`services_settings.<service_name>` on same file.

Disabled services can safely removed from booth `services` and
`services_settings` objects on the config file.

#### Github

enable `services.github` and confgure `services_settings.github` as follow:
```javascript
    "github": {
      "url": String, // url of your profile page
      "client_id": String // your username
    }
```

#### StackOverflow

enable `services.stackoverflow` and confgure `services_settings.stackoverflow` as follow:
```javascript
    "stackoverflow": {
      "url": String, // url of your profile page
      "userid": String // your id number
    }
```

#### Flickr

enable `services.flickr` and confgure `services_settings.flickr` as follow:
```javascript
    "flickr": {
      "url": String, // url of your profile page
      "client_id": String // your id (you can get it from http://idgettr.com/)
    }
```

#### Bitbucket

enable `services.bitbucket` and confgure `services_settings.bitbucket` as follow:
```javascript
    "bitbucket": {
      "url": String, // url of your profile page
      "username": String, // your username
      "show_forks": Boolean // show number of forks (It require a http request for every repository
    }
```

#### SoundCloud

enable `services.soundcloud` and confgure `services_settings.soundcloud` as follow:
```javascript
    "soundcloud": {
      "url": String, // url of your profile page
      "username": String, // your username
      "client_id": String, // your client_id (NEED MORE DOCUMENTATION)
      "show_artwork": Boolean, // show tracks artworks
      "player_color": String // color of tracks player
    }
```

#### Last.fm

enable `services.lastfm` and confgure `services_settings.lastfm` as follow:
```javascript
    "lastfm": {
      "url": String, // url of your profile page
      "username": String, // your username
      "api_key": String // your api key (NEED MORE DOCUMENTATION)
    }
```

#### Dribbble

enable `services.dribbble` and confgure `services_settings.dribbble` as follow:
```javascript
    "dribbble": {
      "url": String, // url of your profile page
      "username": String // your username
    }
```

#### Youtube

enable `services.youtube` and confgure `services_settings.youtube` as follow:
```javascript
    "youtube": {
      "url": String, // url of your profile page
      "username": String, // your username
      "api_key": String // your api key (NEED MORE DOCUMENTATION)
    }
```

#### Google+

enable `services.gplus` and confgure `services_settings.gplus` as follow:
```javascript
    "gplus": {
      "url": String, // url of your profile page
      "user_id": String, // your id number
      "api_key": String // your api key (NEED MORE DOCUMENTATION)
    }
```

#### Facebook

enable `services.facebook` and confgure `services_settings.facebook` as follow:
```javascript
    "facebook": {
      "url": String, // url of your profile page
      "username": String, // your username
      "access_token": String // your access token key (NEED MORE DOCUMENTATION)
    }
```

#### Instagram

enable `services.instagram` and confgure `services_settings.instagram` as follow:
```javascript
    "instagram": {
      "url": String, // url of your profile page
      "access_token": String, // your access token key (NEED MORE DOCUMENTATION)
      "user_id": String // you id number
    }
```

#### LinkedIn

enable `services.linkedin` and confgure `services_settings.linkedin` as follow:
```javascript
    "linkedin": {
      "url": String, // url of your profile page
      "access_token": String // your access token key (NEED MORE DOCUMENTATION)
    }
```

### Plugins setup

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
