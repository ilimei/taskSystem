require('../reactExtend');
var Input = require('./input');

var CardInput=React.extend(Input,{
	displayName:"CardInput",
	componentWillReceiveProps:function(props){
		var obj={};
		for(var i in props){
			obj[i]=props[i];
		}
		obj.value=obj.value.replace(/.{4}(?!$)/g,function(data){
	    	return data+" ";
	    });
		this.Super.componentWillReceiveProps.call(this,obj);
	},
	handle:function(name,e){
		if(this.props.readOnly){
			return;
		}
		if(name=="change"){
			var value=e.target.value;
			value=value.replace(/\s+/g,"").replace(/.{4}(?!$)/g,function(data){
	    		return data+" ";
	    	});
			callAsFunc(this.props.change,[value.replace(/\s+/g,"")]);
			this.setState({value:value});
		}
	}
});

module.exports=CardInput;