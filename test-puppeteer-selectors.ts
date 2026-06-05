import puppeteer from 'puppeteer';
async function test() {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto('https://publer.io/tools/instagram-video-downloader', { waitUntil: 'networkidle2' });
    console.log("Title:", await page.title());
    
    // Log all input and button attributes on the page to find correct selectors
    const inputsInfo = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, button')).map(el => {
        return {
          tag: el.tagName,
          id: el.id,
          name: el.getAttribute('name'),
          type: el.getAttribute('type'),
          placeholder: el.getAttribute('placeholder'),
          className: el.className,
          text: (el as HTMLElement).innerText || el.textContent
        };
      });
    });
    console.log("Found interactive elements:", inputsInfo);
  } catch(e:any) {
    console.error("Puppeteer err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}
test();
