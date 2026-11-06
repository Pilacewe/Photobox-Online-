import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // Pastikan path ini sesuai

export default function Footer() {
  const { isDark } = useTheme();

  // Konfigurasi Tema Dinamis
  const theme = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#F9F9F6]',
    text: isDark ? 'text-[#E1E0CC]' : 'text-[#1A1A1A]',
    textMuted: isDark ? 'text-[#E1E0CC]/50 hover:text-[#E1E0CC]' : 'text-gray-500 hover:text-black',
    border: isDark ? 'border-white/10' : 'border-black/10',
    logo: isDark ? 'text-white' : 'text-black',
  };

  return (
    <footer className={`relative border-t transition-colors duration-700 ${theme.bg} ${theme.border} ${theme.text}`}>
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">
          
          {/* Brand Info (Left) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" className={`flex items-center gap-2 mb-6 transition-colors ${theme.logo}`}>
              <Camera size={24} strokeWidth={1.5} />
              <span className="font-medium text-2xl tracking-tighter">Photoboox.</span>
            </Link>
            <p className={`text-sm font-light leading-relaxed max-w-xs transition-colors ${isDark ? 'text-[#E1E0CC]/70' : 'text-gray-600'}`}>
              Platform studio digital yang dirancang untuk mengabadikan setiap momen estetikmu tanpa batas ruang dan waktu.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Links: Platform */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-semibold tracking-widest uppercase mb-2 opacity-50">Platform</h4>
            <Link to="/" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Beranda</Link>
            <Link to="/templates" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Katalog Bingkai</Link>
            <Link to="/premium" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Premium Akses</Link>
          </div>

          {/* Links: Bantuan & Legal */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-semibold tracking-widest uppercase mb-2 opacity-50">Bantuan</h4>
            <Link to="/faq" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Cara Kerja</Link>
            <Link to="/privacy" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Privasi & Syarat</Link>
            <Link to="/contact" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Hubungi Kami</Link>
          </div>

          {/* Links: Social */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-semibold tracking-widest uppercase mb-2 opacity-50">Sosial</h4>
            <a href="#" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Instagram</a>
            <a href="#" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>TikTok</a>
            <a href="#" className={`text-sm font-medium transition-colors ${theme.textMuted}`}>Pinterest</a>
          </div>

        </div>

        {/* Bottom Section: Copyright & Watermark */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors ${theme.border}`}>
          
          <p className={`text-xs font-light tracking-wider transition-colors ${isDark ? 'text-[#E1E0CC]/40' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} Photoboox. Hak Cipta Dilindungi.
          </p>
          
          <div className={`flex items-center gap-1.5 text-xs font-light tracking-wide transition-colors ${isDark ? 'text-[#E1E0CC]/60' : 'text-gray-500'}`}>
            Dirakit dengan <Heart size={14} className={isDark ? 'text-rose-500 fill-rose-500/20' : 'text-rose-500 fill-rose-100'} /> untuk momenmu.
          </div>

        </div>
      </div>
    </footer>
  );
}