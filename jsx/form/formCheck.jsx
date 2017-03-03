var React = require("react");
function stepChild(children, cb) {
    var nChildren = React.Children.toArray(children).map(function (v, index) {
        return cb(v, index);
    });
    return nChildren;
}

/***
 * 表单检查 可以当一个普通的div用
 * 会自动遍历下属元素 （包括孙子元素） 如果有check方法的 就注入register props
 * check组件需要把自身的注入到register里 方便check统一调用
 * <FormCheck className="xx" style={{color:"red"}} ref="formCheck"><input /></FormCheck>
 *
 * if(this.refs["formCheck"].check()){alert("表单有错误");}
 *
 * @type {FormCheck}
 */
var FormCheck = React.createClass({
    getInitialState: function () {
        return {
            checkDOMS: []
        }
    },
    /**
     * 注册检查的dom组件
     * @param checkDOM
     */
    register(checkDOM){
        this.state.checkDOMS.push(checkDOM);
    },
    /***
     * 检查是否表单有报错
     *      返回true表示有错误
     *      返回false表示无错误
     * @return {boolean}
     */
    check: function () {
        return this.state.checkDOMS.reduce(function (prev, curr) {
            return curr.check() || prev;
        }, false);
    },
    onChildCheck: function (v, index) {
        if (v && v.type && v.type.prototype && typeof v.type.prototype.check == "function") {
            return React.cloneElement(v, {
                register: this.register,
                key: index
            }, stepChild(v.props.child, this.onChildCheck));
        }
        return v;
    },
    render: function () {
        return <div {...this.props}>
            {stepChild(this.props.children, this.onChildCheck)}
        </div>
    }
});

module.exports = FormCheck;