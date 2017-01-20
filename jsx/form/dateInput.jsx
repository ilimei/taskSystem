var Calendar=require("../calendar/calendar");
var Label=require("./label");
var Input=React.createClass({
	getInitialState:function(){
		return {
			date:this.props.date||new Date(),
			formatter:this.props.formatter||"yyyy-MM-dd"
		}
	},
	handle:function(name,e){
		if(name=="change"){
			callAsFunc(this.props.change,[e.target.value]);
			this.setState({value:e.target.value});
		}
	},
	onSelect:function(date){
		this.setState({date:date});
		this.hideCalendar();
		callAsFunc(this.props.change,[date]);
	},
	componentWillReceiveProps:function(props){
		this.setState(props);
	},
	hideCalendar:function(){
		var Calendar=this.refs["calendar"];
		// setTimeout(function(){
			Calendar.setState({show:false});
		// },500);
	},
	showCalendar:function(){
		var Dom=this.refs["groupDom"];
		var Calendar=this.refs["calendar"];
		Calendar.setState({top:Dom.offsetHeight+2,show:true});
	},
	render:function(){
		return <Label 
		style={this.props.style}
		name={this.props.name}
		small={this.props.small}>
			<div className="icon_input">
				<input type="text" className="form-control"
				ref="groupDom"
				onBlur={this.hideCalendar}
				onClick={this.showCalendar}
				value={this.state.date.Format(this.state.formatter)} placeholder={this.props.holder}/>
				<i className="icon icon-calendar"/>
				<Calendar ref="calendar" date={this.state.date} show={false} onSelect={this.onSelect}/>
			</div>
		</Label>
	}
});
module.exports=Input;