/**
 * 基本配置
 */
var path = require('path');
const vueConfig = require('./vue-loader.config');
// var ExtractTextWebpackPlugin=require("extract-text-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack=require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var os = require("os");
var HappyPack = require('happypack');
//并行最大化处理资源
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// 部分plugin
var plugins=  isProd?
    [
        //插件可以并行运行UglifyJS插件(生产环境)
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }),
         new VueLoaderPlugin(),
         new MiniCssExtractPlugin({
              filename: "assets/css/common/[name].css"
              // ,
              // chunkFilename: "assets/css/[id].css"
        })
    ]
    :
    [new VueLoaderPlugin(),new MiniCssExtractPlugin({
         filename: "assets/css/common/common.css"
   }), new OpenBrowserPlugin({ url: 'http://localhost:9100/index' }),new FriendlyErrorsPlugin()]

   plugins=plugins.concat([
     //公共plugin
     new HappyPack({
       id: 'happybabel',
       loaders: ['babel-loader?cacheDirectory=true'],
       threadPool: happyThreadPool,
       // cache: true,
       //允许 HappyPack 输出日志
       verbose: true
     })

   ])



//定义公共路径
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH=path.resolve(ROOT_PATH,'../dist');
let env=process.env.NODE_ENV||"development";
let isProd=(env!="development");
module.exports = {
    //使用开发者工具
    devtool: isProd? false : '#source-map',
    mode:isProd?'production':'development',
    //打包文件输出目录
    output: {
        path: BUILD_PATH,
        publicPath: '/dist/',
        filename: '[name].[hash].js'
    },
    externals: {
    'vue': 'Vue',
    'vue-meta': 'VueMeta',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios'
  },
    //解析选项
    resolve: {
        extensions: ['.js', '.vue','.css'], //自动解析限定的扩展名
        modules: [path.resolve(__dirname, '../node_modules')],//解析模块时应该搜索的目录
        alias: { //指定模块的别名 在require和import 引用是可以使用
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    //告诉webpack如何处理不同的模块
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueConfig
            },
            {
                test: /\.html$/,
                loader: 'html-loader?minimize=true',
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happybabel',
                exclude: /node_modules/ //指定这些js不用babel-loader解析
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader?limit=1&name=[path][name].[hash:7].[ext]',
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader?importLoaders=1&limit=1000&name=[path][name].[hash:7].[ext]'
            },
            // {
            //   test: /\.styl(us)?$/,
            //   use: ['vue-style-loader', 'css-loader', 'stylus-loader']
            // },

            {
              test: /\.css$/,
              use: ['vue-style-loader','css-loader']
            }
            // {
            //     test: /\.css$/,
            //     use:[
        	  //       'vue-style-loader',	MiniCssExtractPlugin.loader, //使用MiniCssExtractPlugin处理css服务器端渲染总是报错不是为何
        	  //       	{
        		//             loader: "css-loader",
        		//             options: {
        		//               minimize: true
        		//             }
        		//         }
        	  //       ]
            // }
        ]
    },
    //性能配置
    performance: {
        //此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示  单位字节
        maxEntrypointSize: 512000, //入口文件最大体积
        maxAssetSize: 512000,//资源最大体积
        hints: isProd ? 'warning' : false
    },
    plugins

}
