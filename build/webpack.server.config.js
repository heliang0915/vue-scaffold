/**
 * 服务端配置 用于生成 服务器端bundle.json文件
 */
require('babel-register');
var webpack = require("webpack");
const base = require('./webpack.base.config');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

let config = merge(base, {
    target: 'node',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    //定义node编译时的白名单
    externals: nodeExternals({
        whitelist:[/\.css$/,/\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/]
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin()
    ]
})


module.exports = config;
