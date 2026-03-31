import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import API_BASE_URL from '../config/api';

function FlashcardItem({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const parts = card.back.split('BẠN CÓ BIẾT:');
  const mainAnswer = parts[0];
  const funFact = parts[1];

  return (
    <div 
      className={`flashcard-container h-80 perspective-1000 ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative w-full h-full transform-style-3d">
        {/* Front */}
        <div className="flashcard-front p-8 backface-hidden shadow-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
          <div className="w-12 h-1 mb-6 opacity-30" style={{ background: 'rgba(212,160,83,0.8)' }}></div>
          <h3 className="text-xl sm:text-2xl riddle-text text-center font-serif italic text-white">
            "{card.front}"
          </h3>
          <div className="w-12 h-1 mt-6 opacity-30" style={{ background: 'rgba(212,160,83,0.8)' }}></div>
          <div className="absolute bottom-4 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'rgba(212,160,83,0.4)' }}>
            Chạm để lật mở bí mật
          </div>
        </div>
        
        {/* Back */}
        <div className="flashcard-back p-8 backface-hidden shadow-2xl overflow-y-auto" style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
          <div className="text-center mb-4">
              <span className="text-[10px] uppercase tracking-tighter opacity-60 mb-1 block text-gray-400">Lời giải</span>
              <h4 className="text-2xl back-answer text-amber-400 font-black">{mainAnswer}</h4>
          </div>
          
          {funFact && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <span className="font-black text-amber-400 not-italic block mb-1">BẠN CÓ BIẾT?</span>
              <p className="text-slate-300 italic text-lg leading-relaxed">{funFact.trim()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudyDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('wiki');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => {
        const current = data.find(l => l._id === lessonId);
        setLesson(current);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) return <div className="p-8 text-center italic text-amber-500 min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Đang lật mở trang sử...</div>;
  if (!lesson) return <div className="p-8 text-center text-red-400 min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>Không tìm thấy tư liệu về thời kỳ này.</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen max-w-4xl mx-auto flex flex-col" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-6 sm:mb-8">
        <div className="flex justify-center sm:justify-start">
          <button onClick={() => navigate('/timeline')} className="btn-primary px-4 py-2 text-sm shrink-0">📜 Quay lại</button>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{lesson.title}</h1>
        <div className="hidden sm:flex justify-end pr-2 text-xs font-bold text-slate-400">Đọc Hiểu</div>
      </div>

      <div className="flex mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setActiveTab('wiki')}
          className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 font-bold transition text-sm sm:text-base ${activeTab === 'wiki' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
          style={activeTab === 'wiki' ? { borderBottom: '3px solid rgba(212,160,83,0.8)' } : {}}
        >
          SỬ KÝ (WIKI)
        </button>
        <button 
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 font-bold transition text-sm sm:text-base ${activeTab === 'flashcards' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
          style={activeTab === 'flashcards' ? { borderBottom: '3px solid rgba(212,160,83,0.8)' } : {}}
        >
          THẺ GHI NHỚ
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {activeTab === 'wiki' ? (
          <div className="prose prose-invert prose-amber max-w-none">
            {lesson.wiki?.content ? (
              <ReactMarkdown>{lesson.wiki.content}</ReactMarkdown>
            ) : (
              <p className="italic" style={{ color: 'rgba(255,255,255,0.4)' }}>Đang cập nhật nội dung lịch sử cho triều đại này...</p>
            )}
            
            {lesson.wiki?.images?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {lesson.wiki.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Tư liệu" className="rounded-lg shadow-md" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {lesson.flashcards?.length > 0 ? (
              lesson.flashcards.map((card, idx) => (
                <FlashcardItem key={idx} card={card} />
              ))
            ) : (
              <p className="col-span-2 text-center italic py-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Chưa có thẻ ghi nhớ cho triều đại này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
