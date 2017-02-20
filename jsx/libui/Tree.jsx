/***
 * React Component Tree create by ZhangLiwei at 13:27
 */
var React = require("react");

var TreeNode = React.createClass({
    propTypes:{
        onEndEdit:React.PropTypes.func,
        onBeforeSelect:React.PropTypes.func
    },
    onSelect:function(){
        var {treeItem, deep}=this.props;
        if(treeItem.active)return;
        if(callAsFunc(this.props.onBeforeSelect,[treeItem])){
            treeItem.active=true;
            callAsFunc(this.props.onSelect,[treeItem,this]);
            this.forceUpdate();
        }
    },
    renderFolder: function (style) {
        var {treeItem, deep}=this.props;
        var open = !!treeItem.open;
        var opCls = CS({
            "icon-caret-right": !open,
            "icon-caret-down": open
        });
        var folderIcon = CS({
            "icon-folder-close-alt": !open,
            "icon-folder-open-alt": open
        });
        var cls=CS({
            "active":treeItem.active
        },"tree_item");
        return <div className={cls} onDoubleClick={this.props.changeOpen}
                    onClick={this.onSelect}
                    onContextMenu={this.props.handleContextMenu}>
            <span className="tree_space" style={style}></span>
            <span className="tree_folder_op">
                <i className={opCls} onClick={this.props.changeOpen}/>
            </span>
            <span className="tree_icon">
                <i className={folderIcon}/>
            </span>
            <span className="tree_text">{this.renderText(treeItem)}</span>
        </div>
    },
    renderChild: function (style) {
        var {treeItem, deep}=this.props;
        var cls=CS({
            "active":treeItem.active
        },"tree_item");
        return <div className={cls}
                    onClick={this.onSelect}
                    onContextMenu={this.props.handleContextMenu}>
            <span className="tree_space" style={style}></span>
            <span className="tree_icon">
                <i className={treeItem.icon||"icon-file-alt"}/>
            </span>
            <span className="tree_text">{this.renderText(treeItem)}</span>
        </div>
    },
    handleEndEdit: function (treeItem, e) {
        if (e.type == "blur") {
            treeItem.isEdit = false;
            this.forceUpdate();
        }
        
        if (e.keyCode == 13) {
            treeItem.isEdit = false;
            callAsFunc(this.props.onEndEdit,[treeItem,e.target.value]);
        }
    },
    bindFocus:function(){
        if(this.refs["editor"]){
            this.refs["editor"].focus();
        }
    },
    componentDidMount:function(){
        this.bindFocus();
    },
    componentDidUpdate:function(){
        this.bindFocus();
    },
    renderText: function (treeItem) {
        if (treeItem.isEdit) {
            return <input className="editBox"
                          ref="editor"
                          onBlur={this.handleEndEdit.bind(this, treeItem)}
                          defaultValue={treeItem.title}
                          onKeyDown={this.handleEndEdit.bind(this, treeItem)}/>
        } else {
            return treeItem.title;
        }
    },
    render: function () {
        var {treeItem, deep}=this.props;
        var style = {width: (deep + 1) * 16};
        if (treeItem.type == 1) {
            return this.renderFolder(style);
        } else {
            return this.renderChild(style);
        }
    }
});
var Tree = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        onContextMenu: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            lastSelectTreeNode:null,
            lastTreeItem:null,
            data: this.props.data||[
                {
                    id: "1", text: "文件夹", icon: "icon-ok", type: 1, isEdit: true
                    , child: [
                    {
                        id: "2", text: "文件夹", type: 1, child: [
                        {id: "4", text: "文件", type: 2, icon: "icon-file-alt"}
                    ]
                    },
                    {id: "3", text: "文件", type: 2, icon: "icon-file-alt"}
                ]
                }
            ]
        }
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.data){
            this.setState({data:nextProps.data});
        }
    },
    handleContextMenu: function (v, e) {
        callAsFunc(this.props.onContextMenu, [e, v]);
    },
    onSelect:function(treeItem,treeNode){
        var {lastSelectTreeNode,lastTreeItem}=this.state;
        if(lastTreeItem){
            lastTreeItem.active=false;
            if(lastSelectTreeNode)
                lastSelectTreeNode.forceUpdate();
        }
        this.state.lastSelectTreeNode=treeNode;
        this.state.lastTreeItem=treeItem;
        callAsFunc(this.props.onSelect,[treeItem]);
    },
    renderLeaf: function (v, deep, arr, parentNode) {
        var style = {width: (deep + 1) * 16};
        v.parentNode = parentNode;
        arr.push(<TreeNode key={v.id}
                           onBeforeSelect={this.props.onBeforeSelect}
                           onSelect={this.onSelect}
                           onEndEdit={this.props.onEndEdit}
                           treeItem={v} deep={deep} handleContextMenu={this.handleContextMenu.bind(this, v)}/>);
    },
    changeOpen: function (v, e) {
        v.open = !v.open;
        this.forceUpdate();
        e.stopPropagation();
        e.preventDefault();
    },
    renderFolder: function (v, deep, arr, parentNode) {
        v.parentNode = parentNode;
        arr.push(<TreeNode key={v.id} treeItem={v}
                           onEndEdit={this.props.onEndEdit}
                           onBeforeSelect={this.props.onBeforeSelect}
                           onSelect={this.onSelect}
                           deep={deep}
                           changeOpen={this.changeOpen.bind(this, v)}
                           handleContextMenu={this.handleContextMenu.bind(this, v)}/>);
        if (v.open && Array.isArray(v.child)) {
            v.child.forEach(function (childV) {
                if (childV.type == 1) {
                    return this.renderFolder(childV, deep + 1, arr, v);
                } else if (childV.type == 2) {
                    return this.renderLeaf(childV, deep + 1, arr, v);
                }
            }, this);
        }
    },
    renderChild: function () {
        var arr = [];
        this.state.data.forEach(function (v, index) {
            if (v.type == 1) {
                return this.renderFolder(v, 1, arr);
            } else if (v.type == 2) {
                return this.renderLeaf(v, 1, arr);
            }
        }, this);
        return arr;
    },
    render: function () {
        var cls = CS({}, "Tree", this.props.className);
        return <div className={cls}>
            {this.renderChild()}
        </div>
    }
});

module.exports = Tree;