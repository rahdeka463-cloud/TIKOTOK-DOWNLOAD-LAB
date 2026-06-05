import axios from 'axios';
async function test() {
  try {
    const res = await axios.post('https://publer.io/api/v1/tools/download', {
      url: "https://www.instagram.com/reel/C7z8zD0P_E5/",
      iphone: false
    });
    console.log("Publer direct res:", res.data);
  } catch (e: any) {
    console.error("Publer error:", e.response?.data || e.message);
  }
}
test();
