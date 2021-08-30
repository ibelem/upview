const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
    window.chrome = {};
    window.chrome.app = {
      InstallState: "hehe",
      RunningState: "haha",
      getDetails: "xixi",
      getIsInstalled: "ohno",
    };
    window.chrome.csi = function () {};
    window.chrome.loadTimes = function () {};
    window.chrome.runtime = function () {};
    Object.defineProperty(navigator, "userAgent", {
      get: () =>
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36",
    });
    Object.defineProperty(navigator, "plugins", {
      get: () => [
        {
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: 1,
          name: "Chrome PDF Plugin",
        },
      ],
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["zh-CN", "zh", "en"],
    });
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });

  const url = "http://www.fangdi.com.cn/new_house/new_house_detail.html?project_id=741f05769091060b"
  const refererurl = "http://www.fangdi.com.cn/";

  function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
  }

  let sell_ava = {}

  await page.goto(url, { waitUntil: "networkidle2", referer: refererurl });

  const rs = "#salesInformation";
  await page.waitForSelector(rs);
  const h_bn = await page.$eval("#salesInformation", (e) => e.outerHTML);
  const $ = cheerio.load(h_bn);

  var currentdate = new Date(); 
  var datetime = (currentdate.getMonth()+1)  + "." + currentdate.getDate() + " "
                + currentdate.getHours() + ":05"
  
  $(".new_house_sale_list .text_ellipsis").each(function () {
    let t = $(this).text()
    if(t.indexOf("可售总套数") > '-1') {
      t = t.replace("可售总套数", "")
      t = t.replace("：", "")
      t = t.trim()
      console.log(t);
      sell_ava.date = datetime
      sell_ava.number = t
    } 
  });

  console.log(sell_ava)

  fs.readFile('./src/upview_daily.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    let obj = JSON.parse(data);
    obj.push(sell_ava);
    json = JSON.stringify(obj);
    fs.writeFile('./src/upview_daily.json', json, 'utf8', function(err){
      if(err) throw err;
    });
  }});

  await browser.close();
})();
