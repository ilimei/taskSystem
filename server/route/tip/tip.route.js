/**
 * Created by ZhangLiwei on 2017/2/9.
 */
const http = require("http");
const router = require("express").Router();
const co = require("co");
const Project=require("../../modal/Project.modal.js");
const Tip=require("../../modal/Tip.modal.js");
const TipTask=require("../../modal/TipTask.modal.js");
const Task=require("../../modal/Task.modal.js");
const Query=require("../../lib/query.class.js");
const DB=require("../../lib/transactionDB.class.js");

router.post("/addTaskTip",function(req,res){
    var db=new DB(App.dbPool);
    co(function*(){
        yield db.startTransaction();
        let ids=JSON.parse(req.body.data);
        let task_id=req.body.taskId;
        let projectId=req.body.projectId;
        var subQuery=new Query(db).select(Tip).find(["id tip_id",task_id+" task_id"]).where({
            "id":["not in",new Query(db).select(TipTask).find("tip_id").where({
                task_id:task_id
            })]
        }).where({
            "id":["in",new Query(db).select(Tip).find("id").where({
                project_id:projectId
            })]
        }).where({
            "id":["in",ids]
        });
        var delQuery=new Query(db).delete(TipTask).where({task_id:task_id});
        if(ids.length){
            delQuery=new Query(db).delete(TipTask).where({tip_id:["not in",ids],task_id:task_id});
            yield delQuery.exec();
            return yield new Query(db).insert(TipTask).value(subQuery,["tip_id","task_id"]).exec();
        }else{
            return yield delQuery.exec();
        }
    }).then(result=>{
        db.commit();
        db.release();
        res.json({success:true});
    }).catch(err=>{
        db.rollback();
        db.release();
        console.error(err);
    });
});

router.post("/list",function(req,res){
    co(function*(){
        var tip=new Tip();
        return yield tip.find().where({project_id:req.body.projectId}).all();
    }).then(result=>{
        res.json({success:true,data:result});
    }).catch(err=>{
        console.error(err);
    });
});

router.post("/add",function(req,res){
    co(function*(){
        var tip=new Tip();
        tip.project_id=req.body.projectId;
        tip.name=req.body.name;
        tip.color=req.body.color;
        return yield tip.insert();
    }).then(result=>{
        res.json({success:true,data:result});
    }).catch(err=>{
        console.error(err);
    });
});

router.post("/remove",function(req,res){
    var db=new DB(App.dbPool);
    co(function*(){
        yield db.startTransaction();
        var tip=new Tip();
        tip.id=req.body.id;
        yield new Query(db).delete(TipTask).where({
            tip_id:tip.id
        }).exec();
        return yield tip.delete(db);
    }).then(result=>{
        db.commit();
        db.release();
        res.json({success:true,data:result});
    }).catch(err=>{
        db.rollback();
        db.release();
        console.error(err);
    });
});

router.post("/edit",function(req,res){
    co(function*(){
        var tip=new Tip();
        tip.id=req.body.id;
        tip.name=req.body.name;
        tip.color=req.body.color;
        return yield tip.update();
    }).then(result=>{
        res.json({success:true,data:result});
    }).catch(err=>{
        console.error(err);
    });
});

module.exports = function (app) {
    app.use("/api/tip", router);
}