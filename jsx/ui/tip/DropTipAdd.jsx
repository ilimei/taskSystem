/***
 * React Component DropTipAdd create by ZhangLiwei at 8:40
 */
var React = require("react");
var DropAny = require("../DropAny");
var TipAdd = require("./TipAdd");

var DropTipAdd = React.createClass({
    stopEvent: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    onAdd: function (tip) {
        callAsFunc(this.props.onAdd, [tip]);
        this.refs["drop"].hide();
    },
    onShow:function(){
        this.refs["dropPanel"].onShow();
    },
    render: function () {
        return <DropAny focusDrop  onShow={this.onShow} ref="drop" className="DropTipAdd add right" onClick={this.stopEvent}>
            <NativeDom np="body" body>
                <i className="icon-plus" title="添加标签"/>
            </NativeDom>
            <TipAdd ref="dropPanel" projectId={this.props.projectId} onAdd={this.onAdd}/>
        </DropAny>
    }
});

module.exports = DropTipAdd;