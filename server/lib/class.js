function BaseClass(){
}

BaseClass.prototype.callSuper=function(name){
	var superPrototype = this.constructor.super_;
	if(superPrototype&&superPrototype.prototype){
		this.constructor=superPrototype.prototype.constructor;
		if(typeof superPrototype.prototype[name]=="function"){
			var args=Array.prototype.slice.call(arguments,1);
			superPrototype.prototype[name].apply(this,args);
		}
		delete this.constructor;
	}
}

function createClass(obj,parent,name){
	name=name||"Class";
	var Class=eval("(function "+name+"(){\
		if(typeof this.init==\"function\"){\
			this.init.apply(this,arguments);\
		}\
	})");
	if(parent){
		Class.super_=parent;
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
	for(var i in obj){
		Class.prototype[i]=obj[i];
	}	
	return Class;
};

module.exports=createClass;