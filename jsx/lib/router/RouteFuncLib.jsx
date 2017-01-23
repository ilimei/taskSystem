exports.DEBUG=false;
exports.shouldUpdate=false;
function log(){
    if(exports.DEBUG){
        console.log.apply(console,arguments);
    }
}
exports.log=log;

function rmEmptyPath(arr){
    for(var i=0,len=arr.length;i<len;i++){
        if(arr[i]==""){
            arr.splice(i,1);
            i--;
        }
    }
}

function isMatch(path,matchPath,param){
    log("isMatch",path,matchPath);
    if(path=="*"){
        return true;
    }
    if(path.startsWith(":")){
        var paramName=path.replace(/^\:/,"");
        param[paramName]=matchPath;
        return true;
    }
    return (path==matchPath);
}


function matchPath(path, arr,param) {
    var paths=path.split(/\//g);
    rmEmptyPath(paths);
    log(paths);
    log(arr);
    var testParam={};
    for(var i=0,len=paths.length;i<len;i++) {
        var p = paths[i];
        var mp = arr[i];
        if (!isMatch(p, mp, testParam)) {
            log("isMatch return false");
            return false;
        }
        log("isMatch return true");
    }
    for(var i in testParam){
        param[i]=testParam[i];
    }
    var re=arr.splice(0,len).join("/");
    return re||"/";
}
exports.matchPath=matchPath;
exports.rmEmptyPath=rmEmptyPath;