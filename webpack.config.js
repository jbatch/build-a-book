const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = (env, options) => {
  const config = {
    context: path.resolve(__dirname, 'client/src/'),
    entry: './index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist', 'client'),
    },
    devServer: {
      contentBase: path.resolve(__dirname, './public'),
      contentBasePublicPath: '/',
      stats: 'errors-only',
      port: 8000,
      compress: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/api', '/media', '/socket.io'],
          target: 'http://localhost:9000',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node_modules/' }],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: options.mode,
        PUBLIC_URL: 'http://localhost:8000',
      }),
      new CopyPlugin({
        patterns: [{ from: '../public', to: './' }],
      }),
      new HtmlWebpackPlugin({
        template: '../public/index.ejs',
        filename: './index.html',
        PUBLIC_URL: PUBLIC_URL,
      }),
    ],
  };

  const envVarMap = {
    APP_BASE_PATH: '',
  };

  if (process.env.PROD) {
    envVarMap['APP_BASE_PATH'] = '';
  }

  config.plugins.push(new webpack.EnvironmentPlugin(envVarMap));
  return config;
};
