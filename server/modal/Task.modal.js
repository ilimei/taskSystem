'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var TaskModal = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},
        {id: "creator", type: "int"},//创建者
        {id: "executor", type: "int"},//执行者
        {id: "end_time", type: "varchar(20)"},//结束时间
        {id: "weight", type: "int"},//紧急程度
        {id: "project", type: "int"},//项目id
        {id: "done", type: "int"},//是否完成
        {id:"update_time",type:"varchar(20)"},//更新时间
        {id: "name", type: "varchar(400)"},//任务名称
        {id: "desc", type: "text"},
    ],
    _tableName: "m_task",
    init: function () {
        this.callSuper("init", arguments);
        this.update_time=(new Date()-0)+"";
    }
}, ModalClass, "TaskModal");

function test() {
    let co = require("co");
    co(function*() {
        var project = new TaskModal();
        return yield [project.drop(), project.create()];
        // var result=yield project.insert();
        // return yield [project.drop(),project.create()];
    }).then(function (result) {
        console.info(result);
    }).catch(function (err) {
        console.info(err.message);
    });
}
// test();

module.exports = TaskModal;