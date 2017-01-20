var Router=require("../lib/router/Router");
var Route=require("../lib/router/Route");
var Link=require("../lib/router/Link");
var Split=require("../ui/Split");
var MainMenu=require("../ui/MainMenu");
var HelperMenu=require("../ui/HelperMenu");
var Toolbar=require("../ui/Toolbar");
var Tasks=require("./user/Task");
var UserSet=require("./user/UserSet");
var store=require("../lib/store");
/***
 * React Component User create by ZhangLiwei at 16:35
 */
var Project=require("./user/Project");

var User = React.createClass({
    getInitialState:function(){
        return {
            data:[
                {text:"项目",icon:"coding-project",path:"project",component:Project},
                {text:"任务",icon:"icon-tasks",path:"tasks",component:Tasks},
                {text:"账户",icon:"icon-user",path:"setting",component:UserSet}
            ]
        }
    },
    renderRoute:function(){
        return this.state.data.map(function(v,index){
            return <Route key={v.path} path={v.path} component={v.component}/>
        });
    },
    doUpdate:function(){
        this.forceUpdate();
    },
    componentDidMount:function(){
        this.unFunc=store.on("loginUser",this.doUpdate);
    },
    componentWillUnmount:function(){
        store.un(this.unFunc);
    },
    render: function () {
        var {routeParam}=this.props;
        var usr=store.get("loginUser");
        var name=usr?usr.nick_name:"";
        return <Split className="User" vertical>
            <Toolbar>
                {name}
            </Toolbar>
            <Split>
                <MainMenu route={this.props.route} data={this.state.data}/>
                <Router>
                    {this.renderRoute()}
                </Router>
            </Split>
        </Split>
    }
});

module.exports = User;