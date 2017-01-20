var _InternalPropTypes=require("./InternalPropTypes");
import React from "react";

var Route=React.createClass({
    propTypes: {
        path: _InternalPropTypes.string,
        component: _InternalPropTypes.component,
        onSelect:_InternalPropTypes.func
    },

    render:function(){
        console.error("parent must Router");
    }
});

module.exports=Route;