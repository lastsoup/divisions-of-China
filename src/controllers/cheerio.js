var superagent = require('superagent');
var cheerio = require('cheerio');
var charset = require("superagent-charset");

charset(superagent); 

var items = [];

var host = "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html";

superagent.get(host)
  .charset('gb2312') //设置字符
  .end(function (error, res) {
      if (error) {
        throw error;
      }

      var $ = cheerio.load(res.text);
      $('.provincetr td a').each(function (idx, element) {
          var $element = $(element);
          var title = $element.text();
          items.push(title);
      });
      console.log(items);
  });

  module.exports = superagent;