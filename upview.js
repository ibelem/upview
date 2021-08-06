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

  const uplist = [
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f6221e4dd5b0b11b2&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f8a55010228e3dc0f&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f911b9f231bba7c3e&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f2ddb7ce914acc2e6&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6fbefbb7889ebdfaf6&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f55d979bae6dcec2b&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6fbd50662b596ab9da&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f5f4f10816e5ff473&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f2c466ff1c1f4f80e&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f5ddce38e6a7582c7&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6f4c8d3913c4147148&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=38617caabe996d6fe5e5d9c5a207f8f8&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8a949ae16c7e0fca8&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8d7e7ab7ef4524838&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd82ddf3709ecb51cd3&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd88e452cbdf90c15b5&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd80a116c316ed12eea&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd891beb16e96db0319&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd86a178e9992e0e88b&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8963dd8b4fa4efa69&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd835685bc2a01dc6a6&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8009e25a226acbbdc&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8e17caf6f94873619&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd8bce75c0f2890b678&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd867168a2bec3e9737&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd871101bf2f422111b&start_id=a2885e6da98a2117",
    "http://www.fangdi.com.cn/new_house/more_info.html?project_id=741f05769091060b&building_id=8ab8c230ad126cd896b49cc440db636b&start_id=a2885e6da98a2117",
  ];

  const refererurl = "http://www.fangdi.com.cn/new_house/new_house_detail.html?project_id=741f05769091060b";

  function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
  }

  var upview = {
    signed: []
  };

  for (u of uplist) {
    console.log(u)
    await page.goto(u, { waitUntil: "networkidle2", referer: refererurl });

    const rs = "#building_name";
    await page.waitForSelector(rs);
    const h_bn = await page.$eval(".hu_wrapper", (e) => e.outerHTML);
    const $ = cheerio.load(h_bn);
    let bn = $("#building_name").text();
    bn = bn.replace("峰范嘉苑", "");
    bn = bn.replace("嘉定区和硕路999弄", "");
    bn = bn.replace("号", "");
    bn = bn.trim();
    $("#moreInfo ._yellow_bg").each(function (index, ele) {
      let t = $(ele).text()
      t = t.trim();
      let signed_room = bn + "-" + t
      upview.signed.push(signed_room)
      console.log(signed_room)
    });

    await delay(5000);
  }

  let json = JSON.stringify(upview);
  fs.writeFile('upview.json', json, 'utf8', function(err){
    if(err) throw err;
  });

  await browser.close();
})();