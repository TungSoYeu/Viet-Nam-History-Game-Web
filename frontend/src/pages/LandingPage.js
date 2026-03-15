import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen history-bg flex flex-col items-center justify-center p-4">
      <div className="text-center animate-fade-in flex flex-col items-center">
        {/* Central Scroll Icon */}
        <div className="relative mb-8 group cursor-pointer" onClick={() => navigate('/login')}>
          <div className="absolute inset-0 bg-amber-200 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
          <div className="relative bg-white/50 p-12 rounded-full border-4 border-amber-900/20 shadow-2xl backdrop-blur-sm transform transition group-hover:scale-110 group-hover:rotate-3 duration-500">
            <ScrollText size={120} className="text-amber-900" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title & Slogan */}
        <h1 className="historical-title mb-2 !border-none !pb-0 tracking-tight">Sử Việt Hùng Ca</h1>
        <p className="text-xl md:text-2xl text-amber-900 font-serif italic mb-12 opacity-80">
          "Dòng máu Lạc Hồng, ngàn năm vang vọng"
        </p>

        {/* Launch Button */}
        <button 
          onClick={() => navigate('/login')}
          className="btn-historical px-12 py-5 text-2xl flex items-center gap-3 group shadow-[0_10px_30px_rgba(139,90,43,0.3)]"
        >
          Khám Phá Ngay
          <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
        </button>

        {/* Decorative elements */}
        <div className="mt-16 flex gap-8 opacity-30">
            <div className="w-24 h-0.5 bg-amber-900"></div>
            <div className="w-2 h-2 rounded-full bg-amber-900"></div>
            <div className="w-24 h-0.5 bg-amber-900"></div>
        </div>
      </div>
    </div>
  );
}
