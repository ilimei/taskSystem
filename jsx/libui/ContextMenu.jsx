/***
 * React Component ContextMenu create by ZhangLiwei at 15:30
 */
var React = require("react");

var ContextMenu = React.createClass({
    getInitialState:function(){
        return {
            show:false,
            data:[],
            top:0,
            left:0
        }
    },
    show:function(e,data){
        e.stopPropagation();
        e.preventDefault();
        this.setState({show:true,left:e.pageX,top:e.pageY,data:data});
        this.refs["rootDom"].focus();
    },
    handleBlur:function(){
        this.setState({show:false});
    },
    onClick:function(v,e){
        callAsFunc(v.click,[e]);
        this.setState({show:false});
    },
    renderItems:function(items){
        return items.map((v,index)=>{
            return <div className="item" key={index} onClick={this.onClick.bind(this,v)}>
                <span className="icon"><i className={v.icon}/></span>
                <span className="text">{v.text}</span>
            </div>
        });
    },
    renderItem:function(){
        return this.state.data.map((v,index)=>{
            var children=undefined;
            if(v.child){
                children=<div className="children">
                    {this.renderItems(v.child)}
                </div>
            }
            return <div className="item" key={index} onClick={this.onClick.bind(this,v)}>
                <span className="icon"><i className={v.icon}/></span>
                <span className="text">{v.text}</span>
                {children}
            </div>
        },this);
    },
    fixTargetPosition(target){
        var {offsetWidth,offsetHeight,offsetLeft,offsetTop}=target;
        var fix=false,fixLeft=offsetLeft,fixTop=offsetTop;
        if(fixLeft+offsetWidth>ClientWidth){
            fix=true;
            fixLeft=fixLeft-offsetWidth;
        }
        if(fixTop+offsetHeight>ClientHeight){
            fix=true;
            fixTop=fixTop-offsetHeight;
        }
        if(fix) {
            target.style.left = fixLeft + "px";
            target.style.top = fixTop + "px";
        }
    },
    componentDidUpdate:function(){
        if(this.state.show){
            var target=this.refs["menu"];
            this.fixTargetPosition(target);
        }
    },
    renderContextMenu(){
        if(this.state.show){
            var {left,top}=this.state;
            return <div className="ContextMenu" ref="menu" style={{
                left:left,
                top:top
            }}>
                {this.renderItem()}
            </div>
        }
    },
    render: function () {
        return <div tabIndex="-1" ref="rootDom" onBlur={this.handleBlur}>
            {this.renderContextMenu()}
        </div>
    }
});

module.exports = ContextMenu;