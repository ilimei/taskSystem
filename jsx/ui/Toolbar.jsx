/***
 * React Component Toolbar create by ZhangLiwei at 21:13
 */
var DropIcon=require("./DropIcon");
var React = require("react");
var TaskList=require("./Tasklist");
var LinkFunc=require("../lib/router/LinkFunc");
import CreateTask from "../page/dialog/CreateTask";
console.dir(process);

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
                {text:"创建项目",icon:"coding-project",click:this.createProject},
                {text:"创建任务",icon:"icon-tasks",click:this.createTask}
            ],
            unread:0,
            msgList:[]
        }
    },
    createTask(){
        showModal(<CreateTask/>)
    },
    createProject(){
        LinkFunc("/user/project/create");
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
    selectMsgList:function(msg){
        Ajax("api/msg/read",{
            id:msg.id
        },data=>{
            this.loadUnRead();
            LinkFunc(`/project/${msg.project_id}/tasks/detail/${msg.task_id}`);
        });
    },
    loadUnRead:function(){
        Ajax("api/msg/unread",{page:1,rows:5},function(data){
            this.setState({unread:data.data[0],msgList:data.data[1]});
        },this);
    },
    componentDidMount:function(){
        cacheAjax("api/user/getLoginInfo",{},function (data) {
            this.setState({user:data});
        },this);
        this.loadUnRead();
    },
    render: function() {
        var img="/headicon/02.png";
        var {user}=this.state;
        if(user.avatar){
            img=user.avatar;
        }
        var cls=CS({
            "item":true,
            "msgNew":this.state.unread>0
        });
        return (
            <div className="Toolbar">
                <div className="right-menu">
                    <span className="item" onClick={this.jumpToMyTask}>
                        <i className="icon-tasks"/>
                    </span>
                    <DropIcon noDrop={this.state.unread<=0} className={cls} icon="icon-bell-alt">
                        <TaskList data={this.state.msgList}
                                  onClick={this.selectMsgList}
                                  textField="content">
                            <a className="more" href="#">查看更多通知》</a>
                        </TaskList>
					</DropIcon>
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