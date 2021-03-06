const http = require("http");
const router = require("express").Router();
const co = require("co");
const Project = require("../../modal/Project.modal.js");
const ProjectUser = require("../../modal/ProjectUser.modal");
const TaskModal = require("../../modal/Task.modal");
const Doc = require("../../modal/Doc.modal");
const User = require("../../modal/User.modal.js");
const Tip=require("../../modal/Tip.modal.js")
const TipTask=require("../../modal/TipTask.modal");
const Query=require("../../lib/query.class");
const DB=require("../../lib/transactionDB.class");
const TaskLog=require("../../modal/TaskLog.modal");
const logUtil=require("../log/logUtil");

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    if(req.header("CONTENT-TYPE")=="application/x-www-form-urlencoded"){
        res.json({error:"noLogin"});
    }else {
        res.redirect(301, "/login");
    }
});

/**
 * @mark 单个获取任务
 */
router.post("/getTask",function(req,res){
    co(function*() {
        let task = new TaskModal();
        return yield task.find().where({id:req.body.id}).one(true);
    }).then(function(data){
        return co(function*() {
            let [creator, executor, project,tips]=yield [new User().find().where({
                id: data.creator
            }).one(true), new User().find().where({
                id: data.executor
            }).one(true), new Project().find().where({
                id: data.project
            }).one(true),new Tip().find().where({
                id:new TipTask().find(["tip_id"]).where({
                    task_id:data.id
                })
            }).all()];
            data.creator = creator;
            data.executor = executor;
            data.project = project;
            data.tips=tips;
            return data;
        });
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

/***
 * @mark 获取项目的所有任务
 */
router.post("/listProject", function (req, res) {
    co(function*() {
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        let projectId = req.body.projectId;
        let queryType = req.body.type;
        let filter=req.body.filter;
        let task = new TaskModal();
        let userId = req.session.userid;
        switch (queryType) {
            case "all": {
                let query = task.find().where({
                    project: projectId,
                    done:filter==-1?null:filter
                }).orderBy(["done asc","weight desc","update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "done": {
                let query = task.find().where({
                    project: projectId,
                    done: 1
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "pending": {
                let query = task.find().where({
                    project: projectId,
                    done: 0
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "created": {
                let query = task.find().where({
                    creator: userId,
                    project: projectId,
                    done:filter==-1?null:filter
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            default: {
                let query = task.find().where({
                    project: projectId,
                    executor: new User().find(["id"]).where({name: queryType}),
                    done:filter==-1?null:filter
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                let [creator, executor, project,tips]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true),new Tip().find().where({
                    id:new TipTask().find(["tip_id"]).where({
                        task_id:v.id
                    })
                }).all()];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                v.tips=tips;
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

/**
 * @mark 给文档页面开个接口
 */
router.post("/listProjectForDoc",function(req,res){
    co(function*() {
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        var docId=req.body.docId;
        var docTaskQuery=new Doc().find("editor").where({parent:docId,type:4});
        let projectId = req.body.projectId;
        let queryType = req.body.type;
        let filter=req.body.filter;
        let task = new TaskModal();
        let userId = req.session.userid;
        switch (queryType) {
            case "all": {
                let query = task.find().where({
                    project: projectId,
                    done:filter==-1?null:filter
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc","update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "done": {
                let query = task.find().where({
                    project: projectId,
                    done: 1
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "pending": {
                let query = task.find().where({
                    project: projectId,
                    done: 0
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "created": {
                let query = task.find().where({
                    creator: userId,
                    project: projectId,
                    done:filter==-1?null:filter
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            default: {
                let query = task.find().where({
                    project: projectId,
                    executor: new User().find(["id"]).where({name: queryType}),
                    done:filter==-1?null:filter
                }).where({
                    id:["not in",docTaskQuery]
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                let [creator, executor, project,tips]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true),new Tip().find().where({
                    id:new TipTask().find(["tip_id"]).where({
                        task_id:v.id
                    })
                }).all()];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                v.tips=tips;
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

/***
 * @mark 获取任务的所有标签
 */
router.post("/listTip", function (req, res) {
    co(function*() {
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        let projectId = req.body.projectId;
        let filter=req.body.filter;
        let task = new TaskModal();
        let tipId = req.body.tipId;
        let query = task.find().where({
            project: projectId,
            id:["in",new TipTask().find(["task_id"]).where({tip_id:tipId})],
            done:filter==-1?null:filter
        }).orderBy(["done asc","weight desc", "update_time"], true);
        return yield [
            query.count(),
            query.offset((page - 1) * rows).limit(rows).all()
        ];
    }).then(function (data) {
        var [count,re]=data;
        var map = re.map(function (v) {
            return co(function*() {
                let [creator, executor, project,tips]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true),new Tip().find().where({
                    id:new TipTask().find(["tip_id"]).where({
                        task_id:v.id
                    })
                }).all()];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                v.tips=tips;
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

/***
 * @mark 获取用户所有的任务
 */
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
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "done": {
                let query = task.find().where({
                    executor: userId,
                    done: 1
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "pending": {
                let query = task.find().where({
                    executor: userId,
                    done: 0
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            case "created": {
                let query = task.find().where({
                    creator: userId
                }).orderBy(["done asc","weight desc", "update_time"], true);
                return yield [
                    query.count(),
                    query.offset((page - 1) * rows).limit(rows).all()
                ];
            }
            default: {
                let query = task.find().where({
                    project: queryType,
                    executor: userId
                }).orderBy(["done asc","weight desc", "update_time"], true);
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
                let [creator, executor, project,tips]=yield [new User().find().where({
                    id: v.creator
                }).one(true), new User().find().where({
                    id: v.executor
                }).one(true), new Project().find().where({
                    id: v.project
                }).one(true),new Tip().find().where({
                    id:new TipTask().find(["tip_id"]).where({
                        task_id:v.id
                    })
                }).all()];
                v.creator = creator;
                v.executor = executor;
                v.project = project;
                v.tips=tips;
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

/***
 * @mark 更新任务
 */
router.post("/update", function (req, res) {
    co(function*() {
        let task = new TaskModal();
        for (var i in req.body) {
            task[i] = req.body[i];
        }
        var data=yield task.update();
        return [yield task.find().where({id:task.id}).one(),data];
    }).then(function ([task,data]) {
        if(req.body.executor){
            delayDo(logUtil.changeTaskExecutor,null,JSON.parse(req.session.user),task);
        }else if(req.body.end_time){
            delayDo(logUtil.changeTaskEndTime,null,JSON.parse(req.session.user),task);
        }else if(req.body.name){
            delayDo(logUtil.changeTaskName,null,JSON.parse(req.session.user),task);
        }else if(req.body.desc){
            delayDo(logUtil.changeTaskDesc,null,JSON.parse(req.session.user),task);
        }else if(req.body.done!=undefined){
            delayDo(logUtil.changeTaskDone,null,JSON.parse(req.session.user),task);
        }else if(req.body.weight!=undefined){
            delayDo(logUtil.changeTaskUrgency,null,JSON.parse(req.session.user),task);
        }
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

/**
 * @mark 添加任务
 */
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
        let data=yield task.insert();
        task.id=data.insertId;
        return [task,data];
    }).then(function ([task,data]) {
        delayDo(logUtil.addTask,null,JSON.parse(req.session.user),task);
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

/**
 * @mark 添加任务同时添加标签
 */
router.post("/addTaskAndTip",function(req,res){
    var db=new DB(App.dbPool);
    co(function*() {
        let task = new TaskModal();
        var executor = req.body.executor;
        let ids=JSON.parse(req.body.data);
        executor = executor == 'false' ? false : executor;
        task.creator = req.session.userid;
        task.executor = executor || req.session.userid;
        task.end_time = req.body.end_time;
        task.weight = req.body.urgency;
        task.project = req.body.projectId;
        task.done = 0;
        task.name = req.body.name;
        task.desc = req.body.desc;
        db.startTransaction();
        var data=yield task.insert(db);
        if(ids.length) {
            yield new Query(db).insert(TipTask).values(ids.map(v => {
                return {task_id: data.insertId, tip_id: v}
            })).exec();
        }
        task.id=data.insertId;
        return [task,data];
    }).then(function ([task,data]) {
        db.commit();
        db.release();
        delayDo(logUtil.addTask,null,JSON.parse(req.session.user),task);
        res.json({success: true, result: data,taskId:data.insertId});
    }).catch(err => {
        db.rollback();
        db.release();
        console.error(err);
    });
});

/**
 * @mark 删除项目
 */
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