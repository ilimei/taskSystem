/***
 * React Component ResizeBox create by ZhangLiwei at 10:22
 */
var React = require("react");
var Mover=require("./mover");
var ReactDOM = require("react-dom");

var ResizeBox = React.createClass({
    propTypes:{
        width:React.PropTypes.number,
        maxWidth:React.PropTypes.number
    },
    getInitialState:function(){
        return {
            width:this.props.width||-1,
            height:-1
        }
    },
    onDragPos:function(dx,dy){
        this.setState({width:this.width+dx});
    },
    onDragEnd:function(){

    },
    onMouseDown:function(e){
        e.stopPropagation();
        e.preventDefault();
        var target=ReactDOM.findDOMNode(this);
        this.width=target.offsetWidth;
        Mover(e.pageX,e.pageY,0,0,this.onDragPos,this.onDragEnd);
    },
    render: function () {
        var cls=CS({},"ResizeBox",this.props.className);
        var style={};
        var {width,maxWidth,...leftProp}=this.props;
        if(this.props.width!=-1){
            style.width=this.state.width;
            style.minWidth=width;
        }
        if(maxWidth){
            style.maxWidth=maxWidth;
        }
        return <div className="ResizeBox" style={style}>
            <div {...leftProp}>{this.props.children}</div>
            <div className="resizeNWHelper" onMouseDown={this.onMouseDown}></div>
        </div>
    }
});

module.exports = ResizeBox;