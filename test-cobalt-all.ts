import axios from 'axios';

async function testInstances() {
  const instances = [
    "https://cobalt.owo.network",
    "https://co.wuk.sh",
    "https://api.vkrdownloader.co",
    "https://cobalt.kwiatechu.com",
    "https://cobalt.q0.uk",
    "https://cobalt.vxrl.dev",
    "https://api.cobalt.faceless.work",
    "https://cobalt.starnodes.dev"
  ];
  
  for(let host of instances) {
    try {
      const res = await axios.post(host, { url: "https://www.instagram.com/reel/C7z8zD0P_E5/" }, {
         headers: {
           "Accept": "application/json",
           "Content-Type": "application/json"
         },
         timeout: 5000
      });
      console.log(`Success on ${host}:`, res.data);
      return;
    } catch(e: any) {
      console.log(`Fail on ${host}:`, e.message);
    }
  }
}
testInstances();
