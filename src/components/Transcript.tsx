import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Copy, Play, Pause, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ThemeConfig } from '../lib/theme';
import { cn } from '../lib/utils';

export default function Transcript({ theme }: { theme: ThemeConfig }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [transcriptText, setTranscriptText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [dots, setDots] = useState('');
  useEffect(() => {
    if (status !== 'loading') return;
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 5 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const doProcess = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    const lowerUrl = targetUrl.toLowerCase();
    if (!lowerUrl.includes('youtube.com') && !lowerUrl.includes('youtu.be')) {
      setToast({ message: 'Sori bre, menu ini khusus untuk transkrip video YouTube aja ya! 🙏', type: 'error' });
      return;
    }

    setStatus('loading');
    setTranscriptText('');
    setAudioUrl('');
    setIsPlaying(false);

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal proses cuy');
      
      setTranscriptText(data.transcript);
      if (data.audioUrl) {
         setAudioUrl(data.audioUrl);
      }
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

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
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-3">
          YouTube Video To Text Transcript 🎙️
        </h2>
        <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto">
          Ubah video YouTube otomatis jadi teks asli dalam sekian detik!
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors duration-500 hover:bg-white/10">
        <div className="mb-6 md:mb-8">
          <label className="block text-white/90 font-semibold mb-2 md:mb-3 ml-1 md:ml-2 text-sm md:text-base">Paste disini, bre!👇</label>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={handlePasteEvent}
              placeholder="https://youtube.com/watch?v=..."
              className={cn(
                "flex-1 bg-black/40 border border-white/10 text-white rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 font-mono text-sm md:text-base transition-colors placeholder:text-white/30 backdrop-blur-md",
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
              className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center shrink-0 w-full sm:w-auto text-sm md:text-base"
            >
              Paste
            </button>
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={!url || status === 'loading'}
          className={cn(
            "w-full rounded-xl md:rounded-2xl py-4 md:py-5 text-lg md:text-xl font-bold transition-all duration-300 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 md:gap-3 relative z-10 outline-none",
            `${theme.button} shadow-xl ${theme.shadow} disabled:bg-white/5 disabled:text-white/30 disabled:border disabled:border-white/10 disabled:shadow-none`
          )}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              Lagi Proses Transcript{dots}
            </>
          ) : (
            'Gas Proses!'
          )}
        </button>

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-red-900/30 border border-red-800/50 text-red-400 p-4 rounded-xl flex items-center justify-center gap-2 backdrop-blur-sm text-sm md:text-base text-center"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p>Yah, ada yang salah pas ngambil transcript. Coba lagi bre!</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 md:mt-10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/40 rounded-t-2xl md:rounded-t-3xl px-5 py-4 md:px-6 md:py-5 border-t border-x border-white/10 gap-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                   <button
                    onClick={togglePlay}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 pl-1 shrink-0",
                      theme.button
                    )}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 -ml-1 text-white" /> : <Play className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                  </button>
                  <div>
                    <h4 className="text-white/90 font-semibold text-sm md:text-base">Audio Asli</h4>
                    <p className="text-white/50 text-xs md:text-sm">Mainkan sambil baca textnya</p>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl || "https://www.w3schools.com/html/horse.mp3"}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-3 md:px-5 md:py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-300 active:scale-95 border border-white/5 text-sm md:text-base"
                >
                  <Copy size={16} />
                  Ambil Teks!
                </button>
              </div>
              
              <div className="bg-black/20 p-5 md:p-8 rounded-b-2xl md:rounded-b-3xl border border-white/10 text-white/80 leading-relaxed font-sans whitespace-pre-wrap text-sm md:text-base">
                {transcriptText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-white/10 px-6 py-4 rounded-2xl shadow-2xl text-white backdrop-blur-md text-sm md:text-base font-semibold pointer-events-none"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
