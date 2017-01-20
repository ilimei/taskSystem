'use strict'
var MakeClass = require("../lib/class");
var ModalClass = require("../lib/modal.class.js");

var User = MakeClass({
    _rule: [
        {id: "id", type: "int auto_increment", key: true},
        {id: "name", type: "varchar(30)"},
        {id: "nick_name", type: "varchar(30)"},
        {id: "phone", type: "varchar(15)"},
        {id: "email", type: "varchar(40)"},
        {id: "password", type: "varchar(40)"},
        {id: "avatar", type: "varchar(200)"},
        {id: "uptime", type: "varchar(20)"}
    ],
    _tableName: "m_user",
    init: function () {
        this.callSuper("init", arguments);
    },
    getDefaultAvator: function () {
        var avator = randomMaxMin(20, 1);
        return "/headicon/Fruit-" + avator + ".png";
    }
}, ModalClass, "User");
var co = require("co");
function testInsert() {
    co(function*() {
        // var user=new User();
        // user.name="zhangsan";
        // user.phone="11122223333";
        // user.email="@qq.com";
        // user.password="123456";
        // user.uptime=new Date().getTime();
        // return yield user.insert();
    }).then(function (data) {
        console.dir(data);
    }).catch(function (e) {
        console.error(e);
    });
}

function testQuery() {
    co(function*() {
        var user = new User();
        return yield [user.drop(), user.create()];
        // user=yield user.find().where({email:"1@qq.com"}).one();
        // user.email="2@qq.com";
        // user.name="lisi";
        // return yield user.update();
    }).then(function (data) {
        console.dir(data);
    }).catch(function (e) {
        console.error(e);
    });
}
// one() all();
// testInsert();
// testQuery();
module.exports = User;