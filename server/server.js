import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {env, cacheTime,conf} from '../config';
import upload from './router/upload';
import auth from './router/auth';
import index from './router/';
import fs from 'fs';
import {useLog, fileLog} from './logs/logs';
import compression from 'compression';
import userQuery from './query/userQuery';
import proxy from 'http-proxy-middleware';//引入代理中间件

let app = express();
//日志配置
useLog(app);
// 启用gzip压缩
app.use(compression({threshold: 0}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/dist', express.static(path.join(__dirname, '/../dist/')));
app.use('/assets', express.static(path.join(__dirname, '/../assets/')));
app.use((req, res, next) => {
  let date = new Date();
  date.setTime(date.getTime() + cacheTime);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cache-control", "max-age:" + cacheTime);
  res.header("Expires", date.toUTCString());
  next();
})
app.use('/assets', express.static(path.join(__dirname, '/../server/public/')));
//API映射代理 middlewares
var apiProxy = proxy('/api', {
  logLevel:env=="development"?"debug":"info",
  target: conf.api,
  changeOrigin: true,
  // 重写路径 将 /api -> target网址的 '/'路径
  pathRewrite: {
    '^/api/': '/'
  }
});
app.use(apiProxy);
app.use("/upload", upload);
app.use("/auth", auth);
//读取cookie 判断权限
app.use((req, res, next) => {
  let {token} = req.cookies;
  let url = req.originalUrl;
  // if(url.indexOf("login")>-1){
  //     console.log("登录不拦...."+url)
  //     next();
  //
  // }else{
  //     console.log("拦截器 服务器端拦截....")
  //     校验token
  //     userQuery.checkToken(token).then(({data},err)=>{
  //         let isValidate=data;
  //         console.dir(isValidate);
  //         next();
  //         if(isValidate){
  //             console.log("放过去....");
  //             next();
  //         }else{
  //             console.log("拦截....");
  //             next();
  //              res.redirect("/login");
  //         }
  //     });
  // }
  next();
});
app.all("*", index);
app.use(function(err, req, res, next) {
  console.log(err);
  if (err.code === 404) {
    res.status(404).end('Not Found!!!~')
  } else {
    let errorPath = env != "development"
      ? path.join(__dirname, "../../dist/server/page/500.html")
      : path.join(__dirname, "/page/500.html");
    fs.readFile(errorPath, (er, content) => {
      res.status(err.status || 500).end(content.toString());
    })
  }
});
export default app;
