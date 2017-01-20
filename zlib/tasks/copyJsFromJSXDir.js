/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
/***
 * 将jsx文件夹下的js文件直接copy到js目录下
 */
gulp.task("copyJsFromJSXDir", function () {
    let stream = gulp.src(buildEnv.buildPath + "/jsx/**/*.js")
        .pipe(gulp.dest(buildEnv.buildPath + '/js'));
    return stream;
});