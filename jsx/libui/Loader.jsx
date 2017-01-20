var React = require("react");

var Loader = React.createClass({
    getInitialState: function () {
        return {
            state: 1,
            text: "数据加载中",
            show: false,
            index: 0
        }
    },
    show: function (text) {
        var index = ++this.state.index;
        this.setState({
            show: true,
            state: 1,
            text: text || "数据加载中"
        });
    },
    hide: function () {
        if (!this.state.show) {
            return;
        }
        var index = --this.state.index;
        if (index <= 0) {
            this.ok();
        }
    },
    ok: function () {
        var self = this;
        self.setState({
            state: 0,
            index: 0,
            text: "数据加载成功",
            show: true
        });
        setTimeout(function () {
            self.setState({
                index: 0,
                state: 1,
                text: "数据加载中",
                show: false
            });
        }, 500);
    },
    error: function (msg) {
        if (!this.state.show)
            return;
        var self = this;
        self.setState({
            state: 2,
            index: 0,
            text: msg,
            show: true
        });
        setTimeout(function () {
            self.setState({
                index: 0,
                state: 1,
                text: "数据加载中",
                show: false
            });
        }, 1000);
    },
    getIcon: function () {
        var st = this.state.state;
        if (st == 1) {
            return <i className="icon-spinner icon-spin"/>;
        } else if (st == 0) {
            return <i className="icon-ok"/>
        } else if (st == 2) {
            return <i className="icon-warning-sign" style={{color: "red"}}/>
        }
    },
    render: function () {
        var objs = {
            display: (this.state.show ? "block" : "none")
        };
        return <div className="Loader progress_modal" style={objs}>
            <div className="borderBg">
                {this.getIcon()}
                <div>
                    {this.state.text}
                </div>
            </div>
        </div>
    }
});

module.exports = Loader;