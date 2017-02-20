/***
 * React Component DropTipList create by ZhangLiwei at 10:38
 */
var React = require("react");
var DropAny=require("../DropAny");

var DropTipList = React.createClass({
    getInitialState:function(){
        return {
            data:[],
            selList:this.props.selList||[]
        }
    },
    load:function(){
        cacheAjax("api/tip/list",{
            projectId:this.props.projectId
        },function(data){
            this.setState({data:data.data,loading:false});
        },this);
    },
    onSelect:function(){
        Ajax("api/tip/addTaskTip",{
            data:JSON.stringify(this.state.selList),
            taskId:this.props.taskId,
            projectId:this.props.projectId
        },function(data){
            var map=dataMapById(this.state.data,"id");
            var result=this.state.selList.map(function(v){
                return map[v];
            });
            callAsFunc(this.props.onSelect,[result]);
            this.refs["dropAny"].hide();
        },this);
    },
    componentDidMount:function(){
        this.load();
    },
    selTip:function(v,selIndex){
        if(selIndex>-1){
            this.state.selList.splice(selIndex,1);
        }else{
            this.state.selList.push(v.id);
        }
        this.forceUpdate();
    },
    renderData:function(){
        return this.state.data.map(function(v,index){
            var selIndex=this.state.selList.indexOf(v.id);
            var cls=CS({
                "selectIcon icon-ok":true,
                "active":selIndex>-1
            });
            return <div className="item" onClick={this.selTip.bind(this,v,selIndex)}>
                <i className={cls}/>
                <span className="colorBlock" style={{background:v.color}}/>
                {v.name}
            </div>
        },this);
    },
    onShow:function(){
        this.refs["dropPanel"].focus();
    },
    render: function () {
        return <DropAny onShow={this.onShow} noDrop={this.props.noDrop} focusDrop ref="dropAny" className="DropTipList">
            <NativeDom body np="body">
                <i className="icon-plus add"/>
            </NativeDom>
            <div className="noOutline" tabIndex="-1" ref="dropPanel">
                <div className="m-container">
                    <button className="btn btn-primary btn-sm btn-block" onClick={this.onSelect}>确定</button>
                </div>
                <div className="m-container">
                    {this.renderData()}
                </div>
            </div>
        </DropAny>
    }
});

module.exports = DropTipList;