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
    console.log(`Navigating to SnapSave: ${reelUrl}`);
    await page.goto('https://snapsave.app/download-video-instagram', { waitUntil: 'networkidle2' });

    // Intercept network responses
    page.on('response', async (res) => {
       const url = res.url();
       if (url.includes('action.php') || url.includes('ajax')) {
          console.log(`[Network Response] ${url}: status=${res.status()}`);
          try {
             const text = await res.text();
             console.log(`[Network Response Body]`, text.substring(0, 500));
          } catch(e) {}
       }
    });

    await page.waitForSelector('input#url');
    await page.type('input#url', reelUrl);
    console.log("Typed URL.");

    await page.click('button#send');
    console.log("Clicked submit.");

    console.log("Waiting for #download-section to change or be populated...");
    try {
      await page.waitForFunction(() => {
         const sec = document.getElementById('download-section');
         return sec && sec.innerHTML.trim().length > 0;
      }, { timeout: 15000 });
      console.log("Download section populated!");
      
      const resHtml = await page.evaluate(() => {
         return document.getElementById('download-section')?.innerHTML;
      });
      console.log("Populated HTML:", resHtml);
    } catch(err:any) {
      console.log("Failed waiting for population:", err.message);
      const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 1000));
      console.log("Current body excerpt:", bodyHtml);
    }

  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
