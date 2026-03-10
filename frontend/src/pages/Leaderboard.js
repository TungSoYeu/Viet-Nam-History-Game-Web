import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const navigate = useNavigate();
  return (
    <div className="p-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="historical-title text-4xl mb-12">Bảng Phong Thần</h1>
      <div className="historical-card w-full max-w-xl">
        <div className="flex flex-col divide-y-2 divide-amber-100">
          <div className="py-5 flex justify-between items-center text-xl font-bold text-amber-900">
            <span className="flex items-center gap-4">
              <span className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-full shadow-sm border border-amber-500">🥇</span> 
              Nam Quốc Sơn Hà
            </span> 
            <span className="font-mono">1500 EXP</span>
          </div>
          <div className="py-4 flex justify-between items-center text-lg text-gray-700 font-semibold">
            <span className="flex items-center gap-4 pl-2">
              <span className="bg-gray-300 w-8 h-8 flex items-center justify-center rounded-full">🥈</span> 
              Cậu Bé Cưỡi Ngựa Tre
            </span> 
            <span className="font-mono">1200 EXP</span>
          </div>
          <div className="py-4 flex justify-between items-center text-lg text-gray-700 font-semibold">
            <span className="flex items-center gap-4 pl-2">
              <span className="bg-orange-300 w-8 h-8 flex items-center justify-center rounded-full">🥉</span> 
              Chim Lạc Nhỏ
            </span> 
            <span className="font-mono">900 EXP</span>
          </div>
        </div>
      </div>
      <button onClick={() => navigate('/timeline')} className="mt-12 btn-historical">
        Về Dòng Thời Gian
      </button>
    </div>
  );
}