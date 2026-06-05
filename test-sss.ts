import axios from 'axios';
async function test() {
  try {
     const res = await axios.get('https://sssinstagram.com/');
     console.log(res.data.length);
  } catch (e:any) {
     console.log(e.message);
  }
}
test();
