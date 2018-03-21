const path = require('path');
const webapck = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackConfig = {
    devtool:'source-map',
    entry:{
        app: path.join(__dirname,'/client/index.js')
    },
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'/client/dist')
    },
    module:{
        rules:[
            {
                test:/(\.js|\.jsx)$/,
                exclude:/node_modules/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['es2015','env','react']
                        }
                    }
                ],
            },
            {
                test:/\.(css|scss)$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:[{
                            loader:'css-loader',
                            options:{
                                sourceMap:true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    Autoprefixer
                                ]
                            }
                        }, 'sass-loader']
                })
            },{
                test:/\.ejs$/,
                use:[{
                    loader:'ejs-loader'
                }]
            }
        ]
    },
    plugins:[
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css'
        }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:path.join(__dirname,'/server/views/index.template.ejs'),
            inject:false
        }),
        new CleanWebpackPlugin([path.join(__dirname,'/client/dist/app.*.css')]) 
    ],
    
}

module.exports = webpackConfig;