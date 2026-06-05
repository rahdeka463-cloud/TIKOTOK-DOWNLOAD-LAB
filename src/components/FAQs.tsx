import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Platform, ALL_PLATFORMS } from '../types';
import { cn } from '../lib/utils';
import { ThemeConfig } from '../types';

const GAUL_FAQS: Record<Platform, { q: string, a: string }[]> = {
  TikTok: [],
  YouTube: [],
  Instagram: [],
  Facebook: [],
  Twitter: [],
  Spotify: [],
  Transcript: [],
};

// Auto-generate 10 casual FAQs per platform
ALL_PLATFORMS.forEach((platform) => {
  GAUL_FAQS[platform] = [
    {
      q: `Apakah download ${platform} di mari itu bayar cuy?`,
      a: `Gratis total 100%, bre! Gak pake embel-embel langganan atau hidden fee yang bikin boncos.`
    },
    {
      q: `Perlu login akun ${platform} dulu gak sih?`,
      a: `Kagak usah! Lu gak usah login atau ngasih password sama sekali, aman jaya tanpa lacak-lacak akun lu.`
    },
    {
      q: `Di HP sama di PC bisa semua kan?`,
      a: `Bisa banget dong! Web kita responsif parah, mau lu buka dari HP kentang atau PC sultan tetap ngacir.`
    },
    {
      q: `Kualitas video/audio ${platform}-nya gimana, burik gak?`,
      a: `Ya tergantung settingan lu! Kita sediain opsi Full HD (1080p), HD (720p) atau MP3. By default bakal narik yang paling mulus.`
    },
    {
      q: `Beneran aman dari kena hack atau virus aneh-aneh?`,
      a: `Super aman! Ga ada tuh iklan popup jebakan betmen apalagi malware. Download di mari bersih sebersih air pegunungan.`
    },
    {
      q: `Gimana kalau akun ${platform}-nya di-private?`,
      a: `Wah, kalau ini jujur aja belum bisa, cuy. Cuma narik konten yang public aja buat hargain privasi yang punya.`
    },
    {
      q: `Prosesnya lama gak sih buat nyedot file-nya?`,
      a: `Sumpah cepet banget! Selama koneksi internet lu kenceng, sistem kita bakal memfasilitasi sedotan super ngebut tanpa antri.`
    },
    {
      q: `Kok pas dipencet malah gagal download, kenapa tuh?`,
      a: `Coba cek lagi URL ${platform}-nya bener apa kagak formatnya. Atau kadang ada server nge-down bentar. Refresh aja, gas lagi.`
    },
    {
      q: `Kena limit gak kalau gue download banyak sekaligus?`,
      a: `Kaga ada limit, bre! Sikat aja semampu kuota lu. Mau lu borong video sekampung juga bebas aja.`
    },
    {
      q: `Kenapa sih gue kudu milih TikoTok Download Lab buat urusan ${platform}?`,
      a: `Soalnya ini yang paling asik, no ribet, minim iklan, dan pokoknya LANCAR JAYA! Gak pake pusing muter muter nyari tombol aslinya.`
    }
  ];
});

export default function FAQ({ platform, theme }: { platform: Platform, theme: ThemeConfig }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4 md:mt-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-4">
          Sering Ditanyain ({platform}) 🤔
        </h2>
        <p className="text-white/60 text-sm md:text-lg">
          Ada yang bingung mau download dari {platform}? Nih pantengin dulu biar pro.
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {GAUL_FAQS[platform].map((faq, idx) => (
          <FAQItem key={idx} question={faq.q} answer={faq.a} index={idx + 1} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer, index, theme }: { question: string, answer: string, index: number, theme: ThemeConfig, key?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md",
      isOpen ? `bg-white/10 border-white/20 ${theme.shadow}` : "hover:bg-white/10"
    )}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 md:p-6 flex items-center justify-between gap-3 md:gap-4 focus:outline-none"
      >
        <div className="flex items-center gap-3 md:gap-5">
          <span className={cn("font-black text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl border flex-shrink-0 transition-all duration-300", theme.iconBg)}>
            {index < 10 ? `0${index}` : index}
          </span>
          <span className="text-white/90 font-semibold text-sm md:text-lg leading-snug pr-2">{question}</span>
        </div>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
           className="text-white/40 shrink-0"
        >
          <ChevronDown size={20} className="md:w-6 md:h-6" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 md:pt-0 text-white/70 text-xs md:text-base leading-relaxed pl-[4rem] md:pl-[5.5rem]">
              <span className="inline-block relative">
                <span className="absolute -left-5 md:-left-6 top-1 md:top-1 text-white/20">↳</span>
                {answer}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
