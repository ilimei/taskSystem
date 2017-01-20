var React = require("react");

var PageNation = React.createClass({
    propTypes:{
        total:React.PropTypes.number,
        page:React.PropTypes.number,
        rows:React.PropTypes.number,
        onSelect:React.PropTypes.func
    },
    getInitialState:function(){
        var total=parseInt(this.props.total)||0,
             rows=parseInt(this.props.rows)||10,
             page=parseInt(this.props.page)||1;
        return {
            total:total,
            current:page,
            rows:rows,
            max:Math.ceil(total/rows)
        }
    },
    componentWillReceiveProps:function(props){
        var total=parseInt(props.total)||0,
             rows=parseInt(props.rows)||10,
             page=parseInt(props.page)||1;
        this.setState({
            total:total,
            current:page,
            rows:rows,
            max:Math.ceil(total/rows)
        });
    },
    select:function(index,e){
        if(index < 1||index > this.state.max)return;
        if(index==this.state.current)return;
        callAsFunc(this.props.onSelect,[index,e]);
    },
    getPages:function(){
        var {current,max}=this.state;
        var arr=[<li key={current} className="active">
            <a>{current}<span className="sr-only"></span></a>
        </li>];
        var lastPre;
        for(var i=1;i< 3 ;i++){
            lastPre=current-i;
            if(current-i < 1){
                break;
            }else{
                arr.unshift(<li key={current-i}>
                    <a onClick={this.select.bind(this,current-i)}>{current-i}<span className="sr-only"></span></a>
                </li>);
            }
        }
        for(var i=1;i< 10 && arr.length < 5;i++){
            if(current+i>max){
                break;
            }else{
                arr.push(<li key={current+i}>
                    <a onClick={this.select.bind(this,current+i)}>{current+i}<span className="sr-only"></span></a>
                </li>);
            }
        }
        while(arr.length< 5){
            lastPre--;
            if(lastPre< 1){
                break;
            }else{
                arr.unshift(<li key={lastPre}>
                    <a onClick={this.select.bind(this,lastPre)}>{lastPre}<span className="sr-only"></span></a>
                </li>);
            }
        }
        return arr;
    },
    render:function() {
        var {current,max}=this.state;
        return (
            <ul className="pagination pagination-sm" style={{margin: 0, verticalAlign: "middle"}}>
                <li className={CS({"disabled":current==1})}>
                    <a  onClick={this.select.bind(this,1)}>
                        <span>首页</span>
                        <span className="sr-only"></span>
                    </a>
                </li>
                <li className={CS({"disabled":this.state.current==1})}>
                    <a onClick={this.select.bind(this,this.state.current-1)}>
                        <span>上一页</span>
                        <span className="sr-only"></span>
                    </a>
                </li>
                {this.getPages()}
                <li className={CS({"disabled":current==max||max==0})}>
                    <a onClick={this.select.bind(this,current+1)}>
                        <span>下一页</span>
                        <span className="sr-only"></span>
                    </a>
                </li>
                <li className={CS({"disabled":current==max||max==0})}>
                    <a onClick={this.select.bind(this,max)}>
                        <span>尾页</span>
                        <span className="sr-only"></span>
                    </a>
                </li>
            </ul>
        );
    }
});

module.exports = PageNation;