import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import os from "os";
import { GoogleGenAI } from "@google/genai";

const app = express();
const cache = new Map<string, { url: string, expiry: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 jam

function getCache(key: string) {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) return item.url;
  if (item) cache.delete(key);
  return null;
}

function setCache(key: string, url: string) {
  if (url) cache.set(key, { url, expiry: Date.now() + CACHE_TTL });
}

app.use(cors());
app.use(express.json());

async function resolveMediaUrl(url: string, isAudio: boolean): Promise<string> {
  const cacheKey = `${isAudio ? 'A' : 'V'}:${url}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`[Cache Hit] ${cacheKey}`);
    return cached;
  }

  let resultUrl = "";
  const lowerUrl = url.toLowerCase();

  // 1. TikTok
  if (lowerUrl.includes('tiktok.com')) {
    const ttApis = [
      async () => {
        const res = await axios.post('https://www.tikwm.com/api/', { url: url, count: 12, cursor: 0, web: 1, hd: 1 }, { timeout: 8000 });
        if (res.data?.data) {
          const d = res.data.data;
          return isAudio ? `https://www.tikwm.com${d.music}` : `https://www.tikwm.com${d.hdplay || d.play}`;
        }
      },
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${url}`, { timeout: 8000 });
        if (res.data?.data) {
          return isAudio ? res.data.data.music : (res.data.data.hdplay || res.data.data.play);
        }
      }
    ];
    for (const api of ttApis) {
      try {
        resultUrl = await api();
        if (resultUrl) {
          setCache(cacheKey, resultUrl);
          return resultUrl;
        }
      } catch (e) {}
    }
  }

  // 2. Instagram
  if (lowerUrl.includes('instagram.com')) {
    const igApis = [
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/instagram?url=${url}`, { timeout: 8000 });
        if (res.data?.data?.length > 0) return res.data.data[0].url || res.data.data[0].downloadUrl;
      },
      async () => {
        const res = await axios.get(`https://api.botcahx.eu.org/api/dowloader/igdown?url=${url}&apikey=p825s07w`, { timeout: 8000 });
        return res.data?.result?.[0]?.url || res.data?.result?.url;
      }
    ];
    for (const api of igApis) {
      try {
        resultUrl = await api();
        if (resultUrl) {
          setCache(cacheKey, resultUrl);
          return resultUrl;
        }
      } catch (e) {}
    }
  }

  // 3. Twitter / X
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    const xApis = [
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${url}`, { timeout: 8000 });
        if (res.data?.data?.url) return res.data.data.url;
        if (res.data?.data?.media?.length > 0) {
            const media = res.data.data.media.reverse().find((m: any) => m.type === 'video' || m.type === 'animated_gif' || m.url);
            return media?.url || res.data.data.media[0].url;
        }
      },
      async () => {
        const res = await axios.get(`https://api.botcahx.eu.org/api/dowloader/twitter?url=${url}&apikey=p825s07w`, { timeout: 8000 });
        return res.data?.result?.[0]?.url || res.data?.result?.url || res.data?.result?.video;
      }
    ];

    for (const api of xApis) {
      try {
        resultUrl = await api();
        if (resultUrl) {
          setCache(cacheKey, resultUrl);
          return resultUrl;
        }
      } catch (e) {}
    }
  }

  // 4. Facebook
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    const fbApis = [
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${url}`, { timeout: 8000 });
        if (res.data?.data?.downloads?.length > 0) {
          const downloads = res.data.data.downloads;
          return isAudio ? downloads[downloads.length - 1].url : (downloads.find((d: any) => d.quality === 'HD') || downloads[0]).url;
        }
      },
      async () => {
        const res = await axios.get(`https://api.botcahx.eu.org/api/dowloader/fbdown?url=${url}&apikey=p825s07w`, { timeout: 8000 });
        return res.data?.result?.url || res.data?.result?.sd;
      }
    ];

    for (const api of fbApis) {
      try {
        resultUrl = await api();
        if (resultUrl) {
          setCache(cacheKey, resultUrl);
          return resultUrl;
        }
      } catch (e) {}
    }
  }
  
  // 5. Spotify - Targeted Search instead of slow AI Meta
  if (lowerUrl.includes('spotify.com')) {
    const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    const query = trackIdMatch ? `Spotify Track ${trackIdMatch[1]}` : "Spotify Track";
    
    let ytUrl = "";
    try {
      // Parallel search for speed
      const [play, yts] = await Promise.all([import('play-dl'), import('yt-search')]);
      const [res1, res2] = await Promise.allSettled([
        play.default.search(query + " audio", { limit: 1 }),
        yts.default(query + " audio")
      ]);
      
      if (res1.status === 'fulfilled' && res1.value.length > 0) ytUrl = res1.value[0].url;
      else if (res2.status === 'fulfilled' && res2.value.all.length > 0) ytUrl = res2.value.all[0].url;
    } catch(e) {}

    if (ytUrl) url = ytUrl; // route to youtube extractors
  }

  // Global Fallback (YouTube, etc)
  const ytApis = [
    async () => {
      const btch = await import('btch-downloader');
      const result = await btch.youtube(url);
      if (result.status && (result.mp4 || result.mp3)) {
         return isAudio ? result.mp3 : result.mp4;
      }
    },
    async () => {
       const ytdl = (await import('@distube/ytdl-core')).default;
       const info = await ytdl.getInfo(url);
       if (isAudio) {
         const format = ytdl.filterFormats(info.formats, 'audioonly');
         return format[0]?.url;
       } else {
         const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
         return format.url;
       }
    },
    async () => {
      const youtubedl = (await import('youtube-dl-exec')).default;
      const info: any = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        callHome: false,
        noCheckCertificates: true,
        format: isAudio ? 'bestaudio' : 'best'
      });
      let u = info.url;
      if (!u && info.formats) {
        if (isAudio) {
           const audioFormats = info.formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none');
           if (audioFormats.length > 0) u = audioFormats[audioFormats.length - 1].url;
        } else {
           const videoFormats = info.formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
           if (videoFormats.length > 0) u = videoFormats[videoFormats.length - 1].url;
           else {
             const anyVideo = info.formats.filter((f: any) => f.vcodec !== 'none');
             if (anyVideo.length > 0) u = anyVideo[anyVideo.length - 1].url;
           }
        }
      }
      return u || (info.entries && info.entries[0]?.url);
    }
  ];

  for (const api of ytApis) {
    try {
      resultUrl = await api();
      if (resultUrl) {
        setCache(cacheKey, resultUrl);
        return resultUrl;
      }
    } catch(e) {}
  }

  setCache(cacheKey, resultUrl);
  return resultUrl;
}

// API Route for Downloader
app.post("/api/download", async (req, res) => {
  const { url, platform, options } = req.body;
  try {
    const isAudio = options && options.includes("Audio(MP3)");
    const timestamp = Date.now();
    const ext = isAudio ? "mp3" : "mp4";
    let filename = `TikoTokLab_${platform}_${timestamp}.${ext}`;
    let streamUrl = await resolveMediaUrl(url, isAudio);

    if (!streamUrl) {
       throw new Error("Server gagal dapetin link raw nya.");
    }

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
  ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    const response = await axios({
      method: "GET",
      url: streamUrl,
      responseType: "stream",
      timeout: 30000, // 30 seconds timeout
      headers: {
        "User-Agent": randomUA,
        "Accept": "*/*",
        "Accept-Encoding": "identity",
        "Connection": "keep-alive",
        "Referer": "https://www.google.com/"
      }
    });

    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");
    
    response.data.pipe(res);
    
  } catch (error: any) {
    console.error("Download Error Detail:", error.message || error);
    const msg = (error.message || "").toLowerCase();
    let userErr = "Gagal narik file aslinya. Mungkin link salah, diprotect, atau server lagi sibuk.";
    
    if (msg.includes('403') || msg.includes('forbidden')) {
       userErr = `Waduh, akses diblokir sama ${platform}. Server mereka kaga mau ngasih filenya ke Cloud Vercel. Coba lagi ntar ya!`;
    } else if (msg.includes('404')) {
       userErr = "Media kaga ketemu, bre. Cek linknya lagi, siapa tau videonya diapus.";
    } else if (msg.includes('timeout')) {
       userErr = "Server tujuan kelamaan balesnya. Jaringannya lagi lelet kayaknya.";
    } else if (msg.includes('sign in to confirm') || msg.includes('miniget')) {
       userErr = "Video ini diblokir YouTube (Bot Detection). Coba cari link video lain.";
    } else if (msg.includes('drm protection')) {
       userErr = "Konten ini diproteksi Hak Cipta (DRM), sistem kaga berani nyolong.";
    }

    res.status(error.response?.status || 500).json({ error: userErr });
  }
});

// API Route for Transcript
app.post("/api/transcript", async (req, res) => {
  const { url } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Ups, API Key belum keset nih." });
    }

    let audioUrl = await resolveMediaUrl(url, true);

    if (!audioUrl) {
       return res.status(500).json({ error: "Gagal nyari sumber raw audionya bre. Pastiin linknya bener." });
    }

    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    const tempId = Date.now() + Math.floor(Math.random() * 1000);
    const tempPath = path.join(os.tmpdir(), `audio_${tempId}.mp3`);
    
    try {
      const streamRes = await axios({ 
        method: 'GET', 
        url: audioUrl, 
        responseType: 'stream',
        headers: {
          "User-Agent": randomUA,
          "Accept": "*/*"
        }
      });
      const writer = fs.createWriteStream(tempPath);
      streamRes.data.pipe(writer);
      await new Promise((resolve, reject) => {
         writer.on('finish', () => resolve(true));
         writer.on('error', reject);
      });

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      // @ts-ignore
      const uploadResult = await ai.files.upload({ file: tempPath, mimeType: "audio/mp3" });
      
      const pt = `Tuliskan transkrip persis seperti yang diucapkan dalam audio ini. Jika ini lagu atau obrolan, tuliskan lirik atau kalimatnya secara nyata. Jangan ada pengantar atau penutup tambahan, langsung transkrip. Gunakan bahasa gaul atau obrolan santai jika ada di dalam audio.`;

      const aiResponse = await ai.models.generateContent({
         model: "gemini-1.5-flash",
         contents: [
           {
             role: 'user',
             parts: [
               { fileData: { fileUri: uploadResult.uri, mimeType: uploadResult.mimeType } },
               { text: pt }
             ]
           }
         ]
      });

      try { fs.unlinkSync(tempPath); } catch(err) {}
      try { await ai.files.delete({ name: uploadResult.name }); } catch(err) {}

      res.json({ transcript: aiResponse.text, audioUrl: audioUrl });

    } catch (gem_err: any) {
      try { fs.unlinkSync(tempPath); } catch(err) {}
      console.error("Gemini Error:", gem_err.message || gem_err);
      return res.status(500).json({ error: "Gagal ngeproses medianya pake AI nih cuy." });
    }
  } catch (error) {
    console.error("Transcript Error:", error);
    res.status(500).json({ error: "Gagal memproses transcript, coba bentar lagi bre!" });
  }
});

export default app;
