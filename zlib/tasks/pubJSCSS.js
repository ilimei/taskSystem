/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const through2 = require("through2");
const debug = require("../debug.js");

require("./bundleLess");
const md5Tree=require("../Md5Tree");

let uglifyJS = require("uglify-js");

const miniJS = function () {
    return through2.obj(function (file, enc, cb) {
        if (file.path.endsWith(".js")) {
            debug.log("\tminify > " + file.path);
            let arr = [];
            if (file.isStream()) {
                file.contents.pipe(buildEnv.getStream())
                    .on("data", function (chunk) {
                        arr.push(chunk.toString());
                    })
                    .on("finish", function () {
                        let result = uglifyJS.minify(arr.join(""), {fromString: true, mangleProperties: true});
                        file.contents = new Buffer(result.code);
                        cb(null,file);
                    });
            } else if (file.isBuffer()) {
                let result = uglifyJS.minify(file.contents.toString(), {fromString: true});
                file.contents = new Buffer(result.code);
                cb(null,file);
            }
        } else {
            cb(null,file);
        }
    });
}

const md5JSCSS = function () {
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
            cb(null,file);
        } else {
            cb(null,file);
        }
    });
};

gulp.task("pubJSCSS", ["bundleLess"], function () {
    buildEnv.deleteFolderRecursive("./pub");
    return gulp.src(buildEnv.buildPath+"/out/**/!(*.html)")
        .pipe(miniJS())
        .pipe(md5JSCSS())
        .pipe(gulp.dest(buildEnv.buildPath+"/pub"));
});