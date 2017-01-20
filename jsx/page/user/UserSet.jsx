/***
 * React Component UserSet create by ZhangLiwei at 11:57
 */
var React = require("react");
var store = require("../../lib/store");
var Split=require("../../ui/Split");
var Input=require("../../form/input");
var FormCheck=require("../../form/formCheck");
var Modal=require("../../form/modal");
var FileSelectorWrapper=require("../../libui/FileSelectorWrapper");

var SelHeadIcon=React.createClass({
    getInitialState:function(){
        return {
            sel:0,
            onHide:null,
            data:new Array(20).fill(1).map(function(v,index){return index+1;})
        }
    },
    hide:function(){
      this.refs["modal"].hide();
    },
    selIcon:function(v){
        this.setState({sel:v});
    },
    ok:function(){
        if(this.state.sel!=0) {
            var user=store.get("loginUser");
            Ajax("api/user/update", {
                "avatar": "/headicon/Fruit-"+this.state.sel+".png"
            }, function (data) {
                user.avatar="/headicon/Fruit-"+this.state.sel+".png";
                store.set("loginUser",user);
                this.hide();
            },this);
        }
    },
    userIcon:function(file){
        console.dir(file);
        var formData=new FormData();
        formData.append("avatar",file);
        var me=this;
        var user=store.get("loginUser");
        PostFormData("api/upload/avatar",formData).then(function(data){
            var nAvatar="/uploads/"+data.result;
            Ajax("api/user/update",{
                "avatar":nAvatar
            },function(data){
                user.avatar=nAvatar;
                store.set("loginUser",user);
                me.hide();
            });
        });
    },
    renderData:function(){
        return this.state.data.map(function(v){
            var cls=CS({
                "selector":true,
                "active":v==this.state.sel
            })
            return <div className={cls} onClick={this.selIcon.bind(this,v)}>
                <img src={"/headicon/Fruit-"+v+".png"}/>
            </div>
        },this);
    },
    render:function(){
        return <Modal title="选择头像" ref="modal" className="HeadIconDialog" onHide={this.state.onHide}>
            {this.renderData()}
            <FileSelectorWrapper btn onSelect={this.userIcon}>
                <button className="btn btn-primary btn-sm" btn>上传</button>
            </FileSelectorWrapper>
            <button className="btn btn-success btn-sm" onClick={this.ok} btn>确定</button>
            <button className="btn btn-warning btn-sm" onClick={this.hide} btn>取消</button>
        </Modal>
    }
});

var UserSet = React.createClass({
    getInitialState:function(){
        return {
            username:"",
            nick_name:"",
            phone:"",
            email:"",
            password:""
        }
    },
    handle:function(name,v){
        this.state[name]=v;
    },
    doSave:function(){
        if(!this.refs["formCheck"].check()){
            var user=store.get("loginUser");
            if(user.id){
                var sendObj={};
                if(this.state.username!=user.name){
                    sendObj.name=this.state.username;
                }
                if(this.state.nick_name!=user.nick_name){
                    sendObj.nick_name=this.state.nick_name;
                }
                if(this.state.phone!=user.phone){
                    sendObj.phone=this.state.phone;
                }
                if(this.state.email!=user.email){
                    sendObj.email=this.state.email;
                }
                if(this.state.password!=""){
                    sendObj.password=this.state.password;
                }
                if(JSON.stringify(sendObj)!="{}"){
                    Ajax("api/user/update",sendObj,function(data){
                        if(data.success){
                            for(var i in sendObj){
                                if(i=="username"){
                                    user.name=sendObj.username;
                                }else {
                                    user[i] = sendObj[i];
                                }
                                store.set("loginUser",user);
                            }
                            alert("保存成功");
                        }
                    },this);
                }
            }
        }
    },
    checkNames:function(v){
        if(!/^[a-zA-z]+[\w_]*$/.test(v)){
            return "用户名只能有字母和下划线组成,且以字母开头";
        }
    },
    checkCKPassword:function(v){
        if(v!=this.state.password){
            return "两次密码不一致";
        }
    },
    checkEmail:function(v){
        if(!/^.+@.+?$/.test(v)){
            return "不符合邮箱格式，例如123@qq.com";
        }
    },
    checkpwd:function(v){
        if(v.length!=0&&(v.length<6||v.length>16)){
            return "密码长度不能小于6后者超过16";
        }else if(!/^[\w_]*$/.test(v)){
            return "密码只能是[a-zA-Z0-9_]的组合";
        }
    },
    onUserChange:function(){
        var user=store.get("loginUser");
        this.state.username=user.name;
        this.state.nick_name=user.nick_name;
        this.state.phone=user.phone;
        this.state.email=user.email;
        this.forceUpdate();
    },
    showSelHeadIconModal:function(){
        showModal(<SelHeadIcon/>);
    },
    componentDidMount:function(){
        var user=store.get("loginUser");
        this.state.username=user.name;
        this.state.nick_name=user.nick_name;
        this.state.phone=user.phone;
        this.state.email=user.email;
        this.unStore=store.on("loginUser",this.onUserChange);
    },
    componentWillUnmount:function(){
        store.un(this.unStore);
    },
    render: function () {
        var user=store.get("loginUser");
        return <Split className="UserSet">
            <div className="Header">
                <img src={user.avatar} onClick={this.showSelHeadIconModal}/>
            </div>
            <div className="content">
                <FormCheck ref="formCheck" className="panel">
                    <Input name="用户名" value={user.name} checks={[this.checkNames]} change={this.handle.bind(this,"username")} noEmpty/>
                    <Input name="昵称" value={user.nick_name} change={this.handle.bind(this,"nick_name")} noEmpty/>
                    <Input name="手机" value={user.phone} change={this.handle.bind(this,"phone")} noEmpty/>
                    <Input name="邮箱" value={user.email} checks={[this.checkEmail]} change={this.handle.bind(this,"email")} noEmpty/>
                    <Input name="密码" type="password"  checks={[this.checkpwd]} change={this.handle.bind(this,"password")} holder="请输入修改的密码"/>
                    <Input name="确认密码" type="password" checks={[this.checkCKPassword]}  change={this.handle.bind(this,"password")} holder="请输入修改的密码"/>
                    <button className="btn btn-primary" onClick={this.doSave}>保存</button>
                </FormCheck>
            </div>
        </Split>
    }
});

module.exports = UserSet;