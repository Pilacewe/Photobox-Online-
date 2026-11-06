import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Filter, X, Check, Lock, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- IMPORT SUPABASE & AUTH CONTEXT ---
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

// Import Gambar Anda
import frameVibesImg from '../assets/frame-vibes.png'; 
import framesRedImg from '../assets/redgoodvibes.png'; 
import framekabar from '../assets/kabarbaik.png'; 
import framejepang from '../assets/japanese.png'; 

// --- DATA BINGKAI ---
const TEMPLATES = [
  { id: 't1', name: "Toy Story Grid", category: "2 Frame", type: "Gratis", image: frameVibesImg, aspect: "aspect-[3/5]", slotCount: 2 },
  { id: 't2', name: "Good Vibes Red", category: "3 Frame", type: "Gratis", image: framesRedImg, aspect: "aspect-[3/5]", slotCount: 3 },
  { id: 'p1', name: "Kabar Hari Ini", category: "3 Frame", type: "Premium", price: "Rp 15.000", image: framekabar, aspect: "aspect-[3/5]", slotCount: 3 },
  { id: 't3', name: "Japanese", category: "4 Frame", type: "Gratis", image: framejepang, aspect: "aspect-[3/5]", slotCount: 4 },
  { id: 'p2', name: "Soft Romance", category: "2 Frame", type: "Premium", price: "Rp 15.000", aspect: "aspect-[3/5]", slotCount: 2 },
  { id: 't4', name: "Polaroid Classic", category: "2 Frame", type: "Gratis", image: frameVibesImg, aspect: "aspect-[3/5]", slotCount: 2 },
  { id: 'p3', name: "90s Disposable", category: "6 Frame", type: "Premium", price: "Rp 25.000", aspect: "aspect-[3/5]", slotCount: 6 },
  { id: 't5', name: "Cloud Nine", category: "3 Frame", type: "Gratis", image: frameVibesImg, aspect: "aspect-[3/5]", slotCount: 3 },
];

const CATEGORIES = ["Semua", "2 Frame", "3 Frame", "4 Frame", "6 Frame"];

