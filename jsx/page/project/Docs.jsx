var React = require("react");
var Split = require("../../ui/Split");
var HelpMenu = require("../../ui/HelperMenu");
var Tree = require("../../libui/Tree");
var Paper = require("../../libui/Paper");
var UEditor = require("../../ue/UEditor");
import UEAddDoc from "./dialog/DocDialog";
import MarkedDocDialog from "./dialog/MarkedDocDialog";

import Marked from "marked"
import hljs  from '../../marked/highlight';
Marked.setOptions({
    renderer: new Marked.Renderer({
        highlight: function (code, lang) {
            if (lang)
                return hljs.highlightAuto(code, [lang]).value;
            else
                return hljs.highlightAuto(code).value;
        }
    }),
    gfm: true,
    breaks: true,
    highlight: function (code, lang) {
        if (lang)
            return hljs.highlightAuto(code, [lang]).value;
        else
            return hljs.highlightAuto(code).value;
    }
});


class DocPaper extends React.Component {
    static propTypes = {
        docNode: React.PropTypes.any
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.onHash = this.onHash.bind(this);
    }

    onHash(e) {
        this.findHashScroll(location.hash);
    }

    findHashScroll(hash){
        if(this.props.docNode) {
            var scrollDiv = this.refs["scrollDiv"];
            var toDiv = document.querySelector(hash);
            var top = 0;
            while (toDiv && toDiv != scrollDiv) {
                top += toDiv.offsetTop;
                toDiv = toDiv.offsetParent;
            }
            scrollDiv.scrollTop = top;
        }
    }

    componentDidMount() {
        window.addEventListener("hashchange", this.onHash);
        this.findHashScroll(location.hash);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.onHash);
    }

    onSaveMark(obj) {
        let {docNode}=this.props;
        obj.parent = docNode.id;
        obj.type = 3;
        obj.editor = 2;
        obj.project_id = this.props.projectId;
        Ajax("api/doc/add", obj, function (data) {
            obj.id = data.result.insertId;
            obj.isEdit = true;
            !docNode.child && (docNode.child = []);
            docNode.child.push(obj);
            this.forceUpdate();
        }, this);
    }

    onSaveUE(obj) {
        let {docNode}=this.props;
        obj.parent = docNode.id;
        obj.type = 3;
        obj.editor = 1;
        obj.project_id = this.props.projectId;
        Ajax("api/doc/add", obj, function (data) {
            obj.id = data.result.insertId;
            obj.isEdit = true;
            !docNode.child && (docNode.child = []);
            docNode.child.push(obj);
            this.forceUpdate();
        }, this);
    }

    onSaveForUpdate(treeItem, obj) {
        Ajax("api/doc/update", {
            id: treeItem.id,
            title: obj.title,
            content: obj.content
        }, data => {
            treeItem.title = obj.title;
            treeItem.content = obj.content;
            this.forceUpdate();
        }, this);
    }

    onEdit(treeItem) {
        if (treeItem.editor == 2) {
            showModal(<MarkedDocDialog title="编辑文档" data={treeItem} onOk={this.onSaveForUpdate.bind(this, treeItem)}/>);
        } else if (treeItem.editor == 1) {
            showModal(<UEAddDoc title="编辑文档" data={treeItem} onOk={this.onSaveForUpdate.bind(this, treeItem)}/>);
        }
    }

    onRemove(treeItem, index) {
        let {docNode}=this.props;
        Confirm("确定删除【"+treeItem.title+"】么？",()=>{
            Ajax("api/doc/del",{
                id:treeItem.id
            },data=>{
                docNode.child.splice(index,1);
                this.forceUpdate();
            },this);
        })
    }

    addDoc(type) {
        if (type == "markdown")
            showModal(<MarkedDocDialog title="新增文档" onOk={this.onSaveMark.bind(this)}/>);
        else if (type == "ue") {
            showModal(<UEAddDoc title="新增文档" onOk={this.onSaveUE.bind(this)}/>);
        }
    }

    renderHeader() {
        var {docNode}=this.props;
        if (docNode) {
            let child = docNode.child && docNode.child.map(function (v, index) {
                    return <div key={v.id} className="header-item">
                        <a href={"#node" + v.id}>{v.title}</a>
                        <i className="icon-edit" onClick={this.onEdit.bind(this, v)}/>
                        <i className="icon-remove" onClick={this.onRemove.bind(this, v, index)}/>
                    </div>
                }, this);
            return <div className="header">{child}</div>
        }
    }

    renderContent() {
        var {docNode}=this.props;
        if (docNode)
            return docNode.child && docNode.child.map(function (v) {
                    var obj = {__html: ""};
                    if (v.editor == 2) {
                        obj.__html = Marked(v.content);
                    } else {
                        obj.__html = v.content;
                    }
                    return <div key={v.id} id={"node" + v.id} className="content-item">
                        <h1>{v.title}</h1>
                        <div dangerouslySetInnerHTML={obj}></div>
                    </div>
                }, this);
    }

    renderPaper() {
        var {docNode}=this.props;
        if (docNode) {
            return <div className="pageTitle">
                <h1>{docNode.title}</h1>
                <button className="btn btn-primary btn-small m-r" onClick={this.addDoc.bind(this, "ue")}>
                    <i className="icon-plus"/>创建UEditor
                </button>
                <button className="btn btn-primary btn-small m-r" onClick={this.addDoc.bind(this, "markdown")}>
                    <i className="icon-plus"/>创建markdown
                </button>
            </div>
        } else {
            return <h1>请选择左侧的文件</h1>
        }
    }

    render() {
        return <div className="subContainer " ref="scrollDiv">
            <Paper className="markdown_css prePaper">
                {this.renderPaper()}
                {this.renderHeader()}
                {this.renderContent()}
            </Paper>
        </div>
    }
}
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
                    text: "删除", icon: "icon-remove", click: this.handleRemoveTreeItem
                },
                {
                    text: "编辑名称", icon: "icon-edit", click: this.handleEditTreeItem
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
            <HelpMenu noData title={this.props.title} resize desc={this.props.helperText}>
                <Tree data={this.state.treeData}
                      onBeforeSelect={this.onBeforeSelect}
                      onEndEdit={this.handleEndEdit} onContextMenu={this.handleContextMenu}/>
            </HelpMenu>
            <DocPaper docNode={this.state.docNode}/>
        </Split>
    }
});

module.exports = Docs;