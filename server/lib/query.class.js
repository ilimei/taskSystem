let co = require("co");
let pool;
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
var Modal=require("./modal.class");

function QueryPromise(sql, param,db) {
    let executor=db||pool;
    return new Promise(function (resolve, reject) {
        let logIndex = 0;
        log("execute sql " + sql.replace(/\?/g, function (matchStr, index) {
                return param[logIndex++];
            }));
        executor.query(sql, param, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            resolve({rows: rows, fields: fields});
        });
    });
}

var QueryMode = {
    SELECT: Symbol("select"),
    UPDATE: Symbol("update"),
    DELETE: Symbol("delete"),
    INSERT: Symbol("insert"),
    UNSET: Symbol("unset")
};
class Query {
    constructor(db) {
        this._table = null;
        this._mode = QueryMode.UNSET;
        this._param = [];//参数列表
        this._filter = [];//查询筛选
        this._mulplite=0;//多条插入
        this._insertSelect=false;//insert select 语句
        this._db=db;
    }

    _setTable(table){
        if(typeof table=="function"&&table.prototype._tableName){
            this._table=table.prototype._tableName;
        }else if(typeof table=="object"&&table._tableName){
            this._table=table._tableName;
        }else {
            this._table = table;
        }
    }

    update(table) {
        if (this._mode != QueryMode.UNSET) {
            throw new Error("update method must call on first");
        }
        this._setTable(table);
        this._mode = QueryMode.UPDATE;
        return this;
    }

    set(map) {
        if (this._mode != QueryMode.UPDATE) {
            throw new Error("must call new Query().update(tableName).set");
        }
        this._setArray = [];
        for (var i in map) {
            this._param.push(map[i]);
            this._setArray.push(i + "=?");
        }
        return this;
    }

    insert(table) {
        if (this._mode != QueryMode.UNSET) {
            throw new Error("insert method must call on first");
        }
        this._setTable(table);
        this._mode = QueryMode.INSERT;
        return this;
    }

    value(map,insertFields) {
        if (this._mode != QueryMode.INSERT) {
            throw new Error("must call new Query().insert(tableName).value(map)");
        }
        if(map instanceof Query){
            this._insertSelect=true;
            this._insertFields=insertFields;
            this._insertSub=map;
            this._param=this._param.concat(map._param);
        }else {
            this._insertFields = [];
            for (var i in map) {
                this._insertFields.push("`" + i + "`");
                this._param.push(map[i]);
            }
        }
        return this;
    }

    values(arr){
        if (this._mode != QueryMode.INSERT) {
            throw new Error("must call new Query().insert(tableName).values(arr)");
        }
        this._mulplite=arr.length;
        this._insertFields = [];
        var map=arr[0];
        var helpFields=[];
        for (var i in map) {
            helpFields.push(i);
            this._insertFields.push("`" + i + "`");
        }
        arr.forEach(function(map){
            helpFields.forEach(function(key){
                this._param.push(map[key]);
            },this);
        },this);
        return this;
    }

    delete(table) {
        if (this._mode != QueryMode.UNSET) {
            throw new Error("delete method must call on first");
        }
        this._setTable(table);
        this._mode = QueryMode.DELETE;
        return this;
    }

    select(table) {
        if (this._mode != QueryMode.UNSET) {
            throw new Error("select method must call on first");
        }
        this._setTable(table);
        this._mode = QueryMode.SELECT;
        return this;
    }

    find(arr) {
        if (this._mode != QueryMode.SELECT) {
            throw new Error("must call new Query().select(tableName).find(map)");
        }
        if (typeof arr == "string") {
            this._find = arr;
        } else if (arr && Array.isArray(arr) && arr.length) {
            this._find = arr.join(",");
        } else {
            this._find = "*";
        }
        return this;
    }

    _addQueryFilter(arr, id, op, value) {
        if (value instanceof Query) {
            this._param = this._param.concat(value._param);
            arr.push(id + " " + op + " (" + value.toString() + ")");
        } else if(Array.isArray(value)){
            this._param=this._param.concat(value);
            arr.push(id+" "+op+" ("+value.map(()=>"?").join(",")+")");
        } else {
            this._param.push(value);
            arr.push(id + " " + op + " ?");
        }
    }

    _analyzeQueryMap(map) {
        var arr = [];
        for (var id in map) {
            if (map.hasOwnProperty(id)) {
                var value = map[id];
                if (Array.isArray(value)) {
                    this._addQueryFilter(arr, id, value[0], value[1]);
                    continue;
                } else if (typeof value == "object") {
                    this._addQueryFilter(arr, id, "in", value);
                    continue;
                } else {
                    this._addQueryFilter(arr, id, "=", value);
                    continue;
                }
            }
        }
        return arr;
    }

    where(map) {
        if (this._mode == QueryMode.UNSET) {
            throw new Error("can't call where method on first");
        }
        if (this._mode == QueryMode.INSERT) {
            throw new Error("can't call where method on insert mode");
        }
        var arr = this._analyzeQueryMap(map);
        if (!this._firstQuery) {
            this._firstQuery = true;
            this._filter.push("(" + arr.join(" and ") + ")");
        } else {
            this._filter.push("and (" + arr.join(" and ") + ")");
        }
        return this;
    }

    orWhere(map) {
        if (this._mode == QueryMode.UNSET) {
            throw new Error("can't call where method on first");
        }
        if (this._mode == QueryMode.INSERT) {
            throw new Error("can't call where method on INSERT mode");
        }
        var arr = this._analyzeQueryMap(map);
        if (!this._firstQuery) {
            this._firstQuery = true;
            this._filter.push("(" + arr.join(" and ") + ")");
        } else {
            this._filter.push("or (" + arr.join(" and ") + ")");
        }
        return this;
    }

    _UpdateSql() {
        var _prevSql = "update " + this._table + " ";
        var _setSql = "set " + this._setArray.join(",");
        return _prevSql + _setSql + this._whereSql();
    }

    _SelectSql() {
        var _prevSql = "select " + this._find + " from " + this._table + " ";
        return _prevSql + this._whereSql();
    }

    _DeleteSql() {
        var _prevSql = "delete from " + this._table + " ";
        return _prevSql + this._whereSql();
    }

    _whereSql() {
        return this._filter.length ? " where " + this._filter.join(" ") : "";
    }

    _InsertSql() {
        if(this._insertSelect){
            var _prevSql = "insert into " + this._table + "(" + this._insertFields.join(",") + ")"+this._insertSub.sql();
            return _prevSql;
        }else {
            var _prevSql = "insert into " + this._table + "(" + this._insertFields.join(",") + ") values";
            var _valueSql = "(" + this._insertFields.map(function () {
                    return "?"
                }).join(",") + ")";
            if (this._mulplite > 1) {
                return _prevSql + new Array(this._mulplite).fill(_valueSql).join(",");
            } else {
                return _prevSql + _valueSql;
            }
        }
    }

    sql() {
        switch (this._mode) {
            case QueryMode.UPDATE:
                return this._UpdateSql();
            case QueryMode.INSERT:
                return this._InsertSql();
            case QueryMode.DELETE:
                return this._DeleteSql();
            case QueryMode.SELECT:
                return this._SelectSql();
            case QueryMode.UNSET:
                return "";
        }
    }

    exec(db) {
        return QueryPromise(this.sql(), this._param,db||this._db);
    }

    toString() {
        return this.sql();
    }

    valueOf() {
        return this.sql();
    }
}

module.exports = Query;