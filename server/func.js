/***
 *  常用API
***/
var fs=require("fs");

/**
 *  遍历目录 获取所有文件
 *  dir 搜索目录 会搜索到子目录下所有文件
 *  callback(file,info) 回调函数 第一个参数是文件路径 第二个参数是文件状态
 */
global.listDepDir = function(dir, callback) {
    var flist = fs.readdirSync(dir);
    for (var i = 0; i < flist.length; i++) {
        var item = flist[i];
        var info = fs.statSync(dir + item);
        if (info.isDirectory()) {
            listDepDir(dir + item + "/", callback);
        } else {
            callback(dir + item, info);
        }
    }
}

global.log=function(){
    console.log.apply(console,arguments);
}

global.randomMaxMin=function randomMaxMin(max,min){
    return parseInt(Math.random()*999999)%(max-min)+min;
}
/*
 * 类构造器
**/
global.MakeClass=require("./lib/class");