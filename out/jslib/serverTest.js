// 创建一个Socket实例
// var socket = new WebSocket('ws://localhost:8808/socket.io/');
// // 打开Socket 
// socket.onopen = function(event) {
// 	console.log("has connected the server");
// }

// // 监听Socket的关闭
// socket.onclose = function(event) {
// 	console.dir(event);
//     // window.location.href=window.location.href;
// };

// 创建Socket.IO实例，建立连接
var socket = io('http://localhost:8808');

socket.on("msg",function(data){
	if(data=="refresh"){
		window.location.href=window.location.href;
	}
});

// 添加一个连接监听器
socket.on('connect',function() { 
  console.log("has connected the server"); 
});

// 添加一个关闭连接的监听器
socket.on('disconnect',function() { 
   console.log('The client has disconnected!');
   window.location.href=window.location.href;
}); 