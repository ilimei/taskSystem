/**
 * 对文件做md5
 * Created by ZhangLiwei on 2017/1/20.
 */
var buildEnv=require("./buildEnv");

class Md5Tree {
    constructor() {
        this.tree = {};
    }

    add(path, md5) {
        path = buildEnv.getPathByBuildPath(path);
        md5 = buildEnv.relativePath("./out", md5);
        this.tree[path] = md5;
    }

    get(path) {
        path = buildEnv.getPathByBuildPath(path);
        return this.tree[path];
    }
}

module.exports=buildEnv.md5Tree = new Md5Tree();