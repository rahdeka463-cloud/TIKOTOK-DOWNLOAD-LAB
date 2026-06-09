import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://api.ryzendesu.vip/api/downloader/igdl?url=https://www.instagram.com/reel/C7z8zD0P_E5/&fp=-7', {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });
    console.log("Ryzendesu IG:", res.data);
  } catch(e:any) {
    console.error(e.response?.data || e.message);
  }
}
test();
