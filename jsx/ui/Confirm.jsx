var Modal=require("../form/modal");
var React = require("react");

var Confirm = React.createClass({
    getInitialState:function(){
        return {
            title:this.props.title||"系统提示",
            text:this.props.content||"",
            onHide:null
        }
    },
    onOk:function(){
        callAsFunc(this.props.onOk);
        this.refs["modal"].hide();
    },
    onCancel:function(){
        this.refs["modal"].hide();
    },
    render: function() {
        return (
            <Modal ref="modal" sm onHide={this.state.onHide} title={this.state.title||"系统提示"}>
                <div>{this.state.text}</div>
                <button btn onClick={this.onOk} className="btn btn-small btn-primary">确定</button>
                <button btn onClick={this.onCancel} className="btn btn-small btn-warning">取消</button>
            </Modal>
        );
    }
});

window.confirm=function(content,onOk,title){
    showModal(<Confirm title={title} onOk={onOk} content={content}/>);
}

module.exports=Confirm;