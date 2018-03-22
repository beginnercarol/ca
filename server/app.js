const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const render = require('koa-views');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');

const routerConfig = require('./router');

const app = new Koa();
const router = new Router();
const compiler = webpack(webpackConfig);


const webpackMiddle = (compiler,options={})=>{
    const publicPath = webpackConfig.output.publicPath || __dirname;
    options.publicPath = publicPath;
    webpackDevMiddleware(compiler,options);
    return async (ctx,next)=>{
        await next();
    }
}



app.use(json());
app.use(bodyParser());

//配置有问题
// app.use(webpackMiddle(compiler,{
//     publicPath:webpackConfig.output.publicPath,
//     historyApiFallback: true,
//     compress: true,
//     stats: "minimal",
// }));

app.use(serve(path.join(__dirname,'../')));
app.use(render(path.join(__dirname,'../')));

routerConfig(router);
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(8079,()=>{
    console.log('listening at port:8079');
});


module.exports = app;