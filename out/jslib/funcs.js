// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时
    "H+" : this.getHours(24),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
function getScript(src){
	document.write('<script type="text/javascript" src="'+src+'"></script>');
}
function getLinkSheet(src){
	document.write('<link rel="stylesheet" type="text/css" href="'+src+'">');
}
function callAsFunc(func,args,obj){
	if(typeof func=="function"){
		return func.apply(obj,args);
	}
}
function n2s(num,length){
	var str=num.toString();
	while(str.length<length){
		str="0"+str;
	}
	return str;
}

function trimStr(str){
	return str.replace(/^\s*|\s*$/,"");
}

//后台url
var ReqUrl="http://"+location.host+"/";
/***
 * ajax请求方法
 *
 * @method Ajax
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {function} callback 回调函数
 * @returns {undefined}
 */
function Ajax(url,data,callback,obj){
	loader.show();
	var xhr;
	if (window.ActiveXObject) {    
        xhr = new ActiveXObject("Microsoft.XMLHTTP");    
    }    
    else if (window.XMLHttpRequest) {    
        xhr = new XMLHttpRequest();    
    }   
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4) {
			loader.hide();
			if (xhr.status == 200) {
				var data;
				if(JSON&&JSON.parse){
					data = JSON.parse(xhr.responseText);
				}else{
					data = eval("("+xhr.responseText+")");
				}
				if (typeof(callback) == "function") {
					callback.apply(obj,[data]);
				}
			} else {
				console.dir(xhr);
			}
			xhr = null; //释放内存
		}
	};
	var sendArr=[];
	for(var i in data){
		if(data.hasOwnProperty(i)){
			sendArr.push(i+"="+encodeURIComponent(data[i]));
		}
	}
	var sendStr=sendArr.join("&");
	if(url.indexOf("http")==0){
		xhr.open("POST", url, true);
	}else{
		xhr.open("POST", ReqUrl+url, true);
	}
	xhr.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
	xhr.send(sendStr);
}

function jumpPage(page){
	window.location.href="index.html?page="+page;
}

function getCurrentPage(){
	var list=location.params.match(/[?&]page=([^&]+)/);
	return list&&list[1];
}

(function(){
	window.currentPath=window.location.pathname.replace(/^.+\/|\.html/g,"");
})();

/***
 * ajax请求方法
 *
 * @method Ajax
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {function} callback 回调函数
 * @returns {undefined}
 */
function AjaxNoLoader(url,data,callback){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = JSON.parse(xhr.responseText);
				if (typeof(callback) == "function") {
					callback(data);
				}
			} else {
				console.dir(xhr);
			}
			xhr = null; //释放内存
		}
	};
	var sendArr=[];
	for(var i in data){
		if(data.hasOwnProperty(i)){
			sendArr.push(i+"="+encodeURIComponent(data[i]));
		}
	}
	var sendStr=sendArr.join("&");
	if(url.indexOf("http")==0){
		xhr.open("POST", url, true);
	}else{
		xhr.open("POST", ReqUrl+url, true);
	}
	xhr.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
	xhr.send(sendStr);
}
/***
 *   根据object获取类名组合
 *   例如:ClassSet({"haha":true,"asd":false,"active":true})   //haha active;
 *
 * @method ClassSet
 * @param {object} obj 类名组合
 * @returns {string}
 */
function ClassSet(obj) {
	var className = [];
	for (var i in obj) {
		if (obj[i] && i != "toString") {
			className.push(i);
		}
	}
	return className.join(" ");
}

/***
 * 对象属性组合
 *
 * @method collectionObject
 * @returns {Object}
 */
function collectionObject(){
	var object={};
	for(var i=0;i<arguments.length;i++){
		var obj=arguments[i];
		for(var prop in obj){
			if(obj.hasOwnProperty(prop)){
				object[prop]=obj[prop];
			}
		}
	}
	return object;
}


/***
 * 获取html元素的绝对位置 比较消耗系统资源
 *
 * @method GetElCoordinate
 * @param {HtmlNode} e 寻找位置的html元素
 * @param {bool} bool 是否计算滚动条位置
 * @param {HtmlNode} stopParent 停止到某个htmlNode
 * @returns {object}
 */
function GetElCoordinate(e,bool,stopParent)
{
    var t = e.offsetTop;
    var l = e.offsetLeft;
    var w = e.offsetWidth;
    var h = e.offsetHeight;
    while (e = e.offsetParent)
    {
    	if(e==stopParent){
    		break;
    	}
    	if(bool){
    		t-=e.scrollTop;
    		l-=e.scrollLeft;
    	}
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    return {
        top: t,
        left: l,
        width: w,
        height: h,
        bottom: t + h,
        right: l + w
    }
}

function StopPropagation(e){
	e.stopPropagation();
}

var EventSpider=(function(){
	var map={};
	var on=function(name,func){
		if(!map[name]){
			map[name]=[];
		}
		map[name].push(func);
		return func;
	}
	var un=function(name,func){
		if(map[name]){
			var i=map[name].indexOf(func);
			map[name].splice(i,1);
		}
	}
	var trigger=function(name,args){
		var list=map[name];
		if(list){
			list.forEach(function(func){
				callAsFunc(func,args);
			});
		}
	}
	return {
		on:on,
		un:un,
		trigger:trigger
	}
})();

window.globalType="unknow";
try{
	var userAgentInfo = navigator.userAgent.toLowerCase();
	var IE=userAgentInfo.match(/msie \d+/);
	if(IE){
		window.globalType=IE[0];
	}
	var IE11=userAgentInfo.match(/rv:11/);
	if(IE11){
		window.globalType="IE11";
	}
	var CHROME=userAgentInfo.match(/chrome\/\d+/);
	if(CHROME){
		window.globalType=CHROME[0];
	}
	var FIRFOX=userAgentInfo.match(/fireFox\/\d+/);
	if(FIRFOX){
		window.globalType=(FIRFOX);
	}
	var B360SE=userAgentInfo.match(/360se/);
	if(B360SE){
		window.globalType=(B360SE);
	}
	var UCWEB=userAgentInfo.match("ucweb");
	if(UCWEB){
		window.globalType=(UCWEB);
	}
}catch(e){
}