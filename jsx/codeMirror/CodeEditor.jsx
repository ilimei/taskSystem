/***
 * React Component CodeEditor create by ZhangLiwei at 10:01
 */
import React from "react"
import CodeMirror from "./codemirror";
import "./sql";

class CodeEditor extends React.Component {

    /***
     * default props value
     */
    props = {
        value:"",
        mode:"text/x-sql",
        height:"100%"
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        value:React.PropTypes.string,
        mode:React.PropTypes.string,
        height:React.PropTypes.string|React.PropTypes.number,
        onChange:React.PropTypes.func,
        onKeyDown:React.PropTypes.func,
        onPaste:React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            value:this.props.value||""
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value){
            this.editor.setValue(nextProps.value);
            this.state.value=nextProps.value;
        }
    }
    
    componentDidMount(){
        this.editor = CodeMirror.fromTextArea(this.refs.textarea, {
            lineNumbers: true,
            lineWrapping:this.props.lineWrapping,
            mode: this.props.mode||"text/x-sql",
            theme:"eclipse",
            value:this.state.value
        });
        this.editor.on("change",cm=>{
            this.state.value=cm.getValue();
            callAsFunc(this.props.onChange,[this.state.value]);
        });
    }
    
    render() {
        return <div className="CodeEditor" onKeyDown={this.props.onKeyDown} onPaste={this.props.onPaste}
                    style={{paddingTop:"1px",height:this.props.height||"auto"}}>
            <textarea ref="textarea" value={this.state.value}/>
        </div>
    }
}

export default CodeEditor;