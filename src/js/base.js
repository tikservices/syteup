"use strict";
//Global configs and functions shared between js
window.UNKNOWN_ERROR = -1;
window.NO_MORE_DATA = -2;
window.MODULE_NOT_FOUND = -3;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
window.spin_opts = {
    lines: 9,
    length: 5,
    width: 2,
    radius: 4,
    rotate: 9,
    color: "#4c4c4c",
    speed: 1.5,
    trail: 40,
    shadow: false,
    hwaccel: true,
    className: "spinner",
    zIndex: 2000000000,
    left: "90%"
};
function formatModuleName(module) {
    return module.replace(/_(.)/g, function (match, p1) {
        return p1.toUpperCase();
    });
}
function alertError(error, errorMessage) {
    return asyncText("templates/alert.html").then(function (view) {
        var template = Handlebars.compile(view);
        $(template({
            error: error,
            error_message: errorMessage
        })).modal().on("hidden.bs.modal", function () {
            $(this).remove();
        });
        return Promise.resolve();
    });
}
/*
function syncGet(url, success, headers, failure) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function () {
        if (this.status !== 200) {
            if (failure)
                failure();
            return;
        }
        success(JSON.parse(this.responseText));
    };
    xhr.onerror = function () {
        if (failure)
            failure();
    };
    if (headers) {
        for (var header in headers) {
            if (headers.hasOwnProperty(header))
                xhr.setRequestHeader(header, headers[header]);
        }
    }
    xhr.send();
}
*/
function asyncText(url, headers) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        if (xhr.overrideMimeType)
            xhr.overrideMimeType("text/plain");
        xhr.onload = function () {
            if (this.status !== 200) {
                reject(this.status);
                return;
            }
            resolve(this.responseText);
        };
        xhr.onerror = function () {
            reject();
        };
        if (headers) {
            for (var header in headers) {
                if (headers.hasOwnProperty(header))
                    xhr.setRequestHeader(header, headers[header]);
            }
        }
        xhr.send();
    });
}
function asyncGet(url, headers, jsonp) {
    if (headers)
        return asyncText(url, headers).then(function (res) {
            return Promise.resolve(JSON.parse(res));
        });
    else
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                jsonp: jsonp,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                dataType: "jsonp",
                async: false,
                success: function (res) {
                    if ("meta" in res && Object.keys(res).length === 2)
                        if ("data" in res)
                            res = res.data;
                        else if ("response" in res)
                            res = res.response;
                    resolve(res);
                },
                error: function (xhr, status) {
                    reject(status);
                }
            });
        });
}
function loadJS(src, obj, data, parentEl) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = ("https:" === document.location.protocol ? "https://" : "http://") + src;
        if (obj)
            for (var opt in obj)
                if (obj.hasOwnProperty(opt))
                    script[opt] = obj[opt];
        if (data)
            for (var el in data)
                if (data.hasOwnProperty(el))
                    script.dataset[el] = data[el];
        function onload() {
            /* jshint validthis:true */
            this.removeEventListener("load", onload);
            resolve();
        }
        script.addEventListener("load", onload);
        (parentEl || document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
    });
}