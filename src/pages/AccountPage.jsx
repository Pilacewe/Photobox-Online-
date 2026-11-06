import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Sparkles, Camera, ArrowRight, Loader2, PackageOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import Navbar from '../components/layout/Navbar';

export default function AccountPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [purchasedTemplates, setPurchasedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Palet tema elegan
  const theme = {
    bg: isDark ? 'bg-[#09090b]' : 'bg-[#fafafa]',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    cardBg: isDark ? 'bg-[#121214]' : 'bg-white',
    cardHover: isDark ? 'hover:border-zinc-700' : 'hover:border-zinc-300',
    accentBg: isDark ? 'bg-white/5' : 'bg-black/5',
    btnPrimary: isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800',
  };

  // Mengambil data template yang telah dibeli user dari Supabase
  useEffect(() => {
    const fetchPurchasedTemplates = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // 1. Ambil data dari tabel purchases milik user yang sedang login
        const { data: purchasesData, error: purchaseError } = await supabase
          .from('purchases')
          .select('template_id')
          .eq('user_id', user.id);

        if (purchaseError) throw purchaseError;

        if (purchasesData && purchasesData.length > 0) {
          // Ambil semua ID template yang pernah dibeli
          const templateIds = purchasesData.map((item) => String(item.template_id));

          // 2. Ambil detail template dari tabel templates Anda
          // (Pastikan tabel template Anda memiliki kolom 'id')
          const { data: templatesData, error: templateError } = await supabase
            .from('templates')
            .select('*')
            .in('id', templateIds);

          if (templateError) throw templateError;
          setPurchasedTemplates(templatesData || []);
        } else {
          setPurchasedTemplates([]);
        }
      } catch (err) {
        console.error("Gagal memuat koleksi template:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedTemplates();
  }, [user]);

  const handleUseTemplate = (template) => {
    navigate('/photobooth', { state: { selectedTemplate: template } });
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-zinc-500/30 relative pb-24`}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* NAVBAR */}
      <Navbar />

      {/* KONTEN UTAMA */}
      <main className="relative z-10 max-w-[1100px] mx-auto px-6 pt-36">
        
        {/* HEADER PROFIL BENTO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 md:p-10 rounded-[2.5rem] border ${theme.border} ${theme.cardBg} shadow-xl mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl ${theme.accentBg} border ${theme.border} flex items-center justify-center shrink-0`}>
              <User size={36} className="opacity-80" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Akun Terverifikasi
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {user?.email ? user.email.split('@')[0] : 'Pengguna Setia'}
              </h1>
              <p className={`text-sm ${theme.textMuted} mt-0.5`}>
                {user?.email}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-6 px-6 py-4 rounded-2xl border ${theme.border} ${theme.accentBg} w-full md:w-auto justify-around md:justify-start`}>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Koleksi Aktif</p>
              <p className="text-2xl font-black mt-0.5">{purchasedTemplates.length} Bingkai</p>
            </div>
            <div className={`w-[1px] h-8 ${theme.border}`} />
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={22} />
            </div>
          </div>
        </motion.div>

        {/* SECTION: KOLEKSI BINGKAI YANG DIBELI */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bingkai Premium Saya</h2>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Daftar template eksklusif yang sudah Anda miliki dan siap digunakan kapan saja.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin opacity-50" />
            <p className={`text-sm ${theme.textMuted}`}>Memuat koleksi bingkai Anda...</p>
          </div>
        ) : purchasedTemplates.length === 0 ? (
          /* KONDISI JIKA BELUM ADA TEMPAT YANG DIBELI */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-12 rounded-[2rem] border ${theme.border} ${theme.cardBg} text-center flex flex-col items-center justify-center shadow-sm`}
          >
            <div className={`w-16 h-16 rounded-full ${theme.accentBg} flex items-center justify-center mb-4 text-zinc-400`}>
              <PackageOpen size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Belum Ada Bingkai Premium</h3>
            <p className={`text-sm ${theme.textMuted} max-w-md mb-8`}>
              Anda belum memiliki koleksi bingkai eksklusif. Jelajahi katalog premium kami dan pilih bingkai favorit Anda untuk mulai berfoto.
            </p>
            <button
              onClick={() => navigate('/premium')}
              className={`px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg ${theme.btnPrimary}`}
            >
              <Sparkles size={16} /> Jelajahi Katalog Premium <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          /* GRID DAFTAR BINGKAI YANG SUDAH DIBELI */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {purchasedTemplates.map((template, idx) => (
              <motion.div
                key={template.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group p-5 rounded-3xl border ${theme.border} ${theme.cardBg} ${theme.cardHover} transition-all duration-300 shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-full aspect-[4/5] rounded-2xl overflow-hidden border ${theme.border} ${theme.accentBg} relative mb-4 flex items-center justify-center p-4`}>
                    {template.image ? (
                      <img src={template.image} alt={template.name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col gap-2 w-full h-full">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={`flex-1 rounded-md border ${isDark ? 'border-white/10 bg-black/50' : 'border-black/10 bg-white/50'}`} />
                        ))}
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white z-20">
                      Dimiliki
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight mb-1">{template.name}</h3>
                  <p className={`text-xs ${theme.textMuted} mb-4`}>{template.category || 'Eksklusif'} • Siap Pakai</p>
                </div>

                <button
                  onClick={() => handleUseTemplate(template)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${theme.btnPrimary}`}
                >
                  <Camera size={15} /> Mulai Sesi Photobooth <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}