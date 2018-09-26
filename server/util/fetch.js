/**
 * 服务端接口转发
 */
import axios from 'axios';
import {env,conf} from '../../config';


var instance = axios.create({
    baseURL: '/',
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'},
    withCredentials:true
});
// axios.defaults.withCredentials = true;

let replaceReg=(str)=>{
    var reg = /\b(\w)|\s(\w)/g;
    str = str.toLowerCase();
    return str.replace(reg,function(m){return m.toUpperCase()})
}

let createHeader=(header)=>{
    let headers={};
    Object.keys(header).forEach((key)=>{
        headers[replaceReg(key)]=header[key];
    })
    return headers;
}


//转发请求
export default function(url,req,type,para){
    let apiURl=conf.api;
    if(url.indexOf("/api/")>-1){
        let urlReg=/(\/\w+)/;
        let  query="";
        let pathName="";
        let queryStr="";
        if(url.indexOf('?')==-1){
            url=url.replace(urlReg,'');
            url=apiURl+url;
        }else{
            query=url.split('?');
            pathName=query[0];
            queryStr=query[1]==undefined?"":query[1];
            pathName=pathName.replace(urlReg,'');
            url=apiURl+pathName+"?"+queryStr;
        }
    }

    let params={};
    let method="GET";
    if(req){
        method=req.method;
        //将tooken放入头部
        console.log("$$$$$$$$$$$$$$$$$$"+JSON.stringify(req.originalUrl));
        if(req.cookies.token){
            instance.defaults.headers.common['token'] = req.cookies.token;
        }
        // console.log(req.cookies.token);
        // axios.defaults.headers.common['token'] =req.cookies.token;

    }else if(type){
        method=type;
    }
    if(method=="POST"&&req){
        params=req.body;
    }else if(method=="POST"&&para){
        params=para;
    }
    console.log("代理后的url地址[%s]",url)
    console.log("Method [%s]",method)
    console.log("params [%s]",JSON.stringify(params))
    return new Promise((resolve,reject)=>{
        instance[method.toLowerCase()](url,params)
            .then((data)=>{

            var info= {
                data,
                err:null
            }
            resolve(info);
        }).catch((err)=>{
            console.log("err-----"+err.message);
            var info= {
                data:null,
                err:err
            }
            reject(info);
        });
    })
}
