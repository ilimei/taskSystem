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

function NativeDom(props){
    const {Name="div",...rest}=props;
    if(rest.np) {
        var nprop={};
        if(Array.isArray(rest.np)){
            for(var i in rest){
                if(i!='np'&&!rest.np.indexOf(i)){
                    nprop[i]=rest[i];
                }
            }
        }else{
            for(var i in rest){
                if(i!='np'&&i!=rest.np){
                    nprop[i]=rest[i];
                }
            }
        }
        return React.createElement(Name,nprop,props.children);
    }else{
        return React.createElement(Name,rest,props.children);
    }
}

window.NativeDom = NativeDom;

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
