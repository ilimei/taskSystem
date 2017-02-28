var http = require("http");
var router = require("express").Router();
var User = require("../../modal/User.modal.js");
var Project = require("../../modal/Project.modal");
var ProjectUser = require("../../modal/ProjectUser.modal");
var co = require("co");

router.post("/login", function (req, res) {
    co(function*() {
        var user = new User();
        user = yield user.find().where({
            name: req.body.username
            , password: req.body.password
        })
            .orWhere({
                phone: req.body.username,
                password: req.body.password
            })
            .orWhere({
                email: req.body.username,
                password: req.body.password
            }).one();
        if (!user) {
            res.json({"error": "错误的登录信息"});
            throw new Error("错误的登录信息");
        }
        req.session.user = JSON.stringify(user);
        req.session.userid = user.id;
        return user;
    }).then(function (result) {
        res.json({success: true, result: result});
    }).catch(function (error) {
        console.error(error);
    })
});

router.post("/register", function (req, res) {
    co(function*() {
        var user = new User();
        var count = yield user.find().where({name: req.body.username})
            .orWhere({phone: req.body.phone})
            .orWhere({email: req.body.email}).count();
        if (count >= 1) {
            res.json({error: "已结被注册了"});
            throw new Error("已结被注册了");
        }
        user.name = req.body.username;
        user.nick_name = req.body.nickname;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.password = req.body.password;
        user.uptime = new Date().getTime();
        user.avatar = user.getDefaultAvator();
        console.dir(user);
        return yield user.insert();
    }).then(function (result) {
        res.json({success: true, result: result});
    }).catch(function (err) {
        console.error(err);
        // res.status(500).json({error:err});
    });
});

router.post("/listProjects", function (req, res) {
    co(function*() {
        var project = new Project();
        var projectUser = new ProjectUser();
        return yield project.find().where({
            id: projectUser.find(["id"]).where({"user_id": req.session.userid})
        }).all();
    }).then(function (result) {
        res.json({success: true, result: result});
    }).catch(function (err) {
        res.status(500).json({error: err});
    });
});

router.post("/update", function (req, res) {
    co(function*() {
        var user = new User();
        user.id = req.session.userid;
        var count = yield user.find().where({name: req.body.username})
            .orWhere({phone: req.body.phone})
            .orWhere({email: req.body.email}).count();
        if (count >= 1) {
            res.json({error: "手机号、用户名或者email有冲突"});
            throw new Error("手机号、用户名或者email有冲突");
        }
        for (var i in req.body) {
            user[i] = req.body[i];
        }
        user.uptime = new Date().getTime();
        req.session.user = JSON.stringify(user);
        return yield user.update();
    }).then(function (result) {
        res.json({success: true, result: result});
    }).catch(function (err) {
        console.error(err);
    });
});

router.post("/list", function (req, res) {
    co(function*() {
        var user = new User();
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        return yield [
            user.find().offset((page - 1) * rows).limit(rows).all(),
            user.find().count()
        ]
    }).then(function (result) {
        var [data, count]=result;
        res.json({success: true, result: data, count: count});
    }).catch(function (err) {
        res.status(500).json({error: err});
    });
});

router.post("/getLoginInfo", function (req, res) {
    if (req.session.user) {
        res.json(JSON.parse(req.session.user));
    } else {
        res.json({noLogin: true});
    }
});

router.post("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.json({success: false, err: err});
        } else {
            res.json({success: true});
        }
    });
});
/**
 * 入口函数 参数app= express
 **/
module.exports = function (app) {
    app.use("/api/user", router);
};