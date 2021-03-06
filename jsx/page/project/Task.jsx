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
var DropFilter=require("../../ui/filter/DropFilter");
var TipTree=require("../../ui/tip/TipTree");

var Tasks=React.createClass({
    getInitialState:function(){
        return {
            projectId:this.props.projectId,
            data:[],
            page:1,
            rows:10,
            total:0,
            filter:-1
        }
    },
    getName:function(){
        var {type}=this.props;
        var {id}=this.props.routeParam;
        if(type){
            return "任务";
        }
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
    filterChange:function(filter){
        this.state.filter=filter;
        var id=this.props.routeParam.id;
        this.load(id);
    },
    renderHeader:function(){
        return <div className="taskHeader">
            {this.getName()}({this.state.total})
            <div className="filter-container">
                <DropFilter onSelect={this.filterChange}/>
            </div>
        </div>
    },
    changePage:function(page){
        var {id}=this.props.routeParam;
        this.state.page=page;
        this.load(id,this.props.type);
    },
    load:function(id,type){
        if(type=="tip"){
            Ajax("api/task/listTip",{
                tipId:id,
                projectId:this.state.projectId,
                page:this.state.page,
                rows:this.state.rows,
                filter:this.state.filter
            },function(data){
                this.setState({data:data.result,total:data.count});
            },this);
        }else{
            Ajax("api/task/listProject",{
                type:id||"all",
                projectId:this.state.projectId,
                page:this.state.page,
                rows:this.state.rows,
                filter:this.state.filter
            },function(data){
                this.setState({data:data.result,total:data.count});
            },this);
        }
    },
    componentWillReceiveProps:function(nextProp){
        if(nextProp.type!=this.props.type){
            this.forceUpdate();
        }
        var id=this.props.routeParam.id;
        var nId= nextProp.routeParam.id;
        var projectId=this.props.projectId;
        var nextProjectId=nextProp.projectId;
        if(projectId!=nextProjectId){
            this.state.projectId=nextProjectId;
            if(id!=nId){
                this.state.page=1;
                this.load(nId,nextProp.type);
            }else{
                this.load(id,nextProp.type);
            }
        }else if(id!=nId){
            this.state.page=1;
            this.load(nId,nextProp.type);
        }
    },
    componentDidMount:function(){
        this.load(this.props.routeParam.id,this.props.type);
    },
    removeTask:function(){
        this.load(this.props.routeParam.id,this.props.type);
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            return <TaskItem key={v.id} task={v} onRemove={this.removeTask.bind(this,v,index)}/>
        },this);
    },
    renderPageNation:function(){
        if(this.state.total>this.state.rows){
            return <div className="pageContainer">
                <PageNation onSelect={this.changePage} total={this.state.total} rows={this.state.rows} page={this.state.page}/>
            </div>
        }
    },
    render:function(){
        var id=this.props.routeParam.id;
        return <div className="Project-Tasks">
            {this.renderHeader()}
            <AddTask preUserId={id} projectId={this.props.projectId} AddSuccess={this.load.bind(this,id)}/>
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
                        data={this.state.data}>
                <TipTree projectId={this.props.projectId}/>
                <div>
                    <div className="helpHeader">所有成员</div>
                    <ListUsers projectId={this.props.projectId}/>
                </div>
            </HelperMenu>
            <div className="TaskSubContainer">
                <Router>
                    <Route path="detail/:id" component={TaskDetail} projectId={this.props.projectId}/>
                    <Route path="tip/detail/:id" component={TaskDetail} projectId={this.props.projectId}/>
                    <Route path="tip/:id" type="tip" component={Tasks} projectId={this.props.projectId}/>
                    <Route path=":id" component={Tasks} projectId={this.props.projectId}/>
                </Router>
            </div>
        </Split>
    }
});

module.exports = Task;