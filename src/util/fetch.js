import 'babel-polyfill';
import  axios from 'axios';
import Vue from 'vue';
//服务器端渲染会异常 没有document
// require('nprogress/nprogress.css')
import {isServer} from '../../config'
let NProgress = require('nprogress');
NProgress.configure({showSpinner: false});
//请求前拦截
axios.interceptors.request.use(function (config) {
    if(!isServer){
      console.log('请求前...');
      // console.log(NProgress);
        NProgress.start();
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})
// //响应前拦截
axios.interceptors.response.use(function (response) {
    if(!isServer){
        console.log('响应前...');
        NProgress.done();
    }
    return response;
}, function (error) {
    return Promise.reject(error)
})

let Fetch = {
    baseURl: "/",
    parseConfig(config){
        return config = config == null ? {} : config;
    },
    get(url, config){
        console.log(`%c Fetch GET URL => ${url}?temp=${Math.random()}`, `color:#409EFF`);
        url=url.indexOf('?')>-1?`${url}&temp=${Math.random()}`:`${url}?temp=${Math.random()}`
        return axios.get(`${url}`, this.parseConfig(config));
    },
    post(url, params, config){
        url=url.indexOf('?')>-1?`${url}&temp=${Math.random()}`:`${url}?temp=${Math.random()}`
        console.log(`%c Fetch POST URL => ${url} params:${JSON.stringify(params)}`, `color:#409EFF`);
        return axios.post(`${url}`, params, this.parseConfig(config));
    }
}
export default Fetch;
