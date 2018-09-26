/*
* ZImg client
* zImg图片服务器
*
* */

import {env,conf} from '../../config';
let request = require("request");
var cheerio = require('cheerio');
var formstream = require('formstream');


function ZImgCli() {
    this.host = conf.zimg.host;
    this.uploadPath = conf.zimg.uploadPath;
    this.port = conf.zimg.port;
    this.uploadDo = conf.zimg.zImgUpload;
    this.deleteDo = conf.zimg.zImgDelete;
}

ZImgCli.prop = ZImgCli.prototype;
ZImgCli.prop.XHR =function (url, opt, callback) {
    let defaultOpt = {
        method: 'GET',
    };
    if (typeof opt == "function") {
        callback = opt;
        opt = {};
    }
    let options = Object.assign({}, defaultOpt, opt);
    console.log("url>>>"+url);
    var req = request(url, options, (err, res, body) => {
        if(err){
            console.log("出现错误%s", err);
        }
        callback==null?null:callback(err, body);
    })
    return req;
}
ZImgCli.prop.upload = function (filePath, file, formFiledName, callback) {
    //参数1 上传Form字段名  参数2上传路径  参数3上传文件原始文件名 参数4文件大小
    var form = formstream();
    form.file(formFiledName, filePath, file.originalFilename, file.size);
    var options = {
        method: 'POST',
        headers: form.headers()
    };
    console.log("准备发送请求....");
    var req = this.XHR(this.uploadDo, options, (err, html) => {
        if(html){
            const $ = cheerio.load(html);
            let title=$('title').text();
            let md5 = "";
            if(title.indexOf("Upload Result")>-1){
                md5 = $('a').attr('href');
            }else if(title.indexOf("413 Request Entity Too Large")>-1){
                err="图片太大";
            }
            if (callback) {
                callback(err, md5);
            }
        }else{
            callback(err, 0);
        }
    })
    form.pipe(req);
}

ZImgCli.prop.delete=function (md5,callback) {
    md5=md5.replace('/','');
    let url=`${this.deleteDo}?md5=${md5}&t=1`;
    this.XHR(url,(err, html) => {
        console.log("执行删除动作,地址:"+url);
        const $ = cheerio.load(html);
        callback=callback==null?function () {}:callback
        if(html.indexOf("Admin Command Successful!")>-1){
            callback(null);
        }else{
            let tx=$('p').eq(2).text();
            callback(tx);
        }
    })
}
module.exports = new ZImgCli();