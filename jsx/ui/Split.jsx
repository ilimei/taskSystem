/***
 * React Component Split create by ZhangLiwei at 11:11
 */
var _InternalPropTypes=require("../lib/router/InternalPropTypes");
var React = require("react");
var Split = React.createClass({
    propTypes:{
        vertical:_InternalPropTypes.boolean
    },
    render: function () {
        var {vertical,className,...props}=this.props;
        var cls=CS({
            "Split":true,
            "vertical":vertical
        });
        if(className){
            cls+=" "+className;
        }
        return <div className={cls} {...props}>
            {this.props.children}
        </div>
    }
});

module.exports = Split;