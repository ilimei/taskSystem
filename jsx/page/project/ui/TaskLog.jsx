/***
 * React Component TaskLog create by ZhangLiwei at 11:39
 */
import React from "react"

class TaskLog extends React.Component {

    /***
     * default props value
     */
    props = {
        taskId: -1,
        projectId: -1
    }

    /***
     * props types for helper text
     */
    static propTypes = {
        taskId: React.PropTypes.string,
        projectId: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            userMap: {}
        }
    }

    renderIcon(log) {
        var color = "#ccc", icon = "icon-plus", textColor: "#333";
        switch (log.type) {
            case 2:
                icon = "icon-user";
                color = "#00b5ad";
                textColor = "#fff";
                break;
            case 3:
                icon = "icon-time";
                color = "#e07b53";
                textColor = "#fff";
                break;
            case 4:
                icon = "coding-exclamation";
                color = "#564f8a";
                textColor = "#fff";
                break;
            case 5:
                icon = "icon-flag";
                color = "#d95c5c";
                textColor = "#fff";
                break;
            case 6:
                icon = "icon-pencil";
                color = "#3b83c0";
                textColor = "#fff";
                break;
            case 7:
                icon = "icon-bullhorn";
                color = "#f2c61f";
                textColor = "#fff";
                break;
        }
        return <span className="log-icon" style={{background: color, color: textColor}}>
                <i className={icon}/>
        </span>
    }

    renderItem(log, index) {
        var user = this.state.userMap[log.user_id];
        var toUser = this.state.userMap[log.to_id];
        return <div className="logItem" key={log.id}>
            {this.renderIcon(log)}
            <span className="user">{user && user.nick_name }</span>
            <span className="text">{log.desc}</span>
            {log.type == 2 ? <span className="user">{ toUser && toUser.nick_name }</span> : ""}
            <span className="time">{new Date(parseInt(log.create_time)).Format("yyyy-MM-dd HH:mm:ss")}</span>
        </div>
    }

    onUserList(data) {
        var map = dataMapById(data.result, "id");
        this.setState({userMap: map});
    }

    load(taskId) {
        if (taskId != -1) {
            Ajax("api/log/getTaskLog", {
                taskId: taskId
            }, data => {
                this.setState({data: data.data});
            }, this);
            cacheAjax("api/project/listUser", {
                projectId: this.props.projectId
            }, this.onUserList, this);
        }
    }

    componentDidMount() {
        this.load(this.props.taskId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.taskId != this.props.taskId) {
            this.load(nextProps.taskId);
        }
    }

    render() {
        return <div className="TaskLog">
            {this.state.data.map(this.renderItem, this)}
        </div>
    }
}

export default TaskLog;