import { useState, useMemo } from 'react';
import { ALL_PLATFORMS } from './data';
import { Platform } from './types';
import { platformThemes } from './lib/theme';
import { BrandIcon } from './components/BrandIcons';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'motion/react';

import MainDownloader from './components/MainDownloader';
import Transcript from './components/Transcript';
import Tutorials from './components/Tutorials';
import FAQs from './components/FAQs';
import Feedback from './components/Feedback';

export default function App() {
  const [activePlatform, setActivePlatform] = useState<Platform>('TikTok');
  const theme = useMemo(() => platformThemes[activePlatform], [activePlatform]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-x-hidden">
      {/* Pre-rendered Platform Background Glows with Hardware Accelerated Transitions */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 h-[700px] bg-gradient-to-b to-transparent pointer-events-none z-0 transition-all duration-1000 ease-in-out platform-glow",
          theme.gradient
        )}
        style={{ opacity: 0.35 }}
      />
      
      {/* Header Info */}
      <header className="w-full max-w-6xl mx-auto pt-16 pb-8 md:pt-20 md:pb-10 px-4 text-center relative z-10">
        <motion.h1 
          layout
          className={cn(
            "text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r tracking-tight mb-4 md:mb-6 drop-shadow-sm font-['Space_Grotesk'] leading-tight py-1",
            theme.textGradient
          )}
        >
          TIKOTOK DOWNLOAD LAB
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white/80 max-w-3xl mx-auto leading-relaxed"
        >
          Download video dan audio dari platform favorit lu. <span className="font-bold text-white block sm:inline mt-1 sm:mt-0">GRATIS CUY!🚀</span>
        </motion.p>
      </header>

      {/* Social Media Selector / Main Menu */}
      <div className="w-full max-w-2xl mx-auto px-4 mb-16 md:mb-20 relative z-20">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {(['TikTok', 'YouTube', 'Instagram'] as Platform[]).map(p => {
              const isActive = activePlatform === p;
              const pTheme = platformThemes[p];
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={cn(
                    "relative px-2 py-3.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer outline-none select-none text-center transform active:scale-95 will-change-transform",
                    isActive 
                      ? `text-white shadow-2xl scale-102 md:scale-105 ${pTheme.button} ${pTheme.shadow}`
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5 hover:scale-102 backdrop-blur-sm"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-xl md:rounded-2xl z-[-1] opacity-50"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <BrandIcon platform={p} className="w-5 h-5 shrink-0" />
                  <span>{p}</span>
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {(['Facebook', 'Twitter', 'Spotify'] as Platform[]).map(p => {
              const isActive = activePlatform === p;
              const pTheme = platformThemes[p];
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={cn(
                    "relative px-2 py-3.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer outline-none select-none text-center transform active:scale-95 will-change-transform",
                    isActive 
                      ? `text-white shadow-2xl scale-102 md:scale-105 ${pTheme.button} ${pTheme.shadow}`
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5 hover:scale-102 backdrop-blur-sm"
                  )}
                >
                  <BrandIcon platform={p} className="w-5 h-5 shrink-0" />
                  <span>{p}</span>
                </button>
              )
            })}
          </div>

          {(() => {
            const p: Platform = 'Transcript';
            const isActive = activePlatform === p;
            const pTheme = platformThemes[p];
            return (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={cn(
                  "w-full px-4 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 md:gap-3 cursor-pointer outline-none select-none transform active:scale-[0.99] will-change-transform",
                  isActive 
                    ? `text-white shadow-2xl scale-101 md:scale-103 ${pTheme.button} ${pTheme.shadow}`
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5 hover:scale-101 backdrop-blur-sm"
                )}
              >
                <BrandIcon platform={p} className="w-5 h-5 shrink-0" />
                <span>Format Khusus: Ekstrak Teks & Lirik 🎙️</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* Content Area - Stacked Vertically */}
      <main className="flex-1 relative z-10 w-full mb-24 space-y-20 md:space-y-28">
        <AnimatePresence mode="wait">
          <motion.section 
            key={activePlatform}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            id="downloader"
            className="will-change-transform"
          >
            {activePlatform === 'Transcript' ? (
              <Transcript theme={theme} />
            ) : (
              <MainDownloader platform={activePlatform} theme={theme} />
            )}
          </motion.section>
        </AnimatePresence>
        
        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>
        
        <Tutorials platform={activePlatform} theme={theme} />
        
        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>

        <FAQs platform={activePlatform} theme={theme} />

        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>

        <Feedback theme={theme} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.05] bg-black/40 backdrop-blur-lg py-12 px-6 relative z-10 text-center mt-auto">
          <div className="max-w-4xl mx-auto text-white/40 text-sm leading-relaxed space-y-4">
            <p className="font-bold text-white/60 tracking-wider text-xs md:text-sm">© 2026 TIKOTOK DOWNLOAD LAB.</p>
            <p className="max-w-2xl mx-auto">
              Alat ini hanya digunakan untuk penggunaan pribadi dan edukasi. Harap hormati hak cipta dan kebijakan masing-masing platform.
            </p>
          </div>
      </footer>
    </div>
  );
}
