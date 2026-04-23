import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, BookOpen, Shield, Trophy, Landmark } from 'lucide-react';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import HistoricalQuote from '../components/HistoricalQuote';

const BACKGROUND_IMAGES = [
  "/assets/images/vinh_ha_long.png",
  "/assets/images/co_do_hue.png",
  "/assets/images/ho_guom.png",
  "/assets/images/pho_co_hoi_an.png",
  "/assets/images/van_mieu_quoc_tu_giam.png"
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setHasFinePointer(media.matches);
    sync();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', sync);
      return () => media.removeEventListener('change', sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  const handleMouseMove = (event) => {
    if (!hasFinePointer) return;
    const { innerWidth, innerHeight } = window;
    const offsetX = ((event.clientX / innerWidth) - 0.5) * 28;
    const offsetY = ((event.clientY / innerHeight) - 0.5) * 18;
    setParallaxOffset({ x: offsetX, y: offsetY });
  };

  return (
    <AnimatedPage>
      <div
        className="theme-page relative min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setParallaxOffset({ x: 0, y: 0 })}
      >
        <ParticlesBackground type="dust" />
        
        {/* 1. Animated Background Carousel Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {BACKGROUND_IMAGES.map((imgUrl, idx) => {
            const isNear = Math.abs(idx - currentImageIndex) <= 1 || (idx === 0 && currentImageIndex === BACKGROUND_IMAGES.length - 1) || (currentImageIndex === 0 && idx === BACKGROUND_IMAGES.length - 1);
            return (
              <div
                key={idx}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
                style={{
                  backgroundImage: isNear ? `url('${imgUrl}')` : 'none',
                  opacity: idx === currentImageIndex ? 1 : 0,
                  transform:
                    idx === currentImageIndex
                      ? `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.07)`
                      : 'scale(1)',
                  transition: 'opacity 1s ease-in-out, transform 5s linear',
                  filter: 'brightness(0.92) saturate(1.05)'
                }}
              />
            );
          })}
        </div>

        {/* 2. Unified Vignette / Dark Glass Overlay Layer */}
        <div 
          className="fixed inset-0 z-10 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(var(--bg-base-rgb), 0.08) 0%, rgba(var(--bg-base-rgb), 0.54) 100%)',
            backdropFilter: 'blur(2px)'
          }}
        ></div>

        {/* 3. Main Content Layer */}
        <div className="relative z-20 text-center max-w-4xl mx-auto w-full px-4">
          {/* Emblem */}
          <div className="mb-8 animate-fade-in-scale">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full relative shadow-2xl backdrop-blur-md" style={{ background: 'linear-gradient(135deg, rgba(185,28,28,0.25), rgba(212,160,83,0.3))', border: '2px solid rgba(212,160,83,0.4)', boxShadow: '0 0 40px rgba(212,160,83,0.3)' }}>
              <Landmark size={48} className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #d4a053, #f0d48a)' }}>
                <Sparkles size={16} className="text-amber-900" />
              </div>
            </div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]"
            style={{ fontFamily: "'Playfair Display', serif", background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.08em' }}
          >
            Danh Nhân Đất Việt 
          </motion.h1>

          {/* Tagline */}
          <p className="text-base sm:text-xl mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]" style={{ color: 'var(--page-heading)', fontFamily: "'Playfair Display', serif" }}>
            "Chinh phục Chủ đề 4: Lịch sử Việt Nam"
          </p>
          <p className="text-sm sm:text-base mb-8 sm:mb-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" style={{ color: 'var(--text-secondary)' }}>
            Hệ thống trò chơi tương tác củng cố và khắc sâu kiến thức
          </p>

          {/* CTA Button */}
          <BouncyButton
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto mx-auto"
          >
            <div className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-4 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,160,83,0.3)] hover:shadow-[0_0_50px_rgba(212,160,83,0.5)] transition-all">
              Khám Phá Sử Việt
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </BouncyButton>

          {/* Historical Quote — Rotating */}
          <div className="mt-8">
            <HistoricalQuote />
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: <BookOpen size={14} />, text: '8 Chế Độ Chơi' },
              { icon: <Shield size={14} />, text: 'PvP Đối Kháng' },
              { icon: <Trophy size={14} />, text: 'Bảng Xếp Hạng' },
            ].map((f, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm drop-shadow-md hover-scale-subtle" style={{ background: 'var(--page-card-soft)', border: '1px solid var(--page-card-border)', color: 'var(--text-primary)' }}>
                {f.icon} {f.text}
              </span>
            ))}
          </div>

          {/* Decorative divider */}
          <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
