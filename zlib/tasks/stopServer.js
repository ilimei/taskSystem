/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");

gulp.task("stopServer", function (cb) {
    let hasCb = false;
    require('http').get(buildEnv.config.stopServerURL, function (res) {
        cb();
        hasCb = true;
    }).on("error", function (err) {
        if (!hasCb)
            cb();
    });
});