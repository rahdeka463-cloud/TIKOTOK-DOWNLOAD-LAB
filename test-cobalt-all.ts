import axios from 'axios';

const instances = [
  'https://cobalt.k6.vc',
  'https://co.disby.me',
  'https://cobalt.api.ryb.red',
  'https://cobalt.sh',
  'https://cobalt.cloud',
  'https://api.cobalt.black',
  'https://cobalt.hyper.it',
  'https://co.wuk.sh',
  'https://api.cobalt.tools'
];

async function test() {
  const url = 'https://www.instagram.com/reel/C7z8zD0P_E5/';
  
  for (const inst of instances) {
    // Try v7 /api/json first
    try {
      const res = await axios.post(`${inst}/api/json`, {
        url: url
      }, {
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        timeout: 5000
      });
      console.log(`[V7 SUCCESS] ${inst} returned:`, res.data);
      continue;
    } catch (e: any) {
      console.log(`[V7 FAIL] ${inst}:`, e.response?.data || e.message);
    }

    // Try v10 / if v7 failed
    try {
      const res = await axios.post(`${inst}/`, {
        url: url
      }, {
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        timeout: 5000
      });
      console.log(`[V10 SUCCESS] ${inst} returned:`, res.data);
    } catch (e: any) {
      console.log(`[V10 FAIL] ${inst}:`, e.response?.data || e.message);
    }
  }
}

test();
