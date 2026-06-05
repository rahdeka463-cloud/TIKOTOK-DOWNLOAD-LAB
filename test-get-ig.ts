import axios from 'axios';
async function test() {
  const res = await axios.get('https://unpkg.com/instagram-url-direct@1.0.13/index.js');
  console.log(res.data.substring(0, 300));
}
test();
