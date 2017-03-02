var React = require("react");
var Split = require("../../../ui/Split");
var HelpMenu = require("../../../ui/HelperMenu");
var Tree = require("../../../libui/Tree");
var Paper = require("../../../libui/Paper");
var UEditor = require("../../../ue/UEditor");
var Router=require("../../../lib/router/Router");
var Route=require("../../../lib/router/Route");
var Link =require("../../../lib/router/Link");
var TaskDetail=require("../TaskDetail");

import TaskSelectDialog from "./TaskSelectDialog";

import DocPaper from "./DocPaper";
import CreateTask from "../../dialog/CreateTask";



/***
 * React Component Docs create by ZhangLiwei at 20:21
 */
var Docs = React.createClass({
    getInitialState: function () {
        return {
            docNode: null,
            treeData: [],
            folderMenu: [
                {
                    text: "删除", icon: "icon-remove", click: this.handleRemoveTreeItem
                },
                {
                    text: "编辑名称", icon: "icon-edit", click: this.handleEditTreeItem
                },
                {
                    text: "新增文件", icon: "icon-plus", click: this.handleAddTreeFile
                },
                {
                    text: "新增文件夹", icon: "icon-plus", click: this.handleAddTreeFolder
                }
            ],
            fileMenu: [
                {
                    text: "追加任务", icon: "icon-tasks", child:[
                        {
                            text:"新建任务",icon:"icon-plus",click:this.handleAddNewTask
                        },
                        {
                            text:"从任务中添加",icon:"icon-tasks", click: this.handleSelectTask
                        }
                    ]
                },
                {
                    text: "编辑名称", icon: "icon-edit", click: this.handleEditTreeItem
                },
                {
                    text: "删除", icon: "icon-remove", click: this.handleRemoveTreeItem
                }
            ],
            taskMenu:[
                {
                    text: "删除", icon: "icon-remove", click: this.handleRemoveTreeItem
                }
            ],
            mainMenu: [
                {
                    text: "新增文件", icon: "icon-plus", click: this.handleAddTreeFile
                },
                {
                    text: "新增文件夹", icon: "icon-plus", click: this.handleAddTreeFolder
                }
            ]
        }
    },
    handleSelectTask:function(){
        var treeItem = this.opTreeItem;
        showModal(<TaskSelectDialog docId={treeItem.id} projectId={this.props.projectId} onOk={this.onAddTasksToTree.bind(this,treeItem)}/>);
    },
    handleEditTreeItem: function () {
        var treeItem = this.opTreeItem;
        treeItem.isEdit = true;
        this.forceUpdate();
    },
    handleAddTreeFile: function () {
        var treeItem = this.opTreeItem;
        if (treeItem.type == 1) {
            treeItem.open = true;
            var obj = {
                parent: treeItem.id,
                title: "文件",
                type: 2,
                content: "",
                editor: 1,
                projectId: this.props.projectId
            };
            Ajax("api/doc/add", obj, data => {
                obj.id = data.result.insertId;
                obj.isEdit = true;
                !treeItem.child && (treeItem.child = []);
                treeItem.child.push(obj);
                this.forceUpdate();
            }, this);
        }
    },
    handleAddTreeFolder: function () {
        var treeItem = this.opTreeItem;
        if (treeItem.type == 1) {
            var obj = {
                parent: treeItem.id,
                title: "文件夹",
                content: "",
                type: 1,
                editor: 1,
                projectId: this.props.projectId
            };
            Ajax("api/doc/add", obj, function (data) {
                obj.id = data.result.insertId;
                obj.isEdit = true;
                !treeItem.child && (treeItem.child = []);
                treeItem.child.push(obj);
                this.forceUpdate();
            }, this);
        }
    },
    handleRemoveTreeItem: function () {
        var treeItem = this.opTreeItem;
        var parentNode = treeItem.parentNode;
        var index = -1;
        Confirm("确定删除【"+treeItem.title+"】么？",()=>{
            Ajax("api/doc/del",{
                id:treeItem.id
            },data=>{
                parentNode && (index = parentNode.child.indexOf(treeItem)) > -1 && parentNode.child.splice(index, 1) && this.forceUpdate();
            },this);
        });
    },
    handleAddNewTask:function(){
        var treeItem = this.opTreeItem;
        showModal(<CreateTask forSelect projectId={this.props.projectId} onSelectOk={this.onAddTaskToTree.bind(this,treeItem)}/>)
    },
    handleContextMenu: function (e, treeItem) {
        this.opTreeItem = treeItem;
        if (treeItem.id < 0) {
            return showContextMenu(e, this.state.mainMenu);
        } else if (treeItem.type == 1) {
            showContextMenu(e, this.state.folderMenu);
        } else {
            showContextMenu(e, this.state.fileMenu);
        }
    },
    handleEndEdit: function (treeItem, value) {
        Ajax("api/doc/update", {
            id: treeItem.id,
            title: value
        }, data => {
            treeItem.title = value;
            this.forceUpdate();
        }, this);
    },
    onAddTaskToTree:function(treeItem,task){
        Ajax("api/doc/addTask",{
            parent:treeItem.id,
            taskId:task.id,
            projectId:this.props.projectId
        },data=>{
            if(!Array.isArray(treeItem.child)){
                treeItem.child=[];
            }
            treeItem.child.push(task);
            this.forceUpdate();
        },this);
    },
    onAddTasksToTree:function(treeItem,ids,tasks){
        this.forceUpdate();
        Ajax("api/doc/addTasks",{
            parent:treeItem.id,
            ids:JSON.stringify(ids),
            projectId:this.props.projectId
        },data=>{
            treeItem.allCount+=tasks.length;
            tasks.forEach(task=>{
                if(task.done!=0)
                    treeItem.doneCount++
            });
            EventSpider.trigger("onAddTaskToTree",[treeItem.id]);
            this.forceUpdate();
        },this);
    },
    onBeforeSelect: function (treeItem) {
        if (treeItem.type == 2) {
            this.setState({docNode: treeItem});
            return true;
        }
    },
    load(treeId,projectId){
        Ajax("api/doc/getDoc", {
            id: treeId,
            projectId: projectId
        }, function (data) {
            data.result.title = this.props.title;
            data.result.type = 1;
            this.setState({treeData: [data.result]});
        }, this);
    },
    componentDidMount(){
        this.load(this.props.treeId,this.props.projectId);
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.treeId!=this.props.treeId) {
            this.load(nextProps.treeId,nextProps.projectId);
        }
    },
    render: function () {
        return <Split className="Docs">
            <HelpMenu noData title={this.props.title} width={400} resize desc={this.props.helperText}>
                <Tree data={this.state.treeData}
                      showComplete={this.props.showComplete}
                      onBeforeSelect={this.onBeforeSelect}
                      onEndEdit={this.handleEndEdit} onContextMenu={this.handleContextMenu}/>
            </HelpMenu>
            <Router>
                <Route path="file/:docid/detail/:id" component={TaskDetail} projectId={this.props.projectId}/>
                <Route path="file/:id/:item" component={DocPaper} projectId={this.props.projectId}/>
                <Route path="*" component={DocPaper} projectId={this.props.projectId}/>
            </Router>
        </Split>
    }
});

module.exports = Docs;