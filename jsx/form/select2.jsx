var Label = require('./label');

var Select2 = React.createClass({
	getInitialState:function() {
	    return {
	        inputValue:"",
	        value:this.props.value||null,
	        style:{},
	        show:false,
	        searchText:"",
	        textField:this.props.textField||"text",
	        valueField:this.props.valueField||"value"
	    };
	},
	handle:function(){

	},
	changeSearch:function(e){
		this.setState({searchText:e.target.value});
	},	
	showPanel:function(e){
		e.stopPropagation();
		e.preventDefault();
		var dom=this.refs["valueInput"];
		var top=GetElCoordinate(dom).top;
		if(document.documentElement.clientHeight-top < 240){
			this.setState({style:{bottom:dom.offsetHeight},show:true});
		}else{
			this.setState({style:{top:dom.offsetHeight-2},show:true});
		}
	},
	componentDidUpdate:function(prevProps, prevState) {
		if(this.state.show)
	    	this.refs["searchbox"].focus();  
	},
	hidePanel:function(e){
		this.setState({show:false,searchText:""});
	},
	stopDefault:function(e){
		e.preventDefault();
	},
	select:function(v){
		var textField=this.state.textField;
	    var valueField=this.state.valueField;
	    var text=v[textField];
	    if(typeof this.props.formatter=="function"){
	    	text=this.props.formatter(v);
	    }
		callAsFunc(this.props.onSelect,[v[valueField],v]);
		callAsFunc(this.props.change,[v[valueField],v]);
		this.setState({value:v[valueField],inputValue:text,show:false,searchText:""});
	},
	getItems:function(){
		var me=this;
		var searchText=this.state.searchText;
		var textField=this.state.textField;
	    var valueField=this.state.valueField;
	    if(typeof this.props.getItems=="function"){
	    	return this.props.getItems(searchText,textField,function(v){
	    		return me.select.bind(me,v);
	    	},me.stopDefault);
	    }
	    var index=0;
		var obj=this.props.data.map(function(v){
			var text=v[textField];
			if(typeof me.props.formatter=="function"){
	    		text=me.props.formatter(v);
	    	}
			if(text.indexOf(searchText)>=0){
				index++;
				return <div onMouseDown={me.stopDefault} 
				onClick={me.select.bind(me,v)}
				className="item">{text}</div>
			}
			return null;
		});
		if(index){
			return <div className="listpanel">{obj}{this.getBtns()}</div>
		}else{
			return <div className="info">没有找到符合条件的结果</div>
		}
	},
	getInputIcon:function(){
		if(this.state.value){
			return <i onClick={this.clear} className="icon  icon-remove"/>
		}else{
			return <i className="icon  icon-caret-down"/>
		}
	},
	clear:function(){
		callAsFunc(this.props.onSelect,[null,null]);
		callAsFunc(this.props.change,[null,null]);
		this.setState({value:null,inputValue:""});
	},
	findValue:function(){
		var textField=this.state.textField;
	    var valueField=this.state.valueField;
	    var value=this.state.value;
	    var me=this;
		if(value){
			this.props.data.map(function(v){
				if(v[valueField]==value){
					var text=v[textField];
				    if(typeof me.props.formatter=="function"){
				    	text=me.props.formatter(v);
				    }
					me.state.inputValue=text;
				}
			});
		}
	},
	getBtns:function(){
		var arr=React.Children.toArray(this.props.children);
		return arr;
	},
	render:function() {
		this.findValue();
		this.state.style["display"]=this.state.show?"block":"none";
		return <Label  style={this.props.style}
			name={this.props.name}
			small={this.props.small}>
			<div className="select2">
				<div className="icon_input">
					<input ref="valueInput" type="text" 
						onMouseDown={this.showPanel}
						value={this.state.inputValue} 
						className="form-control"
						placeholder={this.props.holder}/>
					{this.getInputIcon()}
				</div>
				<div className="droppanel pd4" 
					style={this.state.style}>
					<input ref="searchbox"
					value={this.state.searchText}
					onChange={this.changeSearch} 
					onBlur={this.hidePanel} className="form-control"/>
					{this.getItems()}
				</div>
			</div>
		</Label>
	}
});

module.exports = Select2;