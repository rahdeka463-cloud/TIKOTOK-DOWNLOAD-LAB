import { Platform } from './types';

export const ALL_PLATFORMS: Platform[] = [
  'TikTok', 'YouTube', 'Instagram', 'Facebook', 'Twitter', 'Spotify', 'Transcript'
];

export const GAUL_FAQS: Record<Platform, { q: string, a: string }[]> = {
  TikTok: [],
  YouTube: [],
  Instagram: [],
  Facebook: [],
  Twitter: [],
  Spotify: [],
  Transcript: [],
};

// Auto-generate 10 casual FAQs per platform to provide vast content without hitting prompt limits
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
