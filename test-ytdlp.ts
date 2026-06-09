import yt from 'youtube-dl-exec';
async function test() {
  try {
     const result = await yt('https://www.instagram.com/reel/C7z8zD0P_E5/', {
       dumpJson: true,
       noWarnings: true
     });
     console.log(result.url || result.entries?.[0]?.url);
  } catch(e) {
     console.error(e);
  }
}
test();
