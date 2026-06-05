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
    await page.goto('https://snapsave.app/', { waitUntil: 'networkidle2' });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(el => ({
        text: el.innerText.trim(),
        href: el.getAttribute('href')
      }));
    });
    console.log("Snapsave links:", links);
  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
