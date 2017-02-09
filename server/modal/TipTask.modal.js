/**
 * Created by ZhangLiwei on 2017/2/9.
 */
'use strict'
var MakeClass=require("../lib/class");
var ModalClass=require("../lib/modal.class.js");

// 标签和任务的关系
var TipTask=MakeClass({
    _rule:[
        {id:"task_id",type:"int",key:true},
        {id:"tip_id",type:"int",key:true}
    ],
    _tableName:"m_tip_task",
    init:function(){
        this.callSuper("init",arguments);
    }
},ModalClass,"TipTask");