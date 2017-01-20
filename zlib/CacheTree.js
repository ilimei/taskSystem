/**
 * 缓存树
 * Created by ZhangLiwei on 2017/1/20.
 */

var buildEnv=require("./buildEnv");
var fs = require("fs");

class CacheTree {
    constructor(json) {
        this._data = json ? JSON.parse(json) : {};
        if (!this._data.tree) {
            this._data.tree = {};
        }
        if (!this._data.less) {
            this._data.less = {};
        }
        if (!this._data.lessCache) {
            this._data.lessCache = {};
        }
        if (!this._data.commonJS) {
            this._data.commonJS = [];
            this._data.external = [];
        }
        this._bundleLess = [];
        this.treeChange = {};
    }

    addTree(file, effectFile) {
        file = buildEnv.getPathByBuildPath(file);
        effectFile = buildEnv.getPathByBuildPath(effectFile);
        if (!this._data.tree[file]) {
            this._data.tree[file] = [];
        }
        let arr = this._data.tree[file];
        if (arr.indexOf(effectFile) < 0) {
            arr.push(effectFile);
        }
    }

    addCommonJS(file, id, parent) {
        file = "./" + buildEnv.relativePath(buildEnv.buildPath, file);
        this._data.external.push(file);
        if (!id.startsWith(".")) {
            this._data.commonJS.push({file: file, expose: id});
        } else {
            this._data.commonJS.push({file: file, expose: file});
        }
    }

    addLess(file, effectFile) {
        effectFile = buildEnv.getPathByBuildPath(effectFile);
        if (!this._data.less[effectFile]) {
            this._data.less[effectFile] = [];
            this._data.lessCache[effectFile] = 0;
        }
        let arr = this._data.less[effectFile];
        if (fs.existsSync(file)) {
            if (arr.indexOf(file) < 0) {
                arr.push(file);
            }
        }
    }

    addBundleLess(lessPath) {
        lessPath = buildEnv.getPathByBuildPath(lessPath);
        this._bundleLess.push(lessPath);
    }

    isLessChange(file) {
        file = buildEnv.getPathByBuildPath(file);
        if (!this._data.less[file]) {
            return true;
        }
        let oldTime = this._data.lessCache[file];
        let newTime = 0;
        this._data.less[file].map(function (lessFile) {
            let info = fs.statSync(lessFile);
            newTime += (info.mtime - 0);
        });
        if (newTime != oldTime) {
            this._data.lessCache[file] = newTime;
        }
        return newTime != oldTime;
    }

    addFileTime(file) {
        file = buildEnv.getPathByBuildPath(file);
        let info = fs.statSync(file);
        this._data[file] = info.mtime - 0;
    }

    isFileChange(file) {
        let info = fs.statSync(file);
        file = buildEnv.getPathByBuildPath(file);
        let oldTime = this._data[file];
        let newTime = info.mtime - 0;
        if (oldTime != newTime) {
            this._data[file] = newTime;
            let treeFiles = this._data.tree[file];
            if (treeFiles)
                for (let i = 0, l = treeFiles.length; i < l; i++) {
                    this.treeChange[treeFiles[i]] = true;
                }
            return true;
        } else {
            let treeFiles = this._data.tree[file];
            if (treeFiles)
                for (let i = 0, l = treeFiles.length; i < l; i++) {
                    if (!this.treeChange[treeFiles[i]])
                        this.treeChange[treeFiles[i]] = false;
                }
        }
        return false;
    }

    isTreeChange(file) {
        file = buildEnv.getPathByBuildPath(file);
        return this.treeChange[file];
    }

    toString() {
        return JSON.stringify(this._data);
    }
}

let json = false;
let jsonPath=buildEnv.buildPath+"/cache.json";
if (fs.existsSync(jsonPath)) {
    json = fs.readFileSync(jsonPath);
}
module.exports=buildEnv.cache = new CacheTree(json);