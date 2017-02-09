/***
 * React Component Toolbar create by ZhangLiwei at 21:13
 */
var DropIcon=require("./DropIcon");
var React = require("react");
var TaskList=require("./Tasklist");
var LinkFunc=require("../lib/router/LinkFunc");

var Toolbar = React.createClass({
    getInitialState:function(){
        return {
            user:{},
            menu:[
                {"text":"我的任务",icon:"icon-tasks",click:this.myTask},
                {"text":"修改信息",icon:"icon-edit",click:this.changeInfo},
                {"text":"退出登录",icon:"icon-cloud-download",click:this.logout},
            ],
            data:[
                {text:"创建项目",icon:"coding-project"},
                {text:"创建任务",icon:"icon-tasks"}
            ]
        }
    },
    myTask:function(){
        LinkFunc("/user/tasks/all");
    },
    changeInfo:function(){
        LinkFunc("/user/setting");
    },
    logout:function(){
        Ajax("api/user/logout",{},function(data){
            window.location.href=window.location.href;
        });
    },
    jumpToHome:function(){
        LinkFunc("/user/project/all");
    },
    jumpToMyTask:function(){
        LinkFunc("/user/tasks/pending");
    },
    componentDidMount:function(){
        cacheAjax("api/user/getLoginInfo",{},function (data) {
            this.setState({user:data});
        },this);
    },
    render: function() {
        var img="/headicon/02.png";
        var {user}=this.state;
        if(user.avatar){
            img=user.avatar;
        }
        return (
            <div className="Toolbar">
                <div className="right-menu">
                    <span className="item" onClick={this.jumpToMyTask}>
						<i className="icon-bell-alt"/>
					</span>
                    <DropIcon className="item" icon="icon-plus">
						<TaskList data={this.state.data}/>
					</DropIcon>
                    <DropIcon className="item right" img={img} dropdown>
                        <TaskList data={this.state.menu}/>
                    </DropIcon>
                </div>
                <div className="center">
                    {this.props.children}
                </div>
                <div className="left-menu">
					<span className="logo" onClick={this.jumpToHome}>
						<img src="/img/logo.png"/>
					</span>
                </div>
            </div>
        );
    }
});
module.exports = Toolbar;