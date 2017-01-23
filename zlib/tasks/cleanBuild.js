/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const fs = require("fs");

require("./stopServer");
/**
 * 清理生成的文件
 */
gulp.task("cleanBuild", ["stopServer"], function (cb, reject) {
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/less/outless");
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/out/appjs");
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/out/css");
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/out/page");
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/js");
    buildEnv.deleteFolderRecursive(buildEnv.buildPath + "/pub");
    try {
        fs.unlink("timeMap.json", function () {
        });
        fs.unlink("cache.json", function () {
        });
    } catch (e) {
    }
    cb();
});