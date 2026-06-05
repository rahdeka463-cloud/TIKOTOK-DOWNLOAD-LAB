import { instagramGetUrl } from 'instagram-url-direct';
async function test() {
  try {
    const res = await instagramGetUrl('https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log(res);
  } catch (e: any) {
    console.error("IG err:", e.message);
  }
}
test();
