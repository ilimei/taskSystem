/**
 * Created by ZhangLiwei on 2017/1/20.
 */
const gulp = require("gulp");
const buildEnv = require("../buildEnv");
import {spawn} from "child_process";

const port=buildEnv.config.port;

require("./build");

gulp.task("startServer", ["build"], function () {
    let express = require('express');
    let app = express();
    let http = require('http').Server(app);
    let io = require('socket.io')(http);
    let clients = [];

    app.use(express.static('out'));
    //拦截非api请求 直接交给前台处理
    app.use(function (req, res, next) {
        // console.log('Time:', Date.now());
        var path = req.path.replace(/^\/+/g, "/");
        if (!path.startsWith("/api") && !/\.[^\.]+$/.test(path)) {
            res.sendFile(require("path").resolve(buildEnv.buildPath + "/out/index.html"));
        } else {
            next();
        }
    });
    app.get("/api/refresh", function (req, res) {
        if (clients) {
            clients.map(function (v) {
                v.emit("msg", "refresh");
            });
        } else {
            if (process.platform == "win32") {
                spawn("start chrome --url http://localhost:"+port+"  --disable-web-security --user-data-dir=" + path.resolve("../chromeTemp")).on("error", function (err) {
                    console.error(err);
                });
                // cmd("start chrome http://localhost:8808 -disable-web-security -user-data-dir="+path.resolve("../chromeTemp"),{shell:"/c"});
            } else {
                spawn("open -a '/Applications/Google Chrome.app' --args -disable-web-security -user-data-dir=" + path.resolve("../chromeTemp") + " --url http://localhost:"+port, function (err) {
                    if (err)
                        console.error(err);
                });
            }
        }
        res.send('ok');
    });

    app.get("/api/stop", function (req, res) {
        res.send('ok');
        process.exit(1);
    });

    io.on('connection', function (socket) {
        console.log('has connected');
        clients.push(socket);
    });

    http.on('error', function () {
        require('http').get("http://localhost:"+port+"/api/refresh", function (res) {
            console.info(res.statusCode);
        });
    });
    http.listen(port, function () {
        console.log('listening on *:'+port);
        if (process.platform == "win32") {
            spawn("start chrome --url http://localhost:"+port+"  --disable-web-security --user-data-dir=" + path.resolve("../chromeTemp")).on("error", function (err) {
                console.error(err);
            });
        } else {
            spawn("open -a '/Applications/Google Chrome.app' --args -disable-web-security -user-data-dir=" + path.resolve("../chromeTemp") + " --url http://localhost:8808", function (err) {
                if (err)
                    console.error(err);
            });
        }
        console.info("open the http://localhost:"+port);
    });
});