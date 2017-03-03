var React = require("react");

var TaskList = React.createClass({
    getDefaultProps(){
        return {
            textField:"text",
            iconField:"icon"
        }
    },
    propTypes:{
        data:React.PropTypes.array,
        textField:React.PropTypes.string,
        iconField:React.PropTypes.string,
        onClick:React.PropTypes.func
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
        if(this.props.onClick){
            callAsFunc(this.props.onClick,[v]);
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
        var {textField,iconField}=this.props;
        return this.props.data.map(function(v,index){
            // var cls="task-item"
            // if(v.active){
            // 	cls=cls+" active";
            // }
            var cls=CS({
                "task-item":true,
                "active":v.active
            });
            return <div key={index} onClick={this.jumpToUrl.bind(this,v)} className={cls}>
                {v[iconField]&&<i className={v[iconField]}/>}{v[textField]}</div>
        },this);
    },
    render: function() {
        return (
            <div className="TaskList">
                {this.renderData()}
                {this.props.children}
            </div>
        );
    }
});

module.exports=TaskList;