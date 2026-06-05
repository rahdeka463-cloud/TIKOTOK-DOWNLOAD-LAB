import { useState } from 'react';
import { Platform, ALL_PLATFORMS, platformThemes } from './types';
import { BrandIcon } from './components/BrandIcons';
import { cn } from './lib/utils';
import { AnimatePresence } from 'motion/react';

import MainDownloader from './components/MainDownloader';
import Transcript from './components/Transcript';
import Tutorials from './components/Tutorials';
import FAQs from './components/FAQs';
import Feedback from './components/Feedback';

export default function App() {
  const [activePlatform, setActivePlatform] = useState<Platform>('TikTok');
  const theme = platformThemes[activePlatform];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-x-hidden">
      {/* Pre-rendered Platform Background Glows with Hardware Accelerated Opacity Transitions */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b to-transparent pointer-events-none transition-all duration-700 ease-out opacity-30 will-change-transform",
          theme.gradient
        )}
      />
      
      {/* Header Info */}
      <header className="w-full max-w-6xl mx-auto pt-16 pb-8 md:pt-20 md:pb-10 px-4 text-center relative z-10">
        <h1 className={cn(
          "text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r tracking-tight mb-4 md:mb-6 drop-shadow-sm font-['Space_Grotesk'] transition-colors duration-700 leading-tight py-1",
          theme.textGradient
        )}>
          TIKOTOK DOWNLOAD LAB
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/80 max-w-3xl mx-auto leading-relaxed">
          Download video dan audio dari platform favorit lu. <span className="font-bold text-white block sm:inline mt-1 sm:mt-0">GRATIS CUY!🚀</span>
        </p>
      </header>

      {/* Social Media Selector / Main Menu */}
      <div className="w-full max-w-2xl mx-auto px-4 mb-16 md:mb-20 relative z-20">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Row 1: TikTok, Youtube, Instagram */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {(['TikTok', 'YouTube', 'Instagram'] as Platform[]).map(p => {
              const isActive = activePlatform === p;
              const pTheme = platformThemes[p];
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={cn(
                    "px-2 py-3.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer outline-none select-none text-center transform active:scale-95 will-change-transform",
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

          {/* Row 2: Facebook, Twitter, Spotify */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {(['Facebook', 'Twitter', 'Spotify'] as Platform[]).map(p => {
              const isActive = activePlatform === p;
              const pTheme = platformThemes[p];
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatform(p)}
                  className={cn(
                    "px-2 py-3.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 text-xs sm:text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer outline-none select-none text-center transform active:scale-95 will-change-transform",
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

          {/* Row 3: Transcript */}
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
                <span>Format Khusus: Ekstrak Teks ({p}) 🎙️</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* Content Area - Stacked Vertically */}
      <main className="flex-1 relative z-10 w-full mb-24 space-y-20 md:space-y-28">
        <section id="downloader">
          {activePlatform === 'Transcript' ? (
            <Transcript theme={theme} />
          ) : (
            <MainDownloader platform={activePlatform} theme={theme} />
          )}
        </section>
        
        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>
        
        <section id="tutorials">
          <Tutorials platform={activePlatform} theme={theme} />
        </section>

        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>

        <section id="faq">
          <FAQs platform={activePlatform} theme={theme} />
        </section>

        <div className="max-w-4xl mx-auto w-full border-t border-white/[0.05]"></div>

        <section id="feedback">
          <Feedback theme={theme} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.05] bg-black/40 backdrop-blur-lg py-12 px-6 relative z-10 text-center mt-auto">
          <div className="max-w-4xl mx-auto text-white/40 text-sm leading-relaxed space-y-4">
            <p className="font-bold text-white/60 tracking-wider">© 2026 TIKOTOK DOWNLOAD LAB.</p>
            <p>
              Alat ini hanya digunakan untuk penggunaan pribadi dan edukasi. Developer tidak bertanggung jawab atas penyalahgunaan apapun. Harap hormati hak cipta dan kebijakan masing-masing platform.
            </p>
          </div>
      </footer>
    </div>
  );
}
