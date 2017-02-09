var React = require("react");
/***
 * React Component TaskUrgency create by ZhangLiwei at 23:23
 */
var TaskUrgency = React.createClass({
    propTypes:{
        urgency:React.PropTypes.number
    },
    getInitialState:function(){
        return {
            data:new Array(3).fill(0)
        }
    },
    renderUrgency:function(){
        var urgency=this.props.urgency||0;
        return this.state.data.map(function(v,index){
            var cls=CS({
                "coding-exclamation active":index<urgency,
                "coding-exclamation_line":index>=urgency
             });
            return <i key={index} className={cls}/>;
        },this);
    },
    render: function () {
        return <span className="TaskUrgency" alt={this.props.alt} title={this.props.title}>
                {this.renderUrgency()}
        </span>
    }
});

module.exports = TaskUrgency;