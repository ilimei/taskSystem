/***
 * React Component DocTasks create by ZhangLiwei at 9:27
 */
import React from "react"
import PageNation from "../../../libui/PageNation";
import TaskItem from "../../../ui/TaskItem";

class DocTasks extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {}

    /***
     * props types for helper text
     */
    static propTypes = {
        docNode:React.PropTypes.object
    }

    /**
     * component state
     */
    state = {
        tasks:[],
        page:1,
        rows:10,
        total:0
    }

    constructor(props) {
        super(props);
        ComponentConstrutorAutoBind(this);
    }
    
    componentDidMount(){
         this.load(this.props.docNode.id);
         EventSpider.on("onAddTaskToTree",this.onAddTasksToTree);
    }
    
    componentWillUnmount(){
        EventSpider.un("onAddTaskToTree",this.onAddTasksToTree);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.docNode.id!=this.props.docNode.id){
            this.load(nextProps.docNode.id);
        }
    }

    onAddTasksToTree(id){
        if(this.props.docNode.id==id){
            this.load(id);
        }
    }

    onDelTask(treeItem,task){
        let {docNode}=this.props;
        var _this=this;
        confirm(`确定删除需求【${docNode.title}】中的【${task.name}】任务么？`, function () {
            Ajax("api/doc/del",{
                id:treeItem.id
            },data=>{
                _this.load(docNode.id);
                EventSpider.trigger("onDelTaskFromTree",[docNode.id,task.done]);
            });
        });
    }

    handleSelectPage(page) {
        this.state.page = page;
        this.load(this.props.docNode.id);
    }
    
    load(id){
        Ajax("api/doc/getDocTask",{
            id:id,
            page:this.state.page,
            rows:this.state.rows
        },data=>{
            this.setState({tasks:data.data,total:data.total});
        },this);
    }

    renderTaskItems(){
        return this.state.tasks.map(function (v, index) {
            return <TaskItem key={v.id} task={v.task}
                             onDel={this.onDelTask.bind(this,v)}
                             isSelect={v.task.done!=0}/>
        },this);
    }

    render() {
        return <div className="DocTasks">
            {this.renderTaskItems()}
            <div className="pageNationContainer">
                <PageNation total={this.state.total}
                        onSelect={this.handleSelectPage}
                        page={this.state.page}
                        rows={this.state.rows}/>
            </div>
        </div>
    }
}

export default DocTasks;