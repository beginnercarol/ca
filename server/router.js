const main = (ctx)=>{
    ctx.response.body = 'hello';
}


let renderHomepage = async (ctx,next)=>{
    await ctx.render('/client/dist/index.html');
    next();
}

module.exports =  function (router){
     router.get('/',renderHomepage);
}