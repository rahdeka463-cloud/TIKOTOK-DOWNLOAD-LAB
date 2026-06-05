import axios from 'axios';
async function test() {
  try {
    const params = new URLSearchParams();
    params.append('url', 'https://www.instagram.com/reel/C7z8zD0P_E5/');
    params.append('action', 'post');
    const res = await axios.post('https://snapinsta.app/action.php', params, {
      headers: {
        'Origin': 'https://snapinsta.app',
        'Referer': 'https://snapinsta.app/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(res.data);
  } catch (e: any) {
    console.error(e.message);
  }
}
test();
