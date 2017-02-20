/**
 * Created by ZhangLiwei on 2017/2/9.
 */
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const Query=require("../../server/lib/query.class.js");
const {getTestPool}=require("../config");

module.exports={
    "test transaction":function(test){
        var pool=getTestPool();
        var db=new DB(pool);
        var oldLength;
        co(function*(){
            let queryResult=yield new Query(pool).select("m_user").find().exec()
            oldLength=queryResult.rows.length;
            yield db.startTransaction();
            let result=yield new Query(db).insert('m_user').value().exec();
            db.rollback();
            return yield new Query(pool).select("m_user").find().exec();
        }).then(result=>{
            test.equal(result.rows.length,oldLength,"123");
            test.done();
        }).catch(err=>{
            console.error(err);
            test.fail(err);
        });
    }
}