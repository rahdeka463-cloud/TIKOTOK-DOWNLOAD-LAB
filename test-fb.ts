import getfbvideo from 'fb-video-downloader';
async function test() {
  getfbvideo('https://www.facebook.com/reel/1586520712213793').then(console.log).catch(e => console.log(e.message));
}
test();
