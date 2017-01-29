var Router=require("../lib/router/Router");
var Route=require("../lib/router/Route");
var Link=require("../lib/router/Link");
var Split=require("../ui/Split");
var MainMenu=require("../ui/MainMenu");
var HelperMenu=require("../ui/HelperMenu");
var Toolbar=require("../ui/Toolbar");
var Task=require("./project/Task");
var Users=require("./project/Users");
var React = require("react");
var ProjectDrop=require("../ui/ProjectDrop");
var Docs=require("./project/Docs");
/***
 * React Component Project create by ZhangLiwei at 16:35
 */
var Project = React.createClass({
    getInitialState:function(){
        return {
            ProjectMap:false,
            data:[
                {text:"任务",icon:"icon-tasks",path:"tasks",component:Task},
                {text:"需求",icon:"icon-tasks",path:"docs",component:Docs},
                {text:"成员",icon:"icon-user",path:"users",component:Users}
            ]
        }
    },
    renderRoute:function(){
        var projectId=this.props.routeParam.id;
        return this.state.data.map(function(v,index){
            return <Route key={v.path} path={v.path} component={v.component} projectId={projectId}/>
        },this);
    },
    onProjectMap:function(map){
        this.setState({ProjectMap:map});
    },
    componentDidMount:function(){
        cacheAjax("api/user/listProjects",{},this.onProjectMap);
    },
    render: function () {
        var {ProjectMap}=this.state;
        var projectId=this.props.routeParam.id;
        var name=projectId;
        if(ProjectMap&&ProjectMap[projectId]){
            name=ProjectMap[projectId].name;
        }
        return <Split className="Project" vertical>
            <Toolbar>
                <ProjectDrop projectId={projectId}/>
            </Toolbar>
            <Split>
                <MainMenu data={this.state.data}/>
                <Router>
                    {this.renderRoute()}
                </Router>
            </Split>
        </Split>
    }
});

module.exports = Project;