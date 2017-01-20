'use strict'
var MakeClass=require("../lib/class");
var ModalClass=require("../lib/modal.class.js");
var Project=require("./Project.modal.js");

// 标签类
var TipModal=MakeClass({
	_rule:[
		{id:"id",type:"int auto_increment",key:true},
		{id:"project_id",type:"int"},
		{id:"name",type:"varchar(40)"},
		{id:"color",type:"varchar(10)"}
	],
	_tableName:"m_tip",
	init:function(){
		this.callSuper("init",arguments);
	},
	getProject:function(){
		if(this.project_id)
			return new Project().find().where({id:this.project_id}).one();
	}
},ModalClass,TipModal);

// var co=require("co");
// co(function*(){
// 	var tip=new TipModal();
// 	tip=yield tip.find().one();
// 	return tip;
// }).then(function(tip){
// 	console.dir(tip);
// }).catch(function(err){
// 	console.error(err);
// });

module.exports=TipModal;