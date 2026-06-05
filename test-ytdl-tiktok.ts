import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const res = await youtubedl('https://www.tiktok.com/@tiktok/video/7106594312292453675', {
      dumpSingleJson: true, noWarnings: true
    });
    console.log("Success! Title:", res.title);
  } catch(e: any) {
    console.error("Error:", e.message);
  }
}
test();
