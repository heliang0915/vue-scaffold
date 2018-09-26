/**
 * 读取指webpack生成模板 并混入vue服务器端html代码
 */
import  fs from 'fs';
import  path from 'path';
import {env} from '../config';
let reg=/{{(\w+)}}/g;
let helper={
    getHTMLFormTemplate(templateName,data,cb){
        let filePath=path.join(__dirname,"/../build/"+env+"/"+templateName+".html");
        fs.readFile(filePath,"utf8",(err,page)=>{
           let html="";
            if(err!=undefined){
                html=err.message;
            }else{
                html=page.replace(reg,function(){
                    var key=arguments[1];
                    return data[key];
                })
            }
            err!=undefined?cb(err,null):cb(null,html);
        })
    }
}
export default helper;