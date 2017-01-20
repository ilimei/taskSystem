var Input=require("../form/input");
var Link=require("../lib/router/LinkFunc");
/***
 * React Component Login create by ZhangLiwei at 15:09
 */
var Login = React.createClass({
    getInitialState:function(){
        return {
            formData:{}
        }
    },
    handle:function(name,v){
        this.state.formData[name]=v;
    },
    jumpToRegister:function(){
        Link("/register");
    },
    login:function(){
        Ajax("api/user/login",this.state.formData,function(data){
            if(data.error){
                alert(data.error);
            }else{
                window.user=data.result;
                localStorage.setItem("user",JSON.stringify(window.user));
                Link("/user/project/all");
            }
        });
    },
    onKeyDown:function(e){
        if(e.keyCode==13){
            this.login();
        }
    },
    render: function() {
        return (
            <div className="fullHeight bg_photo">
                <div className="login-box" onKeyDown={this.onKeyDown}>
                    <div className="login-title">用户登录</div>
                    <Input change={this.handle.bind(this,"username")} holder="用户名/手机/邮箱"/>
                    <Input change={this.handle.bind(this,"password")}  type="password" holder="密码"/>
                    <button className="btn btn-block btn-primary" onClick={this.login}>登录</button>
                    <button onClick={this.jumpToRegister} className="btn btn-block btn-link">还没有账号，马上注册</button>
                </div>
                <div className="footer">
                    Copyright  © 2016 dhcc.com
                </div>
            </div>
        );
    }
});

module.exports=Login;

module.exports = Login;