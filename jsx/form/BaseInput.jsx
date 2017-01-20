var React = require("react");

var BaseInput = React.createClass({
    getInitialState: function () {
        var checkFuncs = [];// 定义一个数组
        this.addDefaultCheckFunc(checkFuncs); // 添加默认的检查方法
        callAsFunc(this.props.register, [this]);
        return {
            value: "",
            checkFuncs: checkFuncs,
            error: null
        }
    },
    addDefaultCheckFunc: function (checkFuncs) {
        if (this.props.noEmpty) {
            checkFuncs.push(function (v) {
                if (v == "") {
                    return "不能为空";
                }
            });
        }
        if (this.props.minLength) {
            checkFuncs.push(function (v) {
                if (v.length < this.props.minLength) {
                    return "长度不能小于" + this.props.minLength;
                }
            });
        }
        if (this.props.maxLength) {
            checkFuncs.push(function (v) {
                if (v.length > this.props.maxLength) {
                    return "长度不能大于" + this.props.maxLength;
                }
            });
        }
        if (Array.isArray(this.props.checks)) {
            this.props.checks.map(function (v) {
                checkFuncs.push(v);
            })
        }
    },
    check: function () {
        var value = this.state.value;
        var hasError=false;
        this.state.checkFuncs.every(function(v,index){
            var error=callAsFunc(v, [value], this);
            if(error){
                this.setState({error:error});
                hasError=true;
                return false;
            }
            return true;
        },this);
        if(!hasError){
            this.setState({error:null});
        }
        return hasError;
    },
    render: function () {
        throw new Error("BaseInput必须被子类实现");
    }
});

module.exports = BaseInput;