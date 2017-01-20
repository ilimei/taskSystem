/**
 * Created by ZhangLiwei on 2017/1/20.
 */
let babel = require("babel-core");
let less = require("less");
let through2 = require('through2');
const path=require("path");
const buildEnv=require("./buildEnv");
const cache=require("./CacheTree");
const md5Tree=require("./Md5Tree");
const browserify = require("browserify");
const shim=require("browserify-shim");
const fs = require("fs");
const debug=require("./debug");

const extension_reg=/[^.]+$/;
/***
 * jsx翻译到js 包含 es6->es5
 * @return {*}
 * @constructor
 */
exports.TransformJSX = function () {
    return through2.obj(function (file, enc, cb) {
        let me = this;
        if (cache.isFileChange(file.path)) {
            debug.log("transform >" + file.path);
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
                    console.error(err);
                    cb();
                }
            });
        } else {
            cb();
        }
    });
};

/***
 * 调用browserify对js打包
 * @param bool 是否是对commonJS打包
 * @return {*}
 * @constructor
 */
exports.BundleJs = function (bool) {
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
        debug.log("bundle >" + filePath);
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
exports.BundleCommon = function () {
    return through2.obj(function (file, enc, cb) {
        if (file == null) {
            return cb();
        }
        let self = this;
        file.contents.pipe(buildEnv.getStream())
            .on("data",function(){})
            .on("error", function (err) {
                cb(err);
            })
            .on("finish", function () {
                file.contents = buildEnv.getStream();
                self.push(file);
                var b = browserify({
                    debug: buildEnv.config.debug
                });
                b._ignore = file._ignore;
                b.transform(shim);
                b.require(cache._data.commonJS)
                    .bundle()
                    .on('error', function (err) {
                        cb(err);
                    })
                    .pipe(file.contents);
                cb();
            });
    });
}

/***
 * 生成less文件
 * @param file
 * @return {string}
 */
let makeLessFiles = function (file) {
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
    fs.writeFileSync(file, data);
    return data;
};

/**
 * less翻译到css
 * @return {*}
 * @constructor
 */
exports.BundleLess = function () {
    return through2.obj(function (file, enc, cb) {
        let filePath = file.path.replace(/\\/g, "/");
        if (filePath == buildEnv.PluginJSPath) {
            cb();
            return;
        }
        let LessLibPath = file.path.replace(/\\/g, "/").replace(/\/js\//, "/less/outless/").replace(extension_reg, "less");
        if (cache.isLessChange(LessLibPath)) {
            let data = makeLessFiles(LessLibPath);
            debug.log("bundleLess > " + LessLibPath);
            file.path = file.path.replace(extension_reg, "css");
            this.push(file);
            less.render(data, {
                paths: [".", "./less/base"].concat(buildEnv.config.lessLibPath),
                filename: LessLibPath,
                compress: buildEnv.config.lessPress
            }, function (e, output) {
                if (e) {
                    var startLine = e.line - 1;
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


let uglifyJS = require("uglify-js");
exports.miniJS = function () {
    return through2.obj(function (file, enc, cb) {
        if (file.path.endsWith(".js")) {
            log("minify > " + file.path);
            let arr = [];
            let self = this;
            if (file.isStream()) {
                file.contents.pipe(getStream())
                    .on("data", function (chunk) {
                        arr.push(chunk.toString());
                    })
                    .on("finish", function () {
                        let result = uglifyJS.minify(arr.join(""), {fromString: true, mangleProperties: true});
                        file.contents = new Buffer(result.code);
                        self.push(file);
                        cb();
                    });
            } else if (file.isBuffer()) {
                let result = uglifyJS.minify(file.contents.toString(), {fromString: true});
                file.contents = new Buffer(result.code);
                self.push(file);
                cb();
            }
        } else {
            this.push(file);
            cb();
        }
    });
}

exports.md5JSCSS = function () {
    let crypto = require('crypto');

    function md5(ph) {
        let md5sum = crypto.createHash('md5');
        md5sum.update(ph);
        let str = md5sum.digest('hex');
        return str.substr(0, 8);
    }

    return through2.obj(function (file, enc, cb) {
        if (file.path.endsWith(".js") || file.path.endsWith(".css")) {
            let str = md5(file.contents);
            let oldPath = file.path.replace(/\\/g, "/");
            file.path = oldPath.replace(/[^/]+(\.[^\.]+)$/, str + "$1");
            md5Tree.add(oldPath, file.path);
            this.push(file);
            cb();
        } else {
            this.push(file);
            cb();
        }
    });
};