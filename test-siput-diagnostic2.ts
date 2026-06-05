import axios from 'axios';

const endpoints = [
  'https://api.siputzx.my.id/api/d/tiktok',
  'https://api.siputzx.my.id/api/d/youtube',
  'https://api.siputzx.my.id/api/d/ytdl',
  'https://api.siputzx.my.id/api/d/twitter',
  'https://api.siputzx.my.id/api/d/x',
  'https://api.siputzx.my.id/api/d/threads',
  'https://api.siputzx.my.id/api/d/spotify',
  'https://api.siputzx.my.id/api/d/capcut',
  'https://api.siputzx.my.id/api/d/pinterest',
  'https://api.siputzx.my.id/api/d/gdrive',
  'https://api.siputzx.my.id/api/d/sc'
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
