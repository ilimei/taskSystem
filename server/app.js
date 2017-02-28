process.chdir(__dirname);//重置工作目录

var fs = require("fs");
var express = require("express");
var mysql = require("mysql");
require("./func");//装入常用api

var app = global.App = express();//创建应用
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = app._config = require("./config");//装入配置
app.dbPool = mysql.createPool(config.db);

// 设置session
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(config.sessionDb);
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    cookie: config.sessionCookie,
    saveUninitialized: true
}));

const log4js=require("log4js");
log4js.configure(config.logConfig);
global.getLogger=function(name){
    var logger = log4js.getLogger(name);
    return logger;
}
app.use(log4js.connectLogger(getLogger('express'), {level:'auto', format:':method :url'}));


//醉了 必须提供数据解析插件
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())


//指定静态资源(html css js image等)路径
app.use(express.static(config.staticPath));

const systemLogger=getLogger("system");
/**
 * 记录请求时间
 */
app.use(function(req,res,next){
    req._startTime=(new Date()-0);
    req._req_path=req.path;
    var calResponseTime = function () {
        var now = new Date(); //获取时间 t2
        var deltaTime = now - req._startTime;
        systemLogger.info(req.method+" "+req._req_path+" cost time "+deltaTime+" ms");
    }

    res.once('finish', calResponseTime);
    res.once('close', calResponseTime);
    return next();
});


//加载route下所有some.route.js文件
listDepDir("./route/", function (file) {
    if (file.endsWith(".route.js")) {
        systemLogger.info(file);
        require(file)(app);
    }
});

//拦截非api请求 直接交给前台处理
app.use(function (req, res, next) {
    var path = req.path.replace(/\/+|\\/g, "/");
    req.path=req.path.replace(/\/+|\\/g, "/");
    if (path == "/") {
        if (req.session.userid) {
            res.redirect("/user/all");
        } else {
            res.redirect("/login")
        }
    } else if (!path.startsWith("/api")) {
        if (!req.session.userid) {
            if (path != "/login" && path != "/register") {
                res.redirect("/login");
                return;
            }
        } else {
            if (path == "/login" || path == "/register") {
                res.redirect("/user/project");
                return;
            }
        }
        res.sendFile(require("path").resolve(config.staticPath+"/index.html"));
    } else {
        next();
    }
});

var co = require("co");
app.get("/api/install", function (req, res) {
    var arr = [];
    listDepDir("./modal/", function (file) {
        if (file.endsWith(".modal.js")) {
            arr.push(co(function*() {
                var Modal = require(file);
                return yield [new Modal().drop(), new Modal().create()];
            }));
        }
    });
    Promise.all(arr).then(function (result) {
        res.send("success");
    }).catch(function (err) {
        console.error(err);
        res.status(500).send(err);
    });
});

app.get("/api/session", function (req, res) {
    res.send(req.session.name);
});

app.get("/api/session/:name", function (req, res) {
    req.session.name = req.params.name;
    res.send("set ok");
});

app.get("/api/stop", function (req, res) {
    res.send("ok");
    process.exit(0);
});

var clients = [];
io.on('connection', function (socket) {
    clients.push(socket);
    socket.on('msg', function (msg) {
        socket.emit('msg', {});
        socket.broadcast.emit('msg', data);
    });
    socket.on("disconnect", function () {
        clients.splice(clients.indexOf(socket), 1);
    });
});

app.refreshClient = function () {
    clients.forEach(function (socket) {
        socket.emit('msg', "refresh");
    });
}

app.get("/api/refresh", function (req, res) {
    app.refreshClient();
    res.send('ok');
    process.exit(0);
});

http.on('error', function () {
    console.info("has error");
});

http.listen('8808', function () {
    systemLogger.info('listening on *:8808');
});
