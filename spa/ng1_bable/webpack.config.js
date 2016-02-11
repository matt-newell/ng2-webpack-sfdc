var webpack = require('webpack');
var slds = require('copy-webpack-plugin');
var path = require('path');
var sfdcdeploy = require('./deploy/deploy');
module.exports = {
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  entry: {
    'app': './src/main.js',
    'vendor': './src/vendor.js',
  },
  output: {
    path: './dist',
    filename: "bundle.js",
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new slds([
      { from: './node_modules/@salesforce-ux/design-system/assets', to: './assets'},
      ], {
          ignore: [
              'README',
              '*.txt',
              '*.html',
              'fonts/*.ttf',
              'fonts/webfonts/*.svg',
              'fonts/webfonts/*.eot',
              'icons!(-sprite)/*/*.svg',
              'styles/*.css',
              'icons/*/*.png'
          ]
      })
    //   ,new sfdcdeploy({path:'./dist/', name:'ng2'})
  ],
  devServer: {
    inline: true,
    contentBase: './dist',
    historyApiFallback: true,
    port: 4444
  },
  devTool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
             presets: ['es2015']
         }
      },
      {
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'raw-loader'
      }
    ],
    noParse: [ path.join(__dirname, 'node_modules', 'angular2', 'bundles') ]
  }
};
