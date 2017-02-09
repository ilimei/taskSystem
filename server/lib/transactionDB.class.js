'use strict'

const MakeClass = require("./class");
const co = require("co");
require("../func");

module.exports=MakeClass({
    init:function(pool){
        this._pool=pool;
        this._executor=pool;
    },
    startTransaction:function(){
        var _self=this;
        return new Promise((resolve,reject)=>{
            _self._pool.getConnection(function(err,conn){
                if(err){
                    reject(err);
                }else {
                    _self._executor = conn;
                    resolve(_self);
                }
            });
        });
    },
    query:function(sql,param,cb){
        this._executor.query(sql,param,cb);
    },
    commit:function(){
        this._executor.commit();
    },
    rollback:function(){
        this._executor.rollback();
    }
},null,"TransactionDB");