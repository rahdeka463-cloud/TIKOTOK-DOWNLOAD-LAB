import { ndown, ytdown, tikdown, twitterdown } from 'nayan-media-downloader';

async function run() {
  try {
     let res = await ndown("https://www.instagram.com/reel/C7z8zD0P_E5/");
     console.log("IG:", res);
     
     let res2 = await ytdown("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
     console.log("YT:", res2);

     let res3 = await tikdown("https://www.tiktok.com/@tiktok/video/7106594312292453675");
     console.log("TikTok:", res3);
  } catch(e) {
     console.error("Nayan err", e);
  }
}

run();
