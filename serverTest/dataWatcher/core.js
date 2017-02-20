/**
 * Created by ZhangLiwei on 2017/2/11.
 */

class Holder{
    constructor(){
        this._holders=[];
    }

    add(holder){
        if(this._holders.indexOf(holder)<0) {
            this._holders.push(holder);
        }
    }

    remove(holder){
        var index=this._holders.indexOf(holder);
        this._holders.splice(index,1);
    }

    trigger(){
        this._holders.forEach(v=>v.onChange());
    }
}

class BaseData{
    constructor(holder){
        this._holder=holder;
        this._isInital=false;
    }

    setData(obj){
        let change=false;
        this._isInital=true;
        for(var i in obj){
            if(this[i]!=obj[i]) {
                change=true;
            }
            this[i] = obj[i];
        }
        if(change)this.trigger();
        return this;
    }

    isInit(){
        return this._isInital;
    }

    trigger(){
        this._holder.onChange();
    }
}



class BaseArray{
    constructor(holder){
        this.length=0;
        this._holder=holder;
    }

    push(data){
        if(data instanceof BaseData){
            Array.prototype.push.call(this, data);
        }else {
            Array.prototype.push.call(this, new BaseData(this._holder).setData(data));
        }
        this.trigger();
        return this;
    }

    remove(prop,value){
        Array.prototype.find.call(this,function (v,index) {
            if(v[prop]==value){
                Array.prototype.splice.call(this,index,1);
                this.trigger();
                return true;
            }
        },this);
    }

    trigger(){
        this._holder.onChange();
    }
}

var data=new BaseArray({
    onChange:function(){
        console.dir(data);
    }
});

data.push({name:"zhangsan"});
data.push({name:"lisi"});
data.remove("name","lisi");
data[0].setData({name:"wangwu"})