'use strict'
var MakeClass=require("../lib/class");
var ModalClass=require("../lib/modal.class.js");

var ProjectUser=MakeClass({
    _rule:[
        {id:"id",type:"int", key: true},
        {id:"user_id",type:"int", key: true}
    ],
    _tableName:"m_project_user",
    init:function(){
        this.callSuper("init",arguments);
    }
},ModalClass,"ProjectUser");

function test(){
    let co=require("co");
    co(function*(){
        var project=new ProjectUser();
        return yield [project.drop(),project.create()];
    }).then(function(result){
        console.info(result);
    }).catch(function(err){
        console.info(err.message);
    });
}
// test();

module.exports=ProjectUser;