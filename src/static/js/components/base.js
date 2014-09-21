//Global configs and functions shared between js

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

require.config({
  baseUrl: "static/",
  paths: {
    "text": "js/libs/text",
    "json": "js/libs/json"
  },
  waitSeconds: 15
});

var spin_opts = {
  lines: 9,
  length: 5,
  width: 2,
  radius: 4,
  rotate: 9,
  color: '#4c4c4c',
  speed: 1.5,
  trail: 40,
  shadow: false,
  hwaccel: true,
  className: 'spinner',
  zIndex: 2e9
};

function syncGet (url, success, headers, failure) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.onload = function() {
		if (this.status != 200) {
			if (failure) failure();
		       	return;
		}
		success(JSON.parse(this.responseText));
	};
	xhr.onerror = function() {
		if(failure) failure();
	}
	if(headers) {
		for ( header in headers ) {
			if (headers.hasOwnProperty(header)) return;
			xhr.setRequestHeader(header, headers[header]);
		}
	}
	xhr.send();
}
function asyncGet (url, headers) {
	return new Promise(function(resolve, reject) {
		syncGet(url, resolve, headers, reject);
	});
}
