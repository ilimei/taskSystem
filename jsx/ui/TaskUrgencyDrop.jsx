var DropAny=require("./DropAny");
var TaskUrgency=require("./TaskUrgency");
var TaskList=require("./Tasklist");
var React = require("react");
/***
 * React Component TaskUrgencyDrop create by ZhangLiwei at 9:24
 */
var TaskUrgencyDrop = React.createClass({
    getInitialState:function(){
        var value=this.props.value||0;
        var ok=value;
        return {
            value:value,
            data:[
                {text:<span><TaskUrgency urgency={3}/>十万火急</span>,icon:ok==3?"icon-ok":"",click:this.sel.bind(this,3)},
                {text:<span><TaskUrgency urgency={2}/>优先处理</span>,icon:ok==2?"icon-ok":"",click:this.sel.bind(this,2)},
                {text:<span><TaskUrgency urgency={1}/>正常处理</span>,icon:ok==1?"icon-ok":"",click:this.sel.bind(this,1)},
                {text:<span><TaskUrgency urgency={0}/>有空再看</span>,icon:ok==0?"icon-ok":"",click:this.sel.bind(this,0)}
            ]
        }
    },
    sel:function(v){
        this.state.data[3-this.state.value].icon="";
        this.state.data[3-v].icon="icon-ok";
        this.state.value=v;
        callAsFunc(this.props.change,[v]);
        this.forceUpdate();
    },
    getName:function(v){
        return ["有空再看","正常处理","优先处理","十万火急"][v];
    },
    renderIcon:function(){
        var v=parseInt(this.state.value);
        if(this.props.showName){
            return <span body>
                <TaskUrgency urgency={v}/>
                {this.getName(v)}
            </span>;
        }else{
            return  <TaskUrgency urgency={v} body/>
        }
    },
    render: function () {
        return <DropAny className="TaskUrgencyDrop">
            {this.renderIcon()}
            <TaskList data={this.state.data}/>
        </DropAny>
    }
});

module.exports = TaskUrgencyDrop;