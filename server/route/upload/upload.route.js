/**
 * Created by ZhangLiwei on 2017/1/17.
 */
const http = require("http");
const router = require("express").Router();
const co = require("co");
var multer  = require('multer')
var fs = require("fs");
var upload = multer({ dest: '../out/uploads/' });

router.post('/avatar', upload.single('avatar'), function(req, res) {
    console.log(req.body, req.file);
    var file=req.file;
    fs.rename(file.path,file.path+file.originalname);
    res.json({success:true,result:file.filename+file.originalname});
});

module.exports = function (app) {
    app.use("/api/upload", router);
}