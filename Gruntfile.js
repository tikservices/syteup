"use strict";
//var dom = require("node-dom").dom;
module.exports = function(grunt) {
  //var html = dom(grunt.file.read("src/index.html"));
  grunt.initConfig({
    pkg : grunt.file.readJSON("package.json"),
    jshint : {
      options : {jshintrc : true},
      src : [ "src/**/*.js", "!src/js/libs/*.js" ]
    },
    jsonlint : {
      src : [
        ".jsbeautifyrc",
        ".jshintrc",
        "src/config.json.sample",
        "*.json",
        "src/**/*.json"
      ]
    },
    jsbeautifier : {
      options : {
        config : ".jsbeautifyrc",
        js : {fileTypes : [ ".js", ".json" ]},
        css : {fileTypes : [ ".less", ".css" ]},
        html : {fileTypes : [".html"]}
      },
      files : [
        "src/**/*.js",
        "src/**/*.json",
        "!src/js/libs/*.js",
        "src/**/*.html",
        "!src/templates/*.html",
        "src/**/*.less",
        "src/**/*.css"
      ]
    },
    uglify : {
      options : {screwIE8 : true, compress : true},
      files : {
        "dist/syteup.min.js" : "dist/syteup.js",
        "dist/syteup-modules.min.js" : "dist/syteup-modules.js",
        "dist/syteup-libs.min.js" : "dist/syteup-libs.js"
      }
    },
    less : {
      options : {
        ieCompat : false,
        strictMath : true,
        strictImports : true,
        strictUnits : true,
        rootpath : "src/",
        compress : true,
        plugins : [new require("less-plugin-clean-css")()]
      },
      files : {
        "dist/syteup.min.css" : "src/less/styles.less",
        "dist/syteup-profiles.min.css" : "src/less/profiles.less"
      }
    },
    htmlmin : {
      options : {
        removeComments : true,
        collapseWhitespace : true,
        preserveLineBreaks : true,
        removeAttributeQuotes : true,
        removeRedundantAttributes : true,
        useShortDoctype : true,
        keepClosingSlash : true,
        minifyJS : true,
        minifyCSS : true
      },
      files : {"dist/index.html" : "src/index.html"}
    },
    copy : {
      files : {
        "src/templates/" : "dist/templates",
        "src/services/" : "dist/services",
        "src/plugins/" : "dist/plugins",
        "src/blogs/" : "dist/blogs",
        "src/imgs/" : "dist/imgs",
        "src/config.json" : "dist/config.json"
      }
    },
    concat : {
      files : {
        "dist/syteup.js" : [ "src/js/*.js", "src/blogs/*.js" ],
        "dist/syteup-modules.js" : [ "src/plugins/*.js", "src/services/*.js" ],
        "dist/syteup-libs.js" : [/********/]
      }
    },
    clean : {src : "dist/"}
  });
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-jsonlint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.registerTask("default", [
    /*"clean",*/ "jshint",
    "jsonlint",
    "jsbeautifier",
    "concat",
    "copy",
    "uglify",
    "less",
    "htmlmin"
  ]);
};
