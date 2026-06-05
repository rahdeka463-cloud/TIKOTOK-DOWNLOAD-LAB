import axios from 'axios';
import * as cheerio from 'cheerio';
async function test() {
  try {
    const res = await axios.get('https://api.siputzx.my.id/docs');
    const $ = cheerio.load(res.data);
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/api/d/')) console.log(href);
    });
  } catch(e:any) {
    console.error("Docs err:", e.message);
  }
}
test();
