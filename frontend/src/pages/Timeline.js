// frontend/src/pages/Timeline.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Timeline() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/lessons')
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

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  if (loading) {
    return <div className="p-8 text-center text-xl italic text-amber-900">Đang lật mở trang sử...</div>;
  }

  return (
    <div className="p-8 min-h-screen flex flex-col items-center relative">
      <h1 className="historical-title text-4xl mb-4">Dòng Chảy Thời Gian</h1>
      <p className="mb-12 text-gray-700 italic text-lg max-w-lg text-center font-semibold">
        "Nước Việt ta từ xưa vốn là một nước có chủ quyền, có lịch sử hào hùng ngàn năm..."
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {lessons.map((lesson) => (
          <div 
            key={lesson._id} 
            onClick={() => handleLessonClick(lesson)} 
            className="lesson-card flex flex-col items-center justify-center p-8 cursor-pointer relative"
          >
            <span className="text-sm opacity-60 mb-2">{lesson.description?.split('.')[0] || "THỜI ĐẠI"}</span>
            <span className="text-2xl uppercase font-bold">{lesson.title}</span>
          </div>
        ))}
      </div>

      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="historical-card max-w-md w-full animate-bounce-in">
            <h2 className="text-2xl font-bold text-amber-900 mb-2 text-center uppercase">{selectedLesson.title}</h2>
            <p className="text-gray-600 mb-8 text-center italic">"Học sử để hiểu gốc rễ, chơi sử để rèn trí tuệ."</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate(`/study/${selectedLesson._id}`)}
                className="btn-historical w-full py-4 text-xl flex items-center justify-center gap-3"
              >
                📜 Vào Học Thuật
              </button>
              <button 
                onClick={() => navigate(`/play/${selectedLesson._id}`)}
                className="btn-historical w-full py-4 text-xl flex items-center justify-center gap-3 bg-red-800"
              >
                ⚔️ Vào Chinh Phục
              </button>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="mt-4 text-gray-500 font-bold"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button onClick={() => navigate('/leaderboard')} className="mt-16 btn-historical">
        Bảng Phong Thần
      </button>
    </div>
  );
}