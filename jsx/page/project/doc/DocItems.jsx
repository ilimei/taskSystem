/***
 * React Component DocItems create by ZhangLiwei at 9:00
 */
import React from "react"
import UEAddDoc from "../dialog/DocDialog";
import MarkedDocDialog from "../dialog/MarkedDocDialog";
import Link from "../../../lib/router/Link";
import Marked from "../../../marked/markedFunc"

class DocItems extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {}

    /***
     * props types for helper text
     */
    static propTypes = {}

    /**
     * component state
     */
    state = {
    }

    constructor(props) {
        super(props);
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
        let {docNode}=this.props;
        if (docNode) {
            let child = docNode.child && docNode.child.map(function (v, index) {
                    return <div key={v.id} className="header-item">
                        <Link to={"../"+v.id}>{v.title}</Link>
                        <i className="icon-edit" onClick={this.onEdit.bind(this, v)}/>
                        <i className="icon-remove" onClick={this.onRemove.bind(this, v, index)}/>
                    </div>
                }, this);
            return <div className="header">{child}</div>
        }
    }

    renderContent() {
        let {docNode}=this.props;
        if (docNode)
            return docNode.child && docNode.child.map(function (v) {
                    let obj = {__html: ""};
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
        let {docNode}=this.props;
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
        return <div className="DocItems">
            {this.renderPaper()}
            {this.renderHeader()}
            {this.renderContent()}
        </div>
    }
}

export default DocItems;