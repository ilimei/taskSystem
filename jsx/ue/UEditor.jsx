/***
 * React Component UEditor create by ZhangLiwei at 15:49
 */
import * as React from "react";
import "./ueditor.config";
import "./ueditor.all";
import "./zh-cn"


class UEditor extends React.Component{

    constructor(props){
        super(props);
        this.state={}
    }

    onReady(){
        this.editor.setContent(this.props.value||"");
    }

    componentDidMount(){
        this.editor=UE.getEditor(this.refs["container"]);
        UE.uploadOpt={
            imageFieldName:"avatar",
            imageMaxSize:1024*1024,
            imageUrlPrefix:"/uploads/",
            imageAllowFiles:["bmp","png","jpg","gif"],
            imageActionName:ReqUrl+"api/upload/avatar"
        };
        this.editor.on("ready",this.onReady.bind(this));
        this.editor.on("contentChange",this.onChange.bind(this));
        this.refs["container"].style.width="100%";
    }

    onChange(){
        callAsFunc(this.props.change,[this.editor.getContent()]);
    }
    
    componentWillUnmount(){
        UE.delEditor(this.refs["container"]);
    }

    render() {
        return <div className="UEditor">
            <div className="editor_container" ref="container">
            </div>
        </div>
    }
}


export default UEditor;