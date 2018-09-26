import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {env, cacheTime} from '../config';
import api from './router/api';
import upload from './router/upload';
import auth from './router/auth';
// import {useLog,fileLog} from './logs/logs';
import index from './router/';
import fs from 'fs';
import {useLog, fileLog} from './logs/logs';
import compression from 'compression';
import userQuery from './query/userQuery';


// console.log("ip##########"+helper);
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
app.use("/api/", api);
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
if (env != "development") {
  app.use(express.static(path.join(__dirname, "/../build/" + env)));
  app.use(express.static(path.join(__dirname, "/../build/server")));
  console.log("生产状态：静态目录地址===" + path.join(__dirname, "/../build/" + env));
} else {
  app.use(express.static(path.join(__dirname, "/../build/" + env)));
  app.use(express.static(path.join(__dirname, "/../build/dev_server")));
  console.log("开发状态：静态目录地址===" + path.join(__dirname, "/../build/" + env));

}
export default app;
