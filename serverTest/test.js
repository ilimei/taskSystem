/**
 * 测试入口
 * Created by ZhangLiwei on 2017/2/9.
 */
process.chdir(__dirname);//重置工作目录
// var {getTestPool}=require("./config");
// var http=require("http");
// var parse=require("url").parse;
// const log=console.info.bind(console);
// const DB=require("../server/lib/transactionDB.class.js");
// const co=require("co");
//
// const url="http://sma.ceboss.cn/CustomerApp/customer/custResource/findCustResource.action";
//
// var opt=parse(url);
// opt.method="POST";
// opt.headers={
//     Accept: "application/json, text/javascript, */*; q=0.01",
//     "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
//     "ajaxRequest":"true",
//     "X-Requested-With":"XMLHttpRequest",
//     "Accept-Encoding":"gzip, deflate",
//     Cookie:`JSESSIONID=4E1AE4B0CDCD2735758EA9083DC6967B-n2; ICP_COOKIE_LOGIN_KEY=cname%3D%E6%9D%A8%E4%B8%BD%E7%BE%8E%7Ccompanyid%3D139%7Ccompanyname%3D%E5%A4%A7%E8%BF%9E%E5%88%86%E5%85%AC%E5%8F%B8%7Crole%3D; loginMail="userid=55975|loginname=dlyanglimei@300.cn|source=SOURCE_001"; COOKIES_LOGIN_KEY=9z8r-4to_dJi0Lv2Hj3vKaI4oAQCedvFIMYZTZnOpCY`
// }
// function query(page,cb,errCb) {
//     var req=http.request(opt,res=>{
//         log('STATUS: ' + res.statusCode);
//         log('HEADERS: ' + JSON.stringify(res.headers));
//         var chunks=[];
//         res.on('data', function (chunk) {
//             chunks.push(chunk.toString("utf8"));
//         });
//         res.on("end",function(){
//             console.info(chunks.join(""));
//             var data=JSON.parse(chunks.join(""));
//             var pool=getTestPool();
//             var sql="insert into gonghai select * from allinfodata where `entname` in (";
//             sql+=data.rows.map(function(v){
//                     return `'${v.custNameCn}'`;
//                 }).join(",")+") and pripid not in (select pripid from template)";
//             log(sql);
//             pool.query(sql,null,function(err,data){
//                 if(err){
//                     console.error(err);
//                     errCb(err);
//                 }else{
//                     console.dir(data.message);
//                     cb();
//                 }
//             })
//         });
//     });
//     req.on('error', function (e) {
//         console.info('problem with request: ' + e.message);
//     });
//     req.write("conditionsVO.sortName=createDate&conditionsVO.sortType=-1&conditionsVO.custNameCn=&conditionsVO.isGet=0&notBuyProduct=&buyProduct=&searchTagId=%5B%5D&custType=-1&pageNo="+page+"&pagesize=50");
//     req.end();
// }
//
// function QueryP(page){
//     return new Promise((resolve,reject)=>{
//         query(page,function(){
//             resolve(1);
//         },function () {
//             reject(1);
//         });
//     })
// }
//
// const start=380;
// const end=start+50;
// co(function*(){
//     for(var i=start;i<end;i++){
//         yield QueryP(i);
//     }
// }).then(()=>{
//     process.exit(1);
// }).catch(e=>{
//     console.error(e);
// });

const path = require("path");
const TestRunner = require("nodeunit").reporters.default;
require("./config")

TestRunner.run([
    path.resolve("./lib"),//测试lib下的文件
    // path.resolve("./modal/Comment.modal.js")
]);