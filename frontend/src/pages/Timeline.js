// frontend/src/pages/Timeline.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Timeline() {
  const navigate = useNavigate();

  const goToGame = (lessonId) => {
    navigate(`/play/${lessonId}`);
  };

  return (
    <div className="p-8 min-h-screen flex flex-col items-center">
      <h1 className="historical-title text-4xl mb-4">Dòng Chảy Thời Gian</h1>
      <p className="mb-12 text-gray-700 italic text-lg max-w-lg text-center font-semibold">
        "Nước Việt ta từ xưa vốn là một nước có chủ quyền, có lịch sử hào hùng ngàn năm..."
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div onClick={() => goToGame('dinh')} className="lesson-card flex flex-col items-center justify-center p-8">
          <span className="text-sm opacity-60 mb-2">THẾ KỶ X</span>
          <span className="text-2xl">NHÀ ĐINH</span>
        </div>
        <div onClick={() => goToGame('tien-le')} className="lesson-card flex flex-col items-center justify-center p-8">
          <span className="text-sm opacity-60 mb-2">THẾ KỶ X</span>
          <span className="text-2xl">NHÀ TIỀN LÊ</span>
        </div>
        <div onClick={() => goToGame('ly')} className="lesson-card flex flex-col items-center justify-center p-8 md:col-span-2">
          <span className="text-sm opacity-60 mb-2">THẾ KỶ XI - XIII</span>
          <span className="text-2xl">NHÀ LÝ</span>
        </div>
      </div>
      
      <button onClick={() => navigate('/leaderboard')} className="mt-16 btn-historical">
        Bảng Phong Thần
      </button>
    </div>
  );
}