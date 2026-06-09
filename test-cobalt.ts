import axios from 'axios';

async function testBotcahx() {
  try {
    const res = await axios.get("https://api.botcahx.eu.org/api/dowloader/igdown?url=https://www.instagram.com/reel/C7z8zD0P_E5/&apikey=p825s07w");
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testBotcahx();
