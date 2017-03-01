/***
 * React Component CreateProject create by ZhangLiwei at 13:59
 */
import React from "react"
import Input from "../../form/input";
import Modal from "../../form/modal";
import Split from "../../ui/Split";
var AutoEdit=require("../../ui/AutoEdit");
var ProjectDrop=require("../../ui/ProjectDrop");
var ProjectDropSearch=require("../../ui/ProjectDropSearch");
var UserDropSearch=require("../../ui/UserDropSearch");
var TaskUrgencyDrop=require("../../ui/TaskUrgencyDrop");
var DropCalendar=require("../../ui/DropCalendar");
var DropTipList=require("../../ui/tip/DropTipList");
var LinkFunc=require("../../lib/router/LinkFunc");

class CreateTask extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {}

    /***
     * props types for helper text
     */
    static propTypes = {
        forSelect:React.PropTypes.bool,
        projectId:React.PropTypes.string,
        onSelectOk:React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            onHide:null,
            executor:false,
            urgency:0,
            end_time:-1,
            name:"",
            desc:"",
            projectId:false,
            tips:[]
        }
        this.onChangeDesc=this.onChangeDesc.bind(this);
        this.onChangeName=this.onChangeName.bind(this);
        this.onSelectUsers=this.onSelectUsers.bind(this);
        this.onSelectProject=this.onSelectProject.bind(this)
        this.changeUrgency=this.changeUrgency.bind(this);
        this.onSelectTips=this.onSelectTips.bind(this);
        this.changeEndTime=this.changeEndTime.bind(this);
        this.ok=this.ok.bind(this);
        this.cancel=this.cancel.bind(this);
    }

    onChangeDesc(v){
        this.state.desc=v;
    }

    onChangeName(v){
        this.state.name=v;
    }

    onSelectUsers(user){
        this.state.executor=user.id;
    }

    onSelectProject(project) {
        this.setState({projectId: project.id,tips:[]});
    }

    changeUrgency(urgency){
        this.state.urgency=urgency;
    }

    onSelectTips(tips){
        this.setState({tips});
    }

    changeEndTime(date){
        this.state.end_time=date.getTime();
    }

    cancel(){
        this.refs["modal"].hide();
    }

    ok(){
        var data=JSON.stringify(this.state.tips.map(v=>v.id));
        var post={
            data:data,
            projectId:this.state.projectId,
            executor:this.state.executor,
            urgency:this.state.urgency,
            end_time:this.state.end_time,
            name:this.state.name,
            desc:this.state.desc,
        }
        Ajax("api/task/addTaskAndTip",post,data=>{
            this.cancel();
            if(this.props.forSelect){
                post.id=data.result.insertId;
                callAsFunc(this.props.onSelectOk,[post]);
            }else {
                LinkFunc("/project/" + this.state.projectId + "/tasks/detail/" + data.result.insertId);
            }
        },this);
    }

    renderTips(){
        var {tips}=this.state;
        return tips.map(function (v) {
            return <span className="tip" style={{background:v.color}}>{v.name}</span>
        },this);
    }

    render() {
        return <Modal ref="modal" title="创建任务" lg className="DialogCreateTask" onHide={this.state.onHide}>
            <Split>
                <div className="autoCell">
                    <Input name="任务标题" holder="任务标题" change={this.onChangeName}/>
                    <AutoEdit change={this.onChangeDesc}/>
                </div>
                <div className="set">
                    <div className="title">所属项目</div>
                    <ProjectDropSearch noDrop={this.props.forSelect} projectId={this.props.projectId} onSelect={this.onSelectProject}/>
                    <div className="title">执行者</div>
                    <UserDropSearch onSelect={this.onSelectUsers} projectId={this.state.projectId} showName/>
                    <div className="title">紧急程度</div>
                    <div className="container">
                        <TaskUrgencyDrop change={this.changeUrgency} showName/>
                    </div>
                    <div className="title">截止日期</div>
                    <div className="container">
                        <DropCalendar  className="calendar" icon="icon-calendar"  onSelect={this.changeEndTime}/>
                    </div>
                    <div className="title">
                        标签<span className="m-r"/>
                        <DropTipList selList={this.state.tips} onSelect={this.onSelectTips} projectId={this.state.projectId}/>
                    </div>
                    <div className="container">
                        {this.renderTips()}
                    </div>
                </div>
            </Split>
            <button btn className="btn btn-primary btn-sm" onClick={this.ok}>确定</button>
            <button btn className="btn btn-warning btn-sm" onClick={this.cancel}>取消</button>
        </Modal>
    }
}

export default CreateTask;