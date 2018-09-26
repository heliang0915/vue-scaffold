/**
 * HEADER 管理
 * @author heliang0915
 */
import config from "../../config";
let isServer=config.isServer;//config.isServer;
function getTitle(vm){
    let {title}=vm.$options;
    if(title){
        return typeof title ==="function"?title.call(vm):title;
    }
}
const serverTitleMixin={
   created(){
       let title=getTitle(this);
       if (title) {
           this.$ssrContext.title=`${title}`;
       }
   }
}
const clientTitleMixin={
    mounted(){
        let title=getTitle(this);
        if(title){
            document.title=`${title}`;
        }
    }
}
export default isServer?serverTitleMixin:clientTitleMixin;
