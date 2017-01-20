var React = require("react");
var UserDropSearch=require("./UserDropSearch");
var TaskUrgencyDrop=require("./TaskUrgencyDrop");
var DropIcon=require("./DropIcon");
var Marked=require("marked");
var hljs = require('../marked/highlight');
var LinkFunc=require("../lib/router/LinkFunc");
var DropCalendar=require("./DropCalendar");

Marked.setOptions({
    renderer: new Marked.Renderer({
        highlight: function(code, lang) {
            if (lang)
                return hljs.highlightAuto(code, [lang]).value;
            else
                return hljs.highlightAuto(code).value;
        }
    }),
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        if (lang)
            return hljs.highlightAuto(code, [lang]).value;
        else
            return hljs.highlightAuto(code).value;
    }
});

/***
 * React Component TaskItem create by ZhangLiwei at 19:08
 */
var TaskItem = React.createClass({
    updateExecutor:function(nExecutor){
        var {task}=this.props;
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
    toggleDone:function(){
        var {task}=this.props;
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
        var {task}=this.props;
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
        var {task}=this.props;
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
    toggleShowContent:function(){
        var {task}=this.props;
        task.showContent=!task.showContent;
        this.forceUpdate();
    },
    jumpToDetail:function(){
        var {task}=this.props;
        if(location.pathname.endsWith("tasks")){
            LinkFunc("tasks/detail/"+task.id);
        }else{
            LinkFunc("detail/"+task.id);
        }
    },
    delTask:function(){
        var {task}=this.props;
        var me=this;
        confirm("确定删除【"+task.name+"】么？",function(){
            Ajax("api/task/remove",{
                id:task.id
            },function(data){
                if(data.success){
                    callAsFunc(this.props.onRemove);
                }else{
                    alert(data.message);
                }
            },me);
        });
    },
    renderContent:function(){
        var {task}=this.props;
        if(task.showContent){
            console.dir(task.desc);
            return <div className="task-desc" dangerouslySetInnerHTML={{
                __html:Marked(task.desc)
            }}/>
        }
    },
    render: function () {
        var {task}=this.props;
        if(typeof task.end_time=="string") {
            task.end_time = new Date(parseInt(task.end_time));
        }
        var cls=CS({
            "icon-check-empty":task.done==0,
            "icon-check":task.done!=0
        });
        var nameCls=CS({
            "name":true,
            "lineThrough":task.done!=0
        })
        var CalendarCls=CS({
            "calendar":true,
            "overdue":task.end_time.getTime()>0&&new Date()>task.end_time&&task.done==0
        });
        return <div className="TaskItem">
            <div className="info-container">
            <div className="done">
                <i className={cls} onClick={this.toggleDone}/>
            </div>
            <div className="center">
                <div className="urgency">
                    <TaskUrgencyDrop change={this.changeUrgency} value={task.weight}/>
                </div>
                <div className={nameCls}>
                    {task.name}
                </div>
                <div className="detail">
                    <DropCalendar hasSelect={task.end_time.getTime()!=-1} date={task.end_time} className={CalendarCls} onSelect={this.changeEndTime}/>
                    <span className="creator">
                        创建者：{task.creator.name}
                    </span>
                    <span className="creator">
                        项目：{task.project.name}
                    </span>
                    <span className="desc" onClick={this.toggleShowContent}>
                        <i className="icon-align-left"/>
                        {task.showContent?"收起描述":"描述"}
                    </span>
                    <span className="desc" onClick={this.jumpToDetail}>
                        <i className="icon-info-sign"/>
                        {"查看详情"}
                    </span>
                    <span className="tag">
                        <i className="icon-tags"/>标签
                    </span>
                </div>
            </div>
            <div className="executor">
                <UserDropSearch onSelect={this.updateExecutor} projectId={task.project.id} selUser={task.executor} noDrop={task.done!=0}/>
            </div>
            <div className="delTask">
                <i className="icon-minus-sign" onClick={this.delTask}/>
            </div>
            </div>
            {this.renderContent()}
        </div>
    }
});

module.exports = TaskItem;