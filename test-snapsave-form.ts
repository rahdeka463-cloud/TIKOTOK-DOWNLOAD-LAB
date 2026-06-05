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
    await page.goto('https://snapsave.app/download-video-instagram', { waitUntil: 'networkidle2' });

    const formHtml = await page.evaluate(() => {
      const f = document.querySelector('form');
      return f ? f.outerHTML : 'No form found';
    });
    console.log("Form HTML:", formHtml);

  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
