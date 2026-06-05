import axios from 'axios';
import qs from 'qs';
import vm from 'vm';

async function test() {
  try {
    const res = await axios.post('https://snapsave.app/action.php?lang=en', qs.stringify({
      url: 'https://www.instagram.com/reel/C7z8zD0P_E5/'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://snapsave.app',
        'Referer': 'https://snapsave.app/download-video-instagram'
      }
    });

    const packedCode = res.data;
    console.log("Response status:", res.status);

    // Dynamic decoder using vm sandbox
    let decodedHtml = '';
    const sandbox = {
      eval: (arg: string) => {
         decodedHtml = arg;
      }
    };
    vm.createContext(sandbox);
    vm.runInContext(packedCode, sandbox);

    console.log("--- DECODED HTML RESULTS ---");
    console.log(decodedHtml.substring(0, 1000));
    console.log("--- END DECODED HTML ---");

  } catch(e:any) {
    console.error("Axios POST error:", e.response?.data || e.message);
  }
}

test();
