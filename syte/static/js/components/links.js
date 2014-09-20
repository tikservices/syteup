var $url;

/*var allComponents = [
  'instagram',
  'twitter',
  'github',
  'dribbble',
  'lastfm',
  'soundcloud',
  'bitbucket',
  'foursquare',
  'tent',
  'steam',
  'stackoverflow',
  'linkedin'
];*/
var allComponents = [], enabledServices = [];

currSelection = 'home';

function setupLinks(settings) {
  allComponents = Object.keys(settings.services);
  allComponents.forEach(function(service) {
	  if ( settings["services"][service] ) enabledServices.push(service);
  });

  //CREATE LINKS ITEMS FOR ENABLED SERVICES
  var main_nav = document.getElementsByClassName("main-nav")[0];
  main_nav.innerHTML="";
  if ( settings["blog_platform"].length ) {
	  var blog = settings["blog_platform"];
	  var li = document.createElement("li"),
		  link = document.createElement("a");
	  link.href = "/";
	  link.id = "home-link";
	  link.textContent = "Home";
	  li.appendChild(link);
	  main_nav.appendChild(li);
  }
  var i;
  for (i=0; i < enabledServices.length; i++) {
	  var service = enabledServices[i];
	  var li = document.createElement("li");
	  var link = document.createElement("a");
	  link.href = settings["services_settings"][service]["url"];
	  link.textContent = service;//????????
	  link.id = service + "-link";
	  li.appendChild(link);
	  main_nav.appendChild(li);
  }
  if (settings["fields"]["email"].length) {
	  var li = document.createElement("li");
	  var link = document.createElement("a");
	  link.href = "mailto:" + settings["fields"]["email"] + "?subject=Hello";
	  link.textContent = "Contact";
	  link.id = "contact-link";
	  li.appendChild(link);
	  main_nav.appendChild(li);
  }


  //PROCESS LINKS CLICK EVENT
  $('a').click(function(e) {
      if (e.which == 2)
          return;
      e.preventDefault();
      e.stopPropagation();

      if (this.href == $url)
          return;

      var url = $.url(this.href.replace('/#!', ''));
      $url = this.href;
      if (this.id == 'home-link' /*&& window.location.pathname == '/'*/) {
        adjustSelection('home');
	return;
      } else {
	var i;
	for( i =0; i < enabledServices.length; i++) {
		var service = enabledServices[i];
		if (this.id == service + '-link') {
			var setupFunct = "setup" + service[0].toUpperCase() + service.slice(1);
			adjustSelection(service, window[setupFunct].bind(this, url, this, settings["services_settings"][service]));
			return;
		}
	}
      }
      window.location = this.href;

 /*     else if(this.id == 'instagram-link' && instagram_integration_enabled) {
        adjustSelection('instagram', setupInstagram.bind(this, this));
      }
      else if (settings["services"]["twitter"] && (url.attr('host') == 'twitter.com' || url.attr('host') == 'www.twitter.com')) {
        adjustSelection('twitter', setupTwitter.bind(this, url, this, settings["services_settings"]["twitter"]));
      }
      else if (settings["services"]["github"] && (url.attr('host') == 'github.com' || url.attr('host') == 'www.github.com')) {
        adjustSelection('github', setupGithub.bind(this, url, this, settings["services_settings"]["github"]));
      }
      else if (settings["services"]["dribbble"] && (url.attr('host') == 'dribbble.com' || url.attr('host') == 'www.dribbble.com')) {
        adjustSelection('dribbble', setupDribbble.bind(this, url, this, settings["services_settings"]["dribbble"]));
      }
      else if (settings["services"]["lastfm"] && (url.attr('host') == 'lastfm.com' || url.attr('host') == 'www.lastfm.com')) {
        adjustSelection('lastfm', setupLastfm.bind(this, url, this, settings["services_settings"]["lastfm"]));
      }
      else if (settings["services"]["soundcloud"] && (url.attr('host') == 'soundcloud.com' || url.attr('host') == 'www.soundcloud.com')) {
        adjustSelection('soundcloud', setupSoundcloud.bind(this, url, this, settings["services_settings"]["soundcloud"]));
      }
      else if (settings["services"]["bitbucket"] && (url.attr('host') == 'bitbucket.org' || url.attr('host') == 'www.bitbucket.org')) {
        adjustSelection('bitbucket', setupBitbucket.bind(this, url, this, settings["services_settings"]["bitbucket"]));
      }
      else if(this.id == 'foursquare-link' && settings["services"]["foursquare"]) {
        adjustSelection('foursquare', setupFoursquare.bind(this, this, settings["services_settings"]["foursquare"]));
      }
      else if(this.id == 'tent-link' && settings["services"]["tent"]) {
        adjustSelection('tent', setupTent.bind(this, this, settings["services_settings"]["tent"]));
      }
      else if (this.id == 'steam-link' && settings["services"]["steam"]) {
        adjustSelection('steam', setupSteam.bind(this, url, this, settings["services_settings"]["steam"]));
      }
      else if (this.id == 'stackoverflow-link' && settings["services"]["stackoverflow"]) {
        adjustSelection('stackoverflow', setupStackoverflow.bind(this, url, this, settings["services_settings"]["stackoverflow"]));
      }
      else if (this.id == 'flickr-link' && settings["services"]["flickr"]) {
          adjustSelection('flickr', setupFlickr.bind(this, url, this, settings["services_settings"]["flickr"]));
      }
      else if (this.id == 'linkedin-link' && settings["services"]["linkedin"]) {
          adjustSelection('linkedin', setupLinkedin.bind(this, url, this, settings["services_settings"]["linkedin"]));
      }
      else {
        window.location = this.href;
      }*/
  });
}

function adjustSelection(component, callback) {
  var transition,
      $currProfileEl;

  if (currSelection !== 'home') {
    $currProfileEl = $('#' + currSelection + '-profile');
    transition = $.support.transition && $currProfileEl.hasClass('fade'),
    $currProfileEl.modal('hide');
    if (callback) {
      if (transition) {
        $currProfileEl.one($.support.transition.end, callback);
      }
      else {
        callback();
      }
    }
  }
  else if (callback) {
    callback();
  }

  $('.main-nav').children('li').removeClass('sel');
  $('#' + component + '-link').parent().addClass('sel');

  if (component == 'home')
    $url = null;

  currSelection = component;
}

