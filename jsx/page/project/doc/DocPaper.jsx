/***
 * React Component DocPaper create by ZhangLiwei at 13:27
 */
import React from "react"
import Paper from "../../../libui/Paper";
import Tabs from "../../../libui/Tabs";
import DocItems from "./DocItems";
import DocTasks from "./DocTasks";


class DocPaper extends React.Component {
    static propTypes = {
        docNode: React.PropTypes.any
    }

    constructor(props) {
        super(props);
        this.state = {
            docNode:null,
            selectTab:0,
            data:[
                {text:"需求文档",id:0},
                {text:"需求对应任务",id:1}
            ]
        };
        ComponentConstrutorAutoBind(this);
    }

    findHashScroll(routeParam){
        let scrollDiv = this.refs["scrollDiv"];
        if(this.state.docNode) {
            let {item}=routeParam;
            let toDiv = document.querySelector("#node"+item);
            let top = 0;
            while (toDiv && toDiv != scrollDiv) {
                top += toDiv.offsetTop;
                toDiv = toDiv.offsetParent;
            }
            scrollDiv.scrollTop = top;
        }else{
            scrollDiv.scrollTop=0;
        }
    }

    componentDidUpdate(){
        this.findHashScroll(this.props.routeParam);
    }


    componentDidMount() {
        let {id}=this.props.routeParam;
        this.load(id);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.routeParam.id!=this.props.routeParam.id){
            this.load(nextProps.routeParam.id);
        }
        if(nextProps.routeParam.item!=this.props.routeParam.item){
            this.findHashScroll(nextProps.routeParam);
        }
    }

    load(id){
        if(id) {
            Ajax("api/doc/getDetailDoc", {
                id: id,
                projectId: this.props.projectId
            }, data => {
                this.setState({docNode: data.result});
            }, this);
        }else{
            this.setState({docNode:null});
        }
    }

    onSelect(tab){
        switch (tab.text){
            case "需求文档":
                this.setState({selectTab:0});
                break;
            case "需求对应任务":
                this.setState({selectTab:1});
                break;
        }
    }

    render() {
        return <div className="subContainer " ref="scrollDiv">
            <Paper className="markdown_css prePaper">
                <Tabs data={this.state.data} onSelect={this.onSelect}/>
                {
                    this.state.selectTab==0?
                        <DocItems docNode={this.state.docNode}/>: <DocTasks docNode={this.state.docNode}/>
                }
            </Paper>
        </div>
    }
}

export default DocPaper;