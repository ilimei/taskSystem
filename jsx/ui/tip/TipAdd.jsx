/***
 * React Component TipAdd create by ZhangLiwei at 22:03
 */
var React = require("react");

var TipAdd = React.createClass({
    propTypes:{
        onAdd:React.PropTypes.func
    },
    getInitialState:function(){
        return {
            index:0,
            selColor:"rgb(27, 28, 29)",
            colors:[
                "rgb(27, 28, 29)","rgb(242, 198, 31)","rgb(91, 189, 114)","rgb(59, 131, 192)","rgb(224, 123, 83)","rgb(86, 79, 138)","rgb(217, 92, 92)","rgb(0, 181, 173)",
                "rgb(186, 186, 187)","rgb(251, 238, 187)","rgb(205, 235, 212)","rgb(196, 218, 236)","rgb(246, 215, 203)","rgb(204, 202, 220)","rgb(244, 206, 206)","rgb(178, 233, 230)"
            ]
        }
    },
    selectColor:function(color,index){
        this.setState({selColor:color,index:index});
    },
    stopEvent:function(e){
        e.stopPropagation();
        e.preventDefault();
    },
    renderColor:function(){
        return this.state.colors.map((v,index)=>{
            var border="1px solid "+(this.state.index==index?"#fff":v);
            return  <span className="colors" key={index}
                          style={{background:v,border:border}}
                          onClick={this.selectColor.bind(this,v,index)}/>
        },this);
    },
    onShow:function(){
        this.refs["input"].focus();
    },
    onKeyDown:function(e){
        if(e.keyCode==13) {
            var target=e.target;
            var value = target.value.replace(/^\s*|\s*$/g, "");
            if (value) {
                var tip={
                    projectId: this.props.projectId,
                    color: this.state.selColor,
                    name: value
                };
                Ajax("api/tip/add",tip, function (data) {
                    if (data.success) {
                        target.value="";
                        tip.id=data.data.insertId;
                        callAsFunc(this.props.onAdd, [tip]);
                    }
                }, this)
            }
        }
    },
    render: function () {
        return <div className="TipAdd" onMouseDown={this.stopEvent}>
            <div className="wrapper">
                <input placeholder="按回车新增标签" onKeyDown={this.onKeyDown} ref="input"/>
                <span className="colorBlock" style={{
                    background: this.state.selColor
                }}/>
            </div>
            <div className="colorSelector">
                {this.renderColor()}
            </div>
        </div>
    }
});

module.exports = TipAdd;