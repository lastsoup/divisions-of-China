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

let scrape = async (url,selecter) => {
    const browser = await puppeteer.launch({
      args:  ['--no-sandbox', '--disable-setuid-sandbox']
    });
    var page = await browser.newPage();
    await page.goto(url);
    //await page.setViewport({width: 1920, height: 1080});

    const result = await page.evaluate((selecter) => {
        let data = []; // 初始化空数组来存储数据
        let elements = document.querySelectorAll(selecter); // 获取所有书籍元素
        console.dir("正在抓取省级数据...");
        let total=elements.length;
        for (var i = 0; i < total; i ++) {
            let info = elements[i].querySelector('a');
            var href=info.attributes["href"].value;
            var code=href.replace(".html","");
            var name=info.innerText.replace(/(\r\n)|(\n)/g,"");
            data.push({'code':code,"name":name});
        }
        return data;  // 返回数据
    },selecter);

    browser.close();
    return new Promise((resolve, reject) => {
        resolve(result);
    });
};

exports.scrape = scrape;
