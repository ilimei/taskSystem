function BaseClass(){
}

BaseClass.prototype.callSuper=function(name){
	var superClass = this.constructor._super_;
	if(superClass&&superClass.prototype){
		this.constructor=superClass.prototype.constructor;
		if(typeof superClass.prototype[name]=="function"){
			var args=Array.prototype.slice.call(arguments,1);
            superClass.prototype[name].apply(this,args);
		}
		delete this.constructor;
	}
}

function createClass(obj,parent,name){
	name=name||"Class";
	var Class=eval(`(function ${name}(){
		if(typeof this.init=="function"){
			this.init.apply(this,arguments);
		}
	})`);
	if(parent){
		Class._super_=parent;
		Class.prototype=Object.create(parent.prototype,{
		    constructor: {
		      value: Class,
		      enumerable: false,
		      writable: true,
		      configurable: true
		    }
		});
	}else{
		Class.prototype=Object.create(BaseClass.prototype,{
		    constructor: {
		      value: Class,
		      enumerable: false,
		      writable: true,
		      configurable: true
		    }
		});
	}
	Class.prototype=Object.assign(Class.prototype,obj);
	return Class;
};

module.exports=createClass;