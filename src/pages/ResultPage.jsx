import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Home, Share2, Check, RefreshCcw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ResultPage() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.photos || !location.state.template) {
    return <Navigate to="/" replace />;
  }

  const { photos, template } = location.state;
  const [isGenerating, setIsGenerating] = useState(true);
  const [finalImage, setFinalImage] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Tema Klasik, Profesional, & Minimalis (Bebas dari efek "AI" yang berlebihan)
  const theme = {
    bg: isDark ? 'bg-[#09090b]' : 'bg-[#fafafa]',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    panelBg: isDark ? 'bg-[#121214] border-zinc-800' : 'bg-white border-zinc-200',
    btnPrimary: isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800',
    btnSecondary: isDark ? 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800 border-zinc-700' : 'bg-transparent text-zinc-700 hover:text-black hover:bg-zinc-100 border-zinc-300',
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (src && !src.startsWith('data:')) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Gagal memuat gambar utama."));
      img.src = src;
    });
  };

  // Proses Merender Gambar Resolusi Tinggi di Balik Layar
  useEffect(() => {
    const generateFinalStrip = async () => {
      try {
        const frameImg = await loadImage(template.image);
        
        const canvas = document.createElement('canvas');
        canvas.width = frameImg.width;
        canvas.height = frameImg.height;
        const ctx = canvas.getContext('2d');

        const scanCanvas = document.createElement('canvas');
        const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
        const w = 200;
        const h = Math.floor(200 * (frameImg.height / frameImg.width));
        scanCanvas.width = w;
        scanCanvas.height = h;
        scanCtx.drawImage(frameImg, 0, 0, w, h);
        
        const imgDataObj = scanCtx.getImageData(0, 0, w, h);
        const data = imgDataObj.data;
        const visited = new Uint8Array(w * h);
        const detectedHoles = [];
        
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const alpha = data[idx + 3];
            
            if (alpha < 80 && !visited[y * w + x]) {
              let minX = x, maxX = x, minY = y, maxY = y;
              const queue = [x, y];
              visited[y * w + x] = 1;
              let pixels = 0;
              
              let head = 0;
              while (head < queue.length) {
                const cx = queue[head++];
                const cy = queue[head++];
                pixels++;
                
                if (cx < minX) minX = cx;
                if (cx > maxX) maxX = cx;
                if (cy < minY) minY = cy;
                if (cy > maxY) maxY = cy;
                
                const neighbors = [cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1];
                for (let i = 0; i < neighbors.length; i += 2) {
                  const nx = neighbors[i], ny = neighbors[i + 1];
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    const nIdx = ny * w + nx;
                    if (!visited[nIdx]) {
                      if (data[nIdx * 4 + 3] < 80) { 
                        visited[nIdx] = 1;
                        queue.push(nx, ny);
                      }
                    }
                  }
                }
              }
              
              if (pixels > w * h * 0.005) {
                let hx = (minX / w) * 100, hy = (minY / h) * 100;
                let hw = ((maxX - minX + 1) / w) * 100, hh = ((maxY - minY + 1) / h) * 100;
                hx -= 0.5; hy -= 0.5; hw += 1.0; hh += 1.0;
                detectedHoles.push({ x: hx, y: hy, width: hw, height: hh, touchesBorder: (minX===0||maxX===w-1||minY===0||maxY===h-1) });
              }
            }
          }
        }
        
        detectedHoles.sort((a, b) => {
          if (a.touchesBorder !== b.touchesBorder) return a.touchesBorder ? 1 : -1;
          if (Math.abs(a.y - b.y) > 5) return a.y - b.y;
          return a.x - b.x;
        });
        
        const finalHoles = detectedHoles.slice(0, template.slotCount);

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < finalHoles.length; i++) {
          if (photos[i]) {
            const photoImg = await loadImage(photos[i]);
            const hole = finalHoles[i];
            
            const hx = (hole.x / 100) * canvas.width;
            const hy = (hole.y / 100) * canvas.height;
            const hw = (hole.width / 100) * canvas.width;
            const hh = (hole.height / 100) * canvas.height;

            ctx.save();
            ctx.beginPath();
            ctx.rect(hx, hy, hw, hh);
            ctx.clip(); 

            const imgRatio = photoImg.width / photoImg.height;
            const holeRatio = hw / hh;
            let drawW = hw, drawH = hh, drawX = hx, drawY = hy;

            if (imgRatio > holeRatio) {
              drawW = hh * imgRatio;
              drawX = hx + (hw - drawW) / 2;
            } else {
              drawH = hw / imgRatio;
              drawY = hy + (hh - drawH) / 2;
            }

            ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
            ctx.restore();
          }
        }

        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        setFinalImage(canvas.toDataURL('image/png', 1.0));
      } catch (err) {
        console.error(err);
        setErrorMsg("Terjadi kesalahan saat merender hasil gambar.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateFinalStrip();
  }, [photos, template]);

  const handleDownload = () => {
    if (!finalImage) return;
    
    const a = document.createElement('a');
    a.href = finalImage;
    a.download = `STUDIO-${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${theme.bg} ${theme.text} font-sans overflow-x-hidden relative selection:bg-[#E1E0CC] selection:text-black`}>
      
      {/* Background Noise Halus */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* Navbar Clean & Minimalist */}
      <nav className={`relative z-20 w-full px-6 md:px-12 py-5 flex items-center justify-between border-b ${theme.border} bg-transparent`}>
        <div className="flex items-center gap-3">
          <ImageIcon size={20} className={theme.textMuted} />
          <span className="font-semibold tracking-widest uppercase text-xs">Final Result</span>
        </div>
        <button onClick={() => navigate('/')} className={`flex items-center gap-2 text-sm font-medium transition-colors ${theme.textMuted} hover:${isDark ? 'text-white' : 'text-black'}`}>
          <Home size={18} /> Beranda
        </button>
      </nav>

      {/* Main Container - Proporsional dan Elegan */}
      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 p-6 sm:px-12 lg:px-24 w-full max-w-[1400px] mx-auto py-10 lg:py-0">
        
        {/* =======================================
            KIRI: TAMPILAN GAMBAR HASIL (Klasik & Presisi)
            ======================================= */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <AnimatePresence mode="wait">
            
            {/* State: Memproses */}
            {isGenerating && !errorMsg && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[60vh] lg:h-[75vh]"
              >
                <div className={`w-8 h-8 border-2 border-transparent border-t-current rounded-full animate-spin mb-5 ${theme.text}`} />
                <h3 className="text-lg font-medium tracking-tight">Merender Gambar...</h3>
                <p className={`text-sm mt-1.5 ${theme.textMuted}`}>Menyatukan frame dan piksel</p>
              </motion.div>
            )}

            {/* State: Error */}
            {!isGenerating && errorMsg && (
               <motion.div 
                 key="error"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="flex flex-col items-center justify-center h-[60vh] lg:h-[75vh]"
               >
                 <AlertCircle size={40} className="mb-4 text-rose-500" />
                 <h3 className="text-lg font-medium tracking-tight text-center">Gagal Memproses</h3>
                 <p className={`text-sm mt-2 text-center ${theme.textMuted}`}>{errorMsg}</p>
                 <button onClick={() => navigate('/templates')} className={`mt-6 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme.btnPrimary}`}>Kembali</button>
               </motion.div>
            )}

            {/* State: Berhasil (Render Foto) */}
            {!isGenerating && !errorMsg && finalImage && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                {/* 
                  Gambar ditampilkan murni layaknya kertas foto / artboard cetak 
                  - rounded-sm: sangat sedikit lengkungan (seperti potongan kertas)
                  - shadow-2xl: efek bayangan jatuh ke permukaan meja
                */}
                <div className={`relative shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-sm overflow-hidden border ${isDark ? 'border-zinc-800 bg-[#0a0a0a]' : 'border-zinc-300 bg-white'}`}>
                  <img 
                    src={finalImage} 
                    alt="Final Output" 
                    className="relative z-10 block max-w-full h-[65vh] lg:h-[80vh] w-auto pointer-events-none select-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =======================================
            KANAN: KONTROL DAN AKSI (Gaya Software Profesional)
            ======================================= */}
        <div className="w-full lg:w-1/2 max-w-[420px] flex flex-col justify-center">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Sesi Selesai.
            </h1>
            
            <p className={`text-base leading-relaxed mb-8 ${theme.textMuted}`}>
              Foto Anda telah berhasil dirender pada resolusi penuh. Gunakan panel di bawah untuk menyimpan atau membagikan hasil pindaian ini.
            </p>

            <div className={`p-6 rounded-xl border ${theme.panelBg} shadow-sm flex flex-col gap-4`}>
              
              <button 
                onClick={handleDownload}
                disabled={isGenerating || !finalImage}
                className={`w-full py-4 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50 ${
                  isDownloaded ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : theme.btnPrimary
                }`}
              >
                {isDownloaded ? (
                  <><Check size={18} /> Tersimpan ke Perangkat</>
                ) : (
                  <><Download size={18} /> Unduh Resolusi Penuh</>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/templates')}
                  className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border ${theme.btnSecondary}`}
                >
                  <RefreshCcw size={16} /> Buat Baru
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share && finalImage) {
                      fetch(finalImage)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], 'studio-result.png', { type: 'image/png' });
                          navigator.share({ title: 'Studio Result', files: [file] });
                        }).catch(() => alert("Berbagi tidak didukung di perangkat ini."));
                    } else {
                      alert("Gunakan perangkat Mobile/Tablet untuk menggunakan fitur bagikan langsung.");
                    }
                  }}
                  className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border ${theme.btnSecondary}`}
                >
                  <Share2 size={16} /> Bagikan
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}