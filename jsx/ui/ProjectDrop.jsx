var DropAny=require("./DropAny");
var React = require("react");
var LinkFunc=require("../lib/router/LinkFunc");
var store=require("../lib/store");
/***
 * React Component ProjectDrop create by ZhangLiwei at 11:08
 */
var ProjectDrop = React.createClass({
    getInitialState:function(){
        return {
            filter:"",
            projectId:this.props.projectId,
            selProject:null,
            data:[]
        }
    },
    componentDidMount:function(){
        Ajax("api/user/listProjects",{},function(data) {
            var map={};
            data.result.forEach(function(v){
                map[v.id]=v;
            });
            store.set("projectMap",map);
            this.setState({data:data.result,selProject:map[this.state.projectId]});
        },this);
    },
    selProject:function(project){
        LinkFunc("/project/"+project.id+"/tasks/all");
        this.setState({selProject:project,projectId:project.id});
    },
    renderProjects:function(){
        var filter=this.state.filter;
        return this.state.data.map(function(v,index){
            if(v.name.indexOf(filter)>=0) {
                return <div key={v.id} className="projectItem" onClick={this.selProject.bind(this, v)}>
                    <div className="avatar"><img src={v.icon}/></div>
                    <div className="userName">{v.name}</div>
                </div>
            }
        },this);
    },
    render: function () {
        var {selProject}=this.state;
        return <DropAny className="ProjectDrop">
            <div body>
                {selProject?selProject.name:""}
            </div>
            <div className="">
                {this.renderProjects()}
            </div>
        </DropAny>
    }
});

module.exports = ProjectDrop;