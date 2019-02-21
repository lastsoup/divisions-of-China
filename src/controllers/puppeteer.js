const puppeteer = require('puppeteer');

/*
 * 命名简写备注
 *
 * 省级（省份，Province）         provincetr
 * 地级（城市，City）             citytr
 * 县级（区县，Area）               a
 * 乡级（乡镇街道，Street）         s
 * 村级（村委会居委会，Village）    v
 */

let scrape = async () => {
    const browser = await puppeteer.launch({
      args:  ['--no-sandbox', '--disable-setuid-sandbox']
    });
    var page = await browser.newPage();
    await page.goto('http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html');
    //await page.setViewport({width: 1920, height: 1080});

    const result = await page.evaluate(() => {
        let data = []; // 初始化空数组来存储数据
        let elements = document.querySelectorAll('.provincetr td'); // 获取所有书籍元素
        console.dir("正在抓取省级数据...");
        let total=elements.length;
        for (var i = 0; i < total; i ++) {
            let info = elements[i].querySelector('a');
            var href=info.href;
            var code=href.replace(".html","").replace("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/","");
            var name=info.innerText.replace(/(\r\n)|(\n)/g,"");
            data.push({'code':code,"name":name});
            console.dir((i+1)+"/"+total);
        }
        data.push({'code':"71","name":"台湾省"});
        data.push({'code':"81","name":"香港特别行政区"});
        data.push({'code':"82","name":"澳门特别行政区"});
        console.dir("抓取省级数据完成！");
        return data;  // 返回数据
    });

    browser.close();
    return result;
};

exports.scrape = scrape;
