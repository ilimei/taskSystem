/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const fs = require("fs");
const cache = require("../CacheTree");
const {info}=require("../debug");

require("./bundleLess");

gulp.task("build", ["bundleLess"], function (cb) {
    info("start task build");
    if (buildEnv.config.cache)
        fs.writeFileSync(buildEnv.buildPath+"/cache.json", cache.toString());
    cb();
});