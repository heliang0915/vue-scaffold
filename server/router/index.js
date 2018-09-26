import express  from 'express';
import fs  from 'fs';
import path  from 'path';
import minify from 'html-minifier';
import  {env} from '../../config';
const {createBundleRenderer} = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);
const serverBundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');

let router=express.Router();
let templatePath=env!="development"?path.join(__dirname,"../../dist/server/template/template.html"):path.join(__dirname,"../template/template.html");
let template = fs.readFileSync(templatePath,'utf-8');
let renderer=createBundleRenderer(serverBundle,{
    template,
    clientManifest,
    basedir: resolve('../../dist'),
    runInNewContext: false
});
//同构路由 使得vue前后端公用一套路由
router.route("*").all((req,res,next)=>{
    let context={
        url:req.originalUrl,
        title:"server index"
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
           console.log(err);
            next(err);
        } else {
          if(env!="development"){
              //压缩html代码
              html=minify.minify(html,{
                  collapseWhitespace:true,
                  removeEmptyAttributes:true,
                  minifyJS:true,
                  minifyCSS:true
              })
          }
            res.end(html);
        }
    })
})
export default router;
