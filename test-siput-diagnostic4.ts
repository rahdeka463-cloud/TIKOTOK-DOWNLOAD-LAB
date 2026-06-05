import axios from 'axios';

const endpoints = [
  'https://api.siputzx.my.id/api/instagram',
  'https://api.siputzx.my.id/api/ig',
  'https://api.siputzx.my.id/api/igdl',
  'https://api.siputzx.my.id/api/downloader/instagram',
  'https://api.siputzx.my.id/api/downloader/ig',
  'https://api.siputzx.my.id/api/downloader/igdl'
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
