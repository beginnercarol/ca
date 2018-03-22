const path = require('path');
const webpack = require('webpack');
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
        path:path.join(__dirname,'/client/dist'),
        publicPath:'../',
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
        new CleanWebpackPlugin(['dist/app.*.css','dist/app.*.css.map'],{
            root:path.join(__dirname,'/client/'),
            exclude:'index.css',
            dry:false,
            verbose:true,
            watch:true
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css'
        }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:path.join(__dirname,'/server/views/index.template.html'),
            inject:true
        }),
        // new CleanWebpackPlugin([path.join(__dirname,'/client/dist/app.*.css'),
        //     path.join(__dirname,'/client/dist/app.*.css.map')]),
    ],
    
}

module.exports = webpackConfig;