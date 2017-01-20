'use strict'
var MakeClass=require("../lib/class");
var ModalClass=require("../lib/modal.class.js");

var TaskList=MakeClass({
	_rule:[
		{id:"id",type:"int auto_increment",key:true},
		{id:"name",type:"varchar(100)"}
	],
	_tableName:"m_task_list",
	init:function(){
		this.callSuper("init",arguments);
	}
},ModalClass,"TaskList");

module.exports=TaskList;