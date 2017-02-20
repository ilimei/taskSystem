/***
 * React Component DocDialog create by ZhangLiwei at 9:02
 */
import * as React from "react";
import UEditor from "../../../ue/UEditor";
import Input from "../../../form/input";
import Modal from "../../../form/modal";

class DocDialog extends React.Component{

    props={
        title:"新增文档",
        data:{}
    }

    static propTypes={
        title:React.PropTypes.string,
        data:React.PropTypes.object
    }

    constructor(props){
        super(props);
        let {data}=props;
        data=data||{};
        this.state={
            onHide:null,
            title:data.title||"",
            content:data.content||""
        };
    }

    handle(name,v){
        this.state[name]=v;
    }

    cancel(){
        this.refs["modal"].hide();
    }


    ok(){
        callAsFunc(this.props.onOk,[{
            title:this.state.title,
            content:this.state.content
        }]);
        this.cancel();
    }

    render() {
        return <Modal className="DocDialog" ref="modal" lg title={this.props.title} onHide={this.state.onHide}>
            <Input name="标题" value={this.state.title} change={this.handle.bind(this,"title")}/>
            <UEditor value={this.state.content} change={this.handle.bind(this,"content")}/>
            <button className="btn btn-warning btn-sm" btn onClick={this.cancel.bind(this)}>取消</button>
            <button className="btn btn-primary btn-sm" btn onClick={this.ok.bind(this)}>确定</button>
        </Modal>
    }
}

export default DocDialog;