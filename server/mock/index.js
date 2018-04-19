module.exports = function(router){
    router.get('/platform/nsky-query/v1/olap/alterdashboardmetadata',async (ctx,next)=>{
        ctx.response.body = 
            {
                data:["htw","hm","express","global","exhibition"]
            };
       await next();
    });
    router.get('/platform/getallcubes',async (ctx,next)=>{
        ctx.response.boxy = {
            data:["活动名称","支付金额","总成交额","活动运营","活动预算",
                    "活动名称","支付总金额","总成交额","活动运营","活动预算"]
        }
        await next();
    })
}