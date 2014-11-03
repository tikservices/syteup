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
    if (headers && Object.keys(headers).length)
        return asyncText(url, headers).then(function (res) {
            return Promise.resolve(res);
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