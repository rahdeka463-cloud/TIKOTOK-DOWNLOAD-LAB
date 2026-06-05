import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://bk9.fun/download/instagram?url=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("BK9:", res.data);
  } catch(e:any) {
    console.error("BK9 err:", e.message);
  }
}
test();
