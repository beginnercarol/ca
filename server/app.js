const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const render = require('koa-views');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const routerConfig = require('./router');

const app = new Koa();
const router = new Router();

app.use(json());
app.use(bodyParser());

app.use(serve(path.join(__dirname,'../')));
app.use(render(path.join(__dirname,'../')));

routerConfig(router);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8079);


module.exports = app;