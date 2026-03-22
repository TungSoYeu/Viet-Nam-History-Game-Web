// frontend/src/components/Streak.js
import React from 'react';
import { Zap } from 'lucide-react';

export default function Streak({ count = 0 }) {
  return (
    <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-400 shadow-sm">
      <Zap size={24} className="text-orange-600 fill-orange-600 animate-pulse" />
      <span className="text-orange-800 font-extrabold text-lg">{count} Ngày</span>
    </div>
  );
}