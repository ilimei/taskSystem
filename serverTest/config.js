/**
 * Created by ZhangLiwei on 2017/2/9.
 */
const mysql = require('mysql');
module.exports={
    getTestPool:function (){
        pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coding'
        });
        return pool;
    }
}