import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://api.siputzx.my.id/api/d/facebook?url=https://www.facebook.com/reel/1586520712213793');
    console.log("FB:", res.data);
  } catch(e:any) {
    console.error("FB err:", e.message);
  }
}
test();
