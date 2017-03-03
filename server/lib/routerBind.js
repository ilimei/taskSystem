/**
 * Created by ZhangLiwei on 2017/2/24.
 */
var co=require("co");
const slice=Array.prototype.slice;
const Router=require("express").Router;

class RouterBind{
    constructor(){
        this._router=Router();
    }

    _makeCallbackCo(callback){
        if(isGenerator(callback)) {
            let _this=this;
            return function (req, res,next) {
                co(callback.bind(_this, req, res,next))
                    .then(_this.success.bind(this, res))
                    .catch(_this.error.bind(this, res));
            }
        }else{
            return callback;
        }
    }

    post(path){
        let _this=this;
        let params=slice.call(arguments,1).map(function (callback) {
            return this._makeCallbackCo(callback);
        },this);
        params.unshift(path);
        this._router.post.apply(this._router,params);
    }

    use(callback){
        this._router.use(this._makeCallbackCo(callback));
    }

    success(res,data){
        if(data) {//不返回值时不做处理
            res.json({success: true, data: data});
        }
    }

    error(res,e){
        console.error(e);
        res.json({success:false,msg:e});
    }

    get(){
        return this._router;
    }
}

module.exports=function () {
    return new RouterBind();
};