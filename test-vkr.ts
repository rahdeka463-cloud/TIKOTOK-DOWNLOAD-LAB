import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://vkrdownloader.vercel.app/server?vkr=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("VKR:", res.data);
  } catch(e:any) {
    console.error("VKR err:", e.message);
  }
}
test();
