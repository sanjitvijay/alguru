import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import path from 'path';


export default {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  entry: {
    contentScript: './src/content/index.js',
    background: './src/background/index.js',
    react: './src/react/index.jsx'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve('manifest.json'),
        to: path.resolve('dist')
      },
      ]
    }, 
    ),
    new CopyPlugin({
      patterns: [{
        from: path.resolve('src/react/assets'),
        to: path.resolve('dist/assets')
      },
      ]
    }, 
    ),
    new CopyPlugin({
          patterns: [{
            from: path.resolve('src/react/components/visualization'),
            to: path.resolve('dist/visualization')
          },
          ]
        },
    ),
    new DotenvWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {'runtime': 'automatic'}]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name][ext]',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.html$/i,
        use: 'raw-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};