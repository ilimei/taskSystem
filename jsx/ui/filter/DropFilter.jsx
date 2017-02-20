/***
 * React Component DropFilter create by ZhangLiwei at 9:03
 */
var React = require("react");
var DropAny=require("../DropAny");

var DropFilter = React.createClass({
    getInitialState:function(){
        return {
            sel:-1,
            selText:"全部任务",
            data:[
                {text:"全部任务",id:-1},
                {text:"未完成",id:0},
                {text:"已完成",id:1},
                {text:"已归档",id:2},
                {text:"已关闭",id:3}
            ]
        }
    },
    handle:function(v){
        this.setState({sel:v.id,selText:v.text});
        callAsFunc(this.props.onSelect,[v.id]);
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            var cls=CS({
                "item":true,
                "active":v.id==this.state.sel
            });
            return <div key={v.id} className={cls} onClick={this.handle.bind(this,v)}>
                {v.text}
            </div>
        },this);
    },
    render: function () {
        return <DropAny className="DropFilter">
            <NativeDom Name="div" np="body" body>
                {this.state.selText}<i className="icon-caret-down"/>
            </NativeDom>
            <div className="filterGroup">
                {this.renderData()}
            </div>
        </DropAny>
    }
});

module.exports = DropFilter;