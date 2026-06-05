import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nayan = require('nayan-media-downloader');

async function test() {
  try {
    const ig = await nayan.ndown('https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("IG:", ig);
  } catch(e:any) {
    console.error("Nayan err:", e.message);
  }
}
test();
