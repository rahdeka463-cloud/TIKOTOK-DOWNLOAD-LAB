import ytdl from '@distube/ytdl-core';
import ytSearch from 'yt-search';

async function test() {
  try {
    const r = await ytSearch('Rick Astley Never Gonna Give You Up');
    const video = r.videos[0];
    console.log("Found:", video.url);

    const info = await ytdl.getInfo(video.url);
    const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
    console.log("Audio URL:", format.url.substring(0, 50));
  } catch(e: any) {
    console.error(e.message);
  }
}
test();
