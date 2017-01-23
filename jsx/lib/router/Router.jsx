var React = require("react");
var RouterLib=require("./RouteFuncLib");
var RedirectRoute=require("./RedirectRoute");
var {matchPath,log,rmEmptyPath}=RouterLib;
var MatchObj;


let clone = function (arr) {
    return arr.map(function(v){
        return v;
    });
}

var Router=React.createClass({
    getInitialState:function(){
        return {
            _matchPath:"",
            _routeUnMatchPath:[]
        }
    },
    childContextTypes:{
        _matchPath:React.PropTypes.string,
        _routeUnMatchPath:React.PropTypes.array
    },
    getChildContext:function(){
        return {
            _matchPath:this.state._matchPath,
            _routeUnMatchPath:this.state._routeUnMatchPath
        };
    },
    jumpTo:function(path){
        if(MatchObj.matchPath){
            history.pushState({},"",location.origin+MatchObj.matchPath+"/"+path);
        }else{
            history.pushState({},"",location.origin+path);
        }
        EventSpider.trigger("urlChange");
    },
    renderFist:function(){
        var urlPath=window.location.pathname;
        var arr=urlPath.split(/\//g);
        rmEmptyPath(arr);
        return this.renderChild(arr);
    },
    renderChild:function (arr) {
        var children=React.Children.toArray(this.props.children);
        var param={};
        var _matchPath;
        var _redirectComponent;
        var route=children.find(function(v,index){
            if(v.type == RedirectRoute){
                _redirectComponent=v;
                return false;
            }
            var p=v.props.path;
            _matchPath=matchPath(p,arr,param);
            log(v.props.component.displayName,_matchPath);
            return _matchPath;
        });
        if(!route){
            if(_redirectComponent){
                this.jumpTo(_redirectComponent.props.to);
                return <div></div>
            }
            return <div>can't get path {arr.join("/")}</div>
        }
        var {component,path,onSelect,...props}=route.props;
        MatchObj.matchPath=MatchObj.matchPath?(MatchObj.matchPath+"/"+_matchPath):_matchPath;
        props.routeParam=param;
        this.onSelect=onSelect;
        MatchObj._routeUnMatchPath=arr;
        this.state._matchPath=MatchObj.matchPath;
        this.state._routeUnMatchPath=clone(arr);
        return React.createElement(component,props);
    },
    shouldComponentUpdate:function(){
        return RouterLib.shouldUpdate;
    },
    componentDidUpdate:function(){
        if(this.firstRender){
            RouterLib.shouldUpdate=false;
        }
    },
    componentDidMount:function(){
        callAsFunc(this.onSelect);
    },
    onUrlChange:function(){
        clearTimeout(this.timerId);
        RouterLib.shouldUpdate=true;
        this.timerId=setTimeout((function(){
            this.forceUpdate();
        }).bind(this),100);
    },
    render:function(){
        RouterLib.DEBUG=this.props.DEBUG;
        if(MatchObj&&!this.firstRender){
            return this.renderChild(MatchObj._routeUnMatchPath);
        }else{
            EventSpider.on("urlChange",this.onUrlChange)
            this.firstRender=true;
            MatchObj={};
            return this.renderFist();
        }
    }
});

window.addEventListener("popstate",function(){
    EventSpider.trigger("urlChange");
});

module.exports=Router;