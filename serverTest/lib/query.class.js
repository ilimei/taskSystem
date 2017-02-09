/**
 * Created by ZhangLiwei on 2017/2/9.
 */

const Query=require("../../server/lib/query.class.js");
const DB=require("../../server/lib/transactionDB.class.js");
const co=require("co");
const User=require("../../server/modal/User.modal.js");

function getTestPool(){
    var mysql = require('mysql');
    pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'coding'
    });
    return pool;
}

module.exports={
    "test update":function(test){
        var pool=getTestPool();
        var db=new DB(pool);
        co(function*(){
            yield db.startTransaction();
            yield new Query(db).update(User).set({
                name:"123"
            }).exec();
            var user=yield new User().find(undefined,db).one();
            test.equal("123",user.name,"the update method exec fail");
        }).then(result=>{
            db.rollback();
            test.done();
        }).catch(err=>{
            db.rollback();
            console.error(err);
            test.fail(err);
            test.done();
        });
    },
    "test insert":function(test){
        var pool=getTestPool();
        var db=new DB(pool);
        co(function*(){
            yield db.startTransaction();
            var name="123"+(+new Date());
            yield new Query(db).insert(User).value({
                name:name
            }).exec();
            var user=yield new User().find(undefined,db).where({
                name:name
            }).one();
            test.equal(name,user.name,"the insert method exec fail");
        }).then(result=>{
            db.rollback();
            test.done();
        }).catch(err=>{
            db.rollback();
            console.error(err);
            test.fail(err);
            test.done();
        });
    }
}