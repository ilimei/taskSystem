/**
 * Created by ZhangLiwei on 2017/3/2.
 */
const http = require("http");
const co=require("co");
const router=require("../../lib/routerBind")();
const Task=require("../../modal/Task.modal");
const User=require("../../modal/User.modal");
const Comment=require("../../modal/Comment.modal");
const MsgUtil=require("../log/msgUtil");

router.use(function(req,res,next){
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

router.post("/addComment",function*(req,res,next){
    let comment=new Comment();
    comment.task_id=req.body.taskId;
    comment.reply_to=req.body.replyTo;
    comment.type=req.body.type;
    comment.creator=req.session.userid;
    comment.content=req.body.content;
    var data=yield comment.insert();
    /**传递给下一个函数**/
    req._task_id=comment.task_id;
    next();
    return data;
},function*(req){
    delayDo(MsgUtil.hasNewReply,null,req._task_id);//触发信息
});

function getReplyUsers(cmts){
    return Promise.all(cmts.map(cmt=>{
        return co(function*(){
            cmt.creator=yield new User().find().where({id:cmt.creator}).one(true);
            return true;
        });
    }));
}

router.post("/listComment",function*(req,res){
    let comment=new Comment();
    let list=yield comment.find().where({task_id:req.body.taskId,type:1}).all();
    yield Promise.all(list.map(cmt=>{
        return co(function*(){
            cmt.reply=yield comment.find().where({reply_to:cmt.id,type:2}).all();
            cmt.creator=yield new User().find().where({id:cmt.creator}).one(true);
            yield getReplyUsers(cmt.reply);
            return cmt;
        });
    }));
    return list;
});


router.post("/del",function*(req,res){
    let comment=new Comment();
    comment.id=req.body.id;
    return yield comment.delete();
});

module.exports = function (app) {
    app.use("/api/comment", router.get());
}