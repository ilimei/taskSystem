const path = require("path");
const buildEnv=require("./zlib/buildEnv");
const gulp=require("gulp")

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
    console.info("开启服务");
    require("./zlib/tasks/startServer");
    gulp.start("startServer");
} else if (process.argv[2] == "stop") {
    console.info("开始停止服务");
    require("./zlib/tasks/stopServer");
    gulp.start("stopServer");
} else if (process.argv[2] == "cleanBuild") {
    console.info("清理编译目录");
    require("./zlib/tasks/cleanBuild");
    gulp.start("cleanBuild");
} else if (process.argv[2] == "makePub") {
    console.info("生成发布资源");
    buildEnv.config.debug=false;
    require("./zlib/tasks/pub");
    gulp.start("pub");
} else if(process.argv[2]=="eslint"){
    console.info("检查代码");
    buildEnv.config.debug=false;
    require("./zlib/tasks/eslint");
    gulp.start("lint");
} else {
    console.info("开始构建项目");
    require("./zlib/tasks/build");
    gulp.task("refresh",["build"],function(cb){
        App.refreshClient();
        cb();
    });

    gulp.task("startMyServer",["build"],function(cb){
        require("./server/app");
        cb();
    });

    gulp.task("watchChange", function () {
        gulp.start("startMyServer");
        gulp.watch(['jsx/**/*', 'jsx/**/*.less',"less/base/*.less"], ['refresh']);
    });
    gulp.start("watchChange");
}
