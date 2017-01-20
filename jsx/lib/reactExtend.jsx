var React = require("react");
/***
 * 实现React.createClass 继承 且子类可以getInitialState 会有父类的GetIbi合并
 * @param parentClass {function}
 * @param spesc {Object}
 * @return {Class|Function}
 */
React.extend=function(parentClass, spesc){
    var getInitialState;
    var Class=function(){
        parentClass.apply(this,arguments);
        if(getInitialState) {
            var nState = getInitialState.call(this);
            for (var i in nState) {
                this.state[i] = nState[i];
            }
        }
    }
    Class.prototype=new parentClass({});
    Class.prototype.constructor=Class;
    var arr=Class.prototype.__reactAutoBindPairs=parentClass.prototype.__reactAutoBindPairs.map(function(v){
        return v;
    });
    for(var name in spesc){
        if(!_.isFunction(spesc[name]))
            continue;
        if(name=="getInitialState"){
            getInitialState=spesc[name];
            continue;
        }
        var index=arr.indexOf(name);
        if(index>=0){
            arr[index]=name;
            arr[index+1]=spesc[name];
        }else{
            arr.push(name);
            arr.push(spesc[name]);
        }
    }
    return Class;
}