// frontend/src/pages/Timeline.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Timeline() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);

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
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-3xl mx-auto pt-12">
        <div className="skeleton skeleton-text" style={{ width: 120, height: 12, margin: '0 auto 16px' }} />
        <div className="skeleton skeleton-text" style={{ width: 280, height: 28, margin: '0 auto 12px' }} />
        <div className="skeleton skeleton-text" style={{ width: 240, height: 14, margin: '0 auto 40px' }} />
        <SkeletonLoader variant="timeline" count={6} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="responsive-container py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(212,160,83,0.8)' }}>📚 Thư Viện</p>
          <h1 className="historical-title mb-2 text-white" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dòng Chảy Thời Gian</h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            "Nước Việt ta từ xưa vốn là một nước có chủ quyền, có lịch sử hào hùng ngàn năm..."
          </p>
        </header>
        
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 stagger-children">
          {lessons.map((lesson, idx) => (
            <div 
              key={lesson._id} 
              onClick={() => setSelectedLesson(lesson)} 
              className="group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'var(--gradient-hero)' }}></div>
              <span className="text-xs font-semibold block mb-1" style={{ color: 'rgba(212,160,83,0.8)' }}>{lesson.description?.split('.')[0] || "THỜI ĐẠI"}</span>
              <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{lesson.title}</span>
              <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

        {/* Bottom action */}
        <div className="text-center">
          <button onClick={() => navigate('/leaderboard')} className="btn-primary px-8 py-3.5 flex items-center gap-2 mx-auto text-sm">
            <Trophy size={18} /> Bảng Phong Thần
          </button>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedLesson(null)}>
          <div className="max-w-md w-full rounded-2xl p-8 animate-fade-in-scale" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <span className="text-4xl mb-3 block">📜</span>
              <h2 className="text-xl font-black text-white mb-1 uppercase" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{selectedLesson.title}</h2>
              <p className="text-sm italic mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>"Học sử để hiểu gốc rễ, chơi sử để rèn trí tuệ."</p>
            </div>
            
            <button 
              onClick={() => navigate(`/study/${selectedLesson._id}`)}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mb-3"
            >
              <BookOpen size={20} /> Vào Học Thuật
            </button>
            <button 
              onClick={() => setSelectedLesson(null)}
              className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}