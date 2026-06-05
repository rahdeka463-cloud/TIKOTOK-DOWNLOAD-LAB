import { snapsave } from 'snapsave-media-downloader';
async function run() {
  try {
    const res = await snapsave('https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("Snapsave result:", JSON.stringify(res, null, 2));
  } catch(e: any) {
    console.error("Snapsave error:", e.message);
  }
}
run();
