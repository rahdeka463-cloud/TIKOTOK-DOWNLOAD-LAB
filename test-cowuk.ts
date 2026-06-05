import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('https://co.wuk.sh/api/json', {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }, {
      headers: { "Accept": "application/json", "Content-Type": "application/json" }
    });
    console.log("Res:", res.data);
  } catch (e: any) {
    console.error("Err:", e.response?.data || e.message);
  }
}
test();
