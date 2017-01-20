var React = require("react");
var ReactDOM = require("react-dom");
var Loader=require("../libui/Loader");
require("./reactExtend");

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
    componentDidMount:function() {
        document.cookie="token";
        window.loader=this.refs["loader"];
        window.modalContainer=this.refs["modalContainer"];
        window.showModal=this.showModal;
    },
    render:function() {
        return (
            <div className="fullHeight">
                {this.state.child}
                <Loader ref="loader"></Loader>
                <div ref="modalContainer"></div>
                <div ref="modalContainer2"></div>
            </div>
        );
    }
});

module.exports = Main;