/**
 * Created by ZhangLiwei on 2017/3/2.
 */
const http = require("http");
const co=require("co");
const router=require("../../lib/routerBind")();
const Msg=require("../../modal/Msg.modal");
const User=require("../../modal/User.modal");
const Comment=require("../../modal/Comment.modal");

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

router.post("/list",function*(req,res){
    let msg=new Msg(),
        page=req.body.page,
        rows=req.body.rows,
        query=msg.find().where({id:req.session.userid});
    return yield [query.offset((page - 1) * rows).limit(rows),query.all()];
});

router.post("/unread",function*(req,res){
    let msg=new Msg(),
        page=req.body.page,
        rows=req.body.rows,
        query=msg.find().where({user_id:req.session.userid,has_read:0});
    return yield [query.count(),query.offset((page - 1) * rows).limit(rows).all()];
});

router.post("/read",function*(req,res){
    let msg=new Msg();
    msg.id=req.body.id;
    msg.has_read=1;
    return yield msg.update();
});

module.exports = function (app) {
    app.use("/api/msg", router.get());
}