import puppeteer from 'puppeteer';

async function test() {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    const page = await browser.newPage();
    
    // Set viewport or user agent to look like a normal browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    console.log("Navigating to Publer...");
    await page.goto('https://publer.io/tools/instagram-video-downloader', { waitUntil: 'networkidle2' });
    
    // Type URL into the url input
    console.log("Waiting for input...");
    await page.waitForSelector('input[name="url"]');
    await page.type('input[name="url"]', 'https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("Typed URL.");

    // Track responses
    let apiResponsePromise = new Promise((resolve) => {
       page.on('response', async (res) => {
          const url = res.url();
          if (url.includes('/api/v1/tools/download')) {
             try {
                const json = await res.json();
                resolve(json);
             } catch(e) {}
          }
       });
    });

    // Click download
    console.log("Clicking Download button...");
    await page.click('button[type="submit"]');

    console.log("Waiting for API response...");
    const apiResult = await Promise.race([
       apiResponsePromise,
       new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout waiting for API response")), 15000))
    ]);

    console.log("API Result:", JSON.stringify(apiResult, null, 2));

  } catch(e:any) {
    console.error("Puppeteer err:", e.message);
  } finally {
    if (browser) await browser.close();
  }
}
test();
