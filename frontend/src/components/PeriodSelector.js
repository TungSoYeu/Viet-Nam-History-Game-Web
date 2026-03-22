import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function PeriodSelector({ onSelect, onBack, title, description }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải triều đại:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Đang tải danh sách triều đại...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(212,160,83,0.7)' }}>⚔️ Chọn Thời Kỳ</p>
          <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {title || "Chọn Thời Kỳ Tu Luyện"}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {description || "Chọn một triều đại hoặc thử thách bản thân với kiến thức tổng hợp."}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 stagger-children">
          {/* All Periods - Featured Card */}
          <div 
            onClick={() => onSelect('all')}
            className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center text-center animate-fade-in-up opacity-0"
            style={{ background: 'linear-gradient(135deg, rgba(185,28,28,0.2), rgba(239,68,68,0.1))', border: '1.5px solid rgba(239,68,68,0.25)', animationFillMode: 'forwards' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-base font-black uppercase text-white">Nâng Cao</h3>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Tổng hợp mọi thời kỳ</p>
          </div>

          {/* Individual Lessons */}
          {lessons.map((lesson, idx) => (
            <div 
              key={lesson._id}
              onClick={() => onSelect(lesson._id)}
              className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center text-center animate-fade-in-up opacity-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${(idx + 1) * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <span className="text-3xl mb-2">📜</span>
              <h3 className="text-sm font-bold text-white leading-tight">{lesson.title}</h3>
              <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{lesson.description}</p>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button 
            onClick={onBack}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 mx-auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
