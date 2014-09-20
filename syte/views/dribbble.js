function dribbble(settings) {
	var context = {},
	   r = new XMLHttpRequest();
	r.open('GET', settings.api_url + settings.username, false);
	r.onload = function(){
		if (this.status != 200) return;
		context= JSON.parse(this.responseText);
	};
	r.send();
	return context;
}
define(function(){return dribbble;});
