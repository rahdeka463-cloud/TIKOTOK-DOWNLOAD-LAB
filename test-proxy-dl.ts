import axios from 'axios';

async function run() {
  try {
      const res = await axios.get("https://api.vreden.web.id/api/igdownload?url=https://www.instagram.com/reel/C7z8zD0P_E5/");
      console.log("Response:", res.data);
  } catch(e: any) {
      console.log("Error:", e.message);
  }
}
run();
