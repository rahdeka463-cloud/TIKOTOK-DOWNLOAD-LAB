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

    console.log("Navigating to snapsave.app/download-video-instagram...");
    const res = await page.goto('https://snapsave.app/download-video-instagram', { waitUntil: 'networkidle2' });
    console.log("Status:", res?.status());
    console.log("Page title:", await page.title());

    const elements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, button')).map(el => ({
        tag: el.tagName,
        id: el.id,
        name: el.getAttribute('name'),
        placeholder: el.getAttribute('placeholder'),
        className: el.className,
        text: (el as HTMLElement).innerText || el.textContent
      }));
    });
    console.log("Snapsave Instagram page elements:", elements);

  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
