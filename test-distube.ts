import ytdl from '@distube/ytdl-core';
async function test() {
  try {
    const info = await ytdl.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    console.log("Format URL:", format.url.substring(0,100));
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}
test();
