import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://api.siputzx.my.id/api/d/igdl?url=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("Siputzx IG:", res.data);
  } catch(e:any) {
    console.error(e.message);
  }
}
test();
