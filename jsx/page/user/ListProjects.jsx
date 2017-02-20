var React = require("react");
var Link=require("../../lib/router/Link");
/***
 * React Component ListUsers create by ZhangLiwei at 14:20
 */
var ListProjects = React.createClass({
    getInitialState:function(){
        return {
            filter:"",
            data:[]
        }
    },
    componentDidMount:function(){
        cacheAjax("api/user/listProjects",{},function(data){
            var map={};
            data.result.forEach(function(v){
                map[v.id]=v;
            });
            this.setState({data:data.result});
        },this);
    },
    selUser:function(){

    },
    renderUsers:function(){
        var filter=this.state.filter;
        console.info(filter);
        return this.state.data.map(function(v,index){
            if(v.name.indexOf(filter)>=0) {
                var cls = CS({
                    "icon-ok": v.id == this.state.selUserId
                });
                return <Link to={v.id+""} activeClass="active">
                    <div key={v.id} className="userItem" onClick={this.selUser.bind(this, v)}>
                        <div className="avatar"><img src={v.icon}/></div>
                        <div className="userName">{v.name}</div>
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

module.exports = ListProjects;