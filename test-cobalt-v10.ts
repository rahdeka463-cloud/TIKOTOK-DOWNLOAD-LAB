import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('https://api.cobalt.tools/', {
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
