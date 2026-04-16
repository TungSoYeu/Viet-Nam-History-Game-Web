import { useEffect, useState } from 'react';

const COLORS = [
  '#d4a053', '#f0d48a', '#b91c1c', '#ef4444',
  '#fbbf24', '#f59e0b', '#fde68a', '#dc2626',
];

const SHAPES = ['■', '●', '▲', '◆', '★'];

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}
export default function Confetti({ active = false, count = 50, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: randomBetween(5, 95),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: randomBetween(8, 18),
      duration: randomBetween(2, 4),
      delay: randomBetween(0, 0.8),
    }));

    setParticles(items);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 4500);

    return () => clearTimeout(timer);
  }, [active, count, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            color: p.color,
            fontSize: p.size,
            '--fall-duration': `${p.duration}s`,
            '--fall-delay': `${p.delay}s`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  );
}
