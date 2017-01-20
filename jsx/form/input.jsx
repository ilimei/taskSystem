var Label = require("./label");
var React = require("react");
var BaseInput=require("./BaseInput");

var Input = React.extend(BaseInput,{
    propTypes:{
        notNull:React.PropTypes.bool,
        maxLength:React.PropTypes.number,
        checks:React.PropTypes.array,
        register:React.PropTypes.func,
        value:React.PropTypes.string,
        small:React.PropTypes.string,
        type:React.PropTypes.string,
        holder:React.PropTypes.string
    },
    getInitialState: function () {
        return {
            value: this.props.value || "",
            error: false,
            errorMsg: false
        }
    },
    handle: function (name, e) {
        if (this.props.readOnly) {
            return;
        }
        if (name == "change") {
            this.state.value = e.target.value;
            callAsFunc(this.props.change, [e.target.value]);
            this.check();
            this.setState({value: e.target.value});
        }
    },
    componentWillReceiveProps: function (props) {
        if(props.value!=this.state.value) {
            this.setState(props);
        }
    },
    render: function () {
        var cls=CS({
            "form-control": true,
            "form-control-sm": this.props.sm
        });
        return <Label style={this.props.style}
                      name={this.props.name}
                      small={this.state.errorMsg || this.props.small} error={this.state.error}>
            <input type={this.props.type || "text"} maxLength={this.props.maxLength}
                   value={this.state.value}
                   onKeyDown={this.props.onKeyDown}
                   onBlur={this.check}
                   onChange={this.handle.bind(this, "change")}
                   className={cls}
                   placeholder={this.props.holder}/>
        </Label>
    }
});
module.exports = Input;