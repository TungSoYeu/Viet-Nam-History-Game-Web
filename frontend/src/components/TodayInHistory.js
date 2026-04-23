import { useState, useEffect } from 'react';
import { Calendar, Scroll } from 'lucide-react';
import { getTodayEvent, getRandomEvent } from '../data/historicalEvents';
export default function TodayInHistory({ className = '' }) {
  const [event, setEvent] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setEvent(getTodayEvent());
  }, []);

  const handleRefresh = () => {
    setEvent(getRandomEvent());
  };

  if (!event) return null;

  const [month, day] = event.date.split('-');
  const categoryColors = {
    'Quân sự': '#ef4444',
    'Chính trị': '#3b82f6',
    'Khởi nghĩa': '#f59e0b',
    'Cách mạng': '#dc2626',
    'Văn hóa': '#10b981',
    'Danh nhân': '#d4a053',
    'Ngoại giao': '#8b5cf6',
    'Tưởng niệm': '#6b7280',
  };

  const catColor = categoryColors[event.category] || '#d4a053';

  return (
    <div
      className={`hover-lift rounded-2xl overflow-hidden cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(25,28,38,0.8) 0%, rgba(35,38,52,0.7) 100%)',
        border: '1px solid rgba(212,160,83,0.15)',
        backdropFilter: 'blur(16px)',
        maxWidth: 280,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,160,83,0.12)', border: '1px solid rgba(212,160,83,0.2)' }}
        >
          <Calendar size={14} style={{ color: '#d4a053' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Hôm nay
          </div>
          <div className="text-xs font-bold text-white mt-0.5">
            Ngày {day} tháng {month}
          </div>
        </div>
        <div
          className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex-shrink-0"
          style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}30` }}
        >
          {event.category}
        </div>
      </div>

      {/* Event content */}
      <div className="px-3 py-3">
        <div className="flex items-start gap-2">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center"
            style={{
              background: 'rgba(212,160,83,0.08)',
              border: '1px solid rgba(212,160,83,0.15)',
            }}
          >
            <span className="text-sm font-black" style={{ color: '#f0d48a' }}>{event.year}</span>
          </div>
          <p
            className="text-[11px] leading-snug flex-1"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {event.event}
          </p>
        </div>

        {expanded && (
          <div className="mt-2 pt-2 border-t flex justify-between items-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1 text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Scroll size={10} />
              Sự kiện khác
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleRefresh(); }}
              className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border border-[#d4a053]/30 hover:bg-[#d4a053]/20 transition-colors"
              style={{
                background: 'rgba(212,160,83,0.1)',
                color: '#d4a053',
              }}
            >
              Cập nhật
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
