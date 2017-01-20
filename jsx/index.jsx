var React = require("react");
var ReactDOM = require("react-dom");
window.React = React;
window.ReactDOM = ReactDOM;
require("./globalFunc");
require("./ui/Confirm");
var Main = require("./lib/base");
var Router = require("./lib/router/Router");
var Route = require("./lib/router/Route");
var RedirectRoute = require("./lib/router/RedirectRoute");

var Base = React.createClass({
    render: function () {
        return <div className="Base">
            {this.props.children}
        </div>
    }
});

var Div = React.createClass({
    render: function () {
        return <div className="Div">
            {this.props.children}
        </div>
    }
});

window.Div = Div;

var Test = React.createClass({
    componentDidUpdate: function () {
        console.info("componentDidUpdate " + this.props.name);
    },
    componentDidMount: function () {
        console.info("componentDidMount " + this.props.name);
    },
    componentWillMount: function () {
        console.info("componentWillMount " + this.props.name);
    },
    render: function () {
        console.info("render " + this.props.name);
        return <div className="Test">
            {this.props.children}
        </div>
    }
});

var TestContainer = React.createClass({
    render: function () {
        return <Test name="root">
            <Test name="leaf1"/>
            <Test name="leaf2"/>
        </Test>
    }
});

window.onload = function () {
    ReactDOM.render(<Main/>, document.body)
        .setState({
            child: <Router>
                <Route path="/login" component={require("./page/Login")}/>
                <Route path="/register" component={require("./page/Register")}/>
                <Route path="/user" component={require("./page/User")}></Route>
                <Route path="/project/:id" component={require("./page/Project")}></Route>
                <RedirectRoute to="/login"/>
            </Router>
        });
};
