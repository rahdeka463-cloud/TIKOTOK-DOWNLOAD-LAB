import axios from 'axios';
import * as cheerio from 'cheerio';
import youtubedl from 'youtube-dl-exec';

async function test() {
  try {
    const spotifyUrl = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';
    const res = await axios.get(spotifyUrl);
    const $ = cheerio.load(res.data);
    let title = $('title').text();
    title = title.replace(' - song and lyrics by ', ' ').replace(' | Spotify', '');
    console.log("Spotify Title:", title);

    const searchStr = `ytsearch1:${title} audio`;
    const ytdlRes = await youtubedl(searchStr, {
      dumpSingleJson: true,
      noWarnings: true
    });
    // @ts-ignore
    console.log("Found on YouTube:", ytdlRes.entries[0].title);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();
