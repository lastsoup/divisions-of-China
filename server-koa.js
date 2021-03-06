const Koa = require('koa'),
    Router = require('koa-router'),
    ServeStatic = require('koa-static'),
    config = require('./webpack.config'),
    webpack = require('webpack'),
    { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'),
    {output, server, buildDir,isProduction} = require("./webpack.variable"),
    path = require('path'),
    app = new Koa();
/**加载路由Start 注：无路由默认起始页面inde.html*/
//post处理
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors');
app.use(bodyparser());
app.use(cors());
//swig模板
var views = require('koa-views');
var swig = require('swig');
app.use(views(path.join(__dirname, './views'),{  extension: 'html',map: { html: 'swig' }}));
//中间路由
var index = require('./routes/index');
var api = require('./routes/api');
// 装载所有子路由
var rt=new Router();
rt.use('/', index.routes(),index.allowedMethods());
rt.use('/api', api.routes(),api.allowedMethods());
app.use(rt.routes()).use(rt.allowedMethods());
/**加载路由End*/

if(isProduction){
app.use(ServeStatic(buildDir));
/*错误页处理Start*/
app.use(async (ctx) => {
    switch (ctx.status) {
      case 404:
         ctx.body="404";
        break;
      case 500:
        //await ctx.render('500');
        ctx.body="500";
        break;
    }
  })
}else{
/*错误页处理End*/
/**热加载Start 注：实现热加载自动刷新，修改代码及时呈现到浏览器上*/
const compiler = webpack(config);
config.entry.unshift("webpack-hot-middleware/client?reload=true");

app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: output.publicPath,
}));

app.use(hotMiddleware(compiler, {
}));

app.use(ServeStatic(buildDir));
/**热加载End*/
}


app.listen(server.post, () => {
    console.log(`服务器启动成功：${server.host + ":" + server.post}`)
});
