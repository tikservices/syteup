#!/usr/bin/node

"use strict";

if (process.argv.length < 4) {
    console.error("USAGE: " + process.argv[1] + " <src_dir> <config_file> [<dist_dir>]");
    return 1;
}
var SRC = process.argv[2];
if (/^[^\/]/.test(SRC)) SRC = "../" + SRC;
var CONF = process.argv[3];
global.window = undefined;
Array.forEach = function(a, f) {
    for (var i = 0; i < a.length; i++)
        f(a[i], i);
};
var fs = require("fs");
global.moment = require("moment");
global.Promise = require("promise");
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require(SRC + "/js/base.js");
fs.readFile(CONF, "UTF-8", function(e, config) {
    config = JSON.parse(config);
    var blog_path = formatModulePath(config.blog_platform);
    var blog_name = formatModuleName(config.blog_platform);
    require(SRC + "/blogs/" + blog_path + ".js");
    importM(blog_name + "Blog", SRC + "/blogs/" + blog_path).then(function(blog) {
        blog.fetch(config.blogs_settings[config.blog_platform]).then(function(posts) {
            var rss = genRSS(config, posts);
            if (process.argv.length === 5)
                fs.writeFile(process.argv[4] + "/feed", rss);
            else
                console.log(rss);
        }).catch(function(e) {
            console.error("Error while fetching posts or gen the feed!", e);
        });
    });
});

function genRSS(C, P) {
    /* jshint quotmark: false */
    var rss = '';
    rss += '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">';
    rss += '<channel>';
    rss += '<atom:link href="' + C.fields.url + '/feed" rel="self" type="application/rss+xml" />';
    rss += '<title>' + encodeXML(C.fields.realname) + ' [' + encodeXML(C.fields.username) + ']</title>';
    rss += '<description>' + encodeXML(C.fields.description) + '</description>';
    rss += '<link>' + C.fields.url + '</link>';
    Array.forEach(P, function(p, i) {
        rss += '<item>';
        if (p.title) rss += '<title>' + encodeXML(p.title) + '</title>';
        if (p.body) rss += '<description>' + encodeXML(p.body) + '</description>';
        rss += '<link>' + C.fields.url + '#!post/' + p.id + '</link>';
        rss += '<pubDate>' + moment(p.date, "YYYY-MM-DD HH:mm:ss").format("ddd, DD MMM YYYY HH:mm:ss G\\MT") + '</pubDate>';
        rss += '<guid>' + C.fields.url + ',' + C.blogs_settings[C.blog_platform].blog_url + ',' + p.id + '</guid>';
        rss += '</item>';
    });
    rss += '</channel>';
    rss += '</rss>';
    return rss;
}

function encodeXML(s) {
    return s.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
