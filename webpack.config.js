const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const proxy = require('http-proxy-middleware')

module.exports = (env, argv) => {
  return {
    entry: { main: './src/js/index.js' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      //打包前替换掉cdn的链接包括css&js
      publicPath: '/',
      filename: 'js/[name].[chunkhash].js'
    },
    devServer: {
      host: 'test.m.autohome.com.cn',
    },
    serve:{
      port:8080
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            "babel-loader",
          ]
        },
        {
          test: /\.(scss|css)$/,
          use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif|jpng)$/,
          use: {
            loader: "file-loader",
            options:{
              //打包前替换掉cdn的链接包括image
              publicPath: '',
              name (file) {
                if (argv.mode === 'development') {
                  return '[path][name].[ext]'
                }
                return 'img/[name].[ext]'
              }
            }
          }
        }

      ]
    },
    plugins: [
      new CleanWebpackPlugin('dist', {} ),
      new MiniCssExtractPlugin({
        filename: 'css/style.[contenthash].css',
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: './src/index.html',
        filename: 'index.html'
      }),
      new WebpackMd5Hash()
    ]
  };
}
