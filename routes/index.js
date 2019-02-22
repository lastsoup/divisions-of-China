var Router = require('koa-router');
var rt=new Router();


rt.get('/',async(ctx, next) => {
    await ctx.render('index', { title : "行政区域抓取"});
});

module.exports = rt;