import React from 'react';
export default function Lives({ count }) {
  const candles = "🕯️".repeat(Math.max(0, count));
  return (
    <div className="bg-amber-50 border-2 border-amber-200 px-4 py-1 rounded-full shadow-inner flex items-center gap-2">
      <span className="text-xs text-amber-800 font-bold uppercase tracking-tighter">Sinh Mệnh:</span>
      <span className="text-red-600 font-bold text-xl tracking-widest drop-shadow-sm">{candles}</span>
    </div>
  );
}