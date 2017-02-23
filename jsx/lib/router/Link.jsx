var _InternalPropTypes=require("./InternalPropTypes");
var React = require("react");
var RouterLib=require("./RouteFuncLib");
var {matchPath,log}=RouterLib;
var title="";
var cache={
    state:{}
}

var oneOfType=React.PropTypes.oneOfType;

var Link=React.createClass({
    propTypes: {
        to: oneOfType([_InternalPropTypes.string,React.PropTypes.number]),
        param:_InternalPropTypes.object,
        activeClass:_InternalPropTypes.string
    },
    contextTypes:{
        _matchPath:React.PropTypes.string,
        _routeUnMatchPath:React.PropTypes.array
    },
    shouldComponentUpdate(){
        return RouterLib.shouldUpdate;
    },
    jumpTo:function(){
        history.pushState(cache.state, title,"/"+this.context._matchPath+"/"+this.props.to);
        EventSpider.trigger("urlChange");
    },
    render:function(){
        RouterLib.DEBUG=this.props.DEBUG;
        var {activeClass,to,className,DEBUG,...props}=this.props;
        var obj={};
        if(activeClass){
            obj[activeClass]=matchPath(to,this.context._routeUnMatchPath,{});
        }
        var cls=CS(obj,className);
        return <a {...props} onClick={this.jumpTo} className={cls}>{this.props.children}</a>
    }
});

module.exports=Link;