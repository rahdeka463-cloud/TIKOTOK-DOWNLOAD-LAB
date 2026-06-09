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

  let resultUrl: string | null | undefined = "";
  const lowerUrl = url.toLowerCase();
  const T = 15000; // Optimal 15s timeout for stability on Serverless

  const executeApisFast = async (apis: ((() => Promise<string | undefined | null>))[]) => {
    try {
      return await Promise.any(apis.map(async (api) => {
        const res = await api();
        if (!res || typeof res !== 'string' || !res.startsWith('http')) throw new Error("Invalid URL");
        return res;
      }));
    } catch (e) {
      return null;
    }
  };

  const tryCobaltInstances = async () => {
     const instances = ["https://cobalt.kwiatechu.com", "https://api.cobalt.faceless.work", "https://cobalt.owo.network", "https://co.wuk.sh", "https://cobalt.q0.uk"];
     return executeApisFast(instances.map(host => async () => {
         const res = await axios.post(host, { url, isAudioOnly: isAudio }, {
           headers: { "Accept": "application/json", "Content-Type": "application/json" },
           timeout: T
         });
         return res.data?.url;
     }));
  };

  // 1. TikTok
  if (lowerUrl.includes('tiktok.com')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await axios.post('https://www.tikwm.com/api/', { url: url, count: 12, cursor: 0, web: 1, hd: 1 }, { timeout: T });
        const d = res.data?.data;
        if (d) return isAudio ? `https://www.tikwm.com${d.music}` : `https://www.tikwm.com${d.hdplay || d.play}`;
      },
      async () => {
        const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${url}`, { timeout: T });
        if (res.data) return isAudio ? res.data.music?.play_url : res.data.video?.noWatermark;
      },
      tryCobaltInstances
    ]);
  }

  // 2. Instagram
  else if (lowerUrl.includes('instagram.com')) {
    resultUrl = await executeApisFast([
      tryCobaltInstances,
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${url}`, { timeout: T });
        if (res.data?.data?.length > 0) return res.data.data[0].url || res.data.data[0].downloadUrl;
      },
      async () => {
        const res = await axios.get(`https://api.botcahx.eu.org/api/dowloader/igdown?url=${url}&apikey=p825s07w`, { timeout: T });
        return res.data?.result?.[0]?.url || res.data?.result?.url || res.data?.result?.[0]; 
      },
      async () => {
        const params = new URLSearchParams();
        params.append('url', url);
        params.append('action', 'post');
        const res = await axios.post('https://snapinsta.app/action.php', params, {
          headers: { 'Origin': 'https://snapinsta.app', 'Referer': 'https://snapinsta.app/', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: T
        });
        const match = res.data.match(/href=\\"(https:\\\/\\\/[^"]+\.mp4[^"]*)\\"/);
        return match ? match[1].replace(/\\/g, '') : null;
      }
    ]);
  }

  // 3. Twitter / X
  else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await axios.get(`https://twitsave.com/info?url=${url}`, { timeout: T });
        const match = res.data.match(/href="([^"]+\.mp4[^"]*)"/);
        return match ? match[1] : null;
      },
      tryCobaltInstances
    ]);
  }

  // 4. Facebook
  else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await axios.post(`https://getmyfb.com/api/ajax/search`, `vid=${encodeURIComponent(url)}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*' }, timeout: T });
        if(res.data) {
           const match = res.data.match(/href="([^"]+)"/);
           if (match) return match[1];
        }
      },
      tryCobaltInstances
    ]);
  }
  
  // 5. Spotify
  else if (lowerUrl.includes('spotify.com')) {
    resultUrl = await executeApisFast([
      async () => {
         const res = await axios.get(`https://api.siputzx.my.id/api/s/spotify?query=${url}`, { timeout: T });
         if (res.data?.data) return res.data.data.download;
      },
      async () => {
         const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
         const query = trackIdMatch ? `Spotify Track ${trackIdMatch[1]}` : "Spotify Track";
         const play = await import('play-dl');
         const res = await play.default.search(query + " audio", { limit: 1 });
         if (res.length > 0) {
           const ytdl = (await import('@distube/ytdl-core')).default;
           const info = await ytdl.getInfo(res[0].url);
           const format = ytdl.filterFormats(info.formats, 'audioonly');
           return format[0]?.url;
         }
      }
    ]);
  }

  // Global Fallback (YouTube, etc)
  if (!resultUrl) {
    resultUrl = await executeApisFast([
      tryCobaltInstances,
      async () => {
        const res = await axios.get(`https://api.siputzx.my.id/api/d/youtube?url=${url}`, { timeout: T });
        const d = res.data?.data;
        if (d) return isAudio ? d.audio || d.mp3 || d.url : d.video || d.mp4 || d.url || (d.downloads && d.downloads[0]?.url);
      },
      async () => {
         const ytdl = (await import('@distube/ytdl-core')).default;
         const info = await ytdl.getInfo(url);
         if (isAudio) {
           const format = ytdl.filterFormats(info.formats, 'audioonly');
           return format[0]?.url;
         } else {
           const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
           return format?.url;
         }
      }
    ]);
  }

  if (resultUrl) {
    setCache(cacheKey, resultUrl);
    return resultUrl;
  }
  return "";
}

