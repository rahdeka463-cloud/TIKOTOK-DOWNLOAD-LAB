import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import os from "os";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

async function resolveMediaUrl(url: string, isAudio: boolean) {
  let streamUrl = "";
  let cleanUrl = url.split('?')[0];

  // Try TikTok using tikwm natively if it looks like tiktok
  if (url.includes('tiktok.com')) {
    try {
      const tikwmRes = await axios.post('https://www.tikwm.com/api/', { url: url, count: 12, cursor: 0, web: 1, hd: 1 });
      if (tikwmRes.data && tikwmRes.data.data) {
        const data = tikwmRes.data.data;
        streamUrl = isAudio ? `https://www.tikwm.com${data.music}` : `https://www.tikwm.com${data.hdplay || data.play}`;
      }
    } catch(e) {}
  }

  // Try FB
  if (!streamUrl && (url.includes('facebook.com') || url.includes('fb.watch'))) {
    try {
      const fbRes = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${url}`);
      if (fbRes.data?.data?.downloads?.length > 0) {
        const downloads = fbRes.data.data.downloads;
        if (isAudio) streamUrl = downloads[downloads.length - 1].url;
        else {
          const hd = downloads.find((d: any) => d.quality === 'HD' || d.resolution === '720p (HD)');
          streamUrl = hd ? hd.url : downloads[0].url;
        }
      }
    } catch(e) {}
  }
  
  // Try Spotify
  if (!streamUrl && url.includes('spotify.com')) {
    let queryTitle = "";
    
    // Attempt Gemini-powered metadata lookup
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ 
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
        const pt = `Identify the song title and artist name for this Spotify track URL: ${url}
Please return ONLY a JSON object in this format (no markdown code blocks, no backtick wrap, no other text):
{
  "title": "Song Title",
  "artist": "Artist Name"
}
If you cannot identify it, reply with: {"title": "Unknown", "artist": "Unknown"}`;

        const gRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: pt,
        });

        const textOutput = gRes.text || "";
        const cleanJson = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
        const meta = JSON.parse(cleanJson);
        if (meta.title && meta.title !== "Unknown") {
          queryTitle = `${meta.title} ${meta.artist}`;
          console.log(`[Spotify System] Metadata resolved via Gemini: ${queryTitle}`);
        }
      } catch (err: any) {
        console.warn("[Spotify System] Gemini metadata retrieval failed or premium query unavailable:", err.message || err);
      }
    }

    // Fallback if Gemini failed or didn't run: extract ID from URL
    if (!queryTitle) {
      const match = url.match(/track\/([a-zA-Z0-9]+)/);
      const trackId = match ? match[1] : "";
      queryTitle = trackId ? `Spotify Track ${trackId}` : "Spotify Track";
    }

    // Advanced double-layered YouTube search
    let ytUrl = "";
    try {
      const play = (await import('play-dl')).default;
      const searched = await play.search(queryTitle + " audio", { limit: 1 });
      if (searched && searched.length > 0) {
        ytUrl = searched[0].url;
      }
    } catch(e: any) {
      console.warn("[Spotify System] play-dl search fallback triggered:", e.message || e);
    }

    if (!ytUrl) {
      try {
        const yts = (await import('yt-search')).default;
        const res = await yts(queryTitle + " audio");
        if (res.all && res.all.length > 0) {
          ytUrl = res.all[0].url;
        }
      } catch(e: any) {
        console.error("[Spotify System] Search failed on both play-dl and yt-search:", e.message || e);
      }
    }

    if (ytUrl) {
      cleanUrl = ytUrl;
      console.log(`[Spotify System] Successfully routed Spotify track to: ${cleanUrl}`);
    }
  }

  // Try btch downloader
  if (!streamUrl) {
    try {
      const btch = await import('btch-downloader');
      const result = await btch.youtube(cleanUrl);
      if (result.status && (result.mp4 || result.mp3)) {
         streamUrl = isAudio ? result.mp3 : result.mp4;
      }
    } catch(e) {}
  }

  // Fallback youtubedl
  if (!streamUrl) {
    try {
      const youtubedl = (await import('youtube-dl-exec')).default;
      const info: any = await youtubedl(cleanUrl, {
        dumpSingleJson: true,
        noWarnings: true,
        callHome: false,
        noCheckCertificates: true,
        format: isAudio ? 'bestaudio' : 'best'
      });
      streamUrl = info.url;
      if (!streamUrl && info.formats) {
        if (isAudio) {
           const audioFormats = info.formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none');
           if (audioFormats.length > 0) streamUrl = audioFormats[audioFormats.length - 1].url;
        } else {
           const videoFormats = info.formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
           if (videoFormats.length > 0) streamUrl = videoFormats[videoFormats.length - 1].url;
           else {
             const anyVideo = info.formats.filter((f: any) => f.vcodec !== 'none');
             if (anyVideo.length > 0) streamUrl = anyVideo[anyVideo.length - 1].url;
           }
        }
      }
      if (!streamUrl && info.entries && info.entries.length > 0) streamUrl = info.entries[0].url;
    } catch(err: any) {
      console.error("Fallback YTDL failed", err.message);
    }
  }

  return streamUrl;
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

    const response = await axios({
      method: "GET",
      url: streamUrl,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    res.setHeader("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    
    response.data.pipe(res);
    
  } catch (error: any) {
    console.error("Download Error:", error.message || error);
    const msg = error.message || "";
    let userErr = "Gagal ngambil file asli. Mungkin linknya salah atau server tujuan memblokir.";
    
    if (msg.includes('Sign in to confirm') || msg.includes('miniget')) {
       userErr = "Waduh, Video ini diblokir YouTube (Bot Detection). Coba video lain.";
    } else if (msg.includes('DRM protection')) {
       userErr = "Waduh! Video/Audio ini kena DRM (Hak Cipta ketat), sistem gak diizinin nyedot.";
    } else if (msg.includes('No video could be found') || msg.includes('empty media response')) {
       userErr = platform === 'Instagram' 
          ? "Waduh, Instagram lagi protect gila-gilaan nih API gratisannya. Kalo link lu bener, coba pakai reel lain / tunggu ntar ya!" 
          : "Link bener, tapi kaga ada videonya atau akunnya di-Private bre.";
    }

    res.status(500).json({ error: userErr });
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

    const tempId = Date.now() + Math.floor(Math.random() * 1000);
    const tempPath = path.join(os.tmpdir(), `audio_${tempId}.mp3`);
    
    try {
      const streamRes = await axios({ method: 'GET', url: audioUrl, responseType: 'stream' });
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
         model: "gemini-3.5-flash",
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
