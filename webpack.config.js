const path = require('path');
const { NODE_ENV, FILE_NAME } = process.env;
const filename = `${FILE_NAME}${NODE_ENV === 'production' ? '.min' : ''}.js`;
module.exports = {
  mode: NODE_ENV || 'development',
  entry: [
    './src/index.js',
  ],
  module: {
    rules: [{
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    libraryTarget: 'umd',
  }
};