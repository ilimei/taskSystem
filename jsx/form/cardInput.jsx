require('../reactExtend');
var Input = require('./input');

var CardInput=React.extend(Input,{
	displayName:"CardInput",
	componentWillReceiveProps:function(props){
		console.info(props);
		var obj={};
		for(var i in props){
			obj[i]=props[i];
		}
		console.info("card Input componentWillReceiveProps");
		obj.value=obj.value.replace(/.{4}(?!$)/g,function(data){
	    		return data+" ";
	    });
	    console.info(obj);
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
console.dir(CardInput);

module.exports=CardInput;