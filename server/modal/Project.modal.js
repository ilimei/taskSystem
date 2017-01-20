'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var Project = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},
        {id: "name", type: "varchar(40)"},
        {id: "desc", type: "varchar(400)"},
        {id: "icon", type: "varchar(400)"},
        {id: "creator", type: "int"},
        {id: "uptime", type: "varchar(20)"}
    ],
    _tableName: "m_project",
    init: function () {
        this.callSuper("init", arguments);
        this.uptime = (new Date() - 0);
    },
    getDefaultIcon: function () {
        var avator = randomMaxMin(20, 1);
        return "/headicon/Fruit-" + avator + ".png";
    }
}, ModalClass, "Project");

function test() {
    let co = require("co");
    co(function*() {
        var project = new Project();
        project.icon = project.getDefaultIcon();
        project.name = "测试项目";
        project.desc = "测试项目";
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

module.exports = Project;