export default function TemplateSelectionPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth(); // Mengambil data user yang sedang login
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedForPurchase, setSelectedForPurchase] = useState(null);
  const [purchasedIds, setPurchasedIds] = useState([]); // State untuk menyimpan ID bingkai yang sudah dibeli

  // --- AMBIL DATA PEMBELIAN DARI SUPABASE SAAT HALAMAN DIMUAT ---
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('template_id')
          .eq('user_id', user.id);

        if (!error && data) {
          setPurchasedIds(data.map(item => item.template_id));
        }
      } catch (err) {
        console.error("Gagal memuat status pembelian:", err);
      }
    };

    fetchPurchases();
  }, [user]);

  const filteredTemplates = TEMPLATES.filter(
    (t) => activeCategory === "Semua" || t.category === activeCategory
  );

  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F6]',
    text: isDark ? 'text-[#E1E0CC]' : 'text-[#1A1A1A]',
    textMuted: isDark ? 'text-[#E1E0CC]/60' : 'text-gray-500',
    border: isDark ? 'border-white/10' : 'border-black/10',
    cardBg: isDark ? 'bg-white/[0.02]' : 'bg-white',
    cardHover: isDark ? 'hover:border-white/40' : 'hover:border-black/40',
    badgeGratis: isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700',
    badgePremium: isDark ? 'bg-[#E1E0CC] text-black' : 'bg-black text-white',
    badgePurchased: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    btnBg: isDark ? 'bg-[#E1E0CC] text-black' : 'bg-black text-white',
    modalBg: isDark ? 'bg-[#121212]' : 'bg-white',
  };

  // --- LOGIKA PEMILIHAN FRAME (CEK STATUS LISENSI) ---
  const handleSelectFrame = (templateData) => {
    const isOwned = purchasedIds.includes(templateData.id);

    if (templateData.type === 'Premium' && !isOwned) {
      // 1. Cek apakah user sudah login
      if (!user) {
        alert("Anda harus masuk (login) terlebih dahulu untuk mengakses bingkai Premium.");
        navigate('/login');
        return;
      }
      // Belum dibeli -> Buka Modal Checkout
      setSelectedForPurchase(templateData);
    } else {
      // Jika Gratis atau Sudah Dibeli -> Langsung masuk ke Photobooth
      navigate('/photobooth', { state: { selectedTemplate: templateData } });
    }
  };

  // LOGIKA MENUJU HALAMAN CHECKOUT
  const proceedToCheckout = () => {
    const targetTemplate = selectedForPurchase;
    setSelectedForPurchase(null);
    navigate('/checkout', { state: { template: targetTemplate } });
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#E1E0CC] selection:text-black transition-colors duration-700 relative`}>
      
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.25] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 pt-32 md:pt-48 pb-24">
        
        {/* ───────────────── 1. HERO SECTION ───────────────── */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase opacity-50 block mb-4">
              Studio Collection
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-6 leading-[1.05]">
              Pilih Bingkai.
            </h1>
            <p className={`text-lg md:text-xl font-light max-w-xl leading-relaxed ${theme.textMuted}`}>
              Kurasi bingkai digital untuk mengabadikan momen terbaikmu. Pilih jumlah frame yang sesuai dengan vibemu hari ini.
            </p>
          </motion.div>
        </div>

        <div className={`w-full h-[1px] ${theme.border} mb-12`} />

        {/* ───────────────── 2. FILTER CATEGORY ───────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 overflow-x-auto pb-6 mb-16 scrollbar-hide"
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${theme.border} ${theme.textMuted} shrink-0`}>
            <Filter size={16} />
            <span className="text-xs font-semibold tracking-widest uppercase">Filter Layout</span>
          </div>
          
          <div className="w-[1px] h-6 bg-current opacity-20 mx-2 shrink-0" />

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  isActive 
                    ? `${theme.btnBg} border-transparent shadow-lg` 
                    : `bg-transparent ${theme.border} ${theme.textMuted} hover:border-current`
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* ───────────────── 3. GRID GALLERY BINGKAI ───────────────── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => {
              const isOwned = purchasedIds.includes(template.id);
              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => handleSelectFrame(template)}
                >
                  <div className={`w-full ${template.aspect} rounded-[2rem] overflow-hidden relative p-3 flex flex-col items-center justify-center border transition-all duration-500 ${isDark ? 'bg-black/40' : 'bg-gray-100'} ${theme.border} ${theme.cardHover} shadow-sm group-hover:shadow-xl`}>
                    
                    {template.image ? (
                      <img 
                        src={template.image} 
                        alt={template.name} 
                        className="absolute inset-0 w-full h-full object-contain z-10 p-3 pointer-events-none drop-shadow-md"
                      />
                    ) : (
                      <div className="absolute inset-4 z-0 flex flex-col gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-2xl w-full h-full justify-around">
                        {Array.from({ length: template.slotCount }).map((_, slot) => (
                          <div key={slot} className={`flex-1 rounded-xl w-full border opacity-40 ${isDark ? 'bg-black/80 border-white/10' : 'bg-white border-black/10'}`} />
                        ))}
                      </div>
                    )}

                    {/* Hover State */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-xs z-20 ${isDark ? 'bg-black/50' : 'bg-white/50'}`}>
                      <span className={`${theme.btnBg} px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform duration-500 shadow-2xl`}>
                        {isOwned ? (
                          <><Sparkles size={16} /> Gunakan Frame</>
                        ) : template.type === 'Premium' ? (
                          <><Lock size={16} /> Buka Kunci</>
                        ) : (
                          <><Sparkles size={16} /> Pilih Bingkai</>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-5 px-2">
                    <div className="flex flex-col">
                      <h4 className="font-medium text-lg tracking-tight mb-0.5">{template.name}</h4>
                      <span className={`text-xs font-light ${theme.textMuted}`}>{template.category}</span>
                    </div>
                    
                    <span className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${
                      isOwned ? theme.badgePurchased : template.type === 'Premium' ? theme.badgePremium : `${theme.badgeGratis} border-transparent`
                    }`}>
                      {isOwned ? (
                        <><Check size={12} strokeWidth={3} /> Sudah Dibayar</>
                      ) : template.type === 'Premium' ? (
                        <><Crown size={12} /> {template.price}</>
                      ) : (
                        template.type
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* ───────────────── 4. PAYWALL MODAL (PREMIUM POP-UP) ───────────────── */}
      <AnimatePresence>
        {selectedForPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            
            {/* Backdrop Blur Gelap */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedForPurchase(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Kotak Modal Elegan */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className={`relative w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-[2rem] border ${theme.border} ${theme.modalBg}`}
            >
              
              {/* Tombol Close */}
              <button 
                onClick={() => setSelectedForPurchase(null)}
                className={`absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors backdrop-blur-md`}
              >
                <X size={20} />
              </button>

              {/* Sisi Kiri: Preview Gambar */}
              <div className={`md:w-5/12 p-8 flex items-center justify-center relative ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-100'} border-b md:border-b-0 md:border-r ${theme.border}`}>
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-20">
                  <span className="text-4xl font-bold uppercase tracking-widest rotate-[-45deg] select-none text-gray-500">Preview</span>
                </div>
                
                <div className={`w-3/4 ${selectedForPurchase.aspect} rounded-2xl overflow-hidden relative shadow-lg ${isDark ? 'bg-black/40' : 'bg-white'}`}>
                  {selectedForPurchase.image ? (
                    <img src={selectedForPurchase.image} alt={selectedForPurchase.name} className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-md" />
                  ) : (
                     <div className="absolute inset-2 z-0 flex flex-col gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-xl w-full h-full justify-around">
                       {Array.from({ length: selectedForPurchase.slotCount }).map((_, slot) => (
                         <div key={slot} className={`flex-1 rounded-lg w-full border opacity-40 ${isDark ? 'bg-black/80 border-white/10' : 'bg-white border-black/10'}`} />
                       ))}
                     </div>
                  )}
                </div>
              </div>

              {/* Sisi Kanan: Detail Checkout */}
              <div className="md:w-7/12 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-max mb-6 ${theme.badgePremium}`}>
                  <Crown size={12} /> Frame Premium
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  {selectedForPurchase.name}
                </h2>
                <p className={`text-sm mb-6 ${theme.textMuted}`}>Kategori: {selectedForPurchase.category}</p>
                
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-bold tracking-tighter">{selectedForPurchase.price || "Rp 15.000"}</span>
                  <span className={`text-sm pb-1 ${theme.textMuted}`}>/ Penggunaan</span>
                </div>

                {/* List Fitur Premium */}
                <ul className="flex flex-col gap-3 mb-10">
                  {[
                    "Kualitas cetak resolusi sangat tinggi (4K)",
                    "Akses penuh tanpa Watermark Studio",
                    "Fitur retouch warna otomatis ala fotografer",
                    "Dapat disimpan langsung ke format digital"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium leading-relaxed">
                      <div className="mt-0.5 shrink-0 bg-emerald-500/20 text-emerald-500 rounded-full p-1">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Tombol Aksi: Mengarahkan ke /checkout */}
                <div className="mt-auto flex flex-col gap-3">
                  <button 
                    onClick={proceedToCheckout}
                    className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${theme.btnBg} hover:shadow-lg`}
                  >
                    <CreditCard size={18} /> Lanjutkan ke Pembayaran
                  </button>
                  
                  <button 
                    onClick={() => setSelectedForPurchase(null)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors border border-transparent hover:border-current ${theme.textMuted}`}
                  >
                    Batal
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}