var React = require("react");
var _InternalPropTypes=require("./InternalPropTypes");

var RedirectRoute=React.createClass({
    propTypes: {
        to: _InternalPropTypes.string
    },
    render:function(){
        console.error("RedirectRoute parent must be Router")
    }
});

module.exports=RedirectRoute;