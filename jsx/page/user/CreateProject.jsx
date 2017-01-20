var Input=require("../../form/input");
var Textarea=require("../../form/textarea");

/***
 * React Component CreateProject create by ZhangLiwei at 16:56
 */
var CreateProject = React.createClass({
    getInitialState:function(){
        return {
            name:"",
            desc:""
        }
    },
    handle:function(name,v){
        this.state[name]=v;
    },
    addProject:function(){
        Ajax("api/project/add",this.state,function(data){
            if(data.success){
                history.back();
            }
        });
    },
    render: function () {
        return <div className="CreateProject">
            <div className="header">创建项目</div>
            <Input holder="项目名称" change={this.handle.bind(this,"name")}/>
            <Textarea holder="项目描述" height={400}  change={this.handle.bind(this,"desc")}/>
            <button className="btn btn-small btn-success" onClick={this.addProject}>创建项目</button>
        </div>
    }
});

module.exports = CreateProject;