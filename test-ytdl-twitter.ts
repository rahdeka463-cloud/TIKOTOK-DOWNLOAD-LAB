import youtubedl from 'youtube-dl-exec';
async function test() {
  try {
    const res = await youtubedl('https://twitter.com/Twitter/status/1580661436132757506', {
      dumpSingleJson: true, noWarnings: true
    });
    console.log("Success! Title:", res.title);
  } catch(e: any) {
    console.error("Error:", e.message);
  }
}
test();
