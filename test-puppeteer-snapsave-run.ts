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
    console.log(`Navigating to SnapSave for Reel: ${reelUrl}`);
    await page.goto('https://snapsave.app/download-video-instagram', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input#url');
    await page.type('input#url', reelUrl);
    console.log("Typed URL.");

    await page.click('button#send');
    console.log("Clicked submit.");

    console.log("Waiting for 8 seconds to allow scraping processing...");
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Log all links to see where the download file is
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(el => ({
        text: el.innerText.trim(),
        href: el.getAttribute('href'),
        className: el.className
      })).filter(item => item.href && (item.href.includes('snapcdn') || item.href.includes('download') || item.text.includes('Download')));
    });

    console.log("Found download links:", links);

    // If no direct download links found, let's log the HTML representation of container elements
    const containerHtml = await page.evaluate(() => {
      const el = document.querySelector('.download-items, .section-result, #download-section, .media-box');
      return el ? el.outerHTML : 'No output container found';
    });
    console.log("Container HTML snippet:", containerHtml);

  } catch(e:any) {
    console.error("Err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}

test();
