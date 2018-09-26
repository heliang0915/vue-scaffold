'use strict';

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')
let path=require("path");
let env=process.env.NODE_ENV||"development";
let isProd=(env!="development");
// let externals = _externals();

module.exports = {
    entry: {
        app: path.join(__dirname,'/../server/app.js'),
    },
    target: 'node',
    mode:isProd?'production':'development',
    output: {
        path: path.join(__dirname,'/../dist'),
        filename: 'server/server.js'
    },
    resolve: {
        extensions: ['.js']
    },
    //定义node编译时的白名单
    externals: nodeExternals({
        whitelist:[/\.vue$/,/\.css$/,/\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/]
    }),
    // externals: externals,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // query: {
                //     presets: ['es2015','stage-0']
                // },
                exclude: /node_modules/
            },{
                test:/\.vue$/,
                loader: 'vue-loader',
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ]
};

// function _externals() {
//     let manifest = require('../package.json');
//     // console.log(manifest);
//     let dependencies = manifest.dependencies;
//     let externals = {};
//     for (let p in dependencies) {
//         externals[p] = 'commonjs ' + p;
//     }
//     // console.log("externals>>>"+JSON.stringify(externals));
//     return externals;
// }
