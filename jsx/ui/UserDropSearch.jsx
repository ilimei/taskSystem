var DropAny=require("./DropAny");
var TaskUrgency=require("./TaskUrgency");
var TaskList=require("./Tasklist");
var React = require("react");
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
            loginUser:this.props.selUser||{},
            data:[]
        }
    },
    clear:function(){
        this.setState({loginUser:user,selUserId:user.id});
    },
    onLoginUser:function(user){
        this.setState({loginUser:user,selUserId:user.id});
    },
    onUserList:function({result}){
        var {selUserId}=this.state;
        var map=dataMapById(result,"id");
        if(!this.props.selUser&&result.length){
            selUserId=result[0].id;
        }
        this.setState({data:result,loginUser:map[selUserId],selUserId:selUserId});
    },
    filterUser:function(v){
        this.setState({filter:v});
    },
    load:function(projectId){
        cacheAjax("api/project/listUser",{
            projectId:projectId
        },this.onUserList);
    },
    componentDidMount:function(){
        if(!this.props.selUser)
            cacheAjax("api/user/getLoginInfo",{},this.onLoginUser);
        if(this.props.projectId){
            this.load(this.props.projectId);
        }
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.projectId!=this.props.projectId){
            this.load(nextProps.projectId);
        }
    },
    selUser:function(v){
        callAsFunc(this.props.onSelect,[v]);
        this.setState({loginUser:v,selUserId:v.id});
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
    onShow:function(){
        this.refs["dropPanel"].focus();
    },
    render: function () {
        var {loginUser={}}=this.state;
        return <DropAny onShow={this.onShow} focusDrop noDrop={this.props.noDrop} className="UserDropSearch">
            <NativeDom np="body" body className="userItem noHover">
                <div className="avatar" >
                    <img src={loginUser.avatar} alt={loginUser.nick_name} title={loginUser.nick_name}/>
                </div>
                <span className="userName">{this.props.showName&&loginUser.nick_name}</span>
            </NativeDom>
            <div className="noOutline" tabIndex="-1" ref="dropPanel">{this.renderDrop()}</div>
        </DropAny>
    }
});

module.exports = UserDropSearch;