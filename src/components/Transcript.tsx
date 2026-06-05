import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Copy, Play, Pause, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ThemeConfig } from '../lib/theme';
import { cn } from '../lib/utils';

export default function Transcript({ theme }: { theme: ThemeConfig }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const doProcess = useCallback(async (targetUrl: string) => {
    const trimmedUrl = targetUrl.trim();
    if (!trimmedUrl) return;

    const lowerUrl = trimmedUrl.toLowerCase();
    if (!lowerUrl.includes('youtube.com') && !lowerUrl.includes('youtu.be')) {
      setToast({ message: 'Sori bre, menu ini khusus untuk transkrip video YouTube aja ya! 🙏', type: 'error' });
      return;
    }

    setStatus('loading');
    setLoadingStep('Menganalisis video...');
    setTranscriptText('');
    setAudioUrl('');
    setIsPlaying(false);

    try {
      setLoadingStep('Lagi narik data dan diproses AI... (Sabar ya bre, agak lama)');
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal proses cuy');
      
      setLoadingStep('Boom! Transkrip selesai.');
      setTranscriptText(data.transcript);
      if (data.audioUrl) {
         setAudioUrl(data.audioUrl);
      }
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  const handleProcess = () => doProcess(url);

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text) {
       setUrl(text);
       doProcess(text);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText);
      setToast({ message: 'Mantul! Teks berhasil disalin. 🚀', type: 'success' });
    } catch(e) {
      setToast({ message: 'Gagal salin otomatis, silakan salin teks manual ya bre!', type: 'error' });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
       try {
         if (isPlaying) {
           audioRef.current.pause();
         } else {
           audioRef.current.play();
         }
         setIsPlaying(!isPlaying);
       } catch(err) {
         setToast({ message: 'Gagal memutar audio: Media tidak didukung atau diblokir browser.', type: 'error' });
       }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4 md:mt-8">
      <div className="text-center mb-8 md:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4 tracking-tight font-['Space_Grotesk']"
        >
          YouTube Video To Text Transcript 🎙️
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-medium"
        >
          Ubah video YouTube otomatis jadi teks asli dalam sekian detik!
        </motion.p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-500 hover:bg-white/[0.08]">
        <div className="mb-6 md:mb-8 relative z-10">
          <label className="block text-white/90 font-semibold mb-2 md:mb-3 ml-1 md:ml-2 text-sm md:text-base">Paste link video YouTube kesini👇</label>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={handlePasteEvent}
              placeholder="https://youtube.com/watch?v=..."
              className={cn(
                "flex-1 bg-black/40 border border-white/10 text-white rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 font-mono text-sm md:text-base transition-all placeholder:text-white/30 backdrop-blur-md",
                 theme.ring
              )}
            />
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setUrl(text);
                  doProcess(text);
                } catch(e) {
                  setToast({ message: "Gagal nempel otomatis, silakan paste manual (Ctrl+V) ya bre!", type: 'error' });
                }
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center shrink-0 w-full sm:w-auto text-sm md:text-base cursor-pointer"
            >
              Paste & Proses
            </button>
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={!url || status === 'loading'}
          className={cn(
            "w-full rounded-xl md:rounded-2xl py-4 md:py-5 text-lg md:text-xl font-black transition-all duration-300 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 md:gap-3 relative z-10 outline-none cursor-pointer disabled:cursor-not-allowed",
            `${theme.button} shadow-xl ${theme.shadow} disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/10 disabled:shadow-none`
          )}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                <span className="font-mono text-xs md:text-sm uppercase tracking-tighter">{loadingStep}</span>
              </motion.div>
            ) : (
              <motion.span 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Gas Proses AI!
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 bg-red-900/30 border border-red-800/50 text-red-400 p-4 rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm text-sm md:text-base text-center">
                <AlertCircle size={20} className="shrink-0" />
                <p>Yah, ada yang salah pas ngambil transcript. Coba lagi bre!</p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 md:mt-12"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/40 rounded-t-2xl md:rounded-t-3xl px-5 py-4 md:px-6 md:py-6 border-t border-x border-white/10 gap-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                   <button
                    onClick={togglePlay}
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 pl-1 shrink-0 cursor-pointer",
                      theme.button
                    )}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 -ml-1 text-white" /> : <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                  </button>
                  <div>
                    <h4 className="text-white font-bold text-sm md:text-lg">Full Audio Transcript</h4>
                    <p className="text-white/40 text-xs md:text-sm font-medium">Bisa lu dengerin lho bre</p>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white rounded-xl px-5 py-3 md:px-6 md:py-4 flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95 border border-white/5 text-sm md:text-base cursor-pointer"
                >
                  <Copy size={18} />
                  Salin Transcript
                </button>
              </div>
              
              <div className="bg-black/20 p-6 md:p-10 rounded-b-2xl md:rounded-b-3xl border border-white/10 text-white/90 leading-relaxed font-sans whitespace-pre-wrap text-sm md:text-lg tracking-tight selection:bg-white/20">
                {transcriptText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-slate-900/90 border border-white/10 px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-xl text-sm md:text-base font-bold">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
