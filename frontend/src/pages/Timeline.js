// frontend/src/pages/Timeline.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Trophy, ChevronRight, ScrollText } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { buildApiHeaders, buildApiUrl } from '../utils/classroomContext';

const THEME4_CARD = {
  id: 'theme-4',
  badge: 'Chủ đề 4',
  title: 'Chiến tranh Bảo vệ Tổ quốc và giải phóng dân tộc',
  subtitle: 'trước Cách mạng tháng Tám năm 1945',
  description:
    'Bấm để mở 2 học phần của chủ đề và vào phần học thuật tương ứng.',
};

export default function Timeline() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showTheme4Lessons, setShowTheme4Lessons] = useState(false);

  useEffect(() => {
    fetch(buildApiUrl('/api/lessons'), {
      headers: buildApiHeaders({ includeJson: false }),
    })
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
        <header className="parchment-panel max-w-4xl mx-auto mb-10 rounded-[32px] px-6 py-7 text-center sm:px-10">
          <div className="mb-3 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em]"
              style={{
                color: 'rgba(240, 212, 138, 0.88)',
                background: 'rgba(18, 20, 28, 0.28)',
                border: '1px solid rgba(255, 248, 220, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <BookOpen size={14} strokeWidth={1.8} />
              <span>Thư viện</span>
            </div>
          </div>
          {showTheme4Lessons ? (
            <>
              <h1 className="historical-title mb-2 text-white" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {THEME4_CARD.badge}: {THEME4_CARD.title}
              </h1>
              <p className="parchment-text-soft text-sm max-w-3xl mx-auto">
                {THEME4_CARD.subtitle}
              </p>
            </>
          ) : (
            <>
              <h1 className="historical-title mb-2 text-white" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dòng Chảy Thời Gian
              </h1>
              <p className="parchment-text-soft text-sm max-w-lg mx-auto">
                Chọn một chủ đề để mở các học phần và nội dung học thuật tương ứng.
              </p>
            </>
          )}
        </header>

        {showTheme4Lessons ? (
          <>
            <div className="max-w-3xl mx-auto mb-6">
              <button
                onClick={() => {
                  setShowTheme4Lessons(false);
                  setSelectedLesson(null);
                }}
                className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              >
                <ArrowLeft size={16} /> Quay lại Chủ đề
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 stagger-children">
              {lessons.map((lesson, idx) => (
                <div 
                  key={lesson._id} 
                  onClick={() => setSelectedLesson(lesson)} 
                  className="parchment-panel-soft group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up opacity-0 overflow-hidden"
                  style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: 'var(--gradient-hero)' }}></div>
                  <span className="text-xs font-semibold block mb-1" style={{ color: 'rgba(212,160,83,0.8)' }}>{lesson.description?.split('.')[0] || "HỌC PHẦN"}</span>
                  <span className="parchment-text-strong text-lg font-bold group-hover:text-amber-300 transition-colors">{lesson.title}</span>
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto mb-12">
            <div
              onClick={() => setShowTheme4Lessons(true)}
              className="parchment-panel group relative overflow-hidden rounded-3xl cursor-pointer p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full opacity-20 blur-2xl" style={{ background: 'radial-gradient(circle, rgba(212,160,83,0.35) 0%, transparent 70%)' }}></div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                    <ScrollText size={14} />
                    {THEME4_CARD.badge}
                  </div>
                  <h2 className="parchment-text-strong mt-4 text-2xl sm:text-3xl font-black group-hover:text-amber-200 transition-colors">
                    {THEME4_CARD.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base font-semibold" style={{ color: 'rgba(240,212,138,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.22)' }}>
                    ({THEME4_CARD.subtitle})
                  </p>
                  <p className="parchment-text-soft mt-4 text-sm sm:text-base leading-relaxed">
                    {THEME4_CARD.description}
                  </p>
                  <div className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    {lessons.length} học phần
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:translate-x-1" style={{ background: 'rgba(212,160,83,0.14)', border: '1px solid rgba(212,160,83,0.25)' }}>
                    <ChevronRight size={28} className="text-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
