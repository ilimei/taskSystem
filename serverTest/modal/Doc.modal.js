/**
 * Created by ZhangLiwei on 2017/2/20.
 */
const Doc=require("../../server/modal/Doc.modal.js");
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const {getTestPool}=require("../config");

module.exports={
    "test create Doc table":function(test){
        var pool=getTestPool();
        co(function*(){
            yield new Doc().drop(pool);
            yield new Doc().create(pool);
            test.ok(true);
            test.done();
        }).catch(err=>{
            console.error(err);
            test.fail(err);
            test.done();
        });
    }
}