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

/***
 * 延迟做
 * @param cb
 */
global.delayDo=function(cb,obj,...arguments){
    setTimeout(cb.bind(this, ...arguments), 0);
}
/*
 * 类构造器
**/
global.MakeClass=require("./lib/class");


global.Format=function(date,fmt){
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "H+" : date.getHours(24),                 //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}


const toString=Object.prototype.toString;
/***
 * 判断函数是否是Generator函数
 * @param func
 * @return {boolean}
 */
global.isGenerator=function(func){
    return toString.call(func)=="[object GeneratorFunction]";
}