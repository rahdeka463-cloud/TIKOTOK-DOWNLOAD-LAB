import btch from 'btch-downloader';

async function test() {
  try {
    const res = await btch.igdl("https://www.instagram.com/reel/C7z8zD0P_E5/");
    console.log("IG:", res);
  } catch(e) {
    console.error("IG Error");
  }
}
test();
