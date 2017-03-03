/**
 * Created by ZhangLiwei on 2017/3/2.
 */
'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var Msg = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},// 消息id
        {id: "user_id", type: "int"},                     // 用户id
        {id: "task_id", type: "int"},                     // 任务id
        {id: "project_id", type: "int"},                  // 项目id
        {id: "type", type: "int"},                        // 类型
        {id: "has_read",type:"int"},                      // 是否读取过 0 没有 1 有
        {id: "up_time", type: "varchar(20)"},             // 创建时间
        {id: "content", type: "text"}                     // 日志内容
    ],
    _tableName: "m_msg",
    init: function () {
        this.callSuper("init", arguments);
        this.up_time = (new Date() - 0);
    }
}, ModalClass, "Msg");

module.exports = Msg;