// frontend/src/pages/GamePlay.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Questions from '../components/Questions';
import Lives from '../components/Lives';

export default function GamePlay() {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen max-w-2xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate('/timeline')} 
          className="text-deep-bronze font-bold flex items-center gap-2 hover:opacity-70 transition"
        >
          <span className="text-xl">📜</span> Dòng Thời Gian
        </button>
        <div className="flex-1 bg-amber-100 h-3 rounded-full mx-8 border border-amber-200 shadow-inner">
          <div className="bg-yellow-600 h-3 rounded-full w-1/3 shadow-sm"></div>
        </div>
        <Lives />
      </div>

      <div className="historical-card flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-4 border-b-2 border-amber-100 w-full">
          <span className="text-amber-800 font-bold tracking-widest uppercase text-sm">CÂU HỎI THỬ THÁCH</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-10 leading-relaxed px-4 italic">
          "Ai là người lãnh đạo nhân dân ta đánh thắng quân Nam Hán trên sông Bạch Đằng năm 938?"
        </h2>
        <div className="w-full">
          <Questions />
        </div>
      </div>
    </div>
  );
}