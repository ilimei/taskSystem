var Router=require("../lib/router/Router");
var React = require("react");
var Route=require("../lib/router/Route");
var Link=require("../lib/router/Link");
var Split=require("../ui/Split");
var MainMenu=require("../ui/MainMenu");
var HelperMenu=require("../ui/HelperMenu");
var Toolbar=require("../ui/Toolbar");
var Tasks=require("./user/Task");
var UserSet=require("./user/UserSet");
/***
 * React Component User create by ZhangLiwei at 16:35
 */
var Project=require("./user/Project");

var User = React.createClass({
    getInitialState:function(){
        return {
            usr:{},
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
    doUpdate:function(usr){
        this.setState({usr:usr});
    },
    componentDidMount:function(){
        cacheAjax("api/user/getLoginInfo",{},this.doUpdate);
    },
    render: function () {
        var {routeParam}=this.props;
        var {usr}=this.state;
        var name=usr?usr.nick_name:"";
        return <Split className="User" vertical>
            <Toolbar>
                {name}
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

module.exports = User;