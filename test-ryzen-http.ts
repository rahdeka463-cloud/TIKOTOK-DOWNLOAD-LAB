import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('http://api.ryzendesu.vip/api/downloader/igdl?url=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("Ryzendesu HTTP IG:", res.data);
  } catch(e:any) {
    console.error("Ryzen err:", e.message);
  }
}
test();
