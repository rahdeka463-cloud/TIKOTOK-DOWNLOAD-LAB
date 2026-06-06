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

async function resolveMediaUrl(url, isAudio) {
  let resultUrl = "";
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

export async function onRequestPost({ request, env }) {
   try {
     const { url } = await request.json();
     
     const apiKey = env.GEMINI_API_KEY;
     if (!apiKey) {
        return new Response(JSON.stringify({ error: "API Key GEMINI_API_KEY belum disetup di Cloudflare Settings." }), { status: 500 });
     }

     const audioUrl = await resolveMediaUrl(url, true);

     if (!audioUrl) {
        return new Response(JSON.stringify({ error: "Gagal nyari sumber raw audionya bre. Pastiin linknya bener." }), { status: 404 });
     }

     const reqHeaders = new Headers({
        "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
        "Accept": "*/*"
     });

     let streamRes = await fetch(audioUrl, { headers: reqHeaders });
     
     if (streamRes.status === 403 || streamRes.status === 401) {
         streamRes = await fetch(`https://cors.ryzendesu.vip/?url=${encodeURIComponent(audioUrl)}`, { headers: reqHeaders });
     }

     if (!streamRes.ok) {
        return new Response(JSON.stringify({ error: "Gagal ngambil file media, diblokir." }), { status: 403 });
     }

     const arrayBuffer = await streamRes.arrayBuffer();
     const contentType = streamRes.headers.get('content-type') || 'audio/mp3';
     
     if (contentType.includes('text/html') || arrayBuffer.byteLength < 1000) {
        return new Response(JSON.stringify({ error: "Format link ini bukan media audio/video valid." }), { status: 400 });
     }

     let validMime = "audio/mp3";
     if (contentType.includes('mp4')) validMime = 'video/mp4';
     else if (contentType.includes('ogg')) validMime = 'audio/ogg';
     else if (contentType.includes('wav')) validMime = 'audio/wav';
     else if (contentType.includes('aac')) validMime = 'audio/aac';
     else if (contentType.includes('webm')) validMime = 'video/webm';
     else if (contentType.includes('mpeg')) validMime = 'audio/mpeg';

     const sizeInMB = arrayBuffer.byteLength / (1024 * 1024);
     if (sizeInMB > 19) {
        return new Response(JSON.stringify({ error: `Ukuran audionya kegedean bro (${sizeInMB.toFixed(1)}MB), batas untuk AI itu 20MB.` }), { status: 400 });
     }

     // Convert ArrayBuffer to Base64 (Cloudflare secure approach)
     let binary = '';
     const bytes = new Uint8Array(arrayBuffer);
     const chunkCounter = 1024 * 1024;
     for (let i = 0; i < bytes.length; i += chunkCounter) {
        binary += String.fromCharCode.apply(null, bytes.slice(i, i + chunkCounter));
     }
     const base64Audio = btoa(binary);

     // Call Gemini manually using fetch! Cloudflare native
     const pt = "Tuliskan transkrip persis seperti yang diucapkan dalam audio ini. Jika ini lagu atau obrolan, tuliskan lirik atau kalimatnya secara nyata. Jangan ada pengantar atau penutup tambahan, langsung transkrip. Gunakan bahasa gaul atau obrolan santai jika ada di dalam audio.";
     
     const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;
     
     const geminiRes = await fetch(geminiUrl, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'User-Agent': 'cloudflare-pages'
         },
         body: JSON.stringify({
             contents: [{
                 role: 'user',
                 parts: [
                     { inline_data: { data: base64Audio, mime_type: validMime } },
                     { text: pt }
                 ]
             }]
         })
     });

     const geminiData = await geminiRes.json();
     if (!geminiRes.ok) {
        console.error(geminiData);
        return new Response(JSON.stringify({ error: "Gagal dapet transcript dari AI." }), { status: 500 });
     }

     const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal nge-generate text bro.";
     
     return new Response(JSON.stringify({ transcript: text, audioUrl: audioUrl }), { headers: { "Content-Type": "application/json" } });

   } catch (err) {
     return new Response(JSON.stringify({ error: err.message || "Udah, nyerah gua." }), { status: 500, headers: { "Content-Type": "application/json" } });
   }
}
