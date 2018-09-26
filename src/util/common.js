import {conf} from "../../config";
import fetch from "./fetch";

let common={
   proxyAjaxPromise(method,url,params) {
    return new Promise((resolve,reject)=>{
        fetch[method](`${conf.base}/api/${url}`,params).then((response)=>{
            let {data}=response;
            console.log("data>>>>>"+data);
            resolve(data);
        }).cache((err)=>{
            console.log(err);
            reject(err)
        })
    });
 }
}
export default common;