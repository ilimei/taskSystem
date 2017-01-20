var http = require("http");
var router = require("express").Router();
var co = require("co");
var Project = require("../../modal/Project.modal.js");
var User=require("../../modal/User.modal");
var ProjectUser = require("../../modal/ProjectUser.modal");
var Task=require("../../modal/Task.modal");
var Query=require("../../lib/query.class");

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
        return;
    }
    res.redirect(301, "/login");
});

router.post("/getProject",function(req,res){
    co(function*() {
        let project = new Project();
        return yield project.find().where({id:req.body.id}).one(true);
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/list",function(req,res){
    co(function*(){
        var project = new Project();
        var projectUser=new ProjectUser();
        var userId=req.session.userid;
        switch (req.body.type){
            case "all":
                return yield project.find().where({id:projectUser.find(["id"]).where({user_id:userId})}).all();
            case "created":
                return yield project.find().where({"creator":userId}).all();
            case "joined":
                return yield project.find().where({id:projectUser.find(["id"]).where({user_id:userId})}).all();
            default:
                return yield project.find().where({id:projectUser.find(["id"]).where({user_id:userId})}).all();
        }
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/add", function (req, res) {
    co(function*() {
        var project = new Project();
        project.name = req.body.name;
        project.icon = project.getDefaultIcon();
        project.creator = req.session.userid;
        project.desc=req.session.desc;
        var projectUser = new ProjectUser();
        projectUser.user_id = req.session.userid;
        var result = yield project.insert();
        projectUser.id = result.insertId;
        return yield projectUser.insert();
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/listUser",function(req,res){
    co(function*(){
        var user=new User();
        var projectUser=new ProjectUser();
        var projectId=req.body.projectId;
        return yield user.find().where({id:projectUser.find(["user_id"]).where({id:projectId})}).all();
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/listUnInUser",function(req,res){
    co(function*(){
        var user=new User();
        var projectUser=new ProjectUser();
        var projectId=req.body.projectId;
        return yield user.find().where({id:["not in",projectUser.find(["user_id"]).where({id:projectId})]}).all();
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/addUser",function(req,res){
    co(function*(){
        var arr=JSON.parse(req.body.ids);
        var projectId=req.body.projectId;
        return yield Promise.all(arr.map(function(v){
            var projectUser=new ProjectUser();
            projectUser.id=projectId;
            projectUser.user_id=v;
            return projectUser.insert();
        }));
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

router.post("/removeUser",function(req,res){
    co(function*(){
        var arr=JSON.parse(req.body.ids);
        var projectId=req.body.projectId;
        var project=yield new Project().find().where({id:projectId}).one();
        yield new Query().update(Task).set({
            "executor":project.creator
        }).where({
            "executor":["in",arr]
        }).exec();
        return yield Promise.all(arr.map(function(v){
            var projectUser=new ProjectUser();
            projectUser.id=projectId;
            projectUser.user_id=v;
            return projectUser.delete();
        }));
    }).then(function (data) {
        res.json({success: true, result: data});
    }).catch(err => {
        console.error(err);
    });
});

module.exports = function (app) {
    app.use("/api/project", router);
}