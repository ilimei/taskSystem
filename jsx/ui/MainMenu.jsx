var React = require("react");
var Link=require("../lib/router/Link");
var _InternalPropTypes=require("../lib/router/InternalPropTypes");
/***
 * React Component MainMenu create by ZhangLiwei at 11:17
 */
var MainMenu = React.createClass({
    propTypes:{
        route:_InternalPropTypes.object,
        data:_InternalPropTypes.array
    },
    getInitialState:function(){
        return {
            data:this.props.data||[
                {text:"项目",icon:"coding-project",path:"project"},
                {text:"任务",icon:"icon-tasks",path:"tasks"}
            ]
        }
    },
    renderItem:function(){
        return this.state.data.map(function(v,index){
            return <Link key={index} className="Item" to={v.path} activeClass="active">
                <div className="icon"><i className={v.icon}/></div>
                <div className="text">{v.text}</div>
            </Link>
        },this);
    },
    render: function () {
        return <div className="MainMenu">
            {this.renderItem()}
        </div>
    }
});

module.exports = MainMenu;