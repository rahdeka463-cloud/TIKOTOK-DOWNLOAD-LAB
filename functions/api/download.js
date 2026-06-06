const executeApisFast = async (apis) => {
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

const fetchJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchText = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return await res.text();
  } finally {
    clearTimeout(timeoutId);
  }
};

async function resolveMediaUrl(url, isAudio) {
  let resultUrl = "";
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('tiktok.com')) {
    resultUrl = await executeApisFast([
      async () => {
        const d = await fetchJson(`https://www.tikwm.com/api/`, { method: 'POST', body: JSON.stringify({ url, count: 12, cursor: 0, web: 1, hd: 1 }), headers: { 'Content-Type': 'application/json' }});
        if (d?.data) return isAudio ? `https://www.tikwm.com${d.data.music}` : `https://www.tikwm.com${d.data.hdplay || d.data.play}`;
      },
      async () => {
        const res = await fetchJson(`https://api.siputzx.my.id/api/d/tiktok?url=${url}`);
        return isAudio ? res?.data?.music : (res?.data?.hdplay || res?.data?.play);
      },
      async () => {
        const res = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${url}`);
        return isAudio ? res?.music?.play_url : res?.video?.noWatermark;
      }
    ]);
  } else if (lowerUrl.includes('instagram.com')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await fetchJson(`https://api.siputzx.my.id/api/d/instagram?url=${url}`);
        return res?.data?.[0]?.url || res?.data?.[0]?.downloadUrl;
      },
      async () => {
        const res = await fetchJson(`https://api.botcahx.eu.org/api/dowloader/igdown?url=${url}&apikey=p825s07w`);
        return res?.result?.[0]?.url || res?.result?.url || res?.result?.[0];
      }
    ]);
  } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await fetchJson(`https://api.siputzx.my.id/api/d/twitter?url=${url}`);
        if(res?.data?.url) return res.data.url;
        const media = res?.data?.media;
        if(media?.length > 0) return media.reverse().find(m => m.type === 'video' || m.type === 'animated_gif' || m.url)?.url || media[0].url;
      },
      async () => {
        const text = await fetchText(`https://twitsave.com/info?url=${url}`);
        const match = text.match(/href="([^"]+\.mp4[^"]*)"/);
        return match ? match[1] : null;
      },
      async () => {
        const res = await fetchJson(`https://api.botcahx.eu.org/api/dowloader/twitter?url=${url}&apikey=p825s07w`);
        return res?.result?.[0]?.url || res?.result?.url || res?.result?.video;
      }
    ]);
  } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await fetchJson(`https://api.siputzx.my.id/api/d/facebook?url=${url}`);
        const downloads = res?.data?.downloads;
        if (downloads?.length > 0) return isAudio ? downloads[downloads.length - 1].url : (downloads.find(d => d.quality === 'HD') || downloads[0]).url;
      },
      async () => {
        const text = await fetchText(`https://getmyfb.com/api/ajax/search`, { method: 'POST', body: `vid=${encodeURIComponent(url)}`, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
        const match = text.match(/href="([^"]+)"/);
        return match ? match[1] : null;
      },
      async () => {
        const res = await fetchJson(`https://api.botcahx.eu.org/api/dowloader/fbdown?url=${url}&apikey=p825s07w`);
        return res?.result?.url || res?.result?.sd;
      }
    ]);
  } else if (lowerUrl.includes('spotify.com')) {
     const res = await fetchJson(`https://api.siputzx.my.id/api/s/spotify?query=${url}`);
     return isAudio ? res?.data?.download : null;
  }

  if (!resultUrl) {
    resultUrl = await executeApisFast([
      async () => {
        const res = await fetchJson(`https://api.siputzx.my.id/api/d/youtube?url=${url}`);
        const d = res?.data;
        if (d) return isAudio ? d.audio || d.mp3 || d.url : d.video || d.mp4 || d.url || (d.downloads && d.downloads[0]?.url);
      },
      async () => {
        const res = await fetchJson(`https://api.botcahx.eu.org/api/dowloader/yt?url=${url}&apikey=p825s07w`);
        return isAudio ? res?.result?.mp3 : res?.result?.mp4;
      }
    ]);
  }
  return resultUrl;
}

export async function onRequestPost(context) {
   try {
     const request = context.request;
     const { url, platform, options, direct } = await request.json();
     const isAudio = options && options.includes("Audio(MP3)");
     
     const streamUrl = await resolveMediaUrl(url, isAudio);

     if (!streamUrl) {
        return new Response(JSON.stringify({ error: "Server gagal dapetin link raw nya." }), { status: 404, headers: { "Content-Type": "application/json" } });
     }

     if (direct) {
       return new Response(JSON.stringify({ directUrl: streamUrl }), { headers: { "Content-Type": "application/json" } });
     }

     // If not direct, proxy it through CF
     const reqHeaders = new Headers({
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
        "Accept": "*/*"
     });

     let response = await fetch(streamUrl, { headers: reqHeaders });
     
     if (response.status === 403 || response.status === 401) {
         // Proxy fallback
         response = await fetch(`https://cors.ryzendesu.vip/?url=${encodeURIComponent(streamUrl)}`, { headers: reqHeaders });
     }

     if (!response.ok) {
        return new Response(JSON.stringify({ error: "Akses diblokir sama penyedianya bre, coba opsi direct link aja." }), { status: 403, headers: { "Content-Type": "application/json" } });
     }

     const newResponse = new Response(response.body, response);
     const ext = isAudio ? "mp3" : "mp4";
     newResponse.headers.set("Content-Disposition", `attachment; filename="TikTokLab_${platform}_${Date.now()}.${ext}"`);
     newResponse.headers.set("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");

     return newResponse;
   } catch (err) {
     return new Response(JSON.stringify({ error: err.message || "Gagal ngeprosess link bre" }), { status: 500, headers: { "Content-Type": "application/json" } });
   }
}
