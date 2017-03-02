const path = require("path");
const buildEnv=require("./zlib/buildEnv");
const gulp=require("gulp");
const debug=require("./zlib/debug");

buildEnv.config = {
    appName: "taskSystem",
    jsxPress: ["react", "es2015", "stage-0"],
    lessPress: true,
    stopServerURL:"http://localhost:8808/api/stop",
    port:8808,
    debug: true,
    cache: true,//是否启用缓存
    lessLibPath: [],//less的库文件
    jsLibPath: {}//jsx文件的简单宏替换
}

if (process.argv[2] == "start") {
    debug.info("开启服务");
    require("./zlib/tasks/startServer");
    gulp.start("startServer");
} else if (process.argv[2] == "stop") {
    debug.info("开始停止服务");
    require("./zlib/tasks/stopServer");
    gulp.start("stopServer");
} else if (process.argv[2] == "cleanBuild") {
    debug.info("清理编译目录");
    require("./zlib/tasks/cleanBuild");
    gulp.start("cleanBuild");
} else if (process.argv[2] == "makePub") {
    debug.info("生成发布资源");
    buildEnv.config.debug=false;
    require("./zlib/tasks/pub");
    gulp.start("pub");
} else if(process.argv[2]=="eslint"){
    debug.info("检查代码");
    buildEnv.config.debug=false;
    require("./zlib/tasks/eslint");
    gulp.start("lint");
} else {
    debug.info("开始构建项目");
    let recordClosable;
    require("./zlib/tasks/build");
    gulp.task("refresh",function(cb){
        if(recordClosable.stop){
            recordClosable.stop(null,true);
        }
        recordClosable = gulp.start("refreshServer");
        cb();
    });

    gulp.task("refreshServer",["build"],function(cb){
        App.refreshClient();
        debug.info("success");
        cb();
    });

    gulp.task("startMyServer",["build"],function(cb){
        require("./server/app");
        debug.info("success");
        cb();
    });

    gulp.task("watchChange", function () {
        recordClosable=gulp.start("startMyServer");
        gulp.watch(['jsx/**/*', 'jsx/**/*.less',"less/base/*.less"], ['refresh']);
    });
    gulp.start("watchChange");
}
