/***
 * React Component Confirm create by ZhangLiwei at 17:34
 */
import React from "react"
import Modal from "../form/modal";


class Confirm extends React.Component {

    /***
     * default props value
     */
    props = {
        content:""
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        content:React.PropTypes.string,
        onOk:React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            onHide:null
        }
    }

    cancel(){
        this.refs["modal"].hide();
    }

    ok(){
        callAsFunc(this.props.onOk);
        this.refs["modal"].hide();
    }

    render() {
        return <Modal className="Confirm" title="系统提示" ref="modal" onHide={this.state.onHide}>
            <div>{this.props.content}</div>
            <button className="btn btn-warning btn-sm" btn onClick={this.cancel.bind(this)}>取消</button>
            <button className="btn btn-primary btn-sm" btn onClick={this.ok.bind(this)}>确定</button>
        </Modal>
    }
}

export default Confirm;