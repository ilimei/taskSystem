const g=window;

const _WEEK=["周日","周一","周二","周三","周四","周五","周六"];
const _DATE=["前天","昨天","今天","明天","后天"];
const MINUTE_SECOND=60;
const HOUR_SECOND=3600;
const DAY_SECOND=24*HOUR_SECOND;
const WEEK_SECOND=7*DAY_SECOND;
/***
 * 获取时间的语义表示
 * @param targetDate {Date}
 * @return {string}
 * @constructor
 */
function WHEN(targetDate){
    var now=new Date();
    var t=(now-targetDate)/1000;
    var tail=t>0?"前":"后";
    if(t<0)t=-t;
    if(t>=0&&t<MINUTE_SECOND){
        return Math.floor(t)+"秒"+tail;
    }else if(t>=MINUTE_SECOND&&t<HOUR_SECOND){
        return Math.floor(t/MINUTE_SECOND)+"分"+tail;
    }else if(t>=HOUR_SECOND&&t<DAY_SECOND){
        return Math.floor(t/HOUR_SECOND)+"小时"+tail;
    }else if(t>=DAY_SECOND&&t<WEEK_SECOND){
        return Math.floor(t/(DAY_SECOND))+"天"+tail;
    }else if(t>=WEEK_SECOND){
        return targetDate.Format("yyyy年MM月dd日");
    }
}
g.WHEN=WHEN;
/***
 * 获取周一
 * @param date {Date}
 * @return {number}
 */
function getMonday(date){
    var week=date.getDay();
    if(week==0){
        return (date.getTime()-6*DAY_SECOND*1000);
    }else{
        return (date.getTime()-(week-1)*DAY_SECOND*1000);
    }
}
/***
 * 获取天的语义表示
 * @param targetDate {Date}
 * @return {string}
 * @constructor
 */
function WITCH_DAY(targetDate){
    var now=new Date();
    now=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    targetDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate());
    var isSameWeek=getMonday(now)==getMonday(targetDate);
    var dt=Math.floor((now-targetDate)/DAY_SECOND/1000);//天数时间差
    if(dt>=-2&&dt<=2){
        return _DATE[-dt+2];
    }
    if(isSameWeek){
        return _WEEK[targetDate.getDay()];
    }else if(dt>-14&&dt<14){
        if(dt<0){
            return "下"+_WEEK[targetDate.getDay()];
        }else{
            return "上"+_WEEK[targetDate.getDay()];
        }
    }
    return targetDate.Format("yyyy年MM月dd日");
}
g.WITCH_DAY=WITCH_DAY;

g.GUID=function(){
    var gStr = "";
    var i = 32;
    while(i--){
        gStr += Math.floor(Math.random()*16.0).toString(16);
    }
    var str = gStr.slice(0, 8);
        str+="-";
        str+=gStr.slice(8, 12);
        str+="-";
        str+=gStr.slice(12, 16);
        str+="-";
        str+=gStr.slice(16, 20);
        str+="-";
        str+=gStr.slice(20,32);
    return str;
}

g.CS=function(obj){
    var classes=[];
    for(var i in obj){
        if(obj[i]){
            classes.push(i);
        }
    }
    return classes.concat(Array.prototype.slice.call(arguments,1)).join(" ")
}
/***
 * 延时执行 防止多次执行
 * 以最后一次为准
 * this.timerId=delayFunc(callback,300,this.timerId,param,this);
 *
 * @param func  要被执行的function
 * @param delay 延时时间
 * @param timerId 上次返回的的timerId
 * @param param   执行的参数
 * @param obj     执行的thisObj
 * @return {number|Object}
 */
g.delayFunc=function(func,delay,timerId,param,obj){
    clearTimeout(timerId);
    return setTimeout(function(){
        func.call(obj,param);
    },delay);
}

String.prototype.trim=function(){
    return this.replace(/^\s*|\s*$/g,"");
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "H+" : this.getHours(24),                 //小时
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

g.makeLen=function(v,len){
    if(v.length>len){
        return v.slice(v.length-len);
    }
    return "0".repeat(len-v.length)+v;
}

/***
 * 类型判断
 * @type {{isString: Window._.isString, isArray: Window._.isArray, isRegExp: Window._.isRegExp, isObject: Window._.isObject, isFunction: Window._.isFunction, extend: Window._.extend}}
 * @private
 */
g._=Object.create({},{
    isString:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(o){
            return typeof o=="string";
        }
    },
    isArray:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(o){
            return Array.isArray(o);
        }
    },
    isRegExp:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(o){
            return o instanceof RegExp;
        }
    },
    isObject:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(o){
            return !this.isArray(o)&&!this.isRegExp(o)&&(typeof o=="object");
        }
    },
    isFunction:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(o){
            return typeof o=="function";
        }
    },
    mixin:{
        enumerable: true,
        writable: false,
        configurable: true,
        value:function(){
            return Object.assign.apply(arguments);
        }
    }
});
/***
 * 重写setTimeout
 * @type {*}
 */
var oldSetTimeout=g.setTimeout;
g.setTimeout=function(cb,time,obj){
    return oldSetTimeout(cb.bind(obj),time);
};

/**
 * 对子元素进行快速分组 通过子元素是否设置boolean的子属性
 * @param children 子元素
 * @param arr  分组属性 例如 ["btn","head"]
 * @return {}  例如 { btn:[],head:[],default:[] }
 */
g.CTA=function(children,arr){
    children=React.Children.toArray(children);
    var re={"default":[]};
    arr.forEach(function(v){
        re[v]=[];
    });
    children.forEach(function(child,index){
        if(!child)return;
        var v=arr.find(function(v){
            return child.props[v];
        });
        if(!v){
            re.default.push(child);
        }else {
            re[v].push(child);
        }
    });
    return re;
}

g.stopEvent=function(e){
    e.stopPropagation();
    e.preventDefault();
}

g.PostFormData=function(url,formData){
    loader.show();
    if(!url.startsWith("http")){
        url=ReqUrl+url;
    }
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest();
        // 打开连接。
        xhr.open('POST', url, true);
        // 请求完成时建立一个处理程序。
        xhr.onload = function () {
            if (xhr.status === 200) {
                loader.hide();
                var data = JSON.parse(xhr.responseText);
                resolve(data);
            } else {
                reject('An error occurred!');
            }
        };
        // 发送数据。
        xhr.send(formData);
    });
}