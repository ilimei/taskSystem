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

module.exports=ProjectUser;