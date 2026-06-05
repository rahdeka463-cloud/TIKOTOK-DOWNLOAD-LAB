import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeConfig } from '../lib/theme';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Feedback({ theme }: { theme: ThemeConfig }) {
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = () => {
    if (!message.trim()) {
      setToast('Tulis pesan lu dulu dong bre! 📝');
      return;
    }
    setToast('Mantul! Pesan lu udah direkam sama bot kita. Makasih supportnya bre! 🚀');
    setMessage('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-4 md:mt-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-4">
          Ngaruh Feedback 📝
        </h2>
        <p className="text-white/60 text-sm md:text-lg">
          Ada bug? Fitur baru yang dipengenin? Atau sekadar mo bilang makasih? Tulis aja dimari!
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle glow orb */}
        <div className={cn("absolute -bottom-32 -left-32 w-64 h-64 blur-3xl rounded-full opacity-30 pointer-events-none transition-colors duration-1000", theme.checkBg)} />

        <label className="block text-white/90 font-semibold mb-2 md:mb-3 ml-1 md:ml-2 relative z-10 text-sm md:text-base">Pesan Lu:</label>
        <textarea 
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Eh bre, tambahin fitur convert ke GIF dong!"
          className={cn(
            "w-full bg-black/40 border border-white/10 text-white rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 focus:outline-none focus:ring-2 font-sans transition-all mb-6 md:mb-8 resize-none placeholder:text-white/30 backdrop-blur-sm relative z-10 text-sm md:text-base",
            theme.ring
          )}
        ></textarea>
        
        <button
          onClick={handleSubmit}
          className={cn(
            "w-full rounded-xl md:rounded-2xl py-3 md:py-4 text-base md:text-lg font-bold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 md:gap-3 relative z-10 shadow-xl outline-none",
            theme.button,
            theme.shadow
          )}
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
          Kirim Feedback
        </button>
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
            {toast.includes('Makasih') ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
            )}
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
