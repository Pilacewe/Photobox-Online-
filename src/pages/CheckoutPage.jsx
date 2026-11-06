import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!location.state || !location.state.template) {
    return <Navigate to="/templates" replace />;
  }

  const { template } = location.state;
  
  const rawPrice = template.price || "Rp 15.000";
  const basePrice = parseInt(rawPrice.replace(/\D/g, '')) || 15000;
  const adminFee = 1000;
  const totalPrice = basePrice + adminFee;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const theme = {
    bg: isDark ? 'bg-[#09090b]' : 'bg-[#fafafa]',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    cardBg: isDark ? 'bg-[#121214]' : 'bg-white',
    inputBg: isDark ? 'bg-[#18181b]' : 'bg-zinc-50',
    btnPrimary: isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800',
    modalBg: isDark ? 'bg-[#121214]' : 'bg-white',
  };

  // --- FUNGSI UTAMA: MEMANGGIL MIDTRANS SNAP & SUPABASE ---
  const handlePayNow = async () => {
    if (!user) {
      alert("Sesi Anda telah habis. Silakan login kembali.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Panggil Supabase Edge Function 'create-transaction'
      const { data: funcData, error: funcError } = await supabase.functions.invoke('create-transaction', {
        body: {
          template_id: String(template.id),
          template_name: template.name,
          price: totalPrice,
          user_id: user.id,
          user_email: user.email || "customer@photobooth.com"
        }
      });

      if (funcError) throw new Error(funcError.message || 'Gagal menghubungi server pembayaran.');
      if (!funcData || !funcData.token) throw new Error('Token pembayaran Midtrans tidak valid.');

      const snapToken = funcData.token;

      // 2. Buka Popup Midtrans Snap
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Midtrans Success:", result);
            
            // KODE INSERT KE SUPABASE DIHAPUS DARI SINI
            // Pencatatan database sekarang ditangani sepenuhnya oleh Webhook (midtrans-webhook) demi keamanan.

            setIsProcessing(false);
            setShowSuccessModal(true);
          },
          onPending: function (result) {
            console.log("Midtrans Pending:", result);
            alert("Menunggu pembayaran Anda diselesaikan.");
            setIsProcessing(false);
          },
          onError: function (result) {
            console.log("Midtrans Error:", result);
            setErrorMsg("Pembayaran gagal atau dibatalkan oleh sistem.");
            setIsProcessing(false);
          },
          onClose: function () {
            console.log('Customer menutup popup pembayaran tanpa menyelesaikan.');
            setIsProcessing(false);
          }
        });
      } else {
        throw new Error('Script Midtrans Snap belum dimuat dengan benar di browser.');
      }

    } catch (err) {
      console.error("Error Checkout:", err);
      setErrorMsg(err.message || "Terjadi kesalahan sistem pembayaran.");
      setIsProcessing(false);
    }
  };

  const goToPhotobooth = () => {
    navigate('/photobooth', { state: { selectedTemplate: template } });
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-zinc-500/30 relative`}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between border-b ${theme.border} bg-inherit backdrop-blur-md`}>
        <button 
          onClick={() => navigate(-1)}
          disabled={isProcessing || showSuccessModal}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 ${theme.textMuted}`}
        >
          <ChevronLeft size={20} /> Batal & Kembali
        </button>
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-emerald-500" />
          <span className="font-bold tracking-widest uppercase text-[11px] text-emerald-500">Secure Midtrans Checkout</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-12 pt-32 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* KIRI: RINGKASAN PRODUK */}
        <div className="md:col-span-5 flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Ringkasan Pesanan</h2>
          <div className={`p-6 rounded-xl border ${theme.border} ${theme.cardBg} flex flex-col shadow-sm`}>
            <div className={`w-full aspect-[4/5] rounded-lg overflow-hidden border ${theme.border} ${theme.inputBg} relative mb-6 flex items-center justify-center p-6`}>
              {template.image ? (
                <img src={template.image} alt={template.name} className="w-full h-full object-contain relative z-10 drop-shadow-md" />
              ) : (
                <div className="flex flex-col gap-2 w-full h-full">
                  {Array.from({ length: template.slotCount || 3 }).map((_, i) => (
                    <div key={i} className={`flex-1 rounded-md border ${isDark ? 'border-white/10 bg-black/50' : 'border-black/10 bg-white/50'}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight">{template.name}</h3>
                <p className={`text-sm ${theme.textMuted}`}>{template.category} • Lisensi Premium</p>
              </div>
              <span className="font-semibold">{formatRupiah(basePrice)}</span>
            </div>

            <hr className={`border-t ${theme.border} mb-6`} />

            <div className="flex flex-col gap-3 mb-6">
              <div className={`flex justify-between text-sm ${theme.textMuted}`}><span>Subtotal</span><span>{formatRupiah(basePrice)}</span></div>
              <div className={`flex justify-between text-sm ${theme.textMuted}`}><span>Biaya Layanan</span><span>{formatRupiah(adminFee)}</span></div>
            </div>

            <hr className={`border-t ${theme.border} mb-6`} />

            <div className="flex justify-between items-center text-xl">
              <span className="font-bold">Total</span>
              <span className="font-black tracking-tight">{formatRupiah(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* KANAN: TOMBOL PEMBAYARAN MIDTRANS */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Pembayaran Instan.</h1>
          <p className={`text-base ${theme.textMuted} mb-8`}>
            Klik tombol di bawah untuk memunculkan jendela pembayaran resmi (QRIS, GoPay, Virtual Account, dll).
          </p>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className={`flex items-center gap-4 p-5 rounded-xl border ${theme.border} ${theme.cardBg} mb-8`}>
            <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
            <p className={`text-xs ${theme.textMuted} leading-relaxed font-medium`}>
              Didukung oleh Midtrans Secure Sandbox. Transaksi aman, instan, dan otomatis membuka lisensi bingkai.
            </p>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className={`w-full py-5 rounded-xl text-base font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-80 ${theme.btnPrimary} shadow-lg`}
          >
            {isProcessing ? (
              <><Loader2 size={20} className="animate-spin" /> Menghubungkan ke Midtrans...</>
            ) : (
              <>Bayar Sekarang — {formatRupiah(totalPrice)}</>
            )}
          </button>
        </div>
      </main>

      {/* POPUP MODAL SUKSES */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`relative w-full max-w-md p-8 rounded-[2.5rem] border ${theme.border} ${theme.modalBg} text-center shadow-2xl z-10 flex flex-col items-center`}
            >
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>

              <span className="text-xs font-bold tracking-widest uppercase text-emerald-500 mb-2">Pembayaran Diterima</span>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Lisensi Aktif!</h2>
              <p className={`text-sm mb-8 ${theme.textMuted}`}>
                Pembayaran Anda telah dikonfirmasi oleh sistem. Bingkai <b className="text-current">{template.name}</b> sudah bisa digunakan sepuasnya.
              </p>

              <button
                onClick={goToPhotobooth}
                className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${theme.btnPrimary} shadow-lg`}
              >
                Mulai Sesi Photobooth <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}