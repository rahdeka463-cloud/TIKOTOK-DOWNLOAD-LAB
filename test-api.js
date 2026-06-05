const axios = require("axios");

async function check() {
  try {
     const res1 = await axios.get("https://api.siputzx.my.id/api/d/ytmp4?url=https://www.youtube.com/watch?v=D-UmfqFjpl0");
     console.log("ytmp4:", res1.data);
  } catch(e) { console.log(e.message); }
  
  try {
     const res2 = await axios.get("https://api.siputzx.my.id/api/d/ytmp3?url=https://www.youtube.com/watch?v=D-UmfqFjpl0");
     console.log("ytmp3:", res2.data);
  } catch(e) { console.log(e.message); }
}
check();
