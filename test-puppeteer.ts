import puppeteer from 'puppeteer';

async function test() {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://snapinsta.app/', { waitUntil: 'domcontentloaded' });
    console.log("Success title:", await page.title());
  } catch(e:any) {
    console.error("Puppeteer err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}
test();
