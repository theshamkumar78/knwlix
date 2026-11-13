import { useId } from "react";

export default function ProgressRing({
  pct, size = 64, stroke = 6, color = "#5eead4", gradient = false,
}: { pct: number; size?: number; stroke?: number; color?: string; gradient?: boolean }) {
  const gid = "g" + useId().replace(/:/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct} percent complete`}>
      {gradient && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      )}
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth={stroke} />
      <circle
        cx={mid} cy={mid} r={r} fill="none"
        stroke={gradient ? `url(#${gid})` : color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <text x="50%" y="50%" dy=".35em" textAnchor="middle" fill="#fff" fontWeight="700" fontSize={size * 0.22}>{pct}%</text>
    </svg>
  );
}