var DropAny=require("./DropAny");
var TaskUrgency=require("./TaskUrgency");
var TaskList=require("./Tasklist");
var React = require("react");
const store=require("../lib/store");
var Input=require("../form/input");

/***
 * React Component UserDropSearch create by ZhangLiwei at 12:45
 */
var UserDropSearch = React.createClass({
    propTypes:{
        noDrop:React.PropTypes.bool
    },
    getInitialState:function(){
        return {
            filter:"",
            selUserId:this.props.selUser?this.props.selUser.id:0,
            loginUser:this.props.selUser||store.get("loginUser"),
            data:[]
        }
    },
    clear:function(){
        var user=store.get("loginUser");
        this.setState({loginUser:user,selUserId:user.id});
    },
    onLoginUser:function(){
        var user=store.get("loginUser");
        this.setState({loginUser:user,selUserId:user.id});
    },
    filterUser:function(v){
        this.setState({filter:v});
    },
    componentDidMount:function(){
         this.lsfunc=store.on("loginUser",this.onLoginUser);
         Ajax("api/project/listUser",{
             projectId:this.props.projectId
         },function(data){
           this.setState({data:data.result});
         },this);
    },
    selUser:function(v){
        callAsFunc(this.props.onSelect,[v]);
        this.setState({loginUser:v,selUserId:v.id});
    },
    componentWillUnmount:function(){
        store.un(this.lsfunc);
    },
    renderUsers:function(){
        var filter=this.state.filter;
        return this.state.data.map(function(v,index){
            if(v.email.indexOf(filter)>=0||v.name.indexOf(filter)>=0||v.phone.indexOf(filter)>=0) {
                var cls = CS({
                    "icon-ok": v.id == this.state.selUserId
                });
                return <div key={v.id} className="userItem" onClick={this.selUser.bind(this, v)}>
                    <i className={cls}/>
                    <div className="avatar"><img src={v.avatar}/></div>
                    <div className="userName">{v.nick_name}</div>
                </div>
            }
        },this);
    },
    renderDrop:function(){
        if(this.props.noDrop)return;
        return <div className="searchUsers">
            <div className="inputWrap">
                <Input holder="搜索" change={this.filterUser}/>
            </div>
            {this.renderUsers()}
        </div>
    },
    render: function () {
        var {loginUser}=this.state;
        return <DropAny noDrop={this.props.noDrop} className="UserDropSearch">
            <div body>
                <div className="avatar" >
                    <img src={loginUser.avatar}/>
                </div>
                {this.props.showName&&loginUser.nick_name}
            </div>
            {this.renderDrop()}
        </DropAny>
    }
});

module.exports = UserDropSearch;