/**
 * Created by ZhangLiwei on 2017/3/2.
 */
const Comment=require("../../server/modal/Comment.modal");
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const {getTestPool}=require("../config");

module.exports={
    "test create Comment":(test)=>{
        var pool=getTestPool();
        co(function*(){
            yield new Comment().drop(pool);
            yield new Comment().create(pool);
            test.ok(true);
            test.done();
        }).catch(err=>{
            console.error(err);
            test.fail(err);
            test.done();
        });
    }
}