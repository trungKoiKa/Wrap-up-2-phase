export default function ScoreRing({ pct, size = 132 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2
  const c = 2 * Math.PI * r
  const color = pct >= 80 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)'
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Đạt ${pct} phần trăm`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <span className="tabular absolute inset-0 grid place-items-center text-3xl font-extrabold" style={{ color }}>
        {pct}%
      </span>
    </div>
  )
}
