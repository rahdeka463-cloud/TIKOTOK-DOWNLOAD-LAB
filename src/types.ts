export type Platform = 'TikTok' | 'YouTube' | 'Instagram' | 'Facebook' | 'Twitter' | 'Spotify' | 'Transcript';

export const ALL_PLATFORMS: Platform[] = [
  'TikTok', 'YouTube', 'Instagram', 'Facebook', 'Twitter', 'Spotify', 'Transcript'
];

export interface TabType {
  id: string;
  label: string;
}

export type DownloadOptions = 'Full HD(1080p)' | 'HD(720p)' | 'Audio(MP3)' | 'Tanpa Watermark';

export type ThemeConfig = {
  gradient: string;
  button: string;
  text: string;
  textGradient: string;
  border: string;
  shadow: string;
  ring: string;
  iconBg: string;
  checkBg: string;
};

export const platformThemes: Record<Platform, ThemeConfig> = {
  TikTok: {
    gradient: 'from-pink-600/15 via-transparent to-cyan-600/15',
    button: 'bg-rose-600 hover:bg-rose-500 text-white',
    text: 'text-rose-400',
    textGradient: 'from-rose-400 to-cyan-400',
    border: 'border-rose-500/30',
    shadow: 'shadow-rose-600/30',
    ring: 'focus:ring-rose-500',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    checkBg: 'bg-rose-500 border-rose-500 text-white'
  },
  YouTube: {
    gradient: 'from-red-600/15 via-transparent to-orange-900/10',
    button: 'bg-red-600 hover:bg-red-500 text-white',
    text: 'text-red-400',
    textGradient: 'from-red-400 to-orange-400',
    border: 'border-red-500/30',
    shadow: 'shadow-red-600/30',
    ring: 'focus:ring-red-500',
    iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
    checkBg: 'bg-red-500 border-red-500 text-white'
  },
  Instagram: {
    gradient: 'from-fuchsia-600/15 via-transparent to-orange-600/15',
    button: 'bg-gradient-to-r from-fuchsia-600 to-orange-500 hover:from-fuchsia-500 hover:to-orange-400 text-white',
    text: 'text-fuchsia-400',
    textGradient: 'from-fuchsia-400 to-orange-400',
    border: 'border-fuchsia-500/30',
    shadow: 'shadow-fuchsia-600/30',
    ring: 'focus:ring-fuchsia-500',
    iconBg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    checkBg: 'bg-gradient-to-br from-fuchsia-500 to-orange-500 border-transparent text-white'
  },
  Facebook: {
    gradient: 'from-blue-600/15 via-transparent to-indigo-900/10',
    button: 'bg-blue-600 hover:bg-blue-500 text-white',
    text: 'text-blue-400',
    textGradient: 'from-blue-400 to-indigo-400',
    border: 'border-blue-500/30',
    shadow: 'shadow-blue-600/30',
    ring: 'focus:ring-blue-500',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    checkBg: 'bg-blue-600 border-blue-600 text-white'
  },
  Twitter: {
    gradient: 'from-sky-600/15 via-transparent to-slate-900/10',
    button: 'bg-sky-500 hover:bg-sky-400 text-white',
    text: 'text-sky-400',
    textGradient: 'from-sky-400 to-blue-400',
    border: 'border-sky-500/30',
    shadow: 'shadow-sky-500/30',
    ring: 'focus:ring-sky-500',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    checkBg: 'bg-sky-500 border-sky-500 text-white'
  },
  Spotify: {
    gradient: 'from-emerald-600/15 via-transparent to-green-900/10',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    text: 'text-emerald-400',
    textGradient: 'from-emerald-400 to-green-400',
    border: 'border-emerald-500/30',
    shadow: 'shadow-emerald-600/30',
    ring: 'focus:ring-emerald-500',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    checkBg: 'bg-emerald-500 border-emerald-500 text-white'
  },
  Transcript: {
    gradient: 'from-yellow-600/15 via-transparent to-orange-900/10',
    button: 'bg-yellow-600 hover:bg-yellow-500 text-white',
    text: 'text-yellow-400',
    textGradient: 'from-yellow-400 to-orange-400',
    border: 'border-yellow-500/30',
    shadow: 'shadow-yellow-600/30',
    ring: 'focus:ring-yellow-500',
    iconBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    checkBg: 'bg-yellow-500 border-yellow-500 text-white'
  }
};
