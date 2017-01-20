var Label = require("./label");
var React = require("react");

var TextArea = React.createClass({
    propTypes:{
        height:React.PropTypes.number,
        autoHeight:React.PropTypes.bool,
        maxHeight:React.PropTypes.number,
        minHeight:React.PropTypes.number,
        readOnly:React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            value: this.props.value || ""
        }
    },
    handle: function (name, e) {
        if (this.props.readOnly) {
            return;
        }
        if (name == "change") {
            var value=e.target.value;
            var {textArea}=this.refs;
            callAsFunc(this.props.change, [value]);
            textArea.value=value;
            this.state.value=value;
            if(this.props.autoHeight){
                textArea.style.height=textArea.scrollHeight+"px";
            }
        }
    },
    componentWillReceiveProps: function (props) {
        if(props.value!=this.state.value) {
            this.setState(props);
        }
    },
    render: function () {
        var style = {height: this.props.height};
        if(this.props.minHeight){
            style.minHeight=this.props.minHeight;
        }
        if(this.props.maxHeight){
            style.maxHeight=this.props.maxHeight;
        }
        return <Label style={this.props.style}
                      name={this.props.name}
                      small={this.props.small}>
			<textarea ref="textArea"
                      style={style}
                      value={this.state.value}
                      onKeyDown={this.props.onKeyDown}
                      onChange={this.handle.bind(this, "change")}
                      className="form-control MTextArea"
                      placeholder={this.props.holder}/>
        </Label>
    }
});

module.exports = TextArea;