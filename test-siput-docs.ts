import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://api.siputzx.my.id/');
    console.log("Docs:", res.data.substring(0, 500));
  } catch(e:any) {
    console.error("Docs err:", e.message);
  }
}
test();
