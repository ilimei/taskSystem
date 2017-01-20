const http = require("http");
const router = require("express").Router();
const co = require("co");
const Project = require("../../modal/Project.modal.js");
const ProjectUser = require("../../modal/ProjectUser.modal");
const TaskModal = require("../../modal/Task.modal");
const User = require("../../modal/User.modal");

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    res.redirect(301, "/login");
});

router.post("/getTask",function(req,res){
    co(function*() {
        let task = new TaskModal();
        return yield task.find().where({id:req.body.id}).one(true);
    }).then(function(data){
        return co(function*() {
            let [creator, executor, project]=yield [new User().find().where({
                id: data.creator
            }).one(true), new User().find().where({
                id: data.executor
            }).one(true), new Project().find().where({
                id: data.project
            }).one(true)];
            data.creator = creator;
            data.executor = executor;
            data.project = project;
            return data;
        });
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/listProject", function (req, res) {
    co(function*() {
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        let projectId = req.body.projectId;
        let queryType = req.body.type;
        let task = new TaskModal();
        let userId = req.session.userid;
        switch (queryType) {
            case "all": {
                let query = task.find().where({
                    project: projectId
                }).orderBy(["done asc","weight asc","update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "done": {
                let query = task.find().where({
                    project: projectId,
                    done: 1
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "pending": {
                let query = task.find().where({
                    project: projectId,
                    done: 0
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "overdue": {
                let query = task.find().where({
                    project: projectId,
                    end_time: ["<", new Date().getTime() + ""],
                    done: 0
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "created": {
                let query = task.find().where({
                    creator: userId,
                    project: projectId
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            default: {
                let query = task.find().where({
                    project: projectId,
                    executor: new User().find(["id"]).where({name: queryType})
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
        }
    }).then(function (data) {
        var [count,re]=data;
        var map = re.map(function (v) {
            return co(function*() {
                let [creator, executor, project]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true)];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                return v;
            });
        });
        map.unshift(count);
        return Promise.all(map);
    }).then(function (data) {
        var count = data.shift();
        res.json({success: true, result: data, count: count});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/listUser", function (req, res) {
    co(function*() {
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        let queryType = req.body.type;
        let task = new TaskModal();
        let userId = req.session.userid;
        switch (queryType) {
            case "all": {
                let query = task.find().where({
                    executor: userId
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "done": {
                let query = task.find().where({
                    executor: userId,
                    done: 1
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "pending": {
                let query = task.find().where({
                    executor: userId,
                    done: 0
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "overdue": {
                let query = task.find().where({
                    executor: userId,
                    end_time: ["<", new Date().getTime() + ""],
                    done: 0
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "created": {
                let query = task.find().where({
                    creator: userId
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            default: {
                let query = task.find().where({
                    project: queryType,
                    executor: userId
                }).orderBy(["done asc","weight asc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
        }
    }).then(function (data) {
        var [count,re]=data;
        var map = re.map(function (v) {
            return co(function*() {
                let [creator, executor, project]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true)];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                return v;
            });
        });
        map.unshift(count);
        return Promise.all(map);
    }).then(function (data) {
        var count = data.shift();
        res.json({success: true, result: data, count: count});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/update", function (req, res) {
    co(function*() {
        let task = new TaskModal();
        for (var i in req.body) {
            task[i] = req.body[i];
        }
        return yield task.update();
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/add", function (req, res) {
    co(function*() {
        let task = new TaskModal();
        var executor = req.body.executor;
        executor = executor == 'false' ? false : executor;
        task.creator = req.session.userid;
        task.executor = executor || req.session.userid;
        task.end_time = req.body.end_time;
        task.weight = req.body.urgency;
        task.project = req.body.projectId;
        task.done = 0;
        task.name = req.body.name;
        task.desc = req.body.desc;
        return yield task.insert();
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/remove", function (req, res) {
    co(function*() {
        let task = new TaskModal();
        task = yield task.find().where({id: req.body.id}).one();
        if (task.creator == req.session.userid) {
            return yield task.delete();
        }
        res.json({success: false, message: "无全删除非自己创建的任务"});
        return false;
    }).then(function (data) {
        if (data) {
            res.json({success: true, result: data});
        }
    }).catch(err => {
        console.error(err);
    });
});

module.exports = function (app) {
    app.use("/api/task", router);
}