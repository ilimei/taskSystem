/***
 * React Component HelperMenu create by ZhangLiwei at 13:13
 */
var React = require("react");
var Link=require("../lib/router/Link");
var _InternalPropTypes=require("../lib/router/InternalPropTypes");

var HelperMenu = React.createClass({
    propTypes:{
        title:_InternalPropTypes.string,
        desc:_InternalPropTypes.string
    },
    getInitialState:function(){
        return {
            data:this.props.data||[
                {text:"所有任务",icon:"icon-tasks",path:"all"},
                {text:"正在进行",icon:"icon-time",path:"pending"},
                {text:"已完成的",icon:"icon-ok green",path:"done"},
                {text:"我关注的",icon:"icon-eye-open",path:"watch"},
                {text:"我创建的",icon:"icon-plus",path:"create"}
            ]
        }
    },
    renderHeader:function(){
        var {title,desc}=this.props;
        if(title||desc){
            return <div className="headerItem">
                <div className="title">{title}</div>
                <div className="desc">{desc}</div>
            </div>
        }
    },
    renderItem:function(){
        return this.state.data.map(function(v,index){
            return <Link key={index} activeClass="active" className="listItem" route={this.props.route} to={v.path}>
                <i className={v.icon}/><span>{v.text}</span>
            </Link>
        },this);
    },
    renderChildren:function(){
        return React.Children.map(this.props.children,function(v,index){
            return <div className="lineTop">
                {v}
            </div>
        });
    },
    render: function () {
        return <div className="HelperMenu">
            {this.renderHeader()}
            {this.renderItem()}
            {this.renderChildren()}
        </div>
    }
});

module.exports = HelperMenu;