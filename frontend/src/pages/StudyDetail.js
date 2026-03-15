import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function StudyDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('wiki'); // wiki or flashcards
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/lessons`)
      .then(res => res.json())
      .then(data => {
        const current = data.find(l => l._id === lessonId);
        setLesson(current);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) return <div className="p-8 text-center italic text-amber-900">Đang lật mở trang sử...</div>;
  if (!lesson) return <div className="p-8 text-center text-red-800">Không tìm thấy tư liệu về thời kỳ này.</div>;

  return (
    <div className="p-6 min-h-screen max-w-4xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/timeline')} className="btn-historical px-4 py-2">📜 Quay lại</button>
        <h1 className="text-3xl font-bold text-amber-900">{lesson.title}</h1>
        <div className="w-24"></div>
      </div>

      <div className="flex border-b-2 border-amber-200 mb-6">
        <button 
          onClick={() => setActiveTab('wiki')}
          className={`px-8 py-3 font-bold transition ${activeTab === 'wiki' ? 'border-b-4 border-amber-700 text-amber-800 bg-amber-50' : 'text-gray-500'}`}
        >
          SỬ KÝ (WIKI)
        </button>
        <button 
          onClick={() => setActiveTab('flashcards')}
          className={`px-8 py-3 font-bold transition ${activeTab === 'flashcards' ? 'border-b-4 border-amber-700 text-amber-800 bg-amber-50' : 'text-gray-500'}`}
        >
          THẺ GHI NHỚ
        </button>
      </div>

      <div className="historical-card flex-1 p-8 overflow-y-auto bg-white bg-opacity-90">
        {activeTab === 'wiki' ? (
          <div className="prose prose-amber max-w-none">
            {lesson.wiki?.content ? (
              <ReactMarkdown>{lesson.wiki.content}</ReactMarkdown>
            ) : (
              <p className="italic text-gray-500">Đang cập nhật nội dung lịch sử cho triều đại này...</p>
            )}
            
            {lesson.wiki?.images?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {lesson.wiki.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Tư liệu" className="rounded-lg shadow-md border-2 border-amber-100" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {lesson.flashcards?.length > 0 ? (
              lesson.flashcards.map((card, idx) => {
                const parts = card.back.split('💡 Fun Fact:');
                const mainAnswer = parts[0];
                const funFact = parts[1];

                return (
                  <div key={idx} className="flashcard-container h-80 perspective-1000 cursor-pointer">
                    <div className="relative w-full h-full transform-style-3d">
                      {/* Front */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 flashcard-front rounded-2xl backface-hidden shadow-xl">
                        <div className="w-12 h-1 bg-amber-800 mb-6 opacity-30"></div>
                        <h3 className="text-xl sm:text-2xl riddle-text text-center font-serif italic">
                          "{card.front}"
                        </h3>
                        <div className="w-12 h-1 bg-amber-800 mt-6 opacity-30"></div>
                        <div className="absolute bottom-4 text-[10px] uppercase tracking-widest text-amber-900 opacity-40 font-bold">
                          Chạm để lật mở bí mật
                        </div>
                      </div>
                      
                      {/* Back */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 flashcard-back rounded-2xl backface-hidden rotate-y-180 shadow-2xl overflow-y-auto">
                        <div className="text-center mb-4">
                            <span className="text-[10px] uppercase tracking-tighter opacity-60 mb-1 block">Lời giải</span>
                            <h4 className="text-2xl back-answer">{mainAnswer}</h4>
                        </div>
                        
                        {funFact && (
                          <div className="fun-fact-box w-full text-sm leading-relaxed text-amber-100 italic">
                            <span className="font-black text-amber-400 not-italic block mb-1">💡 BẠN CÓ BIẾT?</span>
                            {funFact}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-2 text-center italic text-gray-500 py-12">Chưa có thẻ ghi nhớ cho triều đại này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
