/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const through2 = require("through2");
const cache = require("../CacheTree");
const debug = require("../debug.js");
let less = require("less");
const fs = require("fs");

require("./bundleJS");

const extension_reg=/[^.]+$/;

/***
 * 生成less文件
 * @param file
 * @return {string}
 */
let makeLessFiles = function (file) {
    let writePath=file;
    file = buildEnv.getPathByBuildPath(file);
    let arr = cache._data.less[file] || [];
    let lessArray = arr.map(function (v) {
        return v;
    });
    lessArray.unshift("base.less");
    lessArray.push("footer.less");
    let data = lessArray.map(function (v) {
        if (v.endsWith(".css")) {
            return "@import (inline) \"" + v + "\";";
        } else {
            return "@import \"" + v + "\";";
        }
    }).join("\r\n");
    fs.writeFileSync(writePath, data);
    return data;
};

/**
 * less翻译到css
 * @return {*}
 * @constructor
 */
const BundleLess = function () {
    return through2.obj(function (file, enc, cb) {
        let filePath = file.path.replace(/\\/g, "/");
        if (filePath == buildEnv.PluginJSPath) {
            cb();
            return;
        }
        let LessLibPath = file.path.replace(/\\/g, "/").replace(/\/js\//, "/less/outless/").replace(extension_reg, "less");
        if (cache.isLessChange(LessLibPath)) {
            let data = makeLessFiles(LessLibPath);
            debug.log("\tbundleLess > " + LessLibPath);
            file.path = file.path.replace(extension_reg, "css");
            less.render(data, {
                paths: [buildEnv.buildPath, buildEnv.buildPath+"/less/base"].concat(buildEnv.config.lessLibPath),
                filename: LessLibPath,
                compress: buildEnv.config.lessPress
            }, function (e, output) {
                if (e) {
                    let startLine = e.line - 1;
                    console.error("\t" + e.filename);
                    e.extract = e.extract.map(function (v) {
                        return "\t\t" + (startLine++) + ":" + v;
                    });
                    e.extract.splice(2, 0, "\t\t  " + " ".repeat(e.column) + "^:" + e.message);
                    console.error(e.extract.join("\n"));
                    cb(e);
                } else {
                    file.contents = new Buffer(output.css);
                    cb(e, file);
                }
            });
        } else {
            cb();
        }
    });
};

gulp.task("bundleLess", ["bundleJS"], function () {
    console.info("start task bundleLess");
    buildEnv.mkDirsSync(buildEnv.buildPath+"/less/outless");
    return gulp.src(buildEnv.buildPath + "/js/*.js")
        .pipe(BundleLess())
        .pipe(gulp.dest(buildEnv.buildPath + "/out/css"))
        .on("finish", function () {
            if (!buildEnv.plugin && fs.existsSync(buildEnv.PluginJSPath)) {
                buildEnv.plugin = require(buildEnv.PluginJSPath);
            }
            if (buildEnv.plugin)
                buildEnv.plugin.on("afterBundleLess");
        });
});