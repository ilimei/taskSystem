/***
 * React Component AddTask create by ZhangLiwei at 10:02
 */
var React = require("react");
var DropIcon=require("../../ui/DropIcon");
var TaskUrgency=require("../../ui/TaskUrgency");
var InputGroup=require("../../ui/InputGroup");
var TaskUrgencyDrop=require("../../ui/TaskUrgencyDrop");
var UserDropSearch=require("../../ui/UserDropSearch");
var AutoEdit=require("../../ui/AutoEdit");
var DropCalendar=require("../../ui/DropCalendar");

var AddTask = React.createClass({
    getInitialState:function(){
        return {
            date:"",
            title:"",
            content:"",
            urgency:0,
            selUser:null
        }
    },
    clear:function(){
        this.refs["dropCalendar"].clear();
        this.refs["inputGroup"].clear();
        this.refs["autoEdit"].clear();
        this.refs["userDrop"].clear();
        this.setState({date:"",
            title:"",
            content:"",
            urgency:0,
            selUser:null
        });
    },
    handle:function(name,v){
        this.state[name]=v;
    },
    selUser:function(v){
        this.state.selUser=v;
    },
    onSelData:function(date){
        this.setState({date:date})
    },
    ok:function(){
        var {date,selUser}=this.state;
        date=date?date.getTime():"-1";
        var userId=selUser?selUser.id:false;
        Ajax("api/task/add",{
            executor:userId,
            end_time:date,
            urgency:this.state.urgency,
            projectId:this.props.projectId,
            name:this.state.title,
            desc:this.state.content
        },function(data){
            if(data.success) {
                this.clear();
                callAsFunc(this.props.AddSuccess)
            }
        },this);
    },
    render: function () {
        var date=this.state.date?this.state.date.Format("yyyy年MM月dd日"):"";
        return <div className="AddTask">
            <DropCalendar ref="dropCalendar" className="calendar" onSelect={this.onSelData}/>
            <div className="center">
                <InputGroup ref="inputGroup" placeholder="添加一个任务" change={this.handle.bind(this,"title")}>
                    <TaskUrgencyDrop change={this.handle.bind(this,"urgency")} value={this.state.urgency}/>
                    <AutoEdit ref="autoEdit" placeholder="添加任务描述支持markdown" change={this.handle.bind(this,"content")} dropper/>
                    <div className="clickAble" foot onClick={this.ok}>
                        <i className="icon-arrow-right"/>
                    </div>
                </InputGroup>
            </div>
            <UserDropSearch ref="userDrop" onSelect={this.selUser} projectId={this.props.projectId} foot/>
        </div>
    }
});

module.exports = AddTask;