const config = require('./config/index');

const main = (ctx)=>{
    ctx.response.body = 'hello';
}
let renderHomepage = async (ctx,next)=>{
    await ctx.render('/client/dist/index.html');
    next();
}
const sendData = async (ctx,next)=>{
    ctx.response.body = 'this data';
    next();
}

const redirect =fetch();

let homepage = config.homepage;
let keys = Object.keys(homepage);

module.exports =  function (router){
     router.get('/',renderHomepage);
     keys.forEach((val)=>{
        router.get(`/${homepage[val]}`,renderHomepage);
     });


     router.get('/getData',sendData);
}