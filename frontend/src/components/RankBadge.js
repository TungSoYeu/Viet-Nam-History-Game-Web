import { formatXP, getRank } from '../data/rankSystem';

export default function RankBadge({ xp = 0, compact = false }) {
  const rank = getRank(xp);
  const nextLabel = rank.nextRank ? rank.nextRank.name : 'Tối đa';

  return (
    <div className="group relative inline-flex">
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-black ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
        style={{
          background: 'rgba(15,23,42,0.72)',
          borderColor: rank.borderColor,
          color: rank.color,
          boxShadow: `0 0 0 1px ${rank.borderColor} inset`,
        }}
      >
        <rank.icon size={compact ? 12 : 14} />
        <span className="uppercase tracking-[0.16em]">{rank.name}</span>
      </div>

      <div
        className="absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-2xl border px-4 py-3 opacity-0 transition-opacity pointer-events-none group-hover:opacity-100"
        style={{
          background: 'rgba(2,6,23,0.96)',
          borderColor: rank.borderColor,
          boxShadow: '0 18px 48px rgba(0,0,0,0.38)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: rank.color }}>
            {rank.name}
          </div>
          <div className="text-[10px] font-bold text-white/60">{formatXP(rank.xp)} XP</div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${rank.progressPercent}%`,
              background: rank.gradient,
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
          <span className="text-white/58">Tiến độ</span>
          <span style={{ color: rank.color }}>{Math.round(rank.progressPercent)}%</span>
        </div>
        <div className="mt-1 text-[10px] text-white/58">
          Hạng kế: <span className="font-bold text-white/75">{nextLabel}</span>
        </div>
      </div>
    </div>
  );
}
