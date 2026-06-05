import axios from 'axios';
import * as cheerio from 'cheerio';
async function test() {
  try {
     const res = await axios.get('https://sssinstagram.com/');
     const $ = cheerio.load(res.data);
     console.log($('form').attr('action'));
     const inputs = $('form input').map((i, el) => $(el).attr('name')).get();
     console.log(inputs);
  } catch (e:any) {
     console.log(e.message);
  }
}
test();
