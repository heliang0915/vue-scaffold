/**
 * API 查询类
 */
import fetch from "../util/fetch";
import  {conf} from '../../config';
let {host,port}=conf;
let APIBase=`${host}:${port}`;
let indexQuery={
     getIndexData(){
       return  new Promise((reslove,reject)=>{
           fetch.get(`${APIBase}/api/web/channelChild/7adefbfa10bf43ee85ca60a0020d2ff6`).then((res)=>res.data).then((data)=>{
               reslove(data)
           }).catch((err)=>{
               reject(err);
           });
       })
    }
}
export default indexQuery;
