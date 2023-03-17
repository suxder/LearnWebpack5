const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require("eslint-webpack-plugin")


module.exports = {
  entry: './src/js/main.js', // 相对路径
  output: {
    path: undefined, // 开发环境不需要输出
    filename: 'js/main.js'
  },
  module: {
    rules: [
      {
        // 利用oneOf来提升构建打包速度，一种类型文件仅仅对应一个loader，不用扫描所有loader
        oneOf: [
          // 处理样式的loader,
          {
            test: /\.css$/,
            use: [
              'style-loader', 
              'css-loader'
            ]
          },
          // 提高JS兼容性
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel缓存
              cacheCompression: false // 关闭缓存文件压缩
            }
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: resolve(__dirname, "../public/index.html") // 绝对路径
      }
    ),
    new ESLintWebpackPlugin(
      {
        // 指定检查文件的根目录
        context: resolve(__dirname, "../src"), // 绝对路径
        cache: true, // 开启缓存
      }
    )
  ],
  // 开发服务器，不会输出资源，在内存中编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true
  },
  mode: 'development',
  devtool: "cheap-module-source-map"
}