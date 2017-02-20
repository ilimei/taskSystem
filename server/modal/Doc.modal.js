/**
 * Created by ZhangLiwei on 2017/2/20.
 */
'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var Doc = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},//文档id
        {id: "project_id",type:"int"},             //所属项目
        {id: "parent", type: "int"},                        // 父文档id -1 需求 -2 技术
        {id: "type", type: "int"},                          // 文档类型 1 文件夹 2 文件  3 文章
        {id: "title", type: "varchar(400)"},               // 文档标题
        {id: "editor",type:"int"},                           // 编辑器 1 ue 2 markdown
        {id: "creator", type: "int"},
        {id: "create_time", type: "varchar(20)"},
        {id: "uptime", type: "varchar(20)"},
        {id: "content",type:"text"}                        // 文档内容
    ],
    _tableName: "m_project_doc",
    init: function () {
        this.callSuper("init", arguments);
        this.uptime = (new Date() - 0);
    }
}, ModalClass, "Doc");

module.exports = Doc;
