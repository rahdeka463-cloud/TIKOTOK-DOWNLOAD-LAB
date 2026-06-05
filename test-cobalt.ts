import axios from 'axios';

async function testCobalt() {
  try {
    const res = await axios.post("https://api.cobalt.tools/api/json", {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testCobalt();
