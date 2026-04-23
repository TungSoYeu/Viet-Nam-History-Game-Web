import { getRank } from '../data/rankSystem';
export default function AvatarFrame({ avatar, username = '', xp = 0, size = 48 }) {
  const rank = getRank(xp);
  const initial = (username || '?').charAt(0).toUpperCase();

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full ${rank.glowClass} group`}
      style={{
        width: size + 8,
        height: size + 8,
        background: rank.gradient,
        padding: 3,
      }}
      title={`${rank.name} — ${rank.xp} XP`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className="rounded-full object-cover transition-transform group-hover:scale-110"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110"
          style={{
            width: size,
            height: size,
            background: '#1a1a2e',
            color: rank.color,
          }}
        >
          {initial}
        </div>
      )}

      {/* Rank badge */}
      <div
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: rank.gradient,
          boxShadow: `0 2px 8px ${rank.borderColor}`,
          border: '2px solid #1a1a2e',
        }}
      >
        <rank.icon size={10} style={{ color: '#1a1a2e' }} />
      </div>

      {/* Desktop hover tooltip */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
        style={{
          background: 'rgba(0,0,0,0.9)',
          color: rank.color,
          border: `1px solid ${rank.borderColor}`,
        }}
      >
        {rank.name} • {rank.xp} XP
      </div>
    </div>
  );
}
