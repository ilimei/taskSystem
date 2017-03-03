/***
 * React Component Comments create by ZhangLiwei at 9:35
 */
import React from "react"
import AutEdit from "../../../ui/AutoEdit";
import Marked from "../../../marked/markedFunc";

class Comments extends React.Component {

    /***
     * default props value
     */
    static defaultProps = {}

    /***
     * props types for helper text
     */
    static propTypes = {
        taskId:React.PropTypes.any
    }

    /**
     * component state
     */
    state = {
        content:"",
        data:[],
        user:null
    }

    constructor(props) {
        super(props);
        ComponentConstrutorAutoBind(this);
    }

    componentDidMount() {
        cacheAjax("api/user/getLoginInfo",{},(user)=>{
            this.setState({user:user})
        });
        this.load();
    }

    load(){
        Ajax("api/comment/listComment",{
            taskId:this.props.taskId
        },data=>{
            this.setState({data:data.data});
        });
    }

    handleChange(content){
        this.state.content=content;
    }

    handleReply(){
        Ajax("api/comment/addComment",{
            taskId:this.props.taskId,
            replayTo:-1,
            type:1,
            content:this.state.content
        },data=>{
            this.state.content="";
            this.refs["editor"].clear();
            this.load();
        },this);
    }

    handleRemoveClick(comment){
        Ajax("api/comment/del",{
            id:comment.id
        },data=>{
            this.load();
        },this);
    }

    renderComments(){
        var {user}=this.state;
        return this.state.data.map(comment=>{
            let html={__html:Marked(comment.content)};
            return <div key={comment.id} className="comment">
                <div className="markdown_css" dangerouslySetInnerHTML={html}></div>
                <div className="options">
                    <span>{comment.creator.nick_name}</span>
                    <span>{new Date(parseInt(comment.create_time)).Format("yyyy-MM-dd HH:mm")}</span>
                    {/*<span className="canClick"><i className="icon-edit"/>回复</span>*/}
                    {user&&user.id==comment.creator.id&&<span className="canClick" onClick={this.handleRemoveClick.bind(this,comment)}><i className="icon-remove"/>删除</span>}
                </div>
                <div className="headIcon">
                    <img src={comment.creator.avatar}/>
                </div>
            </div>
        },this);
    }

    render() {
        return <div className="Comments">
            {this.renderComments()}
            <AutEdit ref="editor" change={this.handleChange} minHeight={100} placeholder="请输入评论内容，支持markdown">
                <i className="icon-reply" onClick={this.handleReply}/>
            </AutEdit>
        </div>
    }
}

export default Comments;