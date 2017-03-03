var Router=require("../../lib/router/Router");
var Route=require("../../lib/router/Route");
var Link=require("../../lib/router/Link");
var LinkFunc=require("../../lib/router/LinkFunc");
var Split=require("../../ui/Split");
var MainMenu=require("../../ui/MainMenu");
var HelperMenu=require("../../ui/HelperMenu");
var React = require("react");
/***
 * React Component Project create by ZhangLiwei at 15:42
 */
var Projects=React.createClass({
    getInitialState:function(){
        return {
            data:[]
        }
    },
    getName:function(){
        var id=this.props.routeParam.id;
        switch (id){
            case "created": return "我创建的";
            case "joined": return "我参与的";
            default:return "所有项目";
        }
    },
    addProject:function(){
        LinkFunc("/user/project/create");
    },
    jumpToProject:function(v){
        LinkFunc("/project/"+v.id+"/tasks");
    },
    componentDidMount:function(){
         let id=this.props.routeParam.id;
         Ajax("api/project/list",{
            type:id
         },function(data){
             if(id=="all") {
                 var map = {};
                 data.result.forEach(function (v) {
                     map[v.id] = v;
                 });
             }
            this.setState({data:data.result});
         },this);
    },
    componentWillReceiveProps:function(nextProps){
        if(this.props.routeParam.id!=nextProps.routeParam.id){
            Ajax("api/project/list",{
                type:nextProps.routeParam.id
            },function(data){
                this.setState({data:data.result});
            },this);
        }
    },
    renderHeader:function(){
        return <div className="projectHeader">
            {this.getName()}
        </div>
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            return <div className="item" key={v.id} onClick={this.jumpToProject.bind(this,v)}>
                <div className="adder">
                    <img src={v.icon}/>
                </div>
                <div className="title">{v.name}</div>
            </div>
        },this);
    },
    render:function(){
        return <div className="Projects autoCell">
            {this.renderHeader()}
            <div className="ProjectContainer">
                {this.renderData()}
                <div className="item" onClick={this.addProject}>
                    <div className="adder">
                        <i className="icon-plus"/>
                    </div>
                    <div className="title">添加项目</div>
                </div>
            </div>
        </div>
    }
});

var Project = React.createClass({
    getInitialState:function(){
        return {
            data:[
                {text:"所有项目",icon:"coding-project",path:"all"},
                {text:"我创建的",icon:"icon-edit",path:"created"},
                {text:"我参与的",icon:"icon-umbrella",path:"joined"}
            ]
        }
    },
    render: function () {
        return <Split className="Project">
            <HelperMenu title="项目"
                        desc="按我创建和参与的项目分类"
                        data={this.state.data}>

            </HelperMenu>
            <div className="ProjectSubContainer">
                <Router>
                    <Route path="create" component={require("./CreateProject")}/>
                    <Route path=":id" component={Projects}/>
                </Router>
            </div>
        </Split>
    }
});

module.exports = Project;