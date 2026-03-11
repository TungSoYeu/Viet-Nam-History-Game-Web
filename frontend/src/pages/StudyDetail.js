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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lesson.flashcards?.length > 0 ? (
              lesson.flashcards.map((card, idx) => (
                <div key={idx} className="flashcard-container group h-64 perspective-1000">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                    {/* Front */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-amber-50 border-2 border-amber-200 rounded-xl backface-hidden shadow-md">
                      <span className="text-xs text-amber-600 mb-2 uppercase tracking-widest">Nhân vật/Sự kiện</span>
                      <h3 className="text-2xl font-bold text-center text-amber-900">{card.front}</h3>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-amber-800 text-white rounded-xl backface-hidden rotate-y-180 shadow-md overflow-y-auto">
                      <span className="text-xs opacity-70 mb-2 uppercase tracking-widest">Sử ký ghi nhận</span>
                      <p className="text-center italic leading-relaxed">{card.back}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center italic text-gray-500">Chưa có thẻ ghi nhớ cho triều đại này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
