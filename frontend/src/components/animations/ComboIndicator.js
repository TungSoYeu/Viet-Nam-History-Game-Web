import { useEffect, useState } from 'react';
export default function ComboIndicator({ streak = 0, show = false }) {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (streak > 0 && streak !== displayStreak) {
      setDisplayStreak(streak);
      setKey((k) => k + 1);
    }
    if (streak === 0) {
      const timer = setTimeout(() => setDisplayStreak(0), 500);
      return () => clearTimeout(timer);
    }
  }, [displayStreak, streak]);

  if (!show || displayStreak < 3) return null;

  const level = displayStreak >= 10 ? 'legendary' : displayStreak >= 5 ? 'epic' : 'fire';

  const fireEmoji = level === 'legendary' ? '🌟' : level === 'epic' ? '🔥🔥' : '🔥';
  const labelColor =
    level === 'legendary'
      ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #dc2626)'
      : level === 'epic'
      ? 'linear-gradient(135deg, #f97316, #ef4444)'
      : 'linear-gradient(135deg, #fbbf24, #f59e0b)';

  return (
    <div
      key={key}
      className="combo-badge fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <span className={`text-2xl ${level === 'legendary' ? 'combo-fire' : ''}`}>
        {fireEmoji}
      </span>
      <div>
        <div
          className="text-lg font-black uppercase tracking-[0.12em]"
          style={{
            background: labelColor,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Combo x{displayStreak}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.58)' }}>
          {level === 'legendary' ? 'HUYỀN THOẠI!' : level === 'epic' ? 'XUẤT SẮC!' : 'Chuỗi đúng'}
        </div>
      </div>
    </div>
  );
}
