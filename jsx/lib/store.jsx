var data={};
var listener={};

exports.get=function(key){
    return data[key];
}

exports.on=function(key,func){
    if(Array.isArray(key)){
        key.forEach(function(key,index){
            if(!Array.isArray(listener[key])){
                listener[key]=[];
            }
            listener[key].push(func);
        });
    }else{
        if(!Array.isArray(listener[key])){
            listener[key]=[];
        }
        listener[key].push(func);
    }
    func.keys=key;
    return func;
}

exports.un=function(func){
    if(func.keys){
        if(Array.isArray(func.keys)){
            func.keys.forEach(function(key){
                var ons=listener[func.key];
                ons.splice(ons.indexOf(func),1);
            });
        }else{
            var ons=listener[func.keys];
            ons.splice(ons.indexOf(func),1);
        }
    }
}

function trigger(key){
    if(Array.isArray(listener[key])){
        listener[key].forEach(function(func){
            callAsFunc(func);
        });
    }
}

exports.set=function(key,value){
    data[key]=value;
    trigger(key);
    return exports;
}