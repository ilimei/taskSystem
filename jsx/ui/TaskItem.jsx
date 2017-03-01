var React = require("react");
var UserDropSearch = require("./UserDropSearch");
var TaskUrgencyDrop = require("./TaskUrgencyDrop");
var DropIcon = require("./DropIcon");
var Marked = require("../marked/markedFunc");
var LinkFunc = require("../lib/router/LinkFunc");
var DropCalendar = require("./DropCalendar");
var DropTipList = require("./tip/DropTipList");

/***
 * React Component TaskItem create by ZhangLiwei at 19:08
 */
var TaskItem = React.createClass({
    propTypes: {
        forSelect: React.PropTypes.bool,
        isSelect: React.PropTypes.bool,
        onDel:React.PropTypes.func
    },
    updateExecutor: function (nExecutor) {
        var {task}=this.props;
        Ajax("api/task/update", {
            id: task.id,
            executor: nExecutor.id
        }, function (data) {
            if (data.success) {
                task.executor = nExecutor;
                this.forceUpdate();
            }
        }, this);
    },
    toggleDone: function (canSentToOther) {
        if (this.props.forSelect) {
            callAsFunc(this.props.onSelect);
        } else {
            if (canSentToOther)return;
            var {task}=this.props;
            var nDone = 0;
            if (task.done == 0) {
                nDone = 1;
            } else {
                nDone = 0;
            }
            Ajax("api/task/update", {
                id: task.id,
                done: nDone
            }, function (data) {
                if (data.success) {
                    task.done = nDone;
                    this.forceUpdate();
                }
            }, this);
        }
    },
    changeEndTime: function (endDate) {
        var {task}=this.props;
        Ajax("api/task/update", {
            id: task.id,
            end_time: endDate.getTime() + ""
        }, function (data) {
            if (data.success) {
                task.end_time = endDate;
                this.forceUpdate();
            }
        }, this);
    },
    changeUrgency: function (v) {
        var {task}=this.props;
        Ajax("api/task/update", {
            id: task.id,
            weight: v
        }, function (data) {
            if (data.success) {
                task.weight = v;
                this.forceUpdate();
            }
        }, this);
    },
    toggleShowContent: function () {
        var {task}=this.props;
        task.showContent = !task.showContent;
        this.forceUpdate();
    },
    jumpToDetail: function () {
        var {task}=this.props;
        if (location.pathname.endsWith("tasks")) {
            LinkFunc("tasks/detail/" + task.id);
        } else {
            LinkFunc("detail/" + task.id);
        }
    },
    delTask: function () {
        var {task,onDel}=this.props;
        if(onDel){
            callAsFunc(onDel,[task]);
        }else {
            var me = this;
            confirm("确定删除【" + task.name + "】么？", function () {
                Ajax("api/task/remove", {
                    id: task.id
                }, function (data) {
                    if (data.success) {
                        callAsFunc(this.props.onRemove);
                    } else {
                        alert(data.message);
                    }
                }, me);
            });
        }
    },
    onSelectTips: function (tips) {
        var {task}=this.props;
        task.tips = tips;
        this.forceUpdate();
    },
    renderTips: function () {
        var {task}=this.props;
        var tips = task.tips;
        return tips.map(function (v) {
            return <span className="tip" style={{background: v.color}}>{v.name}</span>
        }, this);
    },
    renderContent: function () {
        var {task}=this.props;
        if (task.showContent) {
            return <div className="task-desc markdown_css" dangerouslySetInnerHTML={{
                __html: Marked(task.desc)
            }}/>
        }
    },
    renderCheckDetail: function () {
        if (!this.props.forSelect)
            return <span className="desc" onClick={this.jumpToDetail}>
            <i className="icon-info-sign"/>查看详情
        </span>
    },
    renderDopTipSelect:function(task){
        if(!this.props.forSelect)
        return <DropTipList noDrop={this.props.forSelect} selList={dataPropArr(task.tips, "id")}
                     onSelect={this.onSelectTips} projectId={task.project.id} taskId={task.id}/>
    },
    renderDelTask: function () {
        if (this.props.forSelect&&!this.props.onDel) {
            return;
        }
        return <div className="delTask">
            <i className="icon-minus-sign" onClick={this.delTask}/>
        </div>
    },
    render: function () {
        var {task}=this.props;
        if (typeof task.end_time == "string") {
            task.end_time = new Date(parseInt(task.end_time));
        }
        var cls = CS({
            "icon-check-empty": task.done == 0,
            "icon-check": task.done != 0
        });
        if (this.props.forSelect) {
            cls = CS({
                "icon-check-empty": !this.props.isSelect,
                "icon-check": this.props.isSelect
            });
        }
        var nameCls = CS({
            "name": true,
            "lineThrough": task.done != 0
        })
        var CalendarCls = CS({
            "calendar": true,
            "overdue": task.end_time.getTime() > 0 && new Date() > task.end_time && task.done == 0
        });
        const usr = JSON.parse(localStorage.getItem("user"));
        const canEdit = (usr.id != task.creator.id);
        const canSentToOther = (usr.id != task.creator.id && usr.id != task.executor.id);
        return <div className="TaskItem">
            <div className="info-container">
                <div className="done">
                    <i className={cls} onClick={this.toggleDone.bind(this, canSentToOther)}/>
                </div>
                <div className="center">
                    <div className="urgency">
                        <TaskUrgencyDrop noDrop={this.props.forSelect || canEdit} change={this.changeUrgency}
                                         value={task.weight}/>
                    </div>
                    <div className={nameCls}>
                        {task.name}
                    </div>
                    <div className="detail">
                        <DropCalendar noDrop={this.props.forSelect || canEdit} hasSelect={task.end_time.getTime() != -1}
                                      date={task.end_time} className={CalendarCls} onSelect={this.changeEndTime}/>
                        <span className="creator">
                        创建者：{task.creator.nick_name}
                    </span>
                        <span className="creator">
                        项目：{task.project.name}
                    </span>
                        <span className="desc" onClick={this.toggleShowContent}>
                        <i className="icon-align-left"/>
                            {task.showContent ? "收起描述" : "描述"}
                    </span>
                        {this.renderCheckDetail()}
                        <span className="tag">
                        <i className="icon-tags"/>标签：
                            {this.renderDopTipSelect(task)}
                    </span>
                        {this.renderTips()}
                    </div>
                </div>
                <div className="executor">
                    <UserDropSearch showName onSelect={this.updateExecutor} projectId={task.project.id}
                                    selUser={task.executor} noDrop={this.props.forSelect ||task.done != 0 || canSentToOther}/>
                </div>
                {this.renderDelTask()}
            </div>
            {this.renderContent()}
        </div>
    }
});

module.exports = TaskItem;