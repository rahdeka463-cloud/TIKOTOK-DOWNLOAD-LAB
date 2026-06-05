import { useState, useEffect } from 'react';
import { Loader2, Download, CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { Platform, DownloadOptions } from '../types';
import { cn } from '../lib/utils';
import axios from 'axios';
import { ThemeConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const OPTIONS: DownloadOptions[] = ['Full HD(1080p)', 'HD(720p)', 'Audio(MP3)', 'Tanpa Watermark'];

const validatePlatformUrl = (url: string, platform: Platform): boolean => {
  const lowerUrl = url.toLowerCase();
  switch (platform) {
    case 'TikTok': return lowerUrl.includes('tiktok.com');
    case 'YouTube': return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
    case 'Instagram': return lowerUrl.includes('instagram.com');
    case 'Facebook': return lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch');
    case 'Twitter': return lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com');
    case 'Spotify': return lowerUrl.includes('spotify.com');
    default: return false;
  }
};

export default function MainDownloader({ platform, theme }: { platform: Platform, theme: ThemeConfig }) {
  const [url, setUrl] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<DownloadOptions[]>([]);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dots, setDots] = useState('');

  // Default selection
  useEffect(() => {
    if (platform === 'Spotify') {
      setSelectedOptions(['Audio(MP3)']);
    } else if (platform === 'TikTok' || platform === 'Instagram') {
      setSelectedOptions(['Full HD(1080p)', 'Tanpa Watermark']);
    } else {
      setSelectedOptions(['Full HD(1080p)']);
    }
    setErrorMsg('');
    setStatus('idle');
    setUrl(''); // Clear url when platform changes
  }, [platform]);

  useEffect(() => {
    if (status !== 'loading') return;
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 5 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  const toggleOption = (option: DownloadOptions) => {
    if (platform === 'Spotify') return; // Spotify is audio only, no toggle
    
    if (option === 'Audio(MP3)') {
      if (selectedOptions.includes('Audio(MP3)')) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(['Audio(MP3)']);
      }
      return;
    }

    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      const newOptions = selectedOptions.filter(o => o !== 'Audio(MP3)');
      setSelectedOptions([...newOptions, option]);
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) return;
    
    if (!validatePlatformUrl(url, platform)) {
      setErrorMsg(`Waduh bre, lu salah link nih. Pastiin ini beneran link ${platform}!`);
      return;
    }
    
    setErrorMsg('');
    setStatus('loading');
    
    try {
      const response = await axios({
        method: 'POST',
        url: '/api/download',
        data: { url, platform, options: selectedOptions },
        responseType: 'blob'
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      const isAudio = selectedOptions.includes('Audio(MP3)');
      const ext = isAudio ? 'mp3' : 'mp4';
      link.setAttribute('download', `TikoTokLab_${platform}_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error(error);
      const isJsonBlob = error.response?.data instanceof Blob && error.response.data.type === 'application/json';
      let serverError = 'Waduh, server lagi sibuk coy! Bentar ya diulang lagi.';
      
      if (isJsonBlob) {
        const textData = await error.response.data.text();
        const json = JSON.parse(textData);
        if (json.error) serverError = json.error;
      }
      
      setErrorMsg(serverError);
      setStatus('idle');
    }
  };

  const availableOptions = (platform === 'Spotify' ? ['Audio(MP3)'] : 
    (platform === 'TikTok' || platform === 'Instagram') ? OPTIONS : OPTIONS.filter(opt => opt !== 'Tanpa Watermark')) as DownloadOptions[];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Main Card */}
      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors duration-500 hover:bg-white/10">
        
        {/* Subtle glow orb inside card */}
        <div className={cn("absolute -top-32 -right-32 w-64 h-64 blur-3xl rounded-full opacity-30 pointer-events-none transition-colors duration-1000", theme.checkBg)} />

        {/* Input */}
        <div className="mb-6 md:mb-8 relative z-10">
          <label className="block text-white/90 font-semibold mb-2 md:mb-3 ml-1 md:ml-2 text-sm md:text-base">Paste disini, bre!👇</label>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={`Masukkan URL video ${platform} lu disini...`}
              className={cn(
                "flex-1 bg-black/40 border text-white rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 font-mono text-sm md:text-base transition-colors placeholder:text-white/30 backdrop-blur-md",
                errorMsg ? "border-red-500 focus:ring-red-500" : `border-white/10 ${theme.ring}`
              )}
            />
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setUrl(text);
                  if (errorMsg) setErrorMsg('');
                } catch (err) {
                  setErrorMsg('Gagal nempel otomatis (Clipboard Diblokir), silakan paste manual ya bre!');
                }
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center shrink-0 w-full sm:w-auto text-sm md:text-base"
            >
              <Copy size={18} className="mr-2 opacity-70" /> Paste
            </button>
          </div>
          
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-3 bg-red-900/30 border border-red-800/50 text-red-400 p-3 rounded-xl flex items-center gap-2 backdrop-blur-sm text-xs md:text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Options */}
        <div className="mb-8 md:mb-10 relative z-10">
          <p className="text-white/70 text-xs md:text-sm font-semibold mb-3 md:mb-4 ml-1 md:ml-2">
            {platform === 'Spotify' ? 'Settingan Spotify (Cuma MP3):' : 'Pilih Settingan Biar Mantap:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {availableOptions.map((opt) => {
              const isSelected = selectedOptions.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  disabled={platform === 'Spotify'}
                  className={cn(
                    "px-3 md:px-4 py-3 border rounded-xl transition-all duration-300 flex flex-row items-center justify-start md:justify-center gap-2 md:gap-3 backdrop-blur-md",
                    isSelected 
                      ? `bg-white/10 border-transparent text-white shadow-inner ${theme.shadow}` 
                      : "bg-black/20 border-white/5 text-white/50 hover:bg-black/40 hover:text-white",
                    platform === 'Spotify' && "opacity-100 cursor-default hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                    isSelected ? theme.checkBg : "border-white/20"
                  )}>
                    {isSelected && <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" strokeWidth={3} />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-tight text-left line-clamp-2 md:line-clamp-1">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          disabled={!url || status === 'loading'}
          className={cn(
            "w-full rounded-xl md:rounded-2xl py-4 md:py-5 text-lg md:text-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 md:gap-3 relative z-10 outline-none",
            status === 'success' 
              ? "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 text-white" 
              : `${theme.button} shadow-xl ${theme.shadow} disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/10 disabled:shadow-none`
          )}
        >
          {status === 'loading' && (
            <>
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              Lagi Ngambil {selectedOptions.includes('Audio(MP3)') ? 'Audio' : 'Video'}{dots}
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              Sukses! Cek notifikasi download browser lu.
            </>
          )}
          {status === 'idle' && (
            <>
              <Download className="w-5 h-5 md:w-6 md:h-6" />
              {platform === 'Spotify' ? 'Download Sekarang!' : 'Sedot Sekarang!'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
