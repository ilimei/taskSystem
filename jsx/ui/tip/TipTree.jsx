/***
 * React Component TipTree create by ZhangLiwei at 17:05
 */
var React = require("react");
var TipAdd=require("./TipAdd");
var DropTipAdd=require("./DropTipAdd");
var Link=require("../../lib/router/Link");

var Tip=React.createClass({
    getInitialState:function(){
        return {
            menu:[
                {icon:"icon-ok",text:"搞笑"},
                {icon:"",text:"禁用",disable:true},
            ]
        }
    },
    remove:function(){
        var {tip}=this.props;
        Ajax("api/tip/remove",{
            id:tip.id
        },function(data){
            if(data.success) {
                callAsFunc(this.props.onRemove);
            }
        },this);
    },
    stopEvent:function(e){
        e.stopPropagation();
    },
    onContextMenu:function(e){
        showContextMenu(e,this.state.menu);
    },
    render:function(){
        var {tip}=this.props;
        return <Link className="tip" activeClass="active" to={"tip/"+tip.id} onContextMenu={this.onContextMenu}>
            <i className="icon-tag" style={{color:tip.color}}/>
            {tip.name}
            <div className="editArea" onClick={this.stopEvent}>
                <i className="icon-remove" onClick={this.remove}/>
            </div>
        </Link>
    }
});

var TipTree = React.createClass({
    getInitialState:function(){
        return {
            data:[],
            loading:true,
            show:true
        }
    },
    toggleShow:function(){
        this.setState({show:!this.state.show});
    },
    removeTip:function(index){
        this.state.data.splice(index,1);
        this.forceUpdate();
    },
    renderTips:function(){
        if(!this.state.show)return;
        if(this.state.loading){
            return <span><i className="icon-spin icon-spinner"/>数据加载中。。</span>
        }else{
            return this.state.data.map(function(v,index){
                return <Tip tip={v} key={v.id} onRemove={this.removeTip.bind(this,index)}/>
            },this);
        }
    },
    load:function(projectId){
        cacheAjax("api/tip/list",{
            projectId:projectId||this.props.projectId
        },function(data){
            this.setState({data:data.data,loading:false});
        },this);
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.projectId!=this.props.projectId){
            this.load(nextProps.projectId);
        }
    },
    componentDidMount:function(){
        this.load();
    },
    onAdd:function(tip){
        this.state.data.push(tip);
        this.forceUpdate();
    },
    render: function () {
        var iconCls=CS({
            "icon":true,
            "icon-caret-right":!this.state.show,
            "icon-caret-down":this.state.show
        });
        return <div className="TipTree">
            <div className="head" onClick={this.toggleShow}>
                <i className={iconCls}/>
                <span className="">所有标签</span>
                <DropTipAdd onAdd={this.onAdd} projectId={this.props.projectId}/>
            </div>
            {this.renderTips()}
        </div>
    }
});

module.exports = TipTree;