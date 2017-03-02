/**
 * Created by ZhangLiwei on 2017/2/23.
 */
const TaskLog=require("../../server/modal/TaskLog.modal");
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const {getTestPool}=require("../config");

module.exports={
    "test create TaskLog":(test)=>{
        var pool=getTestPool();
        co(function*(){
            yield new TaskLog().drop(pool);
            yield new TaskLog().create(pool);
            test.ok(true);
            test.done();
        }).catch(err=>{
            console.error(err);
            test.fail(err);
            test.done();
        });
    }
}