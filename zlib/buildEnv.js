/**
 * 构建环境变量
 * Created by ZhangLiwei on 2017/1/20.
 */
const path=require("path");
const fs = require("fs");
const relativePath = require('cached-path-relative');
/***
 * 转换 分隔符
 * @param path
 * @return {*|XML|void|string}
 */
function makeLinuxPath(path){
    return path.replace(/\\/g,"/").replace(/\/{2,}/g,"/");
}

/***
 * 构建路径
 * @type {*}
 */
const buildPath=exports.buildPath=makeLinuxPath(path.resolve(__dirname+"/../"));
/***
 * 记录commonJS的路径
 * @type {*}
 */
exports.CommonJSPath=makeLinuxPath(path.resolve(__dirname+"/../js/common.js"));
/**
 * 记录插件js的路径
 * @type {*}
 */
exports.PluginJSPath=makeLinuxPath(path.resolve(__dirname+"/../js/plugin.js"));

/**
 * 获取相对路径
 * @param path {string}
 * @return {string|XML}
 */
exports.getPathByBuildPath=function(path){
    return makeLinuxPath(path).replace(buildPath, ".");
}

let through2 = require('through2');

/***
 * 创建一个双向Stream
 * @return {*}
 */
exports.getStream=function() {
    return through2.obj(function (chunk, enc, cb) {
        this.push(chunk);
        cb();
    });
}

/***
 * 创建路径 相对于buildPath
 * @param dirPath 路径
 * @param mode 模式
 * @return {boolean}
 */
exports.mkDirsSync=function(dirPath, mode){
    dirPath=relativePath(process.cwd(),dirPath);
    if (!fs.existsSync(dirPath)) {
        let pathTmp;
        dirPath.split("/").forEach(function (dirName) {
            if (pathTmp) {
                pathTmp = path.join(pathTmp, dirName);
            } else {
                pathTmp = dirName;
            }
            if (!fs.existsSync(pathTmp)) {
                if (!fs.mkdirSync(pathTmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

/**
 * 删除路径以及下属文件
 * @param path
 */
const deleteFolderRecursive=exports.deleteFolderRecursive = function (path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
/***
 * 修改browserify中的文件分隔符
 */
require("module")._cache[require.resolve("cached-path-relative")].exports = function () {
    return makeLinuxPath(relativePath.apply(this, arguments));
};
exports.relativePath= require('cached-path-relative');