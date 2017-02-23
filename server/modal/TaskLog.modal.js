/**
 * Created by ZhangLiwei on 2017/2/22.
 */
'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var TaskLog = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},// 日志id
        {id: "project_id",type:"int"},                      // 所属项目
        {id: "task_id",type:"int"},                          // 任务id
        {id: "user_id", type: "int"},                        // 谁啊
        {id:"to_id",type:"int"},                             // 对谁  结果的受体
        {id: "user_name",type:"varchar(200)"},             //  人名
        {id: "type", type: "int"},                           // 做了什么的类型
        {id: "desc", type: "varchar(400)"},                 // 做了什么
        {id: "create_time", type: "varchar(20)"}           // 记录时间
    ],
    _tableName: "m_task_log",
    init: function () {
        this.callSuper("init", arguments);
        this.create_time = (new Date() - 0);
    }
}, ModalClass, "TaskLog");

/***
 * 添加日志
 * @param user      操作的用户 {id:"",name:"",nick_name:""}
 * @param to_id     对谁 结果的受体
 * @param projectId 操作的项目Id 默认-1
 * @param taskId    操作的任务id 默认-1
 * @param type      操作的类型
 * @param desc      操作描述
 * @param db        数据库
 * @return {Promise} 返回Promise
 */
TaskLog.addTaskLog=function(user,to_id,projectId,taskId,type,desc,db){
    var log=new TaskLog();
    log.project_id=projectId||-1;
    log.task_id=taskId||-1;
    log.user_id=user.id;
    log.to_id=to_id;
    log.user_name=user.nick_name;
    log.type=type||-1;
    log.desc=desc;
    return log.insert(db);
}

module.exports = TaskLog;