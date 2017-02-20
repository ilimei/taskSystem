/**
 * Created by ZhangLiwei on 2017/2/9.
 */
const TipTask=require("../../server/modal/TipTask.modal");
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const {getTestPool}=require("../config");

module.exports={
    "test create TipTable":(test)=>{
        var pool=getTestPool();
        co(function*(){
            yield new TipTask().create(pool);
            test.ok(true);
            test.done();
        }).catch(err=>{
            console.error(err);
            test.fail(err);
            test.done();
        });
    }
}