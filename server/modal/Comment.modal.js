/**
 * Created by ZhangLiwei on 2017/3/2.
 */
'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var Comment = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},// 评论id
        {id: "task_id", type: "int"},                     // 任务id
        {id: "reply_to", type: "int"},                    // 评论给谁的
        {id: "type", type: "int"},                        // 文档类型 1 回复给任务 2 回复给评论
        {id: "creator", type: "int"},                     // 创建者
        {id: "create_time", type: "varchar(20)"},         // 创建时间
        {id: "content", type: "text"}                     // 评论内容
    ],
    _tableName: "m_task_comment",
    init: function () {
        this.callSuper("init", arguments);
        this.create_time = (new Date() - 0);
    }
}, ModalClass, "Comment");

module.exports = Comment;
