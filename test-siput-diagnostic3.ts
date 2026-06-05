import axios from 'axios';

const endpoints = [
  'https://api.siputzx.my.id/api/d/instadl',
  'https://api.siputzx.my.id/api/d/reels',
  'https://api.siputzx.my.id/api/d/igstory',
  'https://api.siputzx.my.id/api/d/instasave',
  'https://api.siputzx.my.id/api/d/insta',
  'https://api.siputzx.my.id/api/d/instagram-downloader'
];

async function test() {
  for (const ep of endpoints) {
    try {
      const res = await axios.get(ep);
      console.log(`[Diagnostic] ${ep} success:`, res.status, res.data);
    } catch(e:any) {
      console.log(`[Diagnostic] ${ep} result:`, e.response?.status, typeof e.response?.data === 'string' ? e.response?.data.substring(0, 100) : e.response?.data);
    }
  }
}

test();
