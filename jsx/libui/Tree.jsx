/***
 * React Component Tree create by ZhangLiwei at 13:27
 */
var React = require("react");
var Link = require("../lib/router/Link");

var TreeNode = React.createClass({
    propTypes: {
        onEndEdit: React.PropTypes.func,
        onBeforeSelect: React.PropTypes.func,
        reCalculateComplete:React.PropTypes.func
    },
    onSelect: function () {
        var {treeItem, deep}=this.props;
        if (treeItem.active)return;
        if (callAsFunc(this.props.onBeforeSelect, [treeItem])) {
            treeItem.active = true;
            callAsFunc(this.props.onSelect, [treeItem, this]);
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
        var cls = CS({
            "active": treeItem.active
        }, "tree_item");
        if (treeItem.type == 2) {
            folderIcon = "icon-file-text-alt";
            return <Link className={cls} to={"file/" + treeItem.id + "/00"} onDoubleClick={this.props.changeOpen}
                         onContextMenu={this.props.handleContextMenu}>
                <span className="tree_space" style={style}></span>
                <span className="tree_folder_op">
                <i className={opCls} onClick={this.props.changeOpen}/>
            </span>
                <span className="tree_icon">
                <i className={folderIcon}/>
            </span>
                <span className="tree_text">{this.renderText(treeItem)}</span>
            </Link>
        } else {
            return <div className={cls} onDoubleClick={this.props.changeOpen}
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
        }
    },
    renderChild: function (style) {
        var {treeItem, deep}=this.props;
        var cls = CS({
            "active": treeItem.active
        }, "tree_item");
        if (treeItem.type == 2) {
            return <Link to={"file/" + treeItem.id + "/00"} activeClass="active" className={cls}
                         onContextMenu={this.props.handleContextMenu}>
                <span className="tree_space" style={style}></span>
                <span className="tree_icon">
                <i className={treeItem.icon || "icon-file-text-alt"}/>
            </span>
                <span className="tree_text">{this.renderText(treeItem)}</span>
            </Link>
        } else if (treeItem.type == 4) {
            var iconCls=CS({
                "icon-check":treeItem.task.done!=0,
                "icon-check-empty":treeItem.task.done==0
            });
            return <Link to={"task/" + treeItem.editor} activeClass="active" className={cls}
                         onContextMenu={this.props.handleContextMenu}>
                <span className="tree_space" style={style}></span>
                <span className="tree_icon">
                    <i className={iconCls}/>

                </span>
                <span className="tree_text"><i className="icon-tasks"/>{treeItem.task.name}</span>
            </Link>
        }
    },
    handleEndEdit: function (treeItem, e) {
        console.info("???");
        if (e.type == "blur") {
            treeItem.isEdit = false;
            this.forceUpdate();
        }

        if (e.keyCode == 13) {
            treeItem.isEdit = false;
            callAsFunc(this.props.onEndEdit, [treeItem, e.target.value]);
        }
    },
    bindFocus: function () {
        if (this.refs["editor"]) {
            this.refs["editor"].focus();
        }
    },
    onDelTaskFromTree:function(id,isDone){
        var {treeItem}=this.props;
        if(id==treeItem.id){
            treeItem.allCount--;
            if(isDone){
                treeItem.doneCount--;
            }
        }
        callAsFunc(this.props.reCalculateComplete);
    },
    componentDidMount: function () {
        this.bindFocus();
        EventSpider.on("onDelTaskFromTree",this.onDelTaskFromTree)
    },
    componentDidUpdate: function () {
        this.bindFocus();
    },
    componentWillUnmount(){
        EventSpider.un("onDelTaskFromTree",this.onDelTaskFromTree);
    },
    renderText: function (treeItem) {
        if (treeItem.isEdit) {
            console.info(treeItem.isEdit);
            return <input className="editBox"
                          ref="editor"
                          onBlur={this.handleEndEdit.bind(this, treeItem)}
                          defaultValue={treeItem.title}
                          onKeyDown={this.handleEndEdit.bind(this, treeItem)}/>
        } else {
            if (this.props.showComplete) {
                return treeItem.complete + treeItem.title;
            }
            return treeItem.title;
        }
    },
    render: function () {
        var {treeItem, deep}=this.props;
        var style = {width: (deep + 1) * 16};
        if (this.props.isFolder(treeItem)) {
            return this.renderFolder(style);
        } else {
            return this.renderChild(style);
        }
    }
});

function calculateCompleteTask(task) {
    if (task.type == 2) {
        var obj={done: task.doneCount, all: task.allCount};
        if (obj.all != 0) {
            task.complete = "(" + (obj.done / obj.all * 100).toFixed(0) + "%)"
        } else {
            task.complete = "";
        }
        return obj;
    } else {
        var obj = {done: 0, all: 0};
        if (Array.isArray(task.child)) {
            task.child.forEach(t => {
                var re = calculateCompleteTask(t);
                obj.done += re.done;
                obj.all += re.all;
            });
            if (obj.all != 0) {
                task.complete = "(" + (obj.done / obj.all * 100).toFixed(0) + "%)"
            } else {
                task.complete = "";
            }
        } else {
            task.complete = ""
        }
        return obj;
    }
}

function calculateComplete(data) {
    data.forEach(task => {
        calculateCompleteTask(task);
    });
}

var Tree = React.createClass({
    getDefaultProps(){
        return {
            isFolder: function (treeItem) {
                if (treeItem.type == 2 && Array.isArray(treeItem.child) && treeItem.child.length) {
                    return true;
                }
                if (treeItem.type == 1) {
                    return true;
                }
                return false;
            }
        }
    },
    propTypes: {
        data: React.PropTypes.array,
        onContextMenu: React.PropTypes.func,
        isFolder: React.PropTypes.func,
        showComplete: React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            lastSelectTreeNode: null,
            lastTreeItem: null,
            data: this.props.data || [
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
        if (nextProps.data) {
            this.setState({data: nextProps.data});
        }
    },
    handleContextMenu: function (v, e) {
        callAsFunc(this.props.onContextMenu, [e, v]);
    },
    onSelect: function (treeItem, treeNode) {
        var {lastSelectTreeNode, lastTreeItem}=this.state;
        if (lastTreeItem) {
            lastTreeItem.active = false;
            if (lastSelectTreeNode)
                lastSelectTreeNode.forceUpdate();
        }
        this.state.lastSelectTreeNode = treeNode;
        this.state.lastTreeItem = treeItem;
        callAsFunc(this.props.onSelect, [treeItem]);
    },
    reCalculateComplete(){
        this.forceUpdate();
    },
    renderLeaf: function (v, deep, arr, parentNode) {
        var style = {width: (deep + 1) * 16};
        v.parentNode = parentNode;
        arr.push(<TreeNode key={v.id}
                           reCalculateComplete={this.reCalculateComplete}
                           showComplete={this.props.showComplete}
                           onBeforeSelect={this.props.onBeforeSelect}
                           onSelect={this.onSelect}
                           onEndEdit={this.props.onEndEdit}
                           isFolder={this.props.isFolder}
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
                           reCalculateComplete={this.reCalculateComplete}
                           onEndEdit={this.props.onEndEdit}
                           onBeforeSelect={this.props.onBeforeSelect}
                           onSelect={this.onSelect}
                           deep={deep}
                           isFolder={this.props.isFolder}
                           showComplete={this.props.showComplete}
                           changeOpen={this.changeOpen.bind(this, v)}
                           handleContextMenu={this.handleContextMenu.bind(this, v)}/>);
        if (v.open && Array.isArray(v.child)) {
            v.child.forEach(function (childV) {
                if (this.props.isFolder(childV)) {
                    return this.renderFolder(childV, deep + 1, arr, v);
                } else {
                    return this.renderLeaf(childV, deep + 1, arr, v);
                }
            }, this);
        }
    },
    renderChild: function () {
        var arr = [];
        if (this.props.showComplete) {
            calculateComplete(this.state.data);
        }
        this.state.data.forEach(function (treeItem, index) {
            if (this.props.isFolder(treeItem)) {
                return this.renderFolder(treeItem, 1, arr);
            } else {
                return this.renderLeaf(treeItem, 1, arr);
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