var React = require("react");
var DropAny=require("./DropAny");
var TextArea=require("../form/textarea");
/***
 * React Component InputGroup create by ZhangLiwei at 8:00
 */
var InputGroup = React.createClass({
    getInitialState:function(){
        return {
            value:this.props.value||""
        }
    },
    clear:function(){
        this.setState({value:""});
    },
    handle:function(e){
        var v=e.target.value;
        callAsFunc(this.props.change,[v,e]);
        this.setState({value:v});
    },
    hideDrop:function(){
        this.refs["dropAny"].hide();
    },
    renderCenter:function(re,props){
        if(re.dropper){
            return <DropAny className="groupCenter" focusDrop ref="dropAny">
                <input {...props} onChange={this.handle} onBlur={this.hideDrop} value={this.state.value} body/>
                {re.dropper[0]}
            </DropAny>
        }else{
            return  <input {...props} onChange={this.handle} className="groupCenter" value={this.state.value}/>
        }
    },
    render: function () {
        var {children,value,change,onChange,...props}=this.props;
        var re=CTA(children,["foot","dropper"])
        return <div className="InputGroup">
            <div className="header">
                {re.default}
            </div>
            {this.renderCenter(re,props)}
            <div className="footer">
                {re.foot}
            </div>
        </div>
    }
});

module.exports = InputGroup;