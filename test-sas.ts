import igdl from '@sasmeee/igdl';
async function test() {
  try {
    const res = await igdl('https://www.instagram.com/reel/C7z8zD0P_E5/');
    console.log("IG:", res[0].download_link);
  } catch(e:any) {
    console.error("IG err:", e.message);
  }
}
test();
