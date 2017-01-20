'use strict'

var MakeClass = require("./class");
require("../func");
var co = require("co");

var pool;
if (!global.App) {
    var mysql = require('mysql');
    pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'coding'
    });
} else {
    pool = App.dbPool;
}

function QueryPromise(sql, param) {
    if (param != undefined) {
        return new Promise(function (resolve, reject) {
            let logIndex=0;
            log("execute sql "+sql.replace(/\?/g,function(matchStr,index){
                    return param[logIndex++];
            }));
            pool.query(sql, param, function (err, rows, fields) {
                if (err) {
                    reject(err);
                }
                resolve({rows: rows, fields: fields});
            });
        });
    } else {
        return new Promise(function (resolve, reject) {
            pool.query(sql, function (err, rows, fields) {
                if (err) {
                    reject(err);
                }
                resolve({rows: rows, fields: fields});
            });
        });
    }
}

var Query = MakeClass({
    init: function (modal) {
        this._modal = modal;
        this._firstQuery = false;
        this._query = [];
        this._order = [];
        this._param = [];
        this._offset = null;
        this._limit = null;
    },
    find: function (arr) {
        if(typeof arr=="string"){
            this._find = arr;
        }else if (arr && Array.isArray(arr) && arr.length) {
            this._find = arr.join(",");
        } else {
            this._find = "*";
        }
        return this;
    },
    _addQueryFilter:function(arr,id,op,value){
        if(value instanceof Query){
            this._param=this._param.concat(value._param);
            arr.push(id+" "+op+" ("+value.toString()+")");
        }else{
            this._param.push(value);
            arr.push(id+" "+op+" ?");
        }
    },
    _relexQueryMap: function (map) {
        var arr = [];
        for (var id in map) {
            if (map.hasOwnProperty(id)) {
                var value = map[id];
                if (Array.isArray(value)) {
                    this._addQueryFilter(arr,id,value[0],value[1]);
                    continue;
                }else if(typeof value=="object"){
                    this._addQueryFilter(arr,id,"in",value);
                    continue;
                } else {
                    this._addQueryFilter(arr,id,"=",value);
                    continue;
                }
            }
        }
        return arr;
    },
    where: function (map) {
        var arr = this._relexQueryMap(map);
        if (!this._firstQuery) {
            this._firstQuery = true;
            this._query.push("(" + arr.join(" and ") + ")");
        } else {
            this._query.push("and (" + arr.join(" and ") + ")");
        }
        return this;
    },
    orWhere: function (map) {
        var arr = this._relexQueryMap(map);
        if (!this._firstQuery) {
            this._firstQuery = true;
            this._query.push("(" + arr.join(" and ") + ")");
        } else {
            this._query.push("or (" + arr.join(" and ") + ")");
        }
        return this;
    },
    one: function (bool) {
        var self = this;
        var sql = this.sql();
        return QueryPromise(sql, this._param).then(function (obj) {
            if(bool){
                return obj.rows[0];
            }
            if (obj.rows[0]) {
                for (var i in obj.rows[0]) {
                    self._modal[i] = obj.rows[0][i];
                }
                return self._modal;
            }
            return null;
        });
    },
    all: function (callback) {
        return QueryPromise(this.sql(), this._param).then(function (obj) {
            return obj.rows;
        });
    },
    count: function () {
        var self = this;
        var sql = this.sql();
        sql = "select count(*) c from (" + sql + ") a";
        return QueryPromise(sql, this._param).then(function (obj) {
            if (obj.rows[0]) {
                return parseInt(obj.rows[0]["c"]);
            }
            return -1;
        });
    },
    offset: function (n) {
        this._offset = n;
        this._limit = this._limit || 1;
        return this;
    },
    limit: function (n) {
        this._offset = this._offset || 0;
        this._limit = n;
        return this;
    },
    orderBy: function (arr,bool) {
        this._order.push(arr.join(","));
        if(bool){
            this._orderDesc=true;
        }
        return this;
    },
    sql: function () {
        var prevSql = "select " + this._find + " from " + this._modal._tableName;
        if (this._query.length) {
            prevSql += " where " + this._query.join(" ");
            ;
        }
        if (this._order.length) {
            prevSql += " order by " + this._order.join(",");
            if(this._orderDesc){
                prevSql+=" desc";
            }
        }
        if (this._offset !== null) {
            prevSql += " limit " + this._offset + "," + this._limit;
        }
        return prevSql;
    },
    update: function (callback) {
        if (!this._modal._keyMap) {
            throw new Error("this table " + this._modal._tableName + " has no primary key");
        }
        var _param = [];
        var arr = [];
        for (var i in this._modal._ruleMap) {
            if (this._modal.hasOwnProperty(i) && !i.startsWith("_")) {
                _param.push(this._modal[i]);
                arr.push("`" + i + "`=?");
            }
        }
        var whereSql = [];
        for (var i in this._modal._keyMap) {
            if (!this._modal[i]) {
                throw new Error("this table primary key '" + i + "' must set value for update");
            }
            _param.push(this._modal[i]);
            whereSql.push("`" + i + "`=?");
        }
        var sql = "update " + this._modal._tableName + " set ";
        if (arr.length) {
            sql += arr.join(",") + " where " + whereSql.join(" and ");
        }
        return QueryPromise(sql, _param).then(function (obj) {
            return obj.rows;
        });
    },
    insert: function (callback) {
        var _param = [];
        var arr = [];
        var sql = "insert into " + this._modal._tableName + "(";
        var keys = [];
        for (var i in this._modal._keyMap) {
            if (this._modal.hasOwnProperty(i) && !i.startsWith("_")) {
                _param.push(this._modal[i]);
                keys.push("`" + i + "`");
                arr.push("?");
            }
        }
        for (var i in this._modal._ruleMap) {
            if (this._modal.hasOwnProperty(i) && !i.startsWith("_")) {
                _param.push(this._modal[i]);
                keys.push("`" + i + "`");
                arr.push("?");
            }
        }
        sql += keys.join(",") + ") values(" + arr.join(",") + ")";
        return QueryPromise(sql, _param).then(function (obj) {
            return obj.rows;
        });
    },
    delete: function () {
        if (!this._modal._keyMap) {
            throw new Error("this table " + this._modal._tableName + " has no primary key");
        }
        var whereSql = [];
        for (var i in this._modal._keyMap) {
            if (!this._modal[i]) {
                throw new Error("this table primary key '" + i + "' must set value for update");
            }
            this._param.push(this._modal[i]);
            whereSql.push("`" + i + "`=?");
        }
        var sql = "delete from " + this._modal._tableName + " where " + whereSql.join(" and ");
        return QueryPromise(sql, this._param).then(function (obj) {
            return obj.rows;
        });
    },
    create: function () {
        let prevSql = "create table " + this._modal._tableName + "(";
        let endSql = ") default character set 'utf8'";
        let sqlParam = this._modal._rule.reduce(function (prev, curr) {
            if (curr.key) {
                prev.push("`" + curr.id + "` " + curr.type + " primary key");
            } else {
                prev.push("`" + curr.id + "` " + curr.type);
            }
            return prev;
        }, []).join(",");
        return QueryPromise(prevSql + sqlParam + endSql).then(function (obj) {
            return obj.rows;
        });
    },
    drop: function () {
        let sql = "drop table if exists " + this._modal._tableName;
        return QueryPromise(sql).then(function (obj) {
            return obj.rows;
        });
    },
    toString: function () {
        return this.sql();
    },
    valueOf: function () {
        return this.sql();
    }
}, null, "ModalQuery");

/**
 * 数据模型基类
 **/
var Modal = MakeClass({
    _rule: [],
    _tableName: "test",
    init: function () {
        this._keyMap = {};
        var self = this;
        this._ruleMap = this._rule.reduce(function (prev, curr) {
            if (curr.key) {
                self._keyMap[curr.id] = curr;
            } else {
                prev[curr.id] = curr;
            }
            return prev;
        }, {});
    },
    create: function () {
        return new Query(this).create();
    },
    drop: function () {
        return new Query(this).drop();
    },
    find: function (arr) {
        var q = new Query(this);
        return q.find(arr);
    },
    update: function (callback) {
        return new Query(this).update(callback);
    },
    delete: function (callback) {
        return new Query(this).delete(callback);
    },
    insert: function (callback) {
        return new Query(this).insert(callback);
    }
}, null, "Modal");

module.exports = Modal;