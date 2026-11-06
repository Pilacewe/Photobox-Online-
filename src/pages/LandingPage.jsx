import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Download, Sparkles, Aperture, Film, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// IMPORT GAMBAR BACKGROUND HERO
// Pastikan gambar diletakkan di dalam folder src/assets/
import heroBgImg from '../assets/background.png';

// IMPORT GAMBAR BINGKAI (Sesuai dengan TemplateSelectionPage)
import frameVibesImg from '../assets/frame-vibes.png'; 
import framesRedImg from '../assets/redgoodvibes.png'; 
import framekabar from '../assets/kabarbaik.png'; 
import framejepang from '../assets/japanese.png'; 

/* ---------------- WordsPullUp Component (Hero Text) ---------------- */
const WordsPullUp = ({ text, className = "", showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- MAIN LANDING PAGE ---------------- */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Konfigurasi Tema
  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F6]',
    text: isDark ? 'text-[#E1E0CC]' : 'text-[#1A1A1A]',
    textMuted: isDark ? 'text-[#E1E0CC]/60' : 'text-gray-500',
    border: isDark ? 'border-white/10' : 'border-black/10',
    cardBg: isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]',
    btnBg: isDark ? 'bg-[#E1E0CC] text-black' : 'bg-black text-[#F9F9F6]',
    btnInner: isDark ? 'bg-black text-[#E1E0CC]' : 'bg-[#F9F9F6] text-black',
  };

  // DATA BINGKAI SHOWCASE UNTUK LANDING PAGE
  const SHOWCASE_FRAMES = [
    { name: "Toy Story Grid", type: "Gratis", image: frameVibesImg, aspect: "aspect-[3/5]", slotCount: 2, offset: "" },
    { name: "Kabar Hari Ini", type: "Premium", image: framekabar, aspect: "aspect-[3/5]", slotCount: 3, offset: "md:mt-12" },
    { name: "Good Vibes Red", type: "Gratis", image: framesRedImg, aspect: "aspect-[3/5]", slotCount: 3, offset: "" },
    { name: "Japanese", type: "Gratis", image: framejepang, aspect: "aspect-[3/5]", slotCount: 4, offset: "md:mt-12" }
  ];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#E1E0CC] selection:text-black transition-colors duration-700 ease-in-out`}>
      
      {/* ───────────────── 1. HERO SECTION (CINEMATIC LIVING IMAGE) ───────────────── */}
      <section className="h-screen w-full p-3 sm:p-5 relative z-10">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-2xl bg-[#0a0a0a]">
          
          {/* CSS Animation Injector untuk Partikel dan Bayangan Awan */}
          <style dangerouslySetInnerHTML={{__html: `
            .cinematic-zoom {
              animation: slowZoom 25s ease-in-out infinite alternate;
              transform-origin: center 60%;
            }
            @keyframes slowZoom {
              0% { transform: scale(1); }
              100% { transform: scale(1.12); }
            }

            /* Efek bayangan awan yang bergerak menutupi matahari */
            .cloud-shadows {
              background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
              background-size: 200% 200%;
              animation: movingClouds 30s linear infinite;
              mix-blend-mode: multiply;
            }
            @keyframes movingClouds {
              0% { background-position: 0% 0%; opacity: 0.3; }
              50% { background-position: 100% 100%; opacity: 0.6; }
              100% { background-position: 0% 0%; opacity: 0.3; }
            }

            /* Partikel debu/serbuk yang tertiup angin di area rumput */
            .particles-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5; }
            .particle {
              position: absolute;
              background: rgba(255, 255, 255, 0.6);
              border-radius: 50%;
              filter: blur(1px);
              animation: floatParticle linear infinite;
            }
            @keyframes floatParticle {
              0% { transform: translateY(0) translateX(0); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(-150px) translateX(100px); opacity: 0; }
            }
          `}} />

          {/* LAYER 1: Gambar Utama dengan Efek Bernapas (Slow Zoom) */}
          <img 
            className="absolute inset-0 w-full h-full object-cover cinematic-zoom" 
            src={heroBgImg} 
            alt="Photobooth outdoor scene" 
          />
          
          {/* LAYER 2: Efek Awan Bergerak (Menciptakan ilusi cuaca yang dinamis) */}
          <div className="absolute inset-0 cloud-shadows pointer-events-none" />

          {/* LAYER 3: Efek Angin & Partikel (Dihasilkan dengan code) */}
          <div className="particles-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  bottom: `${Math.random() * 30}%`, 
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* LAYER 4: Overlay Gelap & Noise agar Teks Terbaca */}
          <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

          {/* KONTEN TEKS HERO */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 sm:px-8 md:px-12 lg:pb-12 z-20">
            <div className="grid grid-cols-12 items-end gap-6 md:gap-4">
              
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                <h1
                  className="font-medium leading-[0.85] tracking-[-0.05em] text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] xl:text-[13vw]"
                  style={{ color: "#E1E0CC" }}
                >
                  <WordsPullUp text="Photoboox" showAsterisk />
                </h1>
              </div>

              <div className="col-span-12 flex flex-col gap-6 lg:col-span-5 xl:col-span-4 lg:pb-6">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base md:text-lg text-[#E1E0CC]/90 font-light drop-shadow-md"
                  style={{ lineHeight: 1.4 }}
                >
                  Lebih dari sekadar foto. Ini adalah panggung digitalmu. Pilih bingkai, jepret momen, dan jadikan setiap kenangan sebuah karya seni.
                </motion.p>

                <motion.button
                  onClick={() => navigate('/templates')}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center gap-3 self-start rounded-full bg-[#E1E0CC] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-black transition-all hover:gap-4 sm:text-base hover:scale-[1.02] shadow-[0_0_30px_rgba(225,224,204,0.3)]"
                >
                  Mulai Sesi
                  <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black transition-transform group-hover:rotate-45">
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#E1E0CC" }} />
                  </span>
                </motion.button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── 2. THE EXPERIENCE (CARA KERJA) ───────────────── */}
      <section className="py-32 md:py-48 px-6 sm:px-12 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
          
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6">
                Seni <br className="hidden md:block" /> mengabadikan <br className="hidden md:block" /> momen.
              </h2>
              <p className={`text-lg md:text-xl font-light max-w-md ${theme.textMuted}`}>
                Tiga langkah elegan menuju estetika visual yang sempurna. Semuanya terjadi langsung di dalam browsermu.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-12 md:gap-20">
            {[
              { num: "01", title: "Pilih Estetika", desc: "Temukan kurasi bingkai yang sesuai dengan mood-mu. Mulai dari gaya editorial majalah hingga kilau retro Y2K.", icon: <Film strokeWidth={1} size={40} className={theme.textMuted} /> },
              { num: "02", title: "Ekspresikan Diri", desc: "Studio ini milikmu. Izinkan akses kamera, berpose bebas, dan biarkan timer kami menangkap keajaiban di setiap detiknya.", icon: <Aperture strokeWidth={1} size={40} className={theme.textMuted} /> },
              { num: "03", title: "Simpan Selamanya", desc: "Karya senimu siap. Unduh kolase resolusi tinggi yang diproses dengan privasi penuh, langsung di perangkatmu.", icon: <Download strokeWidth={1} size={40} className={theme.textMuted} /> }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`flex flex-col md:flex-row gap-6 md:gap-10 pb-12 border-b ${theme.border} group`}
              >
                <div className="text-4xl md:text-5xl font-light tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl md:text-3xl font-medium">{step.title}</h3>
                    <div className={`p-4 rounded-full border ${theme.border} ${theme.cardBg} group-hover:scale-110 transition-transform duration-500`}>
                      {step.icon}
                    </div>
                  </div>
                  <p className={`text-lg font-light leading-relaxed ${theme.textMuted}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ───────────────── 3. GALLERY SHOWCASE (BINGKAI) ───────────────── */}
      <section className={`py-32 md:py-48 px-4 sm:px-6 border-y ${theme.border} relative overflow-hidden`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square rounded-full blur-[150px] opacity-20 pointer-events-none ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-20 md:mb-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-medium tracking-tight mb-6"
            >
              Koleksi Eksklusif.
            </motion.h2>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate('/templates')}
              className={`group flex items-center gap-2 text-sm tracking-widest uppercase font-semibold pb-2 border-b ${theme.border} hover:border-current transition-colors`}
            >
              Jelajahi Katalog <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SHOWCASE_FRAMES.map((frame, i) => (
              <motion.div 
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`group cursor-pointer flex flex-col ${frame.offset}`} 
                onClick={() => navigate('/templates')}
              >
                <div className={`${frame.aspect} w-full rounded-[2rem] overflow-hidden relative p-3 flex flex-col items-center justify-center border transition-all duration-700 ${theme.cardBg} ${theme.border} group-hover:border-current shadow-sm group-hover:shadow-xl`}>
                  
                  {frame.image ? (
                    <img 
                      src={frame.image} 
                      alt={frame.name} 
                      className="absolute inset-0 w-full h-full object-contain z-10 p-3 pointer-events-none drop-shadow-md"
                    />
                  ) : (
                    <div className="absolute inset-4 z-0 flex flex-col gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-2xl w-full h-full justify-around">
                      {Array.from({ length: frame.slotCount }).map((_, slot) => (
                        <div key={slot} className={`flex-1 rounded-xl w-full border opacity-40 ${isDark ? 'bg-black/80 border-white/10' : 'bg-white border-black/10'}`} />
                      ))}
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm z-20 ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
                    <span className={`${theme.btnBg} px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform duration-500 shadow-2xl`}>
                      <Sparkles size={16} /> Lihat Bingkai
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 px-1">
                  <h4 className="font-medium text-lg md:text-xl tracking-tight">{frame.name}</h4>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border ${frame.type === 'Premium' ? (isDark ? 'bg-[#E1E0CC] text-black border-[#E1E0CC]' : 'bg-black text-white border-black') : `bg-transparent ${theme.border}`}`}>
                    {frame.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── 4. HD CTA SECTION ───────────────── */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className={`relative max-w-[1400px] mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden border px-6 py-24 md:py-32 text-center flex flex-col items-center justify-center transition-all duration-700 ${isDark ? 'bg-[#0A0A0A]/90 border-white/10 backdrop-blur-2xl' : 'bg-white border-black/10 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.1)]'}`}>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className={`absolute -top-1/4 -left-1/4 w-[90vw] max-w-[900px] aspect-square rounded-full blur-[120px] md:blur-[180px] opacity-40 transition-colors duration-1000 ${isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/40'}`}
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className={`absolute -bottom-1/4 -right-1/4 w-[90vw] max-w-[900px] aspect-square rounded-full blur-[120px] md:blur-[180px] opacity-40 transition-colors duration-1000 ${isDark ? 'bg-rose-600/20' : 'bg-rose-300/40'}`}
            />
          </div>

          <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex items-center gap-2 mb-6 px-5 py-2 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
            >
              <ShieldCheck size={16} className={theme.textMuted} />
              <span className={`text-[10px] sm:text-xs font-semibold tracking-widest uppercase ${theme.textMuted}`}>
                100% Privasi Terjaga • Tanpa Registrasi
              </span>
            </motion.div>

            <h2 className={`text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter mb-6 leading-[1.05] ${isDark ? 'text-white' : 'text-black'}`}>
              Siap untuk <br/>memulai?
            </h2>
            
            <p className={`text-lg md:text-xl mb-12 font-light max-w-xl ${theme.textMuted}`}>
              Bergabunglah dengan ribuan kreator lainnya. Abadikan momenmu di dalam studio digital kami sekarang.
            </p>
            
            <div className="relative group">
              <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark ? 'bg-[#E1E0CC]/40' : 'bg-black/20'}`} />
              <button
                onClick={() => navigate('/templates')}
                className={`relative inline-flex items-center gap-4 rounded-full py-2.5 pl-8 pr-2.5 text-base md:text-lg font-medium transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-2xl ${theme.btnBg} border ${isDark ? 'border-transparent' : 'border-black'}`}
              >
                Masuk ke Studio
                <span className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full transition-transform ${theme.btnInner}`}>
                  <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 group-hover:-rotate-45 transition-transform duration-500" />
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}