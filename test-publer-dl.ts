import puppeteer from 'puppeteer';

async function test() {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto('https://publer.io/tools/instagram-video-downloader', { waitUntil: 'domcontentloaded' });
    
    // Type URL
    await page.waitForSelector('input[type="url"]');
    await page.type('input[type="url"]', 'https://www.instagram.com/reel/C7z8zD0P_E5/');
    
    // Intercept response
    page.on('response', async (res) => {
      if (res.url().includes('/api/v1/tools/download')) {
        console.log("Got API res:", await res.json());
      }
    });

    // Click download
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.includes('Download') || b.innerText?.includes('Download'));
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 5000));
  } catch(e:any) {
    console.error("Puppeteer err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}
test();
