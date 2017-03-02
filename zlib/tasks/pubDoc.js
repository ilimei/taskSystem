/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
var fs = require("fs");
const {error}=require("../debug");


gulp.task("pubDoc", function (cb) {
    let crypto = require('crypto');

    function md5(ph) {
        return new Promise(function (resolve, reject) {
            let md5sum = crypto.createHash('md5');
            fs.createReadStream(ph).on("data", function (chunk) {
                md5sum.update(chunk);
            }).on("end", function () {
                let str = md5sum.digest('hex');
                resolve(str);
            }).on("error",function(err){
                error(err);
                reject(err);
            });
        });
    }

    let jsdom = require("jsdom");
    let html = fs.readFileSync("./out/pub.html").toString();

    function callBack($dom, src, arr, type) {
        if (src) {
            arr.push(md5("./out/" + src).then(function (md5) {
                $dom.attr(type || "src", src + "?t=" + md5);
            }));
        }
    };
    let doc = jsdom.env(html, function (err, window) {
        $ = require("jquery")(window);
        let arr = [];
        $("script[type='text/javascript']").each(function () {
            $dom = $(this);
            let src = $(this).attr("src");
            callBack($dom, src, arr);
        });
        $("link").each(function () {
            $dom = $(this);
            let src = $(this).attr("href");
            callBack($dom, src, arr, "href");
        });
        Promise.all(arr).then(function () {
            fs.writeFileSync("./out/pub.html", "<!DOCTYPE html><html>" + $(html).html() + "</html>");
            cb();
        });
    });
});