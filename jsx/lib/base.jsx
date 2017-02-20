var React = require("react");
var ReactDOM = require("react-dom");
var Loader=require("../libui/Loader");
require("./reactExtend");
require("./stores/cacheAjax");
var ContextMenu=require("../libui/ContextMenu");
import Confirm from "../libui/Confirm";

var Main = React.createClass({
    displayName: 'Main',
    getInitialState:function() {
        return {
            child:[]
        };
    },
    showModal:function(modal,sel){
        if(sel){
            ReactDOM.render(modal,this.refs["modalContainer2"]).setState({onHide:this.onHide.bind(this,true)});
        }else{
            ReactDOM.render(modal,modalContainer).setState({onHide:this.onHide});
        }
    },
    onHide:function(sel){
        if(sel){
            ReactDOM.render(<i/>,this.refs["modalContainer2"]);
        }else{
            ReactDOM.render(<i/>,modalContainer);
        }
    },
    confirm:function(content,onOk){
        showModal(<Confirm onOk={onOk} content={content}/>);
    },
    componentDidMount:function() {
        document.cookie="token";
        window.loader=this.refs["loader"];
        window.modalContainer=this.refs["modalContainer"];
        window.showModal=this.showModal;
        window.showContextMenu=this.refs["contextMenu"].show;
        window.Confirm=this.confirm;
    },
    render:function() {
        return (
            <div className="fullHeight">
                {this.state.child}
                <Loader ref="loader"></Loader>
                <div ref="modalContainer"></div>
                <div ref="modalContainer2"></div>
                <ContextMenu ref="contextMenu"/>
            </div>
        );
    }
});

module.exports = Main;
window.ClientHeight=document.documentElement.clientHeight;
window.ClientWidth=document.documentElement.clientWidth;
window.addEventListener("resize",function () {
    window.ClientHeight=document.documentElement.clientHeight;
    window.ClientWidth=document.documentElement.clientWidth;
});