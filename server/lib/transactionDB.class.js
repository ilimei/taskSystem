'use strict'

const MakeClass = require("./class");
const co = require("co");
require("../func");

module.exports=MakeClass({
    init:function(pool){
        this._pool=pool;
        this._executor=pool;
        this._isTransaction=false;
        this._isCommit=false;
        this._isRollback=false;
    },
    startTransaction:function(){
        var _self=this;
        return new Promise((resolve,reject)=>{
            _self._pool.getConnection(function(err,conn){
                if(err){
                    reject(err);
                }else {
                    conn.beginTransaction(function(err,result){
                        if(err){
                            conn.release();
                            reject(err);
                        }else {
                            _self._executor = conn;
                            _self._isTransaction=true;
                            this._isCommit=false;
                            this._isRollback=false;
                            resolve(conn);
                        }
                    });
                }
            });
        });
    },
    query:function(sql,param,cb){
        this._executor.query(sql,param,cb);
    },
    _check:function(){
        if(!this._isTransaction){
            throw new Error("must call the startTransaction method first!!");
        }
    },
    commit:function(){
        this._check();
        if(!this._isCommit) {
            if(this._isRollback){
                throw new Error("this db has been rollback,cant commit")
            }
            this._isCommit=true;
            this._executor.commit();
        }
    },
    rollback:function(){
        this._check();
        if(!this._isRollback) {
            if(this._isCommit){
                throw new Error("this db has been commit,cant rollback")
            }
            this._isRollback=true;
            this._executor.rollback();
        }
    },
    release:function(){
        if(this._isTransaction) {
            this._pool.releaseConnection(this._executor);
            this._isTransaction=false;
            this._executor=this._pool;
        }
    }
},null,"TransactionDB");