/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const through2 = require("through2");
const debug = require("../debug.js");
const babel = require("babel-core");
const path = require("path");
const fs = require("fs");

require("./copyJsFromJSXDir");

const cache = require("../CacheTree");
const extension_reg = /[^.]+$/;
/***
 * jsx翻译到js 包含 es6->es5
 * @return {*}
 * @constructor
 */
var TransformJSX = function () {
    return through2.obj(function (file, enc, cb) {
        let me = this;
        if (cache.isFileChange(file.path)) {
            debug.log("\ttransform >" + file.path);
            babel.transformFile(file.path, {
                presets: buildEnv.config.jsxPress
            }, function (err, result) {
                try {
                    let code = result.code;
                    for (let i in buildEnv.config.jsLibPath) {
                        let reg = new RegExp(i, "g");
                        code = code.replace(reg, buildEnv.relativePath(path.dirname(file.path), buildEnv.config.jsLibPath[i]));
                    }
                    file.contents = new Buffer(code);
                    file.path = file.path.replace(extension_reg, "js");
                    me.push(file);
                    cb();
                } catch (e) {
                    debug.error(err);
                    cb();
                }
            });
        } else {
            cb();
        }
    });
};


gulp.task("transformJSX", ["copyJsFromJSXDir"], function () {
    debug.info("start task transformJSX");
    let stream = gulp.src(buildEnv.buildPath + "/jsx/**/*.jsx")
        .pipe(TransformJSX())
        .pipe(gulp.dest(buildEnv.buildPath + '/js'))
        .on("finish", function () {
            if (!buildEnv.plugin && fs.existsSync(buildEnv.PluginJSPath)) {
                buildEnv.plugin = require(buildEnv.PluginJSPath);
            }
            if (buildEnv.plugin)
                buildEnv.plugin.on("afterTransformJSX");
        });
    return stream;
});