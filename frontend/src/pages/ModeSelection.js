import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flag, Hourglass, Puzzle, History, 
  Library, Image as ImageIcon, ScanSearch,
  ArrowRight, Trophy, BookOpen, ChevronRight, Users
} from 'lucide-react';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import ProgressRing from '../components/ProgressRing';
import { theme4Modes } from '../data/theme4Modes';

export default function ModeSelection() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  const iconMap = {
    "turning-page": <ImageIcon size={28} />,
    "understanding-teammates": <Users size={28} />,
    "historical-recognition": <ScanSearch size={28} />,
    "connecting-history": <Puzzle size={28} />,
    "crossword-decoding": <Library size={28} />,
    "historical-flow": <History size={28} />,
    "lightning-fast": <Hourglass size={28} />,
    "picture-puzzle": <Flag size={28} />,
  };

  const competitionModes = theme4Modes.map((mode) => ({
    ...mode,
    icon: iconMap[mode.id] || <ImageIcon size={28} />,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (selectedMode) {
    return (
      <AnimatedPage>
        <div className="theme-page min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ background: 'var(--page-bg-gradient)' }}>
          <ParticlesBackground type="dust" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="theme-glass-card max-w-2xl w-full rounded-3xl overflow-hidden relative z-10"
          >
            {/* Header banner */}
            <div 
              className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden" 
              style={{ 
                backgroundImage: `url(${selectedMode.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="absolute inset-0 opacity-40 bg-black"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent"></div>
              <div className="relative z-10 text-center px-6 flex flex-col items-center">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 text-white drop-shadow-md *:w-14 *:h-14"
                >
                  {selectedMode.icon}
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">{selectedMode.name}</h1>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10">
              <p className="text-base sm:text-lg leading-relaxed mt-2 mb-8 text-center" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{selectedMode.longDesc}"
              </p>

              <div className="flex items-center gap-6 mb-8 justify-center">
                <ProgressRing percent={selectedMode.progress || 0} size={64} strokeWidth={6} />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Độ khó</div>
                  <div className={`px-3 py-1 rounded text-xs font-bold w-max ${
                    selectedMode.difficulty === 'Dễ' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    selectedMode.difficulty === 'Trung bình' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedMode.difficulty || 'Chưa phân loại'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <BouncyButton 
                  onClick={() => navigate(`/modes/${selectedMode.id}/guide`)}
                  className="w-full"
                >
                  <div className="w-full py-4 rounded-2xl font-black text-lg uppercase text-white flex items-center justify-center gap-2"
                    style={{ 
                      background: selectedMode.gradient,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
                    }}
                  >
                    XEM HƯỚNG DẪN <ChevronRight size={20} />
                  </div>
                </BouncyButton>
                <button 
                  onClick={() => setSelectedMode(null)}
                  className="w-full py-3 rounded-2xl font-semibold uppercase text-sm transition-all hover:bg-white/10"
                  style={{ background: 'var(--page-card-soft)', color: 'var(--text-secondary)', border: '1px solid var(--page-card-border)' }}
                >
                  ← Quay Lại
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="theme-page min-h-screen flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ background: 'var(--page-bg-gradient)' }}>
        <ParticlesBackground type="dust" />
        <div className="responsive-container py-8 sm:py-12 relative z-10">
          {/* Header */}
          <header className="parchment-panel max-w-4xl mx-auto mb-8 mt-4 rounded-[32px] px-6 py-7 text-center sm:px-10 sm:py-8">
            <div className="mb-3 flex justify-center">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em]"
                style={{
                  color: 'rgba(240, 212, 138, 0.9)',
                  background: 'rgba(18, 20, 28, 0.28)',
                  border: '1px solid rgba(255, 248, 220, 0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                <BookOpen size={14} strokeWidth={1.8} />
                <span>Chủ đề 4</span>
              </div>
            </div>
            <h1 className="historical-title mb-3 text-white drop-shadow-md" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Chiến tranh Bảo vệ Tổ quốc và giải phóng dân tộc
            </h1>
          </header>

          {/* Mode Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12"
          >
            {competitionModes.map((mode) => (
              <motion.div 
                key={mode.id} 
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedMode(mode)}
                className="relative rounded-3xl overflow-hidden cursor-pointer flex flex-col min-h-[220px] sm:min-h-[240px] md:min-h-[260px] group transition-all duration-300"
                style={{ 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                {/* Full Background Image & Gradient */}
                <div 
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" 
                  style={{ 
                    backgroundImage: `url(${mode.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transformOrigin: 'center',
                    width: '101%',
                    height: '101%',
                    left: '-0.5%',
                    top: '-0.5%'
                  }}
                ></div>
                <div 
                  className="absolute inset-0 transition-opacity duration-300 opacity-60 group-hover:opacity-40"
                  style={{ 
                    background: mode.gradient,
                  }}
                ></div>

                {/* Dark Gradient Overlay for Readability */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 40%, rgba(15, 23, 42, 0.2) 100%)' 
                  }}
                ></div>

                {/* Content Container */}
                <div className="relative z-10 flex-1 flex flex-col justify-end p-5">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {mode.icon}
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-16" title={mode.difficultyDetail}>
                    <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      mode.difficulty === 'Dễ' ? 'bg-green-500/30 border border-green-400/50 text-green-300' :
                      mode.difficulty === 'Trung bình' ? 'bg-amber-500/30 border border-amber-400/50 text-amber-300' :
                      'bg-red-500/30 border border-red-400/50 text-red-300'
                    }`}>
                      {mode.difficulty}
                    </div>
                  </div>

                  {/* Progress Ring Overlay */}
                  <div className="absolute top-4 right-4">
                    <ProgressRing percent={mode.progress || 0} size={48} strokeWidth={4} />
                  </div>

                  {/* Title */}
                  <div className="flex items-center justify-between mt-auto">
                    <h2 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors tracking-wide drop-shadow-md">
                      {mode.name}
                    </h2>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white transition-all group-hover:translate-x-1" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pb-4">
            <BouncyButton onClick={() => navigate('/leaderboard')}>
              <div className="btn-primary px-8 py-3.5 flex items-center justify-center gap-2 text-sm">
                <Trophy size={18} /> Bảng Phong Thần
              </div>
            </BouncyButton>
            <BouncyButton onClick={() => navigate('/timeline')}>
              <div className="btn-gold px-8 py-3.5 flex items-center justify-center gap-2 text-sm">
                <BookOpen size={18} /> Vào Thư Viện
              </div>
            </BouncyButton>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
