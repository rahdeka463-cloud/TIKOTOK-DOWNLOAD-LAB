import axios from 'axios';
async function run() {
  try {
     const res2 = await axios.get("https://aemt.me/download/igdl?url=https://www.instagram.com/reel/DCT1tPzvB_b/");
     console.log(res2.data);
  } catch(e: any) {
     console.error(e.response?.data || e.message);
  }
}
run();
