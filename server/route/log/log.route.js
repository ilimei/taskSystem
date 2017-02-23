/**
 * Created by ZhangLiwei on 2017/2/23.
 */
const http = require("http");
const router = require("express").Router();
const co = require("co");
const TaskModal=require("../../modal/Task.modal");
const TaskLog=require("../../modal/TaskLog.modal");

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

router.post("/getTaskLog",function(req,res){
     co(function*(){
        var log=new TaskLog();
        return yield log.find().where({
            task_id:req.body.taskId
        }).orderBy(["create_time"]).all();
     }).then(data=>{
        res.json({"success":true,data:data});
     }).catch(e=>{
        console.error(e);
        res.json({"success":false,message:e});
     });
});

module.exports = function (app) {
    app.use("/api/log", router);
}