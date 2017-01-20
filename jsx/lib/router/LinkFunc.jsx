module.exports=function(path){
    if(path.startsWith("/")){
        path=location.origin+path;
    }
    history.pushState({},"",path);
    EventSpider.trigger("urlChange");
}