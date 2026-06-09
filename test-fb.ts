import axios from 'axios';
async function test() {
  const url = 'https://www.facebook.com/reel/1586520712213793';
  try {
     const res = await axios.post(`https://getmyfb.com/api/ajax/search`, `vid=${encodeURIComponent(url)}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*' }});
     console.log(res.data);
  } catch (e:any) {
     console.log(e.message);
  }
}
test();
