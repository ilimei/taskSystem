var DropAny=require("./DropAny");
var React = require("react");
var LinkFunc=require("../lib/router/LinkFunc");
var Input=require("../form/input");
/***
 * React Component ProjectDrop create by ZhangLiwei at 11:08
 */
var ProjectDropSearch = React.createClass({
    getInitialState:function(){
        return {
            filter:"",
            projectId:this.props.projectId,
            selProject:null,
            data:[]
        }
    },
    componentDidMount:function(){
        cacheAjax("api/user/listProjects",{},function(data) {
            var map={};
            data.result.forEach(function(v){
                map[v.id]=v;
            });
            var selProject=map[this.props.projectId];
            if(data.result.length){
                if(!selProject) {
                    selProject = data.result[0];
                }
                callAsFunc(this.props.onSelect, [selProject]);
            }
            this.setState({data:data.result,selProject:selProject});
        },this);
    },
    selProject:function(project){
        callAsFunc(this.props.onSelect,[project]);
        this.setState({selProject:project,projectId:project.id});
    },
    onShow:function(){
        this.refs["dropPanel"].focus();
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
    filterUser:function(v){
        this.setState({filter:v});
    },
    renderDrop:function(){
        if(this.props.noDrop)return;
        return <div className="searchUsers">
            <div className="inputWrap">
                <Input holder="搜索" change={this.filterUser}/>
            </div>
            {this.renderProjects()}
        </div>
    },
    renderSelectItem:function(){
        var {selProject}=this.state;
        if(selProject) {
            return <div className="projectItem">
                <div className="avatar"><img src={selProject.icon}/></div>
                <div className="userName">{selProject.name}</div>
            </div>
        }
    },
    render: function () {
        var {selProject}=this.state;
        return <DropAny onShow={this.onShow} focusDrop noDrop={this.props.noDrop}  className="ProjectDrop">
            <NativeDom Name="div" np="body" body>
                {this.renderSelectItem()}
            </NativeDom>
            <div className="noOutline" tabIndex="-1" ref="dropPanel">{this.renderDrop()}</div>
        </DropAny>
    }
});

module.exports = ProjectDropSearch;