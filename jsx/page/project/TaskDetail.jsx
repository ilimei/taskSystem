var React = require("react");
var AutoEdit=require("../../ui/AutoEdit");
var Split=require("../../ui/Split");
var UserDropSearch=require("../../ui/UserDropSearch");
var TaskUrgencyDrop=require("../../ui/TaskUrgencyDrop");
var DropIcon=require("../../ui/DropIcon");
var DropCalendar=require("../../ui/DropCalendar");
var DropTipList=require("../../ui/tip/DropTipList");
var TaskLog=require("./ui/TaskLog").default;
/***
 * React Component TaskDetail create by ZhangLiwei at 12:47
 */
var TaskDetail = React.createClass({
    getInitialState:function(){
        return {
            task: null,
            project: null,
            name:"",
            content:""
        }
    },
    handle:function(name,e){
        this.state[name]=e.target.value;
        this.forceUpdate();
    },
    handleContent:function(name,v){
        this.state[name]=v;
        this.forceUpdate();
    },
    saveName:function(e){
        if(e.type=="keydown"&&e.keyCode==13){
            e.target.blur();
            return;
        }else if(e.type=="blur"){
            var {task}=this.state;
            if(task.name!=this.state.name)
            Ajax("api/task/update",{
                id:task.id,
                name:this.state.name
            },function(data){
                if(data.success){
                    task.name=this.state.name;
                    this.forceUpdate();
                }
            },this);
        }else{
            return;
        }
        console.dir(e.type);
    },
    changeDesc:function(){
        var {task}=this.state;
        if(task.desc!=this.state.content)
        Ajax("api/task/update",{
            id:task.id,
            desc:this.state.content
        },function(data){
            if(data.success){
                task.desc=this.state.content;
                this.forceUpdate();
            }
        },this);
    },
    updateExecutor:function(nExecutor){
        var {task}=this.state;
        Ajax("api/task/update",{
            id:task.id,
            executor:nExecutor.id
        },function(data){
            if(data.success){
                task.executor=nExecutor;
                this.forceUpdate();
            }
        },this);
    },
    toggleDone:function(canSentToOther){
        if(canSentToOther)return;
        var {task}=this.state;
        var nDone=0;
        if(task.done==0){
            nDone=1;
        }else{
            nDone=0;
        }
        Ajax("api/task/update",{
            id:task.id,
            done:nDone
        },function(data){
            if(data.success){
                task.done=nDone;
                this.forceUpdate();
            }
        },this);
    },
    changeEndTime:function(endDate){
        var {task}=this.state;
        Ajax("api/task/update",{
            id:task.id,
            end_time:endDate.getTime()+""
        },function(data){
            if(data.success){
                task.end_time=endDate;
                this.forceUpdate();
            }
        },this);
    },
    changeUrgency:function(v){
        var {task}=this.state;
        Ajax("api/task/update",{
            id:task.id,
            weight:v
        },function(data){
            if(data.success){
                task.weight=v;
                this.forceUpdate();
            }
        },this);
    },
    load:function(id){
        Ajax("api/task/getTask",{
            id:id
        },function(data){
            this.setState({task:data.result,
                project:data.result.project,name:data.result.name,
                content:data.result.desc});
        },this);
    },
    componentDidMount:function(){
        this.load(this.props.routeParam.id);
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.routeParam.id!=this.props.routeParam.id){
            this.load(nextProps.routeParam.id);
        }
    },
    renderLoader(){
        return <div><i className="icon-spin icon-spinner"/>数据加载中..</div>
    },
    renderTips(){
        var {task}=this.state;
        if(!task||!task.tips)return;
        var tips=task.tips;
        return tips.map(function (v) {
            return <span className="tip" style={{background:v.color}}>{v.name}</span>
        },this);
    },
    onSelectTips:function(tips){
        var {task}=this.state;
        task.tips=tips;
        this.forceUpdate();
    },
    render: function () {
        var {task,project}=this.state;
        if(task==null||project==null){
            return this.renderLoader();
        }
        if(typeof task.end_time=="string") {
            task.end_time = new Date(parseInt(task.end_time));
        }
        var cls=CS({
            "icon-check-empty":task.done==0,
            "icon-check":task.done!=0
        });
        const usr=JSON.parse(localStorage.getItem("user"));
        const canEdit=(usr.id!=task.creator.id);
        const canSentToOther=(usr.id!=task.creator.id&&usr.id!=task.executor.id);

        return <Split className="TaskDetail" vertical>
            <div className="taskTitle">
                <div className="done">
                    <i className={cls} onClick={this.toggleDone.bind(this,canSentToOther)}/>
                </div>
                <span className="title">
                    <textarea disabled={canEdit} value={this.state.name} onKeyDown={this.saveName} onBlur={this.saveName} onChange={this.handle.bind(this,"name")}/>
                </span>
            </div>
            <Split>
                <div className="content">
                    <div className="icon">
                        <i className="icon-align-right"/>
                    </div>
                    <div className="center">
                        <AutoEdit cantEdit={canEdit} preview
                                  change={this.handleContent.bind(this,"content")}
                                  value={task.desc} noLimitHeight>
                            <i className="icon-save" onClick={this.changeDesc}/>
                        </AutoEdit>
                    </div>
                    <TaskLog taskId={task.id} projectId={project.id}/>
                </div>
                <div className="set">
                    <div className="title">所属项目</div>
                    <div className="projectName container">
                        <div className="avatar">
                            <img src={project.icon}/>
                        </div>
                        {project.name}
                    </div>
                    <div className="title">执行者</div>
                    <div className="container">
                        <UserDropSearch onSelect={this.updateExecutor} showName projectId={this.props.projectId} selUser={task.executor} noDrop={task.done!=0||canSentToOther}/>
                    </div>
                    <div className="title">紧急程度</div>
                    <div className="container">
                        <TaskUrgencyDrop noDrop={canEdit} change={this.changeUrgency} value={task.weight} showName/>
                    </div>
                    <div className="title">截止日期</div>
                    <div className="container">
                        <DropCalendar  noDrop={canEdit} hasSelect={task.end_time.getTime()!=-1} className="calendar" icon="icon-calendar" date={task.end_time} onSelect={this.changeEndTime}/>
                    </div>
                    <div className="title">
                        标签<span className="m-r"/>
                        <DropTipList selList={dataPropArr(task.tips,"id")} onSelect={this.onSelectTips} projectId={task.project.id} taskId={task.id}/>
                    </div>
                    <div className="container">
                        {this.renderTips()}
                    </div>
                </div>
            </Split>
        </Split>
    }
});

module.exports = TaskDetail;