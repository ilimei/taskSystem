var emptyFn=function(){};
var StartX,StartY;
var ObjectX=0,ObjectY;
var obj=null;
var oldLeft=0;
var target=null;
var ObjectDragPos=emptyFn;
var ObjectDragEnd=emptyFn;

function MouseMove(e){
	var dx=e.pageX-StartX;
	var dy=e.pageY-StartY;
	callAsFunc(ObjectDragPos,[ObjectX+dx,ObjectY+dy,dx,dy]);
}

function MouseUp(e){
	document.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	document.removeEventListener("mousemove", MouseMove);
	document.removeEventListener("mouseup", MouseUp);
	callAsFunc(ObjectDragEnd,[e]);
}

/**
 * 移动函数
 * @param pageX pageX 当前pageX
 * @param pageY pageY 当前pageY
 * @param objX 待移动对象的初始X
 * @param objY 待移动对象的初始Y
 * @param dragPos function(x,y,dx,dy){}
 * @param dragEnd function(){}
 */
function mover(pageX,pageY,objX,objY,dragPos,dragEnd){
	StartY=pageY;
	StartX=pageX;
	ObjectX=objX;
	ObjectY=objY;
	ObjectDragPos=dragPos||emptyFn;
	ObjectDragEnd=dragEnd||emptyFn;
	document.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	document.addEventListener("mousemove", MouseMove);
	document.addEventListener("mouseup", MouseUp);
}

module.exports=mover;