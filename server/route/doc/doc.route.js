/**
 * Created by ZhangLiwei on 2017/2/20.
 */
const http = require("http");
const router = require("express").Router();
const co = require("co");
const Doc = require("../../modal/Doc.modal.js");
const User = require("../../modal/User.modal");
const ProjectUser = require("../../modal/ProjectUser.modal");
const Task = require("../../modal/Task.modal");
const Project = require("../../modal/Project.modal.js");
const Tip=require("../../modal/Tip.modal.js")
const TipTask=require("../../modal/TipTask.modal");
const Query = require("../../lib/query.class.js");
const DB = require("../../lib/transactionDB.class.js");

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    if (req.header("CONTENT-TYPE") == "application/x-www-form-urlencoded") {
        res.json({error: "noLogin"});
    } else {
        res.redirect(301, "/login");
    }
});

/***
 * 获取树形排列
 * @param data
 * @param doc
 * @return {*}
 */
function getTreeChild(data, doc) {
    return co(function*() {
        for (var i = 0; i < data.length; i++) {
            var docNode=data[i];
            if(docNode.type==2){
                var query=doc.find().where({parent: docNode.id,type:4});
                var doneQuery=new Task().find().where({done:["<>",0]}).where({
                    id:doc.find("editor").where({parent: docNode.id,type:4})
                });
                var [all,done]=yield [query.count(),doneQuery.count()];
                docNode.doneCount=done;
                docNode.allCount=all;
            }else {
                //不列出文章
                var list = yield doc.find().where({parent: data[i].id, type: ["<>", 3]})
                    .where({type: ["<>", 4]}).all();
                data[i].child = list;
                if (data[i].type != 2) {
                    data[i].open = true;
                }
                if (list.length) {
                    yield getTreeChild(list, doc);
                }
            }
        }
    });
}

function delChild(data, doc, db) {
    return co(function*() {
        for (var i = 0; i < data.length; i++) {
            var list = yield doc.find().where({parent: data[i].id}).all();
            if (list.length) {
                yield delChild(list, doc);
            }
            doc.id = data[i].id;
            yield doc.delete(db);
        }
    });
}

router.post("/getDoc", function (req, res) {
    co(function*() {
        let doc = new Doc();
        let root = {title: "文档", id: req.body.id, open: true};
        let lst = yield doc.find().where({parent: req.body.id, project_id: req.body.projectId}).all();
        root.child = lst;
        yield getTreeChild(lst, doc);
        return root;
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/getDocTask",function(req,res){
    co(function*(){
        var page = parseInt(req.body.page);//第几页 从1开始
        var rows = parseInt(req.body.rows);//每页多少个
        var query=new Query().select([[Doc, "a"], [Task, "b"]])
            .find(["a.*", "b.end_time end_time", "b.weight weight", "b.done done"])
            .where("a.editor=b.id")
            .where({parent:req.body.id,type:["<>",3]})
            .orderBy(["done asc","weight desc", "update_time desc"]);
        let [count,lst] = yield [query.count(),query.offset((page - 1) * rows).limit(rows).exec()];
        var re=lst.map(v=>{
            return co(function*(){
                return yield [new Task().find().where({id:v.editor}).one(true),v];
            });
        });
        re.push(count);
        return Promise.all(re);
    }).then(data=>{
        var count=data.pop();
        var re=data.map(([task,v])=>{
            return co(function*(){
                let [creator, executor, project,tips]=yield [new User().find().where({
                    id: task.creator
                }).one(true), new User().find().where({
                    id: task.executor
                }).one(true), new Project().find().where({
                    id: task.project
                }).one(true),new Tip().find().where({
                    id:new TipTask().find(["tip_id"]).where({
                        task_id:task.id
                    })
                }).all()];
                task.creator = creator;
                task.executor = executor;
                task.project = project;
                task.tips=tips;
                v.task=task;
                return v;
            });
        });
        re.push(count);
        return Promise.all(re);
    }).then(data=>{
        let count=data.pop();
        res.json({success:true,data:data,total:count});
    }).catch(e=>{
        console.error(e);
        res.json({success:false,message:e});
    });
});

router.post("/getDetailDoc", function (req, res) {
    co(function*() {
        let doc = new Doc();
        doc = yield doc.find().where({id: req.body.id}).one(true);
        let lst = yield new Doc().find().where({parent: req.body.id, type: ["<>", 4]}).all();
        doc.child = lst;
        return doc;
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/addTask", function (req, res) {
    co(function*() {
        let doc = new Doc();
        doc.parent = req.body.parent;
        doc.type = 4;
        doc.editor = req.body.taskId;
        doc.project_id = req.body.projectId;
        doc.uptime = new Date().getTime();
        doc.creator = req.session.user.id;
        doc.creatime = doc.uptime;
        return yield doc.insert();
    }).then(data => {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/addTasks", function (req, res) {
    co(function*() {
        let ids = JSON.parse(req.body.ids);
        let upTime = new Date().getTime();
        let insertObjs = ids.map(id => {
            return {
                parent: req.body.parent,
                type: 4,
                editor: id,
                project_id: req.body.projectId,
                uptime: upTime,
                creator: req.session.user.id,
                create_time: upTime
            }
        });
        return yield new Query().insert(Doc).values(insertObjs).exec();
    }).then(data => {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/add", function (req, res) {
    co(function*() {
        let doc = new Doc();
        doc.parent = req.body.parent;
        doc.type = req.body.type;
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.editor = req.body.editor;
        doc.project_id = req.body.projectId;
        doc.uptime = new Date().getTime();
        doc.creator = req.session.user.id;
        doc.creatime = doc.uptime;
        return yield doc.insert();
    }).then(data => {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/update", function (req, res) {
    co(function*() {
        let doc = new Doc();
        doc.id = req.body.id;
        if (req.body.title) {
            doc.title = req.body.title;
        }
        if (req.body.content) {
            doc.content = req.body.content;
        }
        doc.uptime = new Date().getTime();
        return yield doc.update();
    }).then(data => {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/del", function (req, res) {
    let db = new DB(App.dbPool);
    co(function*() {
        db.startTransaction();
        let doc = new Doc();
        doc.id = req.body.id;
        let lst = yield doc.find().where({parent: req.body.id}).all(db);
        delChild(lst, doc, db);
        var delQuery = new Query(db).delete(Doc).where({
            parent: doc.id
        });
        return yield [doc.delete(db), delQuery.exec()];
    }).then(data => {
        db.commit();
        db.release();
        res.json({success: true, result: data});
    }).catch(err => {
        db.rollback();
        db.release();
        console.error(err);
    });
});

module.exports = function (app) {
    app.use("/api/doc", router);
}