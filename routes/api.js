var Router = require('koa-router');
var rt=new Router();
var mssql=require('../src/controllers/mssql-helper');
var mysql=require('../src/controllers/mysql-helper');
//var puppeteer = require('../src/controllers/puppeteer');
var cheerio = require('../src/controllers/cheerio');

rt.post('/cheerio',async(ctx, next) => {
    //cheerio抓取行政区
    let postParam = ctx.request.body;
    let pdata=await cheerio.Json1(postParam.url,postParam.selecter);
    ctx.response.body = pdata;
});

rt.post('/json',async(ctx, next) => {
  //cheerio抓取行政区
  let postParam = ctx.request.body;
  let pdata=await cheerio.Json2(postParam.url,postParam.selecter);
  ctx.response.body = pdata;
});

rt.post('/code',async(ctx, next) => {
  //cheerio抓取行政区
  let postParam = ctx.request.body;
  var index=0;
  var host="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/";
  var selecter=[".provincetr td",".citytr td:last-child",".countytr td:last-child",".towntr td:last-child",".villagetr td:last-child"];
  let code=postParam.code;
  var url=host;
  switch(code.length){
    case 0:
    {
      index=0;
      break;
    }
    case 2:
    {
      index=1;
      url=host+code+".html";
      break;
    }
    case 4:
    {
      index=2;
      if(code==4419||code==4420||code==4604) //特殊处理三个没有区直接到街道的
      index=3;
      var str1=code.substr(0,2);
      url=host+str1+"/"+code+".html";
      break;
    }
    case 6:
    {
      index=3;
      var str1=code.substr(0,2);
      var str2=code.substr(2,2);
      url=host+str1+"/"+str2+"/"+code+".html";
      break;
    }
    case 9:
    {
      index=4;
      var str1=code.substr(0,2);
      var str2=code.substr(2,2);
      var str3=code.substr(4,2);
      if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1)
         url=host+str1+"/"+str2+"/"+code+".html";
      else
         url=host+str1+"/"+str2+"/"+str3+"/"+code+".html";
      break;
    }
    default:
    {
      alert("编码填写错误");
      return;
    }
  }
  selecter=selecter[index];
  let pdata=await cheerio.Json2(url,selecter);
  ctx.response.body = pdata;
});

// rt.post('/puppeteer',async(ctx, next) => {
//     //puppeteer抓取行政区
//     let postParam = ctx.request.body;
//     let pdata= await puppeteer.scrape(postParam.url,postParam.selecter);
//     ctx.body = pdata;
// });

rt.post('/savejson',async(ctx, next) => {
  let postParam = ctx.request.body;
  console.log(postParam)
  ctx.body = "保存成功";
});

rt.get('/mssql',async(ctx, next) => {
     //MSSQL
     let dataList = await mssql.querySql('select * from [User]',"",function(err, result){});
     ctx.body = dataList;
});

rt.get('/mysql',async(ctx, next) => {
   //MYSQL
   let dataList = await mysql.query('SELECT * FROM t_dept where id="6f614220210811e8944f7faa904251e7"');
   ctx.body = dataList;
});

module.exports = rt;