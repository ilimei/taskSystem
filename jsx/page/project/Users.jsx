var React = require("react");
var Modal=require("../../form/modal");
var SelUserModal=React.createClass({
    getInitialState:function(){
        return {
            onHide:null,
            data:[],
            selList:[]
        }
    },
    componentDidMount:function(){
         Ajax("api/project/listUnInUser",{
             projectId:this.props.projectId
         },function(data){
            this.setState({data:data.result});
         },this);
    },
    cancel:function(){
        this.refs["modal"].hide();
    },
    ok:function(){
        var ids=this.state.selList.map(function(v){
            return v.id;
        });
        Ajax("api/project/addUser",{
            ids:JSON.stringify(ids),
            projectId:this.props.projectId
        },function(data){
            if(data.success){
                callAsFunc(this.props.onOk);
                this.cancel();
            }else{
                alert(data.message);
            }
        },this)
    },
    isSel:function(v){
        return this.state.selList.includes(v);
    },
    selItem:function(v){
        var {selList}=this.state;
        if(!this.isSel(v)) {
            selList.push(v);
        }else{
            selList.splice(selList.indexOf(v),1);
        }
        this.forceUpdate();
    },
    renderData:function(){
        if(this.state.data.length) {
            return this.state.data.map(function (v) {
                var cls = CS({
                    "UserItem": true,
                    "active": this.isSel(v)
                });
                return <div className={cls} onClick={this.selItem.bind(this, v)}>
                    <div className="avatar">
                        <img src={v.avatar}/>
                    </div>
                    <div className="name">{v.nick_name}</div>
                </div>
            }, this);
        }else{
            return <h1>没有不在项目中的用户</h1>
        }
    },
    render:function(){
        return <Modal title="添加成员" lg ref="modal" onHide={this.state.onHide}>
            <div className="Users">
                <div className="usersContainer">
                    {this.renderData()}
                </div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={this.ok} btn>确定</button>
            <button className="btn btn-sm btn-warning" onClick={this.cancel} btn>取消</button>
        </Modal>
    }
});

/***
 * React Component Users create by ZhangLiwei at 10:27
 */
var Users = React.createClass({
    getInitialState:function(){
        return {
            ProjectMap:null,
            data:[],
            selList:[]
        }
    },
    isSel:function(v){
        return this.state.selList.includes(v);
    },
    selItem:function(v,unSel){
        if(unSel){
            return;
        }
        var {selList}=this.state;
        if(!this.isSel(v)) {
            selList.push(v);
        }else{
            selList.splice(selList.indexOf(v),1);
        }
        this.forceUpdate();
    },
    componentWillReceiveProps(nextProps){
        var projectId=this.props.projectId;
        var nextProjectId=nextProps.projectId;
        if(projectId!=nextProjectId){
            this.reload();
        }
    },
    onProjectMap:function({result}){
          this.setState({ProjectMap:dataMapById(result,"id")});
    },
    componentDidMount:function(){
        cacheAjax("api/user/listProjects",{},this.onProjectMap);
        Ajax("api/project/listUser",{
             projectId:this.props.projectId
         },function(data){
             this.setState({data:data.result});
         },this);
    },
    reload:function(){
        Ajax("api/project/listUser",{
            projectId:this.props.projectId
        },function(data){
            this.setState({data:data.result});
        },this);
    },
    addUser:function(){
        showModal(<SelUserModal projectId={this.props.projectId} onOk={this.reload}/>);
    },
    removeUser:function(){
        var me=this;
        var ids=this.state.selList.map(function(v){
            return v.id;
        });
        confirm("确定要删除选中用户么？",function(){
            Ajax("api/project/removeUser",{
                projectId:me.props.projectId,
                ids:JSON.stringify(ids)
            },function(data){
                this.reload();
            },me);
        });
    },
    renderData:function(){
        var userId=-1;
        var {ProjectMap}=this.state;
        if(ProjectMap&&ProjectMap[this.props.projectId])
            userId=ProjectMap[this.props.projectId].creator;
        return this.state.data.map(function(v){
            var unSel=userId==v.id;
            var cls = CS({
                "UserItem": true,
                "active": this.isSel(v),
                "unSelect":unSel
            });
            return <div className={cls}  onClick={this.selItem.bind(this, v,unSel)}>
                <div className="avatar">
                    <img src={v.avatar}/>
                </div>
                <div className="name">
                    {v.nick_name}
                    <div className="creator">{unSel?"创建者":""}</div>
                </div>
            </div>
        },this);
    },
    render: function () {
        return <div className="Users pd">
            <div className="userHeader">
                项目成员
                <div className="btnArea">
                    <button onClick={this.addUser} className="btn btn-sm btn-success m-r">添加成员</button>
                    <button onClick={this.removeUser} disabled={
                        this.state.selList.length==0
                    } className="btn btn-sm btn-warning m-r">删除成员</button>
                </div>
            </div>
            {this.renderData()}
        </div>
    }
});

module.exports = Users;