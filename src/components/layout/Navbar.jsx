import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sun, LogOut, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  
  const { isDark, setIsDark } = useTheme();
  const { user } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Palet warna untuk Dark Mode & Light Mode
  const theme = {
    navBg: isDark ? 'bg-[#09090b]/80 border-white/10' : 'bg-white/80 border-black/10',
    dropdownBg: isDark ? 'bg-[#121214] border-white/10' : 'bg-white border-black/10',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900',
    logo: isDark ? 'text-zinc-100' : 'text-zinc-900',
    iconBtn: isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-black/5 hover:bg-black/10 border-black/10',
    pillContainer: isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10',
  };

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 w-full md:w-auto transition-all duration-500 ${scrolled ? 'top-0 md:top-3' : 'top-0 md:top-6'}`}>
      <div className={`flex items-center justify-between md:justify-center gap-4 md:gap-8 px-6 py-3 backdrop-blur-md shadow-2xl transition-colors duration-700 border-b md:border md:rounded-full ${theme.navBg} w-full md:min-w-[700px] lg:min-w-[900px]`}>
        
        {/* ================= KIRI: LOGO ================= */}
        <Link to="/" className={`font-extrabold text-xl tracking-tighter transition-colors ${theme.logo}`}>
          Photoboox.
        </Link>

        {/* ================= TENGAH: MENU DESKTOP ================= */}
        <div className="hidden md:flex items-center gap-8 mx-4">
          {[
            { name: 'Beranda', path: '/' },
            { name: 'Templates', path: '/templates' },
            { name: 'Premium', path: '/premium' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium tracking-wide transition-colors ${isActive(item.path) ? theme.text : theme.textMuted}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Garis Pemisah Navbar (Divider) */}
        <div className={`hidden md:block w-[1px] h-6 transition-colors ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

        {/* ================= KANAN: ACTIONS & AUTH ================= */}
        <div className="flex items-center gap-3">
          
          {!user ? (
            // ------------------ TAMPILAN SEBELUM LOGIN ------------------
            <>
              {/* Tombol Login Teks */}
              <Link 
                to="/login" 
                className={`text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity px-3 ${theme.text}`}
              >
                Login
              </Link>
              
              {/* Tombol Animasi "Get Started" (Proporsional & Presisi) */}
              <Link to="/templates">
                <button className={`group relative h-[38px] w-[130px] cursor-pointer rounded-full p-1 outline-none transition-colors border ${isDark ? 'bg-zinc-900 border-white/20' : 'bg-white border-black/20'}`}>
                  {/* Lingkaran Animasi Background */}
                  <span className={`circle m-0 block h-[30px] w-[30px] overflow-hidden rounded-full duration-500 ease-out group-hover:w-full ${isDark ? 'bg-zinc-100' : 'bg-zinc-900'}`} aria-hidden="true" />
                  
                  {/* Ikon Panah (Tepat di tengah lingkaran) */}
                  <div className="absolute top-1/2 left-[10px] -translate-y-1/2 duration-500 ease-out group-hover:translate-x-1 flex items-center justify-center pointer-events-none">
                    <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-900' : 'text-white'}`} />
                  </div>
                  
                  {/* Teks Tombol */}
                  <span className={`absolute top-1/2 left-1/2 ml-2.5 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-bold tracking-wide whitespace-nowrap duration-500 ease-out ${isDark ? 'text-zinc-100 group-hover:text-zinc-900' : 'text-zinc-900 group-hover:text-white'}`}>
                    Get Started
                  </span>
                </button>
              </Link>

              {/* Tema Toggle */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-all border ${theme.iconBtn} ${theme.textMuted}`}
                title="Ganti Tema"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
            </>
          ) : (
            // ------------------ TAMPILAN SETELAH LOGIN (Kapsul Terpadu) ------------------
            <div className="flex items-center gap-3">
              
              {/* 1. Tema Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-full transition-all border ${theme.iconBtn} ${theme.textMuted}`}
                title="Ganti Tema"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              {/* 2. Kapsul Gabungan Akun & Keluar (Dipisah garis |) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center rounded-full border ${theme.pillContainer} backdrop-blur-md overflow-hidden shadow-sm`}
              >
                {/* Bagian Kiri: Tombol Akun (Bisa diklik ke /account & memunculkan dropdown saat di-hover) */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <Link to="/account">
                    <motion.div 
                      whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
                      className={`flex items-center gap-2 pl-4 pr-3 py-2 text-sm font-semibold transition-colors ${theme.text}`}
                    >
                      <User size={15} className="opacity-70" />
                      <span>Akun</span>
                    </motion.div>
                  </Link>

                  {/* Dropdown Menu Informasi Akun */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute left-0 top-full mt-2 w-52 rounded-2xl border ${theme.dropdownBg} shadow-2xl overflow-hidden py-2 z-50`}
                      >
                        <div className={`px-4 py-2 border-b ${isDark ? 'border-white/10' : 'border-black/10'} mb-1`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1 ${theme.text}`}>Email Anda</p>
                          <p className={`text-xs font-medium truncate ${theme.text}`}>
                            {user.email}
                          </p>
                        </div>
                        
                        <Link
                          to="/account"
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} ${theme.text}`}
                        >
                          <LayoutDashboard size={16} className="opacity-70" /> Dashboard
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Garis Pemisah (Divider Vertikal |) */}
                <div className={`w-[1px] h-5 ${isDark ? 'bg-white/15' : 'bg-black/15'} my-auto`} />

                {/* Bagian Kanan: Tombol Keluar */}
                <motion.button
                  whileHover={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                    color: '#ef4444' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 pl-3 pr-4 py-2 text-sm font-semibold transition-colors ${theme.textMuted}`}
                  title="Keluar dari akun"
                >
                  <LogOut size={15} />
                  <span>Keluar</span>
                </motion.button>

              </motion.div>
              
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
}