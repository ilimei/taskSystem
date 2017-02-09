var DropIcon=require("./DropIcon");
var Calendar=require("../libui/Calendar");
var React = require("react");
/***
 * React Component DropCalendar create by ZhangLiwei at 16:11
 */
var DropCalendar = React.createClass({
    getInitialState:function(){
        var now=new Date();
        var date=this.props.date;
        return {
            hasSelect:this.props.hasSelect||false,
            date:date>10?date:now
        }
    },
    clear:function(){
        this.setState({date:new Date(),hasSelect:false});
    },
    setDate:function(name){
        var now=new Date();
        switch (name){
            case "today":this.onSelect(now);return;
            case "tomorrow":this.onSelect(new Date(now.getTime()+86400000));return;
            case "clear":this.setState({date:now,hasSelect:false});return;
        }
    },
    onSelect:function(date){
        this.setState({date:date,hasSelect:true});
        callAsFunc(this.props.onSelect,[date]);
        this.refs["dropIcon"].hide();
    },
    onShow:function(){
        this.refs["dropPanel"].focus();
    },
    render: function () {
        var {date,hasSelect}=this.state;
        var {className}=this.props;
        var dateText=hasSelect?date.Format("yyyy年MM月dd日"):"无期限";
        return <DropIcon onShow={this.onShow} ref="dropIcon" focusDrop noDrop={this.props.noDrop} className={className+" noShadow"} text={dateText} icon="icon-calendar">
            <Calendar date={date} onSelect={this.onSelect}/>
            <div className="noOutline" tabIndex="-1" ref="dropPanel">
                <button className="btn btn-link" onClick={this.setDate.bind(this,"today")}>今天</button>
                <button className="btn btn-link" onClick={this.setDate.bind(this,"tomorrow")}>明天</button>
                <button className="btn btn-link" onClick={this.setDate.bind(this,"clear")}>清除</button>
            </div>
        </DropIcon>
    }
});

module.exports = DropCalendar;