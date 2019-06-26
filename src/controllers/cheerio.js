var superagent = require('superagent');
var cheerio = require('cheerio');
var charset = require("superagent-charset");
charset(superagent); 
var fn={};
/*
 * 命名简写备注
 * http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html
 * 省级（省份，Province）          provincetr
 * 地级（城市，City）              citytr
 * 县级（区县，Area）              countytr
 * 乡级（乡镇街道，Street）        towntr
 * 村级（村委会居委会，Village）    villagetr
 */

fn.Json1 = async function (url,selecte) {
  return new Promise(( resolve, reject ) => {
      try{
        superagent.get(url).
        retry(2).
        set('Accept-Encoding', 'identity').
        buffer(true).charset('gb2312').end(function (err, res) {
          if (err) {
            reject(err)
          }
          if(res){
            var items = [];
            var $ = cheerio.load(res.text);
            $(selecte).find("a").each(function (idx, el) {
                var $element = $(el);
                var href=$element.attr('href');
                //var code=href.replace(".html","");
                var code=href.replace(/(.*\/)*([^.]+).*/ig,"$2");
                var name =$element.text();
                items.push({'code':code,"name":name});
            });
            resolve(items);
          }
        });
    
      }catch(err){
         reject(err)
      }
  });
};

fn.Json2 = async function (url,selecte) {
  return new Promise(( resolve, reject ) => {
      try{
        superagent.get(url).
        retry(2).
        set('Accept-Encoding', 'identity').
        buffer(true).charset('gb2312').end(function (err, res) {
          if (err) {
            reject(err)
          }
          if(res){
            var items = [];
            var $ = cheerio.load(res.text);
            if(selecte==".villagetr td:last-child"){
                $(selecte).each(function (idx, el) {
                  var $element = $(el);
                  var name =$element.text();
                  items.push(name);
                });
            }else{
                var json={};
                $(selecte).find("a").each(function (idx, el) {
                  var $element = $(el);
                  var href=$element.attr('href');
                  var code=href.replace(/(.*\/)*([^.]+).*/ig,"$2");
                  var name =$element.text();
                  json[code]=name.replace("办事处","");
                  items=json;
                });
            }
            resolve(items);
          }
        });
    
      }catch(err){
         reject(err)
      }
  });
};

module.exports = fn;