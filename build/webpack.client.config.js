/**
 *  用于生成 客户端bundle.json文件
 */
require('babel-register');
var webpack=require("webpack");
const base = require('./webpack.base.config');
const merge = require('webpack-merge');
let {isProd}=require("../config");
const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = merge(base, {
    entry: {
        app: './src/entry-client.js'
        // ,
        // libs:['vue','vue-router','axios','vuex'] //依赖库
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
          cacheGroups: {
              commons: {
                  name: "libs",
                  chunks: "initial",
                  minChunks: 2
              }
          }
      }
    },
    plugins: [
        // 设置全局的环境变量 代码中可以直接使用设置的环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // 热加载
        isProd? function(){}:new webpack.HotModuleReplacementPlugin(),
        new VueSSRClientPlugin()
    ]
})
module.exports = config
