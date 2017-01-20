/**
 * common.js 这里require的都会打包到common.js中
 * 其它文件再引入不会打包
 */
var React=require("react");
var ReactDOM=require("react-dom");

window.React=React;
window.ReactDOM=ReactDOM;