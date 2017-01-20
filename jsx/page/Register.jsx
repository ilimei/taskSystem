var Input=require("../form/input");
var Link=require("../lib/router/LinkFunc");
var FormCheck=require("../form/formCheck");
/***
 * React Component Register create by ZhangLiwei at 15:17
 */
var Register = React.createClass({
    getInitialState:function(){
        return {
            data:[],
            formData:{}
        }
    },
    jumpToLogin:function(){
        Link("/login");
    },
    register:function(obj){
        this.state.data.push(obj);
    },
    handle:function(name,v){
        this.state.formData[name]=v;
    },
    checkNames:function(v){
        if(!/^[a-zA-z]+[\w_]*$/.test(v)){
            return "用户名只能有字母和下划线组成,且以字母开头";
        }
    },
    checkEmail:function(v){
        if(!/^.+@.+?$/.test(v)){
            return "不符合邮箱格式，例如123@qq.com";
        }
    },
    checkpwd:function(v){
        if(v.length<6||v.length>16){
            return "密码长度不能小于6后者超过16";
        }else if(!/^[\w_]+$/.test(v)){
            return "密码只能是[a-zA-Z0-9_]的组合";
        }
    },
    checkPWD:function(v){
        if(v!=this.state.formData["password"]){
            return "确认密码与密码不一致";
        }
    },
    registerUser:function(){
        if(this.refs["formCheck"].check()){
            return;
        }
        Ajax("api/user/register",
            this.state.formData,
            function(data){
                if(data.error){
                    alert(data.error);
                }else{
                    alert("注册成功");
                    Link("/login");
                }
            },this);
    },
    render: function() {
        return (
            <div className="fullHeight bg_photo">
                <FormCheck ref="formCheck" className="login-box">
                    <div className="login-title">用户注册</div>
                    <Input holder="用户名" change={this.handle.bind(this,"username")} register={this.register} noEmpty minLength={6} maxLength={12} checks={[this.checkNames]}/>
                    <Input holder="用户昵称" change={this.handle.bind(this,"nickname")} register={this.register} noEmpty maxLength={12}/>
                    <Input holder="手机"  change={this.handle.bind(this,"phone")} register={this.register} noEmpty maxLength={15}/>
                    <Input holder="邮箱"  change={this.handle.bind(this,"email")} register={this.register} noEmpty maxLength={20} checks={[this.checkEmail]}/>
                    <Input type="password"  change={this.handle.bind(this,"password")} register={this.register} noEmpty checks={[this.checkpwd]} holder="密码"/>
                    <Input type="password"  register={this.register} checks={[this.checkPWD]} noEmpty holder="确认密码"/>
                    <button className="btn btn-block btn-primary" onClick={this.registerUser}>注册</button>
                    <button onClick={this.jumpToLogin} className="btn btn-block btn-link">已有账号，马上登录</button>
                </FormCheck>
                <div className="footer">
                    Copyright  © 2017 dhcc.com
                </div>
            </div>
        );
    }
});

module.exports=Register;