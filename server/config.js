const topPath = "out";
const basePath = __dirname;
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
    }
}
