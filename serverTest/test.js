/**
 * 测试入口
 * Created by ZhangLiwei on 2017/2/9.
 */
process.chdir(__dirname);//重置工作目录

const path = require("path");
const TestRunner = require("nodeunit").reporters.default;
require("./config")

TestRunner.run([
    path.resolve("./lib"),//测试lib下的文件
    // path.resolve("./modal/Comment.modal.js")
]);