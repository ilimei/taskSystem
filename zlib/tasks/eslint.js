/**
 * Created by ZhangLiwei on 2017/2/22.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
const eslint=require("gulp-eslint");

gulp.task('lint', () => {
    console.info("开始检测代码")
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src([buildEnv.buildPath+'/jsx/**/*.jsx'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint({
            "parserOptions": {
                "ecmaVersion": 6, //指定ECMAScript支持的版本，6为ES6
                "sourceType": "module", //指定来源的类型，有两种”script”或”module”
                "ecmaFeatures": {
                    "jsx": true//启动JSX
                },
            }
        }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});