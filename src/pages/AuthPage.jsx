import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../config/supabase';
import { useTheme } from '../context/ThemeContext';
import { Mail, User, Lock, ChevronLeft, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // State untuk form
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Tambahan state username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F6]',
    text: isDark ? 'text-[#E1E0CC]' : 'text-[#1A1A1A]',
    inputBg: isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10',
    btnBg: isDark ? 'bg-[#E1E0CC] text-black' : 'bg-black text-white',
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLoginMode) {
        // --- PROSES LOGIN ---
        
        // Mencegah user login pakai username (karena Supabase butuh email)
        if (!email.includes('@')) {
          throw new Error("Silakan gunakan Alamat Email Anda untuk masuk.");
        }

        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        navigate('/templates'); // Sukses login, pindah ke halaman utama
        
      } else {
        // --- PROSES REGISTER ---
        
        // 1. Validasi manual agar username terisi dan tidak pakai spasi (opsional)
        if (!username.trim()) throw new Error("Username tidak boleh kosong.");
        const cleanUsername = username.toLowerCase().replace(/\s+/g, '');

        // 2. Daftarkan user menggunakan Email Asli
        const { data, error: authError } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (authError) throw authError;

        // 3. Simpan Username ke tabel profiles
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: data.user.id, 
                username: cleanUsername 
              }
            ]);

          if (profileError) {
            console.error("Gagal simpan username:", profileError.message);
            // Tetap lanjut meskipun gagal simpan profile agar tidak menghentikan flow user
          }
        }

        alert("Pendaftaran berhasil! Silakan masuk dengan akun Anda.");
        setIsLoginMode(true);
        setPassword(''); 
      }
    } catch (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Email atau password salah.');
      } else if (error.message.includes('already registered')) {
        setErrorMsg('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung Masuk.');
      } else if (error.code === '23505') { 
        // Kode error Postgres jika data unik kembar (username sudah dipakai)
        setErrorMsg('Username ini sudah terpakai, silakan pilih yang lain.');
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengganti mode (reset error dan password)
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMsg('');
    setPassword('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text} px-4 font-sans relative`}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.25] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      
      <button onClick={() => navigate(-1)} className="absolute top-8 left-8 flex items-center gap-2 z-10 hover:opacity-70 transition-opacity font-semibold text-sm">
        <ChevronLeft size={18} /> Kembali
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className={`p-8 md:p-12 rounded-[2rem] border ${theme.inputBg} backdrop-blur-md shadow-2xl`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {isLoginMode ? 'Selamat Datang' : 'Buat Akun'}
            </h1>
            <p className="text-sm opacity-60">
              {isLoginMode ? 'Masuk untuk mengakses koleksi premium Anda.' : 'Daftar untuk mulai mengoleksi bingkai eksklusif.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {/* Notifikasi Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center mb-1">
                    {errorMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Email (Muncul di Login & Register) */}
            <div className={`flex items-center px-4 py-3.5 rounded-xl border ${theme.inputBg} focus-within:border-current transition-colors`}>
              <Mail size={18} className="opacity-50 mr-3 shrink-0" />
              <input 
                type="email" 
                required 
                placeholder="Alamat Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm placeholder:opacity-50"
              />
            </div>

            {/* Input Username (Hanya Muncul saat Register) */}
            {!isLoginMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center px-4 py-3.5 rounded-xl border ${theme.inputBg} focus-within:border-current transition-colors`}>
                <User size={18} className="opacity-50 mr-3 shrink-0" />
                <input 
                  type="text" 
                  required={!isLoginMode}
                  placeholder="Buat Username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-sm placeholder:opacity-50"
                />
              </motion.div>
            )}

            {/* Input Password (Muncul di Login & Register) */}
            <div className={`flex items-center px-4 py-3.5 rounded-xl border ${theme.inputBg} focus-within:border-current transition-colors`}>
              <Lock size={18} className="opacity-50 mr-3 shrink-0" />
              <input 
                type="password" 
                required 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm placeholder:opacity-50"
              />
            </div>

            <button disabled={loading} className={`w-full py-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 mt-4 transition-transform active:scale-95 disabled:opacity-70 ${theme.btnBg}`}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : (isLoginMode ? 'Masuk' : 'Daftar Akun')}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium opacity-60">
            {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
            <button type="button" onClick={toggleMode} className="underline font-bold hover:opacity-100">
              {isLoginMode ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}