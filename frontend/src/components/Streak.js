// frontend/src/components/Streak.js
import React from 'react';

export default function Streak() {
  // Tạm thời mình ghi số 3, sau này số này sẽ lấy từ kho dữ liệu (trường 'streak' của người chơi)
  const currentStreak = 3; 

  return (
    <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-400 shadow-sm">
      <span className="text-2xl animate-pulse">🔥</span>
      <span className="text-orange-800 font-extrabold text-lg">{currentStreak} Ngày</span>
    </div>
  );
}