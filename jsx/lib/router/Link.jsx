var _InternalPropTypes=require("./InternalPropTypes");
var React = require("react");
var RouterLib=require("./RouteFuncLib");
var {matchPath,log}=RouterLib;
var title="";
var state={};

var Link=React.createClass({
    propTypes: {
        to: _InternalPropTypes.string,
        route:_InternalPropTypes.object,
        param:_InternalPropTypes.object,
        activeClass:_InternalPropTypes.string
    },
    shouldComponentUpdate(){
        return RouterLib.shouldUpdate;
    },
    jumpTo:function(){
        history.pushState(state, title,"/"+this.props.route._matchPath+"/"+this.props.to);
        EventSpider.trigger("urlChange");
    },
    render:function(){
        RouterLib.DEBUG=this.props.DEBUG;
        var cls=null;
        var {activeClass,route,to,className,DEBUG,...props}=this.props;
        if(activeClass){
            var obj={};
            obj[activeClass]=matchPath(to,route._routeUnMatchPath,{});
            cls=CS(obj);
        }
        if(className){
            cls+=" "+className;
        }
        return <a {...props} onClick={this.jumpTo} className={cls}>{this.props.children}</a>
    }
});

module.exports=Link;