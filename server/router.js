const config = require('./config/index');

const main = (ctx)=>{
    ctx.response.body = 'hello';
}
let renderHomepage = async (ctx,next)=>{
    console.log('geturl',ctx.request.url);
    await ctx.render('/client/dist/index.html');
    next();
}
const sendData = async (ctx,next)=>{
    ctx.response.body = 'this data';
    next();
}

let homepage = config.homepage;
let keys = Object.keys(homepage);

console.log("keys=>",keys);

module.exports =  function (router){
     router.get('/',renderHomepage);
     keys.forEach((val)=>{
        console.log("url=>",homepage[val]);
        router.get(`/${homepage[val]}`,renderHomepage);
     });
     router.get('/getData',sendData);
}