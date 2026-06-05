import axios from 'axios';
async function test() {
  const url = 'https://www.instagram.com/reel/C7z8zD0P_E5/';
  const paths = [
    `/api/instagram?url=${url}`,
    `/api/igdl?url=${url}`,
    `/api/ig?url=${url}`
  ];

  for (const p of paths) {
    try {
      const res = await axios.get(`https://api.agatz.xyz${p}`);
      console.log(`Path ${p} success:`, res.data);
    } catch(e:any) {
      console.error(`Path ${p} fail:`, e.message);
    }
  }
}
test();
