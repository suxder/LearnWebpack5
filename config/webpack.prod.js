const os = require("os")
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

// 获取处理样式的Loaders
// 减少重复代码
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

// cpu核数
const threads = os.cpus().length

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'static/js/main.js',
    path: resolve(__dirname, '../dist'),
    clean: true
  },
  module: {
    rules: [
      {
        oneOf: [
          // 处理样式的loader,
          {
            test: /\.css$/,
            use: getStyleLoaders()
          },
          // 提高JS兼容性
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false // 关闭缓存文件压缩
                }
              }
            ]
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: resolve(__dirname, "../public/index.html")
      }
    ),
    /* 
      该插件负责与.eslintrc.js文件配合确定Eslint规则与指定检查文件的根目录

      .eslintignore负责告知vscode Eslint插件哪些文件需要忽略报错提示
    */
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true, // 开启缓存
      cacheLocation: resolve(__dirname, "../node_modules/.cache/eslintCache"),
      threads // 开启多进程
    }),
    new MiniCssExtractPlugin(
      {
        filename: "static/css/main.css"
      }
    ),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads // 开启多进程
      })
    ],
  },
  mode: 'production',
  devtool: "source-map"
}