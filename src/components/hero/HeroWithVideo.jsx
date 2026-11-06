import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * HeroWithVideo - Custom-built hero component inspired by 21st.dev style
 * Props are intentionally structured for easy customization.
 */
export default function HeroWithVideo({
  brandName = 'Photoboox',
  heroTitle = 'Abadikan Momen Manismu',
  heroSubtitle = 'Online Photobooth Gratis & Cozy',
  heroDescription = 'Pilih bingkai favoritmu, jepret momen terbaik, dan simpan kenangan estetik tanpa batas langsung dari browsermu.',
  emailPlaceholder = 'Masukkan email untuk info premium...',
  backgroundImage = 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=2000&auto=format&fit=crop',
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  onCtaPrimary,
  onCtaSecondary,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/70 via-black/50 to-[#E15A97]/30" />

      {/* Video (modal-like fullscreen when active) */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted={isMuted}
              className="w-full rounded-2xl shadow-2xl"
            />
            {/* Video controls */}
            <div className="absolute bottom-4 left-4 flex gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center w-full py-24 pt-32">
        {/* Left: Text */}
        <div className="space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium">
            <Camera size={16} className="text-[#E15A97]" />
            {heroSubtitle}
          </div>

          {/* Title */}
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-white leading-[1.05] tracking-wide">
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i === 1 || i === 2 ? 'text-[#FFB8D1]' : ''}>{word} </span>
            ))}
          </h1>

          {/* Description */}
          <p className="text-white/75 text-lg leading-relaxed max-w-md">
            {heroDescription}
          </p>

          {/* Email input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder={emailPlaceholder}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-[#E15A97] focus:ring-2 focus:ring-[#E15A97]/30 transition"
            />
            <button
              onClick={onCtaPrimary}
              className="px-6 py-3.5 rounded-full bg-[#E15A97] text-white font-heading font-medium hover:bg-[#c0427b] transition-all hover:shadow-lg hover:shadow-[#E15A97]/40 whitespace-nowrap active:scale-95"
            >
              Daftar Gratis
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onCtaPrimary}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#E15A97] to-[#9B88ED] text-white font-heading text-lg font-medium hover:opacity-90 hover:shadow-xl hover:shadow-[#E15A97]/30 transition-all active:scale-95"
            >
              <Camera size={22} /> Jepret Sekarang
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white font-heading text-lg font-medium hover:bg-white/20 transition-all active:scale-95"
            >
              <Play size={20} className="fill-white" /> Lihat Demo
            </button>
          </div>
        </div>

        {/* Right: Photo collage mockup */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-72">
            {/* Main polaroid */}
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/20">
                <img
                  src={backgroundImage}
                  alt="photobooth preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-white/70 text-sm mt-2 font-medium py-1">✨ Your Moment</p>
            </div>
            {/* Floating mini cards */}
            <div className="absolute -top-8 -left-12 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-xl -rotate-6">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-white/20">
                <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-xl rotate-6">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-white/20">
                <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            {/* Sparkle badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#E15A97] to-[#9B88ED] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ✨ FREE
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-white/30 rounded-full" />
      </div>
    </section>
  );
}
