/**
 * vuex store
 */
import Vue from 'vue';
import Vuex from 'vuex';
import config from "../../config";
let isServer=config.isServer;
import index from './modules/index';
// console.log("Vue.use(Vuex)......."+isServer);
if(isServer){
  Vue.use(Vuex);
}
var store=new Vuex.Store({
    modules:{
      index
    }
})

export default  store;
