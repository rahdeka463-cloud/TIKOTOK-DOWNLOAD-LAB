import { Zap, ShieldCheck, Download, CodeXml } from 'lucide-react';
import { Platform } from '../types';
import { ThemeConfig } from '../types';
import { cn } from '../lib/utils';

export default function Tutorials({ platform, theme }: { platform: Platform, theme: ThemeConfig }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4 md:mt-8">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-4">
          Cara Pakai Buat {platform} 📖
        </h2>
        <p className="text-white/60 text-sm md:text-lg">
          Kaga ngerti cara pakenya? Santai, ikutin flow ini aja.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative">
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] blur-3xl rounded-[100%] opacity-10 pointer-events-none transition-colors duration-1000", theme.checkBg)} />

        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md relative z-10 group shadow-lg">
          <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border transition-all duration-300 group-hover:scale-110", theme.iconBg)}>
            <Zap size={24} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white/90 mb-2 md:mb-3">1. Salin Link {platform}</h3>
          <p className="text-white/60 leading-relaxed text-xs md:text-sm">
            Buka aplikasi web {platform}, cari konten yang lu demen, pencet logo Share ➔ Copy Link.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md relative z-10 group shadow-lg">
          <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border transition-all duration-300 group-hover:scale-110", theme.iconBg)}>
             <CodeXml size={24} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white/90 mb-2 md:mb-3">2. Paste Di Kotak Ajaib</h3>
          <p className="text-white/60 leading-relaxed text-xs md:text-sm">
            Balik ke lab ini, pencet tombol "Paste" segede gaban di atas. Santai, kaga bakal nyasar.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md relative z-10 group shadow-lg">
          <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border transition-all duration-300 group-hover:scale-110", theme.iconBg)}>
            <ShieldCheck size={24} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white/90 mb-2 md:mb-3">3. Atur Kualitas & Setting</h3>
          <p className="text-white/60 leading-relaxed text-xs md:text-sm">
            Mau nyedot MP3 doang? Atau HD tanpa watermark? Tinggal ceklis aja opsi yang lu butuhin.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md relative z-10 group shadow-lg">
           <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 border transition-all duration-300 group-hover:scale-110", theme.iconBg)}>
            <Download size={24} className="md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white/90 mb-2 md:mb-3">4. Hit Tombol Sedot!</h3>
          <p className="text-white/60 leading-relaxed text-xs md:text-sm">
            Klik tombol mantap di bawah settingan, tunggu sesaat... dan bum! File lu kelar diunduh.
          </p>
        </div>
      </div>
    </div>
  );
}
