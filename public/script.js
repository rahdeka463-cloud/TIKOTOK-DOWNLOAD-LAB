// Minta izin notifikasi browser pas web dibuka
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function changePlatform(platform) {
    // Sembunyiin semua section, buang class active dari tab
    document.querySelectorAll('.platform-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Aktifin yang diklik
    const activeSection = document.getElementById(`${platform}-section`);
    if(activeSection) activeSection.classList.add('active');
    event.currentTarget.classList.add('active');

    // Ganti Tema Warna (Body Class)
    document.body.className = `theme-${platform}`;
}

// Fungsi tombol PASTE 📋
async function pasteURL(inputId) {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById(inputId).value = text;
    } catch (err) {
        alert('Browser lu gak ngasih izin auto-paste bre. Ctrl+V aja yak!');
    }
}

// Simulasi Download Video
function startDownload(platformId, platformName) {
    const urlInput = document.getElementById(`url-${platformId}`).value;
    if(!urlInput) {
        alert('Isi dulu linknya bre!');
        return;
    }

    const loader = document.getElementById(`loader-${platformId}`);
    loader.classList.remove('hidden');

    // MENGHUBUNGI BACKEND (Simulasi)
    // Di real app, disini lu pakai fetch('/api/download', {...})
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Notifikasi Browser
        if (Notification.permission === "granted") {
            new Notification(`Mantap! 🚀`, {
                body: `Sukses mengambil video ${platformName}! Cek folder download lu.`,
                icon: 'https://cdn-icons-png.flaticon.com/512/8242/8242194.png' // Icon random buat notif
            });
        } else {
            alert(`Sukses mengambil video ${platformName}!\n(Nyalain notif browser biar makin asik bre)`);
        }
    }, 3500); // Simulasi nunggu 3.5 detik biar animasi muter-muternya keliatan
}

// Fitur Transcript Audio 🎤
function startTranscript() {
    const urlInput = document.getElementById('url-transcript').value;
    if(!urlInput) { alert('Link podcast atau videonya mana bre?'); return; }

    const loader = document.getElementById('loader-transcript');
    const resultArea = document.getElementById('result-transcript');
    
    loader.classList.remove('hidden');
    resultArea.classList.add('hidden');

    setTimeout(() => {
        loader.classList.add('hidden');
        resultArea.classList.remove('hidden');
        
        // Output hasil transkrip
        document.getElementById('transcript-text').value = 
            "[00:00] Halo semuanya, selamat datang di podcast ini!\n[00:05] Hari ini kita bakal bahas soal teknologi downloader yang lagi viral.\n[00:10] (Teks ini di-generate dari backend AI lo nantinya...)";
            
    }, 4000);
}

function copyTranscript() {
    const text = document.getElementById('transcript-text');
    text.select();
    document.execCommand('copy');
    alert('Teks berhasil disalin, bre! Tinggal copas aja.');
}

let isPlaying = false;
function toggleAudio() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('play-pause-btn');
    btn.innerText = isPlaying ? '⏸️ Pause Audio' : '▶️ Play Audio Asli';
    // Logic mainin audio dimasukin disini ntar
}
