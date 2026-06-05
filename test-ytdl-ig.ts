import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const res = await youtubedl('https://www.instagram.com/reel/C7z8zD0P_E5/?igsh=...', {
      dumpSingleJson: true, noWarnings: true
    });
    console.log("Success! Title:", res.title);
  } catch(e: any) {
    console.error("Error:", e.message);
  }
}
test();
