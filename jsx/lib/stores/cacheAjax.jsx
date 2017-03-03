"use strict";

/**
 * Created by ZhangLiwei on 2017/1/22.
 */

/***
 * 键值排序 并返回json字符串
 */
function hashParam(obj) {
    var keyMap = [];
    for (var i in obj) {
        keyMap.push(i);
    }
    keyMap.sort();
    var nobj = {};
    keyMap.forEach(function (v) {
        nobj[v] = obj[v] + "";
    });
    return JSON.stringify(nobj);
}

function makeKey(url, param) {
    return url + hashParam(param);
}

var Cache = {
    DBStore: {},
    Listener: {},
    state:{}
};

window.cacheAjax = function (url, param, callback, obj) {
    var key = makeKey(url, param);
    var {state}=Cache;
    if (!Array.isArray(Cache.Listener[key])) {
        Cache.Listener[key] = [];
    }
    Cache.Listener[key].push([callback,obj]);
    if (Cache.DBStore[key]) {
        callback.call(obj, Cache.DBStore[key]);
    } else {
        if(state[key]=="pending")return;
        state[key]="pending"
        Ajax(url, param,function(data){
            state[key]="done";
            Cache.DBStore[key]=data;
            cacheAjaxTrigger(key);
        });
    }
};

window.cacheAjaxUpdate = function (url, param, obj) {
    var key = makeKey(url, param);
    Cache.DBStore[key]=obj;
    cacheAjaxTrigger(key);
};

function cacheAjaxTrigger(key){
    var store = Cache.DBStore[key];
    if (Array.isArray(Cache.Listener[key])) {
        Cache.Listener[key].forEach(function (c) {
            callAsFunc(c[0], [store],c[1]);
        });
    }
}


window.dataPropArr=function(data,key){
    if(Array.isArray(data)){
        return data.map(function(v){
            return v[key];
        });
    }else{
        throw new TypeError("the first param data must be Array");
    }
}

window.dataMapById=function(data,key){
    if(Array.isArray(data)){
        var map={};
        data.forEach(function(v){
            map[v[key]]=v;
        });
        return map;
    }else{
        throw new TypeError("the first param data must be Array");
    }
}

EventSpider.on("urlChange", function () {
    Cache.Listener = {};
    Cache.DBStore = {};
    Cache.state={};
});