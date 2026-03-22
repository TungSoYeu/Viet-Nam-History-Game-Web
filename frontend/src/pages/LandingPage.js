import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, BookOpen, Shield, Trophy } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.9)), url('/assets/images/vietnam_history_hero_1774157920838.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Decorative Background Orbs are no longer needed with a rich image background, but we keep the particle effects */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Emblem */}
        <div className="mb-8 animate-fade-in-scale">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full relative" style={{ background: 'linear-gradient(135deg, rgba(185,28,28,0.15), rgba(212,160,83,0.15))', border: '2px solid rgba(212,160,83,0.3)' }}>
            <span className="text-6xl">🏯</span>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a053, #f0d48a)' }}>
              <Sparkles size={16} className="text-amber-900" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black mb-3 animate-fade-in" style={{ fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #f0d48a 0%, #d4a053 50%, #f0d48a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animationDelay: '0.1s' }}>
          Sử Việt Hùng Ca
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl mb-2 animate-fade-in opacity-0" style={{ color: 'rgba(212,160,83,0.8)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          "Dòng máu Lạc Hồng, ngàn năm vang vọng"
        </p>
        <p className="text-sm sm:text-base mb-10 animate-fade-in opacity-0" style={{ color: 'rgba(255,255,255,0.5)', animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Khám phá 4000 năm lịch sử qua trò chơi tương tác
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/login')}
          className="btn-primary text-lg px-10 py-4 flex items-center gap-3 mx-auto animate-fade-in-up opacity-0 group"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Khám Phá Ngay
          <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          {[
            { icon: <BookOpen size={14} />, text: '9 Chế Độ Chơi' },
            { icon: <Shield size={14} />, text: 'PvP Đối Kháng' },
            { icon: <Trophy size={14} />, text: 'Bảng Xếp Hạng' },
          ].map((f, i) => (
            <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              {f.icon} {f.text}
            </span>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mt-12 flex items-center justify-center gap-3 opacity-20">
          <div className="w-16 h-px bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <div className="w-16 h-px bg-white"></div>
        </div>
      </div>
    </div>
  );
}
