/**
 * RadarChart — SVG radar/spider chart for post-game analytics.
 * Desktop-optimized with hover tooltips on each axis.
 *
 * @param {Array} data - Array of { label, value (0-100), color? }
 * @param {number} size - Chart diameter
 */
export default function RadarChart({ data = [], size = 260 }) {
  const center = size / 2;
  const radius = size / 2 - 30;
  const count = data.length;

  if (count < 3) return null;

  const angleStep = (2 * Math.PI) / count;

  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Background grid rings
  const gridRings = [20, 40, 60, 80, 100];

  // Data polygon points
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const polygonStr = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="radar-chart-area">
        {/* Grid rings */}
        {gridRings.map((ring) => {
          const ringPoints = data
            .map((_, i) => {
              const p = getPoint(i, ring);
              return `${p.x},${p.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const p = getPoint(i, 100);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon fill */}
        <polygon
          points={polygonStr}
          fill="rgba(212, 160, 83, 0.15)"
          stroke="#d4a053"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={data[i].color || '#d4a053'}
            stroke="#1a1a2e"
            strokeWidth={2}
            className="hover-scale-subtle"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const labelPoint = getPoint(i, 120);
          const isLeft = labelPoint.x < center;
          const isTop = labelPoint.y < center;
          return (
            <text
              key={`label-${i}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={isLeft ? 'end' : labelPoint.x === center ? 'middle' : 'start'}
              dominantBaseline={isTop ? 'auto' : 'hanging'}
              className="text-[10px] font-bold uppercase"
              fill="rgba(255,255,255,0.5)"
              style={{ letterSpacing: '0.1em' }}
            >
              {d.label}
            </text>
          );
        })}

        {/* Value labels */}
        {dataPoints.map((p, i) => (
          <text
            key={`val-${i}`}
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            className="text-[9px] font-black"
            fill={data[i].color || '#f0d48a'}
          >
            {data[i].value}
          </text>
        ))}
      </svg>
    </div>
  );
}
