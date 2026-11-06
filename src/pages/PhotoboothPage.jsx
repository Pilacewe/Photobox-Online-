import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Image as ImageIcon, Timer, Settings2, RefreshCcw, ArrowRight, RotateCcw, Sparkles, Focus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import defaultFrameImg from '../assets/frame-vibes.png';

const STUDIO_FILTERS = [
  { name: 'Normal', css: 'none' },
  { name: 'B&W', css: 'grayscale(100%)' },
  { name: 'Retro', css: 'sepia(80%) contrast(120%)' },
  { name: 'Cool', css: 'hue-rotate(180deg) saturate(150%) brightness(110%)' },
  { name: 'Warm', css: 'sepia(40%) saturate(150%) brightness(105%) contrast(110%)' },
];

const TIMER_OPTIONS = [3, 5, 10];

export default function PhotoboothPage() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const template = location.state?.selectedTemplate || {
    name: "Custom Frame",
    image: defaultFrameImg,
    slotCount: 3
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const [photos, setPhotos] = useState([]); 
  const [currentShot, setCurrentShot] = useState(0); 
  
  const [holes, setHoles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const [activeTimer, setActiveTimer] = useState(3);
  const [activeFilter, setActiveFilter] = useState(STUDIO_FILTERS[0]);
  const [countdown, setCountdown] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Tema Premium & Elegan
  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#f4f4f5]',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    border: isDark ? 'border-white/10' : 'border-zinc-200/80',
    panelBg: isDark ? 'bg-[#121212]/80 border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'bg-white/80 border-zinc-200/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)]',
    btnPrimary: isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]',
    btnToggleBg: isDark ? 'bg-black/50 border border-white/5' : 'bg-zinc-100/80 border border-zinc-200/50',
    btnActive: isDark ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'bg-white text-zinc-900 shadow-md border border-zinc-200',
    btnInactive: isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900',
    btnDanger: isDark ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
  };

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false 
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      alert("Tolong izinkan akses kamera di browser Anda.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [startCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!template?.image) {
      setIsAnalyzing(false);
      return;
    }
    
    const img = new Image();
    img.src = template.image;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
           setIsAnalyzing(false);
           return;
        }

        const w = 200;
        const h = Math.floor(200 * (img.height / img.width));
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const visited = new Uint8Array(w * h);
        const detectedHoles = [];
        
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const alpha = data[idx + 3];
            
            if (alpha < 80 && !visited[y * w + x]) {
              let minX = x, maxX = x, minY = y, maxY = y;
              let touchesBorder = false;
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
                
                if (cx === 0 || cx === w - 1 || cy === 0 || cy === h - 1) touchesBorder = true;
                
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
                detectedHoles.push({ x: hx, y: hy, width: hw, height: hh, touchesBorder, pixels });
              }
            }
          }
        }
        
        detectedHoles.sort((a, b) => {
          if (a.touchesBorder !== b.touchesBorder) return a.touchesBorder ? 1 : -1;
          if (Math.abs(a.y - b.y) > 5) return a.y - b.y;
          return a.x - b.x;
        });
        
        const count = template.slotCount || detectedHoles.length;
        setHoles(detectedHoles.slice(0, count));
      } catch (err) {
        console.error("Error analyzing frame:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    img.onerror = () => setIsAnalyzing(false);
  }, [template]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = activeFilter.css;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setPhotos(prev => [...prev, dataUrl]);
    setCurrentShot(prev => prev + 1);
  };

  const triggerShutter = () => {
    if (currentShot >= template.slotCount || countdown !== null) return;
    setCountdown(activeTimer);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      takePhoto();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRetakeLast = () => {
    if (currentShot > 0) {
      setPhotos(prev => prev.slice(0, -1));
      setCurrentShot(prev => prev - 1);
    }
  };

  const handleFinish = () => navigate('/result', { state: { photos, template } });
  const handleRetakeAll = () => { setPhotos([]); setCurrentShot(0); };
  const stopStream = () => { if (stream) stream.getTracks().forEach(track => track.stop()); };

  return (
    <div className={`min-h-screen w-full flex flex-col ${theme.bg} ${theme.text} font-sans selection:bg-[#E1E0CC] selection:text-black transition-colors duration-700 overflow-x-hidden`}>
      
      {/* Background Noise & Glow Effects */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full z-0" />
      <canvas ref={canvasRef} className="hidden" />

      {/* ───────────────── TOP NAVBAR ───────────────── */}
      <nav className={`relative z-20 w-full px-6 md:px-12 py-5 flex items-center justify-between border-b ${theme.border} bg-transparent flex-shrink-0`}>
        <button 
          onClick={() => { stopStream(); navigate('/templates'); }} 
          className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${theme.textMuted} hover:text-rose-500 hover:-translate-x-1`}
        >
          <X size={20} /> Batalkan Sesi
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-[10px] sm:text-xs">Live Studio</span>
        </div>
      </nav>

      {/* ───────────────── MAIN STUDIO AREA (PERBAIKAN TATA LETAK) ───────────────── */}
      {/* 
        MENGGUNAKAN justify-center & gap yang pas (gap-10 sampai gap-20)
        Ini memaksa bingkai kiri & konsol kanan berdempetan mesra di tengah layar.
        padding X dijaga agar tetap aman di layar kecil.
      */}
      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 xl:gap-24 p-6 sm:px-10 lg:px-12 max-w-[1600px] mx-auto w-full my-auto">
        
        {/* ========================================================
            KIRI: PREVIEW HASIL STRIP
            ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-auto flex flex-col items-center justify-center py-4 flex-shrink-0"
        >
          <div className={`relative inline-block shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border ${isDark ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/5 bg-[#121212]'} transition-transform duration-500 hover:scale-[1.02]`}>
            
            <img 
              src={template.image} 
              alt="Frame Overlay" 
              className="relative z-10 block max-w-full h-[70vh] lg:h-[80vh] w-auto pointer-events-none select-none drop-shadow-2xl"
            />
            
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
              {isAnalyzing && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4 text-white">
                       <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase opacity-80">Menyiapkan Frame...</span>
                    </div>
                 </motion.div>
              )}

              {!isAnalyzing && holes.length > 0 && holes.map((hole, i) => (
                <div 
                  key={i}
                  style={{ left: `${hole.x}%`, top: `${hole.y}%`, width: `${hole.width}%`, height: `${hole.height}%` }}
                  className={`absolute overflow-hidden flex items-center justify-center z-0 shadow-inner transition-all duration-700 ${currentShot === i ? 'bg-zinc-800/80 scale-[1.01]' : 'bg-zinc-950'}`}
                >
                  {currentShot === i && (
                     <div className="absolute inset-0 border-[2px] border-dashed border-white/30 rounded-lg sm:rounded-xl animate-pulse m-2 sm:m-3" />
                  )}
                  {currentShot > i && (
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      src={photos[i]} 
                      alt={`Shot ${i + 1}`} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {currentShot < i && <ImageIcon size={24} className="text-white/5" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            KANAN: KONSOL KAMERA (Tetap Rapi di Sisi Kanan Tengah)
            ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-[500px] lg:w-[480px] xl:w-[520px] flex flex-col justify-center py-4 flex-shrink-0"
        >
          
          {/* Header Info */}
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-current to-current/50 bg-clip-text text-transparent">
              {currentShot >= template.slotCount ? "Sesi Selesai ✨" : `Pose ${currentShot + 1} / ${template.slotCount}`}
            </h2>
            <p className={`text-sm mt-2 font-medium ${theme.textMuted}`}>
              {currentShot >= template.slotCount ? "Sempurna! Periksa hasilnya dan simpan momen ini." : "Atur filter dan berikan senyuman terbaikmu."}
            </p>
            
            <div className="flex items-center gap-2 mt-5 max-w-[280px] mx-auto lg:mx-0">
              {Array.from({ length: template.slotCount }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                    currentShot > i ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 
                    currentShot === i ? (isDark ? 'bg-white' : 'bg-zinc-900') : 
                    (isDark ? 'bg-white/10' : 'bg-black/10')
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Kotak Kamera Utama */}
          <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.4)] mb-6 flex-shrink-0 group ring-1 ring-white/10`}>
            
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between opacity-40 transition-opacity duration-300 group-hover:opacity-70">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-xl"></div>
                <div className="w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Focus size={80} className="text-white" />
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-xl"></div>
                <div className="w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-xl"></div>
              </div>
            </div>

            {currentShot < template.slotCount ? (
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted 
                 style={{ filter: activeFilter.css }} 
                 className="w-full h-full object-cover -scale-x-100 transition-all duration-500" 
               />
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-[#050505]">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Sparkles size={48} className="mb-4 opacity-50" />
                  </motion.div>
                  <p className="text-sm font-medium tracking-widest uppercase">Kamera Siaga</p>
               </div>
            )}

            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, opacity: 0, rotate: -15 }} 
                  animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                  exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }} 
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none bg-black/30 backdrop-blur-[2px]"
                >
                  <span className="text-[120px] sm:text-[160px] font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] leading-none">
                    {countdown}
                  </span>
                </motion.div>
              )}
              {isFlashing && (
                <motion.div 
                  initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white z-50 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Panel Kontrol Eksekutif */}
          <div className={`p-5 sm:p-6 rounded-[2rem] border ${theme.panelBg}`}>
            {currentShot < template.slotCount ? (
              <div className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-4">
                  <div className={`flex items-center justify-between p-2 rounded-2xl ${theme.btnToggleBg}`}>
                    <div className="flex items-center gap-2 pl-3 opacity-80">
                      <Timer size={16} />
                      <span className="text-xs uppercase tracking-widest font-bold">Waktu</span>
                    </div>
                    <div className="flex gap-1.5">
                      {TIMER_OPTIONS.map((time) => (
                        <button
                          key={time}
                          onClick={() => setActiveTimer(time)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                            activeTimer === time ? theme.btnActive : theme.btnInactive
                          }`}
                        >
                          {time}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl ${theme.btnToggleBg}`}>
                    <div className="flex items-center gap-2 mb-3 pl-2 opacity-80">
                      <Settings2 size={16} />
                      <span className="text-xs uppercase tracking-widest font-bold">Filter Lensa</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-1">
                      {STUDIO_FILTERS.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setActiveFilter(f)}
                          className={`snap-center shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                            activeFilter.name === f.name ? theme.btnActive : theme.btnInactive
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  {currentShot > 0 && countdown === null && (
                     <button 
                        onClick={handleRetakeLast}
                        className={`px-5 rounded-2xl text-sm font-bold flex items-center justify-center transition-all hover:-rotate-12 border ${theme.btnDanger}`}
                        title="Ulangi Foto Terakhir"
                     >
                        <RotateCcw size={20} />
                     </button>
                  )}
                  <button 
                    onClick={triggerShutter}
                    disabled={countdown !== null || isAnalyzing}
                    className={`flex-1 py-4 sm:py-5 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 shadow-xl disabled:opacity-50 disabled:scale-100 disabled:translate-y-0 disabled:shadow-none ${theme.btnPrimary}`}
                  >
                    {isAnalyzing ? (
                      <span>Loading Frame...</span>
                    ) : countdown !== null ? (
                      <span className="animate-pulse">Bersiap...</span>
                    ) : (
                      <><Camera size={20} /> Jepret Pose</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                 <button 
                   onClick={handleFinish}
                   className={`w-full py-5 rounded-2xl text-base font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:-translate-y-1 active:scale-95 shadow-2xl ${theme.btnPrimary}`}
                 >
                   Simpan & Cetak Hasil <ArrowRight size={20} />
                 </button>
                 <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={handleRetakeLast}
                     className={`w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${theme.btnDanger}`}
                   >
                     <RotateCcw size={16} /> Ulangi Terakhir
                   </button>
                   <button 
                     onClick={handleRetakeAll}
                     className={`w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-transparent hover:bg-black/5 dark:hover:bg-white/5 ${theme.textMuted}`}
                   >
                     <RefreshCcw size={16} /> Ulangi Semua
                   </button>
                 </div>
              </motion.div>
            )}
          </div>

        </motion.div>
      </main>
    </div>
  );
}