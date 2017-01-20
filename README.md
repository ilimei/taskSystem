# 任务系统[![build status](https://secure.travis-ci.org/thlorenz/browserify-shim.svg?branch=master)](http://travis-ci.org/thlorenz/browserify-shim)
项目任务系统

### 使系统的开发的更工程化

### 开始应用
从github上克隆和这个应用,修改`server/config.js`
```javascript
module.exports={
	db:{
		connectionLimit : 10,
		host            : 'localhost',
		user            : 'root',
		password        : 'root',
		database        : 'coding'
	},
	sessionDb:{
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'root',
		database: 'coding'
	},
	sessionCookie:{
        maxAge: 3600000
	}
}
```
在项目目录中以下命令
```
npm install
node build.js
```
成功后 打开chrome浏览器访问`http://localhost:8808`