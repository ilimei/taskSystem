var React = require("react");

var DropIcon = React.createClass({
    getInitialState:function(){
        return {
            show:false
        }
    },
    renderIcon:function(){
        var {icon,img,text,dropdown}=this.props;
        var arr=[];
        if(icon){
            arr.push(<i key={icon} className={icon}/>);
        }else if(img){
            arr.push(<img key={img} src={img}/>)
        }
        if(text){
            arr.push(<span key={text}>{text}</span>)
        }
        if(dropdown){
            arr.push(<i key={dropdown} className="icon-angle-down" style={
                {
                    fontSize:"1.5rem",
                    marginLeft:"0.5rem"
                }
            }/>);
        }
        return arr;
    },
    renderChild:function(){
        return this.props.children;
    },
    hide:function(){
        var me=this;
        this.timerId=setTimeout(function(){
            me.setState({show:false});
        },50);
    },
    onHover:function(e){
        var me=this;
        var {focusDrop}=this.props;
        if(focusDrop) {
            setTimeout(function () {
                clearTimeout(me.timerId);
                me.setState({show: true});
            }, 51);
        }
    },
    onMouseDown:function(e){
        e.stopPropagation();
        var {focusDrop}=this.props;
        if(!focusDrop)return;
        var me=this;
        setTimeout(function(){
            clearTimeout(me.timerId);
            me.setState({show:true});
        },0);
    },
    render: function() {
        var {className,icon,img,focusDrop}=this.props;
        var cls=className?("DropIcon "+className):"DropIcon";
        if(focusDrop){
            cls+=" noHoverDrop";
        }
        var dCls=CS({
            "drop_panel":true,
            "hide":this.props.noDrop
        });
        var style={};
        if(focusDrop&&this.state.show){
            style.display="block";
        }
        return (
            <div className={cls} onMouseDown={this.onHover}>
                {this.renderIcon()}
                <div className={dCls} style={style} onBlur={this.hide} onMouseDown={this.onMouseDown} ref="panel">
                    {this.renderChild()}
                </div>
            </div>
        );
    }
});

module.exports=DropIcon;