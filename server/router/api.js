import express from 'express';
import fetch from '../util/fetch';

let router=express.Router();
//这一层做的请求代理
//做api代理
router.route('*').all((req,res)=>{
    fetch(req.originalUrl,req).then((response)=>{
        let {data}=response.data;
        let jsonStr="";
        console.log("#######"+req.originalUrl);
        if(req.originalUrl=="/api/"){
          jsonStr="欢迎使用代理API"
        }else{
          try{
            jsonStr=JSON.stringify(data)
          }catch(e){
            jsonStr="不是json结构"
          }
        }
        res.send(jsonStr);
    }).catch((err)=>{
        console.log(err);
    });
})
export default router;
