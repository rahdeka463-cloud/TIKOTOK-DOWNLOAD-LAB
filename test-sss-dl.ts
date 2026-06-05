import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('https://sssinstagram.com/request', {
      url: "https://www.instagram.com/reel/C7z8zD0P_E5/",
      submit: ''
    }, {
      headers: {
        'Origin': 'https://sssinstagram.com',
        'Referer': 'https://sssinstagram.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(res.data);
  } catch (e: any) {
    console.error(e.message);
  }
}
test();
