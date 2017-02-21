# 任务系统[![build status](https://secure.travis-ci.org/thlorenz/browserify-shim.svg?branch=master)](http://www.yanglimei.com)
项目任务系统

### 前言

让项目开发的任务和文档有个记录的地方,方便责任定位和系统开发进程推进

### 运行环境要求
* chrome 50 +
* nodeJs 6.2+

### 开始应用
* 从github上克隆和这个应用,修改`server/config.js`
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
* 在项目目录中以下命令
```shell
npm install
node build.js
```
* 打开chrome浏览器访问`http://localhost:8808/api/install`，安装数据库
* 打开`http://localhost:8808/`,开始使用

### 最新修改
* 增加了项目中的文档和标签