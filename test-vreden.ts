import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://api.vreden.web.id/api/igdl?url=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("VREDEN:", res.data);
  } catch(e:any) {
    console.error("VREDEN err:", e.message);
  }
}
test();
