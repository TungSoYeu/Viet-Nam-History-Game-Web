import { Shield, Award, Crown, Star, Gem } from 'lucide-react';
export const RANKS = [
  {
    id: 'rookie',
    name: 'Tân binh',
    minXP: 0,
    maxXP: 99,
    color: '#b45309',   
    gradient: 'linear-gradient(135deg, #78350f, #b45309)',
    borderColor: 'rgba(180, 83, 9, 0.4)',
    glowClass: '',
    icon: Shield,
  },
  {
    id: 'warrior',
    name: 'Chiến binh',
    minXP: 100,
    maxXP: 499,
    color: '#94a3b8',       
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
    borderColor: 'rgba(148, 163, 184, 0.4)',
    glowClass: '',
    icon: Award,
  },
  {
    id: 'general',
    name: 'Tướng quân',
    minXP: 500,
    maxXP: 1499,
    color: '#fbbf24',       
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    glowClass: 'glow-gold',
    icon: Crown,
  },
  {
    id: 'commander',
    name: 'Đại tướng',
    minXP: 1500,
    maxXP: 4999,
    color: '#38bdf8',       
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    glowClass: 'glow-gold',
    icon: Star,
  },
  {
    id: 'legend',
    name: 'Quốc sĩ',
    minXP: 5000,
    maxXP: Infinity,
    color: '#f0d48a',       
    gradient: 'linear-gradient(135deg, #d4a053, #f0d48a, #d4a053)',
    borderColor: 'rgba(212, 160, 83, 0.5)',
    glowClass: 'glow-legendary',
    icon: Gem,
  },
];
export function getRank(xp = 0) {
  const numXp = Number(xp) || 0;
  let rank = RANKS[0];

  for (const r of RANKS) {
    if (numXp >= r.minXP) rank = r;
    else break;
  }

  const nextRank = RANKS[RANKS.indexOf(rank) + 1] || null;
  const progressInRank = numXp - rank.minXP;
  const rankRange = (nextRank ? nextRank.minXP : rank.minXP + 1000) - rank.minXP;
  const progressPercent = Math.min(100, (progressInRank / rankRange) * 100);

  return {
    ...rank,
    xp: numXp,
    nextRank,
    progressInRank,
    rankRange,
    progressPercent,
  };
}
export function formatXP(xp) {
  return Number(xp || 0).toLocaleString('vi-VN');
}
