/**
 * 客户端路由
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

// import  component from './asyncRoutes';

// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
const index = () => import(/* webpackChunkName: 'asyncRoutes' */ '../views/index.vue')
const test = () => import(/* webpackChunkName: 'asyncRoutes' */ '../views/test/test.vue')
const notFound = () => import(/* webpackChunkName: 'asyncRoutes' */ '../views/NotFound.vue')



Vue.use(VueRouter);
export function createRouter() {
    return new VueRouter(getConfig());
}


let routes=[
    { path: '/index', component: index},
    { path: '/test', component: test},
    { path: '*', component: notFound},
];
let getConfig = () => {
    let config = {};
    config.mode = "history";
    config.fallback=false;
    config.routes = routes
    return config;
};
