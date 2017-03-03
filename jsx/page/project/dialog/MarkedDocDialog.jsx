/***
 * React Component MarkedDocDialog create by ZhangLiwei at 9:45
 */
import React from "react"
import ReactDOM from "react-dom";
import Input from "../../../form/input";
import Modal from "../../../form/modal";
import Split from "../../../ui/Split";
import CodeEditor from "../../../codeMirror/CodeEditor";
import "../../../codeMirror/markdown";
import ResizeBox from "../../../libui/ResizeBox";
import Marked  from '../../../marked/markedFunc';

class MarkedDocDialog extends React.Component {

    /***
     * default props value
     */
    props = {
        title: "新增文档",
        markdown: "",
        data: null
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        title: React.PropTypes.string,
        markdown: React.PropTypes.string,
        data: React.PropTypes.object
    }

    constructor(props) {
        super(props);
        var html = props.data ? Marked(props.data.content) : "";
        this.state = {
            onHide: null,
            title: props.data ? props.data.title : "",
            markdown: props.data ? props.data.content : "",
            html: {__html: html}
        }
    }

    handleChange(value) {
        this.state.markdown = value;
        this.state.html = {__html: Marked(value)};
        ReactDOM.findDOMNode(this.refs["div"]).innerHTML = this.state.html.__html;
    }

    handleChangeTitle(v) {
        this.state.title = v;
    }

    cancel() {
        this.refs["modal"].hide();
    }

    ok() {
        callAsFunc(this.props.onOk, [{
            title: this.state.title,
            content: this.state.markdown
        }]);
        this.cancel();
    }

    parseImage(e) {
        var me = this;
        var clipboard = e.clipboardData;
        var type = clipboard.items[0].type;
        if (type.match(/image/)) {
            var blob = clipboard.items[0].getAsFile();
            var formData=new FormData();
            formData.append("avatar",blob,"test.png");
            PostFormData("api/upload/avatar",formData)
                .then(function(data){
                    if(data.success){
                        me.refs["editor"].replaceSelection("![title](/uploads/" + data.result + ")");
                    }else{
                        alert(data.result)
                    }
                }).catch(function(e){
            });
        }
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        return <Modal className="MarkedDocDialog" ref="modal" lg title={this.props.title} onHide={this.state.onHide}>
            <Input name="标题" value={this.state.title} change={this.handleChangeTitle.bind(this)}/>
            <Split>
                <ResizeBox className="CodeEditorWrap" width={400}>
                    <CodeEditor ref="editor" mode="text/x-markdown"
                                value={this.state.markdown}
                                onPaste={this.parseImage.bind(this)}
                                onChange={this.handleChange.bind(this)} lineWrapping
                                height="100%"/>
                </ResizeBox>
                <div className="preview markdown_css" ref="div" dangerouslySetInnerHTML={this.state.html}></div>
            </Split>
            <button className="btn btn-warning btn-sm" btn onClick={this.cancel.bind(this)}>取消</button>
            <button className="btn btn-primary btn-sm" btn onClick={this.ok.bind(this)}>确定</button>
        </Modal>
    }
}

export default MarkedDocDialog;