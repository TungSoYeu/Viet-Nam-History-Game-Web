import { useState, useEffect, useRef } from 'react';
export default function AnimatedCounter({ end = 0, suffix = '', label = '', duration = 2000, icon }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);

  return (
    <div
      ref={ref}
      className="counter-stat hover-glow-gold rounded-2xl p-6 text-center cursor-default"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(212,160,83,0.15)',
        backdropFilter: 'blur(12px)',
        minWidth: 160,
      }}
    >
      {icon && <div className="mb-2 flex justify-center opacity-60">{icon}</div>}
      <div
        className="text-4xl lg:text-5xl font-black"
        style={{
          background: 'linear-gradient(135deg, #f0d48a, #d4a053)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {count}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.18em] font-bold mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </div>
    </div>
  );
}
