import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flag, Hourglass, Puzzle, Swords, History, 
  Library, UserSearch, Image as ImageIcon, ScanSearch,
  ArrowRight, Trophy, BookOpen, ChevronRight
} from 'lucide-react';
import AnimatedPage from '../components/animations/AnimatedPage';
import BouncyButton from '../components/animations/BouncyButton';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import { theme4Modes } from '../data/theme4Modes';

export default function ModeSelection() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  const iconMap = {
    "turning-page": <ImageIcon size={28} />,
    "understanding-teammates": <Swords size={28} />,
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
        staggerChildren: 0.1 // Hiệu ứng xuất hiện lần lượt giữa các card
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Mode Detail Overlay
  if (selectedMode) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
          <ParticlesBackground type="dust" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full rounded-3xl overflow-hidden relative z-10" 
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
          >
            {/* Header banner */}
            <div 
              className="relative h-48 sm:h-56 flex items-center justify-center overflow-hidden" 
              style={{ 
                backgroundImage: selectedMode.gradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="absolute inset-0 opacity-10 bg-black"></div>
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
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                "{selectedMode.longDesc}"
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Mục tiêu</span>
                  <span className="text-white font-bold">{selectedMode.stats}</span>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Phần thưởng</span>
                  <span className="text-white font-bold">100 - 500 XP</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <BouncyButton 
                  onClick={() => navigate(selectedMode.path)}
                  className="w-full"
                >
                  <div className="w-full py-4 rounded-2xl font-black text-lg uppercase text-white flex items-center justify-center gap-2"
                    style={{ 
                      background: selectedMode.gradient,
                      backgroundSize: 'cover',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)' 
                    }}
                  >
                    XUẤT QUÂN <ChevronRight size={20} />
                  </div>
                </BouncyButton>
                <button 
                  onClick={() => setSelectedMode(null)}
                  className="w-full py-3 rounded-2xl font-semibold uppercase text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  ← Quay lại
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
      <div className="min-h-screen flex flex-col relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <ParticlesBackground type="dust" />
        <div className="responsive-container py-8 sm:py-12 relative z-10">
          {/* Header */}
          <header className="mb-8 text-center mt-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(212,160,83,0.8)' }}>Chủ đề 4</p>
            <h1 className="historical-title mb-2 text-white" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chiến Tranh Bảo Vệ Tổ Quốc</h1>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Bộ trò chơi của Bài 7 và Bài 8 với số lượng câu hỏi cố định, hình ảnh lịch sử chính thống và lược đồ nhận diện.
            </p>
          </header>

          {/* Mode Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12"
          >
            {competitionModes.map((mode) => (
              <motion.div 
                key={mode.id} 
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedMode(mode)}
                className="relative rounded-3xl overflow-hidden cursor-pointer group flex flex-col"
                style={{ 
                  minHeight: '230px',
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
                    width: '101%', // Tăng nhẹ kích thước để tránh lộ viền trắng
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

                  {/* Title & Desc */}
                  <h2 className="text-xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors tracking-wide drop-shadow-md">
                    {mode.name}
                  </h2>
                  <p className="text-xs mb-3 leading-relaxed line-clamp-2 drop-shadow-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {mode.desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,160,83,0.9)' }}>{mode.stats}</span>
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
