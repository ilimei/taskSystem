/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const through2 = require("through2");
const fs = require("fs");
const md5Tree=require("../Md5Tree");
require("./pubJSCSS");
const {info} =require("../debug");

let makePubDoc = function ($) {
    return through2.obj(function (file, enc, cb) {
        let $html = $("<div></div>").html($("html").html());
        $html.find("script[type='text/javascript']").each(function () {
            let src = $(this).attr("src");
            let md5Name = md5Tree.get("./out/" + src);
            if (md5Name) {
                $(this).attr("src", "/"+md5Name)
            }
        });
        $html.find("link").each(function () {
            let src = $(this).attr("href");
            let md5Name = md5Tree.get("./out/" + src);
            if (md5Name) {
                $(this).attr("href", "/"+md5Name);
            }
        });
        $html.find("#page").remove();
        let jsPath = file.path.replace(/\\/g, "/");
        let cssPath = jsPath.replace(/\/appjs\//, "/css/").replace(/\.js$/, ".css");
        $html.append($("<script type='text/javascript' src='/" + md5Tree.get(jsPath) + "'></script>"));
        $html.append($('<link rel="stylesheet" type="text/css" href="/' + md5Tree.get(cssPath) + '">'));
        file.path = jsPath.replace(/\.js$/, ".html");
        let htmlStr="<!DOCTYPE html><html><head>" + $html.html() + "</head><body></body></html>";
        file.contents = new Buffer(htmlStr.replace(/\>\s+\</g,"><"));
        cb(null,file);
    });
}

gulp.task("pub", ["pubJSCSS"], function (cb) {
    info("start task pub");
    let jsdom = require("jsdom");
    let html = fs.readFileSync(buildEnv.buildPath+"/out/pub.html").toString();
    jsdom.env(html, function (err, window) {
        let $ = require("jquery")(window);
        return gulp.src(buildEnv.buildPath+"/out/appjs/!(common.js)")
            .pipe(makePubDoc($))
            .pipe(gulp.dest("./pub"))
            .on("finish", function () {
                cb();
            });
    });
});