/**
 * Created by ZhangLiwei on 2017/2/20.
 */
var http = require("http");
var router = require("express").Router();
var co = require("co");
var Doc = require("../../modal/Doc.modal.js");
var User=require("../../modal/User.modal");
var ProjectUser = require("../../modal/ProjectUser.modal");
var Task=require("../../modal/Task.modal");
const Query=require("../../lib/query.class.js");
const DB=require("../../lib/transactionDB.class.js");

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

function getChild(data,doc){
    return co(function*(){
        for(var i=0;i<data.length;i++){
            var list=yield doc.find().where({parent:data[i].id}).all();
            data[i].child=list;
            data[i].open=true;
            if(list.length){
                yield getChild(list,doc);
            }
        }
    });
}

function delChild(data,doc,db){
    return co(function*(){
        for(var i=0;i<data.length;i++){
            var list=yield doc.find().where({parent:data[i].id}).all();
            if(list.length){
                yield delChild(list,doc);
            }
            doc.id=data[i].id;
            yield doc.delete(db);
        }
    });
}

router.post("/getDoc",function(req,res){
    co(function*() {
        let doc = new Doc();
        let root={title:"文档",id:req.body.id,open:true};
        let lst=yield doc.find().where({parent:req.body.id,project_id:req.body.projectId}).all();
        root.child= lst;
        yield getChild(lst,doc);
        return root;
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/getDetailDoc",function(req,res){
    co(function*() {
        let doc = new Doc();
        doc=yield doc.find().where({id:req.body.id}).one(true);
        let lst=yield new Doc().find().where({parent:req.body.id}).all();
        doc.child=lst;
        return doc;
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/add",function (req,res) {
    co(function*(){
        let doc = new Doc();
        doc.parent=req.body.parent;
        doc.type=req.body.type;
        doc.title=req.body.title;
        doc.content=req.body.content;
        doc.editor=req.body.editor;
        doc.project_id=req.body.projectId;
        doc.uptime=new Date().getTime();
        doc.creator=req.session.user.id;
        doc.creatime=doc.uptime;
        return yield doc.insert();
    }).then(data=>{
        res.json({success: true, result: data});
    }).catch(err=>{
        console.error(err);
    });
});

router.post("/update",function(req,res){
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
    }).then(data=>{
        res.json({success: true, result: data});
    }).catch(err=>{
        console.error(err);
    });
});

router.post("/del",function(req,res){
    let db=new DB(App.dbPool);
    co(function*(){
        db.startTransaction();
        let doc = new Doc();
        doc.id = req.body.id;
        let lst=yield doc.find().where({parent:req.body.id}).all(db);
        delChild(lst,doc,db);
        var delQuery=new Query(db).delete(Doc).where({
            parent:doc.id
        });
        return yield [doc.delete(db),delQuery.exec()];
    }).then(data=>{
        db.commit();
        db.release();
        res.json({success: true, result: data});
    }).catch(err=>{
        db.rollback();
        db.release();
        console.error(err);
    });
});

module.exports = function (app) {
    app.use("/api/doc", router);
}