var React = require("react");
var Link=require("../../lib/router/Link");
/***
 * React Component ListUsers create by ZhangLiwei at 14:20
 */
var ListUsers = React.createClass({
    getInitialState:function(){
        return {
            projectId:this.props.projectId,
            filter:"",
            data:[]
        }
    },
    componentWillReceiveProps(nextProp){
        var projectId=this.props.projectId;
        var nextProjectId=nextProp.projectId;
        if(projectId!=nextProjectId){
            this.state.projectId=nextProjectId;
            this.load();
        }
    },
    componentDidMount:function(){
        this.load();
    },
    onLoad:function({result}){
        this.setState({data:result});
    },
    load(){
        cacheAjax("api/project/listUser",{
            projectId:this.state.projectId
        },this.onLoad);
    },
    selUser:function(){

    },
    renderUsers:function(){
        var filter=this.state.filter;
        console.info(filter);
        return this.state.data.map(function(v,index){
            if(v.email.indexOf(filter)>=0||v.name.indexOf(filter)>=0||v.phone.indexOf(filter)>=0) {
                var cls = CS({
                    "icon-ok": v.id == this.state.selUserId
                });
                return <Link key={v.id} to={v.name} activeClass="active">
                    <div key={v.id} className="userItem" onClick={this.selUser.bind(this, v)}>
                        <div className="avatar"><img src={v.avatar}/></div>
                        <div className="userName">{v.nick_name}</div>
                    </div>
                </Link>
            }
        },this);
    },
    render: function () {
        return <div className="ListUsers">
            {this.renderUsers()}
        </div>
    }
});

module.exports = ListUsers;