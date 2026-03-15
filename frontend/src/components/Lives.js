import React from 'react';
import { Flame } from 'lucide-react';

export default function Lives({ count }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 px-4 py-1 rounded-full shadow-inner flex items-center gap-2">
      <span className="text-xs text-amber-800 font-bold uppercase tracking-tighter">Sinh Mệnh:</span>
      <div className="flex gap-1">
        {Array.from({ length: Math.max(0, count) }).map((_, i) => (
          <Flame key={i} size={20} className="text-red-600 fill-red-600" />
        ))}
      </div>
    </div>
  );
}