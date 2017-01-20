var React = require("react");

var TaskList = React.createClass({
    propTypes:{
        data:React.PropTypes.array
    },
    getInitialState:function(){
        return {
            data:this.props.data||[
                {"text":"任务",icon:"icon-cloud-download",href:"http://www.baidu.com"},
                {"text":"任务",icon:" icon-user-md",href:"http://www.baidu.com"},
                {"text":"任务",icon:" icon-angle-left",href:"http://www.baidu.com"},
                {"text":"任务",icon:" icon-angle-right",href:"http://www.baidu.com"},
                {"text":"任务",icon:" icon-angle-up",href:"http://www.baidu.com"},
                {"text":"任务",icon:" icon-angle-down",href:"http://www.baidu.com"}
            ]
        }
    },
    jumpToUrl:function(v,e){
        if(v.click){
            callAsFunc(v.click);
            return;
        }
        if(this.select){
            this.select.active=false;
        }
        this.select=v;
        v.active=true;
        this.forceUpdate();//通知组件更新
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            // var cls="task-item"
            // if(v.active){
            // 	cls=cls+" active";
            // }
            var cls=CS({
                "task-item":true,
                "active":v.active
            });
            return <div key={index} onClick={this.jumpToUrl.bind(this,v)} className={cls}>
                <i className={v.icon}/>{v.text}</div>
        },this);
    },
    render: function() {
        return (
            <div className="TaskList">
                {this.renderData()}
            </div>
        );
    }
});

module.exports=TaskList;