var Router=require("../../lib/router/Router");
var Route=require("../../lib/router/Route");
var Link=require("../../lib/router/Link");
var LinkFunc=require("../../lib/router/LinkFunc");
var Split=require("../../ui/Split");
var MainMenu=require("../../ui/MainMenu");
var HelperMenu=require("../../ui/HelperMenu");
var React = require("react");
var TaskUrgency=require("../../ui/TaskUrgency");
var InputGroup=require("../../ui/InputGroup");
var TaskUrgencyDrop=require("../../ui/TaskUrgencyDrop");
var AddTask=require("./AddTask");
var ListUsers=require("./ListUsers");
var TaskItem=require("../../ui/TaskItem");
var PageNation=require("../../libui/PageNation");
var RedirectRoute=require("../../lib/router/RedirectRoute");
var TaskDetail=require("./TaskDetail");

var Tasks=React.createClass({
    getInitialState:function(){
        return {
            projectId:this.props.projectId,
            data:[],
            page:1,
            rows:5,
            total:0
        }
    },
    getName:function(){
        var id=this.props.routeParam.id;
        switch (id){
            case "done": return "已完成的";
            case "pending": return "未完成的";
            case "created":return "我创建的";
            case "overdue":return "已过期的";
            default:
                if(id&&id!="all") return id+"的任务"
                else return "所有任务";
        }
    },
    renderHeader:function(){
        return <div className="taskHeader">
            {this.getName()}
        </div>
    },
    changePage:function(page){
        var id=this.props.routeParam.id;
        this.state.page=page;
        this.load(id);
    },
    load:function(id){
        Ajax("api/task/listProject",{
            type:id||"all",
            projectId:this.state.projectId,
            page:this.state.page,
            rows:this.state.rows
        },function(data){
            this.setState({data:data.result,total:data.count});
        },this);
    },
    componentWillReceiveProps:function(nextProp){
        var id=this.props.routeParam.id;
        var nId= nextProp.routeParam.id;
        var projectId=this.props.projectId;
        var nextProjectId=nextProp.projectId;
        if(projectId!=nextProjectId){
            this.state.projectId=nextProjectId;
            if(id!=nId){
                this.state.page=1;
                this.load(nId);
            }else{
                this.load(id);
            }
        }else if(id!=nId){
            this.state.page=1;
            this.load(nId);
        }
    },
    componentDidMount:function(){
        this.load(this.props.routeParam.id);
    },
    removeTask:function(){
        this.load(this.props.routeParam.id);
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            return <TaskItem key={v.id} task={v} onRemove={this.removeTask.bind(this,v,index)}/>
        },this);
    },
    renderPageNation:function(){
        console.info(this.state.total,this.state.rows);
        if(this.state.total>this.state.rows){
            return <div className="pageContainer">
                <PageNation onSelect={this.changePage} total={this.state.total} rows={this.state.rows} page={this.state.page}/>
            </div>
        }
    },
    render:function(){
        var id=this.props.routeParam.id;
        return <div className="Tasks">
            {this.renderHeader()}
            <AddTask projectId={this.props.projectId} AddSuccess={this.load.bind(this,this.props.routeParam.id)}/>
            {this.renderData()}
            {this.renderPageNation()}
        </div>
    }
});

/***
 * React Component Task create by ZhangLiwei at 12:46
 */
var Task = React.createClass({
    getInitialState:function(){
        return {
            data:[
                {text:"所有任务",icon:"icon-tasks",path:"all"},
                {text:"已完成的",icon:"icon-ok-circle",path:"done"},
                {text:"未完成的",icon:"icon-umbrella",path:"pending"},
                {text:"已延期的",icon:"icon-time",path:"overdue"},
                {text:"我创建的",icon:"icon-bookmark",path:"created"}
            ]
        }
    },
    render: function () {
        return <Split className="Task">
            <HelperMenu title="任务"
                        desc="按已完成和未完成的任务分类"
                        data={this.state.data}
                        route={this.props.route}>
                <div>
                    <div className="helpHeader">所有成员</div>
                    <ListUsers projectId={this.props.projectId} route={this.props.route}/>
                </div>
            </HelperMenu>
            <div className="TaskSubContainer">
                <Router DEBUG>
                    <Route path="detail/:id" component={TaskDetail} projectId={this.props.projectId}/>
                    <Route path=":id" component={Tasks} projectId={this.props.projectId}/>
                </Router>
            </div>
        </Split>
    }
});

module.exports = Task;