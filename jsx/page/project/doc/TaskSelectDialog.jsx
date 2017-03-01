/***
 * React Component TaskSelectDialog create by ZhangLiwei at 14:45
 */
import React from "react"
import Modal from "../../../form/modal";
import Split from "../../../ui/Split";
import PageNation from "../../../libui/PageNation";
import TaskItem from "../../../ui/TaskItem";

const oneOfType = React.PropTypes.oneOfType;

class TaskSelectDialog extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        projectId: oneOfType([React.PropTypes.string, React.PropTypes.number]),
        onOk:React.PropTypes.func,
        docId:oneOfType(React.PropTypes.string,React.PropTypes.number)
    }

    state = {
        onHide: null,
        selectTaskIds:[],
        selectTasks: [],
        tasks:[],
        page: 1,
        rows: 5,
        total: 0
    }

    constructor(props) {
        super(props);
        ComponentConstrutorAutoBind(this);
    }

    componentDidMount() {
        this.load();
    }

    load(){
        Ajax("api/task/listProjectForDoc", {
            page: this.state.page,
            rows: this.state.rows,
            projectId: this.props.projectId,
            type:"all",
            filter:-1,
            docId:this.props.docId
        }, data => {
            this.setState({total:data.count,tasks:data.result});
        }, this);
    }

    handleSelectPage(page){
        this.state.page=page;
        this.load();
    }

    onSelect(task) {
        let index=this.state.selectTaskIds.indexOf(task.id);
        if(index<0) {
            this.state.selectTasks.push(task);
            this.state.selectTaskIds.push(task.id);
            this.forceUpdate();
        }else{
            this.state.selectTaskIds.splice(index,1);
            this.state.selectTasks.splice(index,1);
            this.forceUpdate();
        }
    }

    renderTaskItems(){
        return this.state.tasks.map(function (v, index) {
            let isSelect=this.state.selectTaskIds.indexOf(v.id)>=0;
            return <TaskItem key={v.id} task={v} forSelect isSelect={isSelect} onSelect={this.onSelect.bind(this,v)}/>
        },this);
    }

    renderSelectTaskItems(){
        return this.state.selectTasks.map(function (v, index) {
            let isSelect=true;
            return <TaskItem key={v.id} task={v} forSelect isSelect={isSelect} onSelect={this.onSelect.bind(this,v)}/>
        },this);
    }

    cancel(){
        this.refs["modal"].hide();
    }

    ok(){
        callAsFunc(this.props.onOk,[this.state.selectTaskIds,this.state.selectTasks]);
        this.cancel();
    }

    render() {
        return <Modal title="选择任务" lg className="TaskSelectDialog" onHide={this.state.onHide} ref="modal">
            <Split>
                <div className="autoCell">
                    {this.renderTaskItems()}
                    <div className="pageNationContainer">
                    <PageNation total={this.state.total}
                                onSelect={this.handleSelectPage}
                                page={this.state.page}
                                rows={this.state.rows}/>
                    </div>
                </div>
                <div className="autoCell">
                    {this.renderSelectTaskItems()}
                </div>
            </Split>
            <button className="btn btn-warning" btn onClick={this.cancel}>取消</button>
            <button className="btn btn-primary" btn onClick={this.ok}>确定</button>
        </Modal>
    }
}

export default TaskSelectDialog;