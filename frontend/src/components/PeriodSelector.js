import React, { useState, useEffect } from 'react';

export default function PeriodSelector({ onSelect, onBack, title, description }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center text-amber-900 font-bold">Đang tải danh sách triều đại...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
      <div className="max-w-4xl w-full text-center">
        <h1 className="historical-title text-4xl mb-4">{title || "Chọn Thời Kỳ Tu Luyện"}</h1>
        <p className="mb-8 text-gray-700 italic">{description || "Chọn một triều đại cụ thể hoặc thử thách bản thân với kiến thức tổng hợp."}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {/* Option: Advanced / All Periods */}
          <div 
            onClick={() => onSelect('all')}
            className="p-6 rounded-xl border-4 border-red-800 bg-red-100 shadow-xl cursor-pointer transform transition hover:-translate-y-2 hover:bg-red-200 flex flex-col items-center justify-center text-center"
          >
            <span className="text-4xl mb-2">🔥</span>
            <h3 className="text-xl font-black text-red-900 uppercase">Nâng Cao</h3>
            <p className="text-sm text-red-800 font-bold">Tổng hợp mọi thời kỳ</p>
          </div>

          {/* Individual Lessons */}
          {lessons.map((lesson) => (
            <div 
              key={lesson._id}
              onClick={() => onSelect(lesson._id)}
              className="p-6 rounded-xl border-2 border-amber-800 bg-white shadow-md cursor-pointer transform transition hover:-translate-y-1 hover:bg-amber-50 flex flex-col items-center justify-center text-center"
            >
              <span className="text-3xl mb-2">📜</span>
              <h3 className="text-lg font-bold text-amber-900">{lesson.title}</h3>
              <p className="text-xs text-amber-800 line-clamp-2">{lesson.description}</p>
            </div>
          ))}
        </div>

        <button 
            onClick={onBack}
            className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
        >
            Quay lại Sa Bàn
        </button>
      </div>
    </div>
  );
}
