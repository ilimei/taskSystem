/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const fs = require("fs");
const through2 = require("through2");
const browserify = require("browserify");
const buildEnv = require("../buildEnv");
const shim=require("browserify-shim");


require("./transformJSX");
const cache = require("../CacheTree");
const debug = require("../debug.js");

const extension_reg = /[^.]+$/;


/***
 * 调用browserify对js打包
 * @param bool 是否是对commonJS打包
 * @return {*}
 * @constructor
 */
let BundleJs = function (bool) {
    return through2.obj(function (file, enc, cb) {
        if (!bool) {
            let filePath = file.path.replace(/\\/g, "/");//window路径修正
            if (filePath == buildEnv.CommonJSPath || filePath == buildEnv.PluginJSPath) {//跳过CommonJS和PluginJS
                return cb();
            }
        }
        let filePath = file.path;
        //获取js文件对应生成的less位置
        let outLessPath = file.path.replace(/\\/g, "/").replace(/\/js\//, "/less/outless/").replace(extension_reg, "less");
        cache.addBundleLess(outLessPath);
        //判断js是否需要重新打包
        if (cache.isTreeChange(file.path) == false) {
            return cb();
        }
        debug.log("\tbundle >" + filePath);
        let b = browserify({
            debug: buildEnv.config.debug,
            filter: function (id) {
                try {
                    var file = require.resolve(id);
                    //如果引入的是css或者less加入对应的css打包中
                    if (file.endsWith(".css") || file.endsWith(".less")) {
                        cache.addLess(file, outLessPath);
                        b.ignore(id);
                        return false;
                    }
                } catch (e) {
                }
                return true;
            }
        });
        file.contents = buildEnv.getStream();
        b.on('file', function (childFile, id, parent) {
            if (bool) {
                if (childFile.endsWith(".css")) {
                    console.info(childFile, id);
                    console.info(b._ignore);
                }
                cache.addCommonJS(childFile, id, parent);
            }
            let lessPath = childFile.replace(/\\/g, "/").replace(/\/js\//, "/jsx/").replace(extension_reg, "less");
            let jsxPath = childFile.replace(/\\/g, "/").replace(/\/js\//, "/jsx/").replace(extension_reg, "jsx");
            cache.addTree(jsxPath, filePath);
            cache.addLess(lessPath, outLessPath);
        });
        b.transform(shim);
        b.require(file.path, {
            entry: true,
            debug: buildEnv.config.debug
        });
        if (!bool) {
            if (cache._data.external.length) {
                b.external(cache._data.external, {
                    basedir: buildEnv.buildPath
                });
            }
        }
        b.bundle().on('error', function (err) {
            console.error(err);
        }).pipe(file.contents);
        file._ignore = b._ignore;//记录ignore文件
        cb(null, file);
    });
};

/***
 * 对CommonJS进行打包
 * @return {*}
 * @constructor
 */
let BundleCommon = function () {
    return through2.obj(function (file, enc, cb) {
        if (file == null) {
            return cb();
        }
        let self = this;
        file.contents.pipe(buildEnv.getStream())
            .on("data", function () {
            })
            .on("error", function (err) {
                cb(err);
            })
            .on("finish", function () {
                file.contents = buildEnv.getStream();
                var b = browserify({
                    debug: buildEnv.config.debug
                });
                b._ignore = file._ignore;
                b.transform(shim);
                var oldPath=process.cwd();
                process.chdir(buildEnv.buildPath);
                b.require(cache._data.commonJS)
                    .bundle()
                    .on('error', function (err) {
                        console.error(err);
                        cb(err);
                    })
                    .pipe(file.contents);
                process.chdir(oldPath);
                cb(null,file);
            });
    });
}


gulp.task("commonJS", ["transformJSX"], function (cb) {
    console.info("start task commonJS");
    let stream = gulp.src(buildEnv.buildPath + "/js/common.js")
        .pipe(BundleJs(true))
        .pipe(BundleCommon())
        .pipe(gulp.dest(buildEnv.buildPath + "/out/appjs"))
        .on("finish", function () {
            if (!buildEnv.plugin && fs.existsSync(buildEnv.PluginJSPath)) {
                buildEnv.plugin = require(buildEnv.PluginJSPath);
            }
            if (buildEnv.plugin)
                buildEnv.plugin.on("afterCommonJS");
        });
    return stream;
});

gulp.task("bundleJS", ["commonJS"], function () {
    console.info("start task bundleJS");
    let stream = gulp.src(buildEnv.buildPath + "/js/*.js")
        .pipe(BundleJs())
        .pipe(gulp.dest(buildEnv.buildPath + "/out/appjs"))
        .on("finish", function () {
            if (!buildEnv.plugin && fs.existsSync(buildEnv.PluginJSPath)) {
                buildEnv.plugin = require(buildEnv.PluginJSPath);
            }
            if (buildEnv.plugin)
                buildEnv.plugin.on("afterBundleJS");
        });
    return stream;
});