import { instagramGetUrl } from 'instagram-url-direct';
async function test() {
  try {
    const res = await instagramGetUrl('https://www.instagram.com/reel/DCT1tPzvB_b/');
    console.log(res);
  } catch (e: any) {
    console.error("IG err:", e.message);
  }
}
test();
