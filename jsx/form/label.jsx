var React = require("react");

var Label=React.createClass({
	propTypes:{
        className:React.PropTypes.string,
        style:React.PropTypes.object,
        name:React.PropTypes.string,
        small:React.PropTypes.string
    },
    renderLabel:function(){
        if(this.props.name){
            return <label>{this.props.name}</label>
        }
    },
    renderSmall:function(){
        if(this.props.small){
            return <small className="text-muted">{this.props.small}</small>
        }
    },
	render:function(){
		if(this.props.error){
			cls+=" has-error";
		}
		var cls="form-group "+CS({
		    "has-error":this.props.error
		});
		if(this.props.className){
		    cls+=" "+className;
        }
		return <fieldset className={cls} style={this.props.style}>
            {this.renderLabel()}
		    {this.props.children}
            {this.renderSmall()}
		</fieldset>
	}
});
module.exports=Label;