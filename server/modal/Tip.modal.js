'use strict'
var MakeClass=require("../lib/class");
var ModalClass=require("../lib/modal.class.js");

// 标签类
var TipModal=MakeClass({
	_rule:[
		{id:"id",type:"int auto_increment",key:true},
		{id:"project_id",type:"int"},
		{id:"name",type:"varchar(40)"},
		{id:"color",type:"varchar(20)"}
	],
	_tableName:"m_tip",
	init:function(){
		this.callSuper("init",arguments);
	}
},ModalClass,"TipModal");

module.exports=TipModal;