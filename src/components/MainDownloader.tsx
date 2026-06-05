import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Download, CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { Platform, DownloadOptions } from '../types';
import { cn } from '../lib/utils'; // Assuming logic might change or using our own lib/utils
import axios from 'axios';
import { ThemeConfig } from '../lib/theme';
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
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized platform selection
  useEffect(() => {
    const defaults: Record<string, DownloadOptions[]> = {
      'Spotify': ['Audio(MP3)'],
      'TikTok': ['Full HD(1080p)', 'Tanpa Watermark'],
      'Instagram': ['Full HD(1080p)', 'Tanpa Watermark']
    };
    setSelectedOptions(defaults[platform] || ['Full HD(1080p)']);
    setErrorMsg('');
    setStatus('idle');
    setUrl('');
    setDownloadProgress(0);
  }, [platform]);

  const toggleOption = useCallback((option: DownloadOptions) => {
    if (platform === 'Spotify') return;
    
    setSelectedOptions(prev => {
      if (option === 'Audio(MP3)') {
        return prev.includes('Audio(MP3)') ? [] : ['Audio(MP3)'];
      }
      const filtered = prev.filter(o => o !== 'Audio(MP3)');
      return prev.includes(option) ? filtered.filter(o => o !== option) : [...filtered, option];
    });
  }, [platform]);

  const handleDownload = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    
    if (!validatePlatformUrl(trimmedUrl, platform)) {
      setErrorMsg(`Waduh bre, lu salah link nih. Pastiin ini beneran link ${platform}!`);
      return;
    }
    
    setErrorMsg('');
    setStatus('loading');
    setLoadingStep('Lagi nyari link terbaik...');
    setDownloadProgress(0);
    
    try {
      const response = await axios({
        method: 'POST',
        url: '/api/download',
        data: { url: trimmedUrl, platform, options: selectedOptions },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(percent);
            setLoadingStep(`Lagi ditarik... ${percent}%`);
          } else {
            setLoadingStep('Lagi narik data ke server...');
          }
        },
        timeout: 120000 // 2 minutes
      });

      setLoadingStep('Selesai! Lagi nyimpen...');
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
      setTimeout(() => {
        setStatus('idle');
        setDownloadProgress(0);
      }, 5000);
    } catch (error: any) {
      console.error(error);
      const isJsonBlob = error.response?.data instanceof Blob && error.response.data.type === 'application/json';
      let serverError = 'Waduh, server lagi sibuk coy! Bentar ya diulang lagi.';
      
      if (isJsonBlob) {
        const textData = await error.response.data.text();
        const json = JSON.parse(textData);
        if (json.error) serverError = json.error;
      } else if (error.message?.includes('timeout')) {
        serverError = "Waduh, jaringannya kelamaan bre. Coba lagi!";
      }
      
      setErrorMsg(serverError);
      setStatus('idle');
      setDownloadProgress(0);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (errorMsg) setErrorMsg('');
      inputRef.current?.focus();
    } catch (err) {
      setErrorMsg('Gagal nempel otomatis (Clipboard Diblokir), silakan paste manual ya bre!');
    }
  };

  const availableOptions = (platform === 'Spotify' ? ['Audio(MP3)'] : 
    (platform === 'TikTok' || platform === 'Instagram') ? OPTIONS : OPTIONS.filter(opt => opt !== 'Tanpa Watermark')) as DownloadOptions[];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:bg-white/[0.08] group">
        
        <div className={cn("absolute -top-32 -right-32 w-64 h-64 blur-3xl rounded-full opacity-30 pointer-events-none transition-colors duration-1000", theme.checkBg)} />

        <div className="mb-6 md:mb-8 relative z-10">
          <label className="block text-white/90 font-semibold mb-2 md:mb-3 ml-1 md:ml-2 text-sm md:text-base">Paste disini, bre!👇</label>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={`Masukkan URL video ${platform} lu disini...`}
              className={cn(
                "flex-1 bg-black/40 border text-white rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 font-mono text-sm md:text-base transition-all placeholder:text-white/30 backdrop-blur-md",
                errorMsg ? "border-red-500 focus:ring-red-500" : `border-white/10 ${theme.ring}`
              )}
            />
            <button
              onClick={handlePaste}
              className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center shrink-0 w-full sm:w-auto text-sm md:text-base cursor-pointer"
            >
              <Copy size={18} className="mr-2 opacity-70" /> Paste
            </button>
          </div>
          
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-900/30 border border-red-800/50 text-red-400 p-3 rounded-xl flex items-center gap-2 backdrop-blur-sm text-xs md:text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-8 md:mb-10 relative z-10">
          <p className="text-white/70 text-xs md:text-sm font-semibold mb-3 md:mb-4 ml-1 md:ml-2 uppercase tracking-wider">
            {platform === 'Spotify' ? 'Settingan Spotify (Cuma MP3):' : 'Pilih Settingan Biar Mantap:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {availableOptions.map((opt) => {
              const isSelected = selectedOptions.includes(opt);
              return (
                <motion.button
                  layout
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  disabled={platform === 'Spotify' || status === 'loading'}
                  className={cn(
                    "px-3 md:px-4 py-3 border rounded-xl transition-all duration-300 flex flex-row items-center justify-start gap-3 backdrop-blur-md active:scale-95 will-change-transform cursor-pointer disabled:cursor-not-allowed group/opt",
                    isSelected 
                      ? `bg-white/10 border-transparent text-white shadow-inner ${theme.shadow}` 
                      : "bg-black/20 border-white/5 text-white/50 hover:bg-black/40 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                    isSelected ? `${theme.checkBg} border-transparent scale-110` : "border-white/20 group-hover/opt:border-white/40"
                  )}>
                    {isSelected && <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" strokeWidth={3} />}
                  </div>
                  <span className="text-xs sm:text-sm font-bold leading-tight text-left line-clamp-2 md:line-clamp-1 uppercase tracking-tighter">{opt}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="relative">
          {status === 'loading' && downloadProgress > 0 && (
            <div className="absolute -top-1 inset-x-0 h-1 bg-white/5 rounded-full overflow-hidden z-20">
              <motion.div 
                className={cn("h-full", theme.checkBg)}
                initial={{ width: 0 }}
                animate={{ width: `${downloadProgress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
            </div>
          )}
          
          <button
            onClick={handleDownload}
            disabled={!url || status === 'loading'}
            className={cn(
              "w-full rounded-xl md:rounded-2xl py-4 md:py-5 text-lg md:text-xl font-extrabold transition-all duration-300 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 md:gap-3 relative z-10 outline-none overflow-hidden cursor-pointer disabled:cursor-not-allowed",
              status === 'success' 
                ? "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 text-white" 
                : `${theme.button} shadow-xl ${theme.shadow} disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/10 disabled:shadow-none`
            )}
          >
            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                  <span className="font-mono text-sm uppercase tracking-widest">{loadingStep}</span>
                </motion.div>
              ) : status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  <span>MANTAP! CEK DOWNLOAD LU</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{platform === 'Spotify' ? 'Download Sekarang!' : 'Sedot Sekarang!'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
