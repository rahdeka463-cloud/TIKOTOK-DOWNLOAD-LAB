import youtubedl from 'youtube-dl-exec';

async function test() {
  try {
    const res = await youtubedl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: 'https://www.youtube.com/'
    });
    console.log("Success! Title:", res.title);
    if(res.url) console.log("URL:", res.url);
    if(res.formats) console.log("Formats available:", res.formats.length);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();
