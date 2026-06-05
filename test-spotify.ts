import youtubedl from 'youtube-dl-exec';

async function test() {
  try {
    const res = await youtubedl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT', {
      dumpSingleJson: true,
      noWarnings: true
    });
    console.log("Success! Title:", res.title);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();
