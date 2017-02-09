/**
 * 测试lib/class.js文件
 * Created by ZhangLiwei on 2017/2/9.
 */

var createClass=require("../../server/lib/class");

exports.ClassNameTest=function(test){
    const Query=createClass({},null,"Query");
    test.equal("Query",Query.name,"the class name not equal the set");
    test.done();
}

exports.ClassInstanceTest=function(test){
    const Parent=createClass({},null,"Parent");
    const Child=createClass({},Parent,"Child");
    let obj=new Child();
    test.ok(obj instanceof Parent,"obj not instanceof Parent");
    test.done();
}

exports.ClassCallSuperTest=function(test){
    const Parent=createClass({
        init:function(){
            this.name="123";
        }
    },null,"Parent");
    const Child=createClass({
        init:function(){
            this.callSuper("init", arguments);
            test.equal("123",this.name,"callSuper failed");
            test.done();
        }
    },Parent,"Child");
    new Child();
}