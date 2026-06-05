import puppeteer from 'puppeteer';

async function test() {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    const reelUrl = 'https://www.instagram.com/reel/C7z8zD0P_E5/';
    console.log(`Navigating to Publer: ${reelUrl}`);
    await page.goto('https://publer.io/tools/instagram-video-downloader', { waitUntil: 'networkidle2' });

    page.on('request', req => {
       console.log(`[Request] ${req.method()} ${req.url()}`);
    });

    page.on('response', async res => {
       const url = res.url();
       if (url.includes('download') || url.includes('tool') || url.includes('api')) {
          console.log(`[Response] ${url} status=${res.status()}`);
          try {
             const text = await res.text();
             console.log(`[Response Body Excerpt]`, text.substring(0, 500));
          } catch(e) {}
       }
    });

    console.log("Waiting for input...");
    await page.waitForSelector('input[name="url"]');
    await page.type('input[name="url"]', reelUrl);
    console.log("Typed URL.");

    console.log("Clicking submit...");
    await page.click('button[type="submit"]');

    console.log("Waiting 15 seconds...");
    await new Promise(resolve => setTimeout(resolve, 15000));

  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
