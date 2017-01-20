var React = require("react");
/***
 * React Component Calendar create by ZhangLiwei at 20:09
 */
var Calendar = React.createClass({
    getInitialState:function(){
        var date=this.props.date||new Date();
        if(typeof  date=="string"||typeof date=="number"){
            date=new Date(date);
        }
        return {
            showDate:new Date(date.getFullYear(),date.getMonth(),date.getDate()),
            currDate:new Date(date.getFullYear(),date.getMonth(),date.getDate()),
            weeks:["日","一","二","三","四","五","六"]
        }
    },
    componentWillReceiveProps:function(nextProp){
        var date=nextProp.date||new Date();
        if(typeof  date=="string"||typeof date=="number"){
            date=new Date(date);
        }
        this.setState( {
            showDate:new Date(date.getFullYear(),date.getMonth(),date.getDate()),
            currDate:new Date(date.getFullYear(),date.getMonth(),date.getDate())
        })
    },
    renderWeek:function(){
        return this.state.weeks.map(function(v){
            return <span className="week" key={v}>{v}</span>
        });
    },
    selDate:function(v){
        callAsFunc(this.props.onSelect,[v]);
        this.setState({currDate:v,showDate:v});
    },
    prevMonth:function(){
        var currDate=this.state.showDate;
        this.setState({showDate:new Date(currDate.getFullYear(),currDate.getMonth()-1,currDate.getDate())});
    },
    nextMonth:function(){
        var currDate=this.state.showDate;
        this.setState({showDate:new Date(currDate.getFullYear(),currDate.getMonth()+1,currDate.getDate())});
    },
    renderDate:function(){
        var year=this.state.showDate.getFullYear();
        var month=this.state.showDate.getMonth();
        var firstDay=new Date(year,month,1);
        var lastDay=new Date(year,month+1,0);
        var startWeek=firstDay.getDay();
        var endWeek=lastDay.getDay();
        var totalShow=lastDay.getDate()+startWeek+(6-endWeek);
        return new Array(totalShow).fill(0).map(function(v,index){
            return new Date(year,month,1+index-startWeek);
        }).map(function(v,index){
            var cls=CS({
                "day":true,
                "select":v.getTime()==this.state.currDate.getTime(),
                "prev":v.getTime()<firstDay.getTime(),
                "next":v.getTime()>lastDay.getTime()
            });
            return <span key={v.getTime()} className={cls} onClick={this.selDate.bind(this,v)}>{v.getDate()}</span>;
        },this);
    },
    renderHeader:function(){
        return <div className="header">
            <i className="icon-chevron-left" onClick={this.prevMonth}/>
            <span className="yearMonth">{this.state.showDate.Format("yyyy-MM")}</span>
            <i className="icon-chevron-right" onClick={this.nextMonth}/>
        </div>
    },
    render: function () {
        return <div className="Calendar noSelect">
            {this.renderHeader()}
            {this.renderWeek()}
            {this.renderDate()}
        </div>
    }
});

module.exports = Calendar;