// API Route for Downloader
app.post("/api/download", async (req, res) => {
  const { url, platform, options, direct } = req.body;
  try {
    const isAudio = options && options.includes("Audio(MP3)");
    const timestamp = Date.now();
    const ext = isAudio ? "mp3" : "mp4";
    let filename = `TikoTokLab_${platform}_${timestamp}.${ext}`;
    let streamUrl = await resolveMediaUrl(url, isAudio);

    if (!streamUrl) {
       throw new Error("Server gagal dapetin link raw nya.");
    }

    if (direct) {
       return res.json({ directUrl: streamUrl });
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
       userErr = `Waduh, akses diblokir sama penyedia videonya bro. Coba opsi download lewat browser aja (Direct Link).`;
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

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.google.com/"
    };

    let streamRes;
    try {
      streamRes = await axios({ 
        method: 'GET', 
        url: audioUrl, 
        responseType: 'arraybuffer',
        timeout: 45000,
        headers
      });
    } catch (streamErr: any) {
      console.log("[Transcript] Direct fetch failed, trying proxy 1...");
      try {
        streamRes = await axios({
          method: 'GET',
          url: `https://cors.ryzendesu.vip/?url=${encodeURIComponent(audioUrl)}`,
          responseType: 'arraybuffer',
          timeout: 45000,
          headers
        });
      } catch(e) {
        console.log("[Transcript] Proxy 1 failed, trying proxy 2...");
        try {
          streamRes = await axios({
            method: 'GET',
            url: `https://api.allorigins.win/raw?url=${encodeURIComponent(audioUrl)}`,
            responseType: 'arraybuffer',
            timeout: 45000,
            headers
          });
        } catch(e2) {
          throw new Error("Gagal donlod source media, sistem ngeblok akses donlod ke link ini.");
        }
      }
    }

    const contentType = streamRes.headers['content-type'] || '';
    const isHtml = contentType.includes('text/html') && streamRes.data.byteLength < 500000;
    
    if (isHtml || streamRes.data.byteLength < 1000) {
        throw new Error("Gagal ngambil file media, link kena blokir Captcha/Cloudflare (bukan valid media). Coba link platform lain.");
    }

    let validMime = "audio/mp3";
    if (contentType.includes('mp4')) validMime = 'video/mp4';
    else if (contentType.includes('ogg')) validMime = 'audio/ogg';
    else if (contentType.includes('wav')) validMime = 'audio/wav';
    else if (contentType.includes('aac')) validMime = 'audio/aac';
    else if (contentType.includes('webm')) validMime = 'video/webm';
    else if (contentType.includes('mpeg')) validMime = 'audio/mpeg';

    const sizeInMB = streamRes.data.byteLength / (1024 * 1024);
    
    const ai = new GoogleGenAI({ apiKey });
    const pt = `Tuliskan transkrip persis seperti yang diucapkan dalam audio ini. Jika ini lagu atau obrolan, tuliskan lirik atau kalimatnya secara nyata. Jangan ada pengantar atau penutup tambahan, langsung transkrip. Gunakan bahasa gaul atau obrolan santai jika ada di dalam audio.`;

    let aiResponse;

    if (sizeInMB > 19) {
        // Use File API for large files
        const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}.${validMime.split('/')[1]}`);
        fs.writeFileSync(tempFilePath, Buffer.from(streamRes.data));
        
        try {
            const uploadResult = await ai.files.upload({
              file: tempFilePath,
              mimeType: validMime,
            });

            aiResponse = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: [
                {
                  role: 'user',
                  parts: [
                    { fileData: { fileUri: uploadResult.uri, mimeType: validMime } },
                    { text: pt }
                  ]
                }
              ]
            });
            
            // Cleanup
            await ai.files.delete({ name: uploadResult.name }).catch(() => {});
        } finally {
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }
    } else {
        const base64Audio = Buffer.from(streamRes.data).toString('base64');
        aiResponse = await ai.models.generateContent({
           model: "gemini-1.5-flash-8b",
           contents: [
             {
               role: 'user',
               parts: [
                 { inlineData: { data: base64Audio, mimeType: validMime } },
                 { text: pt }
               ]
             }
           ]
        });
    }

    res.json({ transcript: aiResponse.text, audioUrl: audioUrl });

  } catch (error) {
    console.error("Transcript Error:", error);
    res.status(500).json({ error: "Gagal memproses transcript, coba bentar lagi bre!" });
  }
});

export default app;
