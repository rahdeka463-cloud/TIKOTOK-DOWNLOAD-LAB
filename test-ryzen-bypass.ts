import axios from 'axios';
async function test() {
  const url = 'https://www.instagram.com/reel/C7z8zD0P_E5/';
  const fpVariants = ['-5', '-7', '-3'];
  for (const fp of fpVariants) {
    try {
      const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/igdl?url=${url}&fp=${fp}`, {
         headers: {
            'User-Agent': 'Mozilla/5.0'
         }
      });
      console.log(`Bypass with fp=${fp}:`, typeof res.data === 'string' ? res.data.substring(0, 200) : res.data);
    } catch(e:any) {
      console.error(`Bypass fp=${fp} fail:`, e.message);
    }
  }
}
test();
