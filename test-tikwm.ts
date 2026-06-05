import axios from 'axios';
async function test() {
  const url = 'https://www.tiktok.com/@tiktok/video/7106594312292453675';
  const res = await axios.post('https://www.tikwm.com/api/', { url, count: 12, cursor: 0, web: 1, hd: 1 });
  console.log("Tikwm res:", res.data);
}
test();
