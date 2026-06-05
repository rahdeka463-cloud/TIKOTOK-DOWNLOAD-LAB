import axios from 'axios';
async function test() {
  try {
    const res = await axios.get('https://vihangayt.me/download/instagram?url=https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("Vihanga IG:", res.data);
  } catch(e:any) {
    console.error("Vihanga err:", e.message);
  }
}
test();
