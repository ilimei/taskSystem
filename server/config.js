const topPath = "out";
const basePath = __dirname;
const log4js=require("log4js");
const logLv={
    ALL:"ALL",
    TRACE:"TRACE",
    DEBUG:"DEBUG",
    INFO:"INFO",
    WARN:"WARN",
    ERROR:"ERROR",
    FATAL:"FATAL",
    OFF:"OFF"
}
module.exports = {
    staticPath: `${basePath}/../${topPath}`,
    uploadPath: `${basePath}/../${topPath}/uploads/`,
    db: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'coding'
    },
    sessionDb: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'coding'
    },
    sessionCookie: {
        maxAge: 3600000
    },
    logConfig: {
        appenders: [
            {type: 'console'},
            {
                type: 'file',
                filename: `${basePath}/../logs/access.log`,
                maxLogSize: 1024*1024,
                backups: 4,
                category: 'express'
            },
            {
                type: 'file',
                filename: `${basePath}/../logs/access_time.log`,
                maxLogSize: 1024*1024,
                backups: 4,
                category: 'system'
            },
            {
                type: 'file',
                filename: `${basePath}/../logs/error.log`,
                maxLogSize: 1024*1024,
                backups: 4,
                category: 'express',
                levels:logLv.ERROR
            }
        ],
        levels:{
            "[all]":logLv.INFO,
            "console":logLv.INFO,
            "express":logLv.ERROR,
            "sql":logLv.ERROR,
            "system":logLv.INFO
        },
        replaceConsole: true
    }
}
