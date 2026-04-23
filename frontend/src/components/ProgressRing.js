export default function ProgressRing({ percent = 0, size = 48, strokeWidth = 4, label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color =
    percent >= 80
      ? '#10b981'
      : percent >= 50
      ? '#f59e0b'
      : percent >= 20
      ? '#3b82f6'
      : 'rgba(255,255,255,0.2)';

  return (
    <div className="relative inline-flex items-center justify-center group" title={`${Math.round(percent)}% hoàn thành`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
          style={{
            '--ring-circumference': circumference,
            '--ring-offset': offset,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      {/* Center label */}
      <div
        className="absolute inset-0 flex items-center justify-center text-[9px] font-black"
        style={{ color }}
      >
        {label || `${Math.round(percent)}%`}
      </div>

      {/* Desktop hover tooltip */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.85)',
          color: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {Math.round(percent)}% hoàn thành
      </div>
    </div>
  );
}
