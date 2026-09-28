// مكوّنات واجهة مشتركة لشاشات التجربة التفاعلية
import type { ReactNode } from 'react';
import type { Car } from './data';

/* لوحة مرور مصرية معدنية */
export function Plate({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' }) {
  const inner = size === 'sm' ? 'px-1.5 py-[2px] text-[10px]' : 'px-2.5 py-[3px] text-xs';
  return (
    <span dir="ltr" className="inline-flex flex-col items-stretch overflow-hidden rounded-[6px] border border-black/25 bg-white leading-none text-black shadow-sm">
      <span className="flex items-center justify-between bg-[#0B3D91] px-2 py-[2px] text-[6px] font-bold tracking-[0.25em] text-white">
        <span>س ج د</span><span>EGYPT</span>
      </span>
      <span className={`cluster-font font-bold ${inner}`}>{code}</span>
    </span>
  );
}

/* شارة قسم */
export function SectionTitle({ eyebrow, title, after }: { eyebrow?: string; title: string; after?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        {eyebrow && <p className="cluster-font mb-1 text-[11px] font-bold tracking-[0.25em]" style={{ color: 'var(--teal)' }}>{eyebrow}</p>}
        <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
      </div>
      {after}
    </div>
  );
}

/* شارة مباشر */
export function LiveChip({ label = 'مباشر' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'var(--green)' }}>
      <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: 'var(--green)' }} />
      {label}
    </span>
  );
}

/* خريطة طريق مصغرة */
export function PickupMap({ from, to, coords }: { from: string; to: string; coords: string }) {
  return (
    <div className="map-grid relative h-[148px] overflow-hidden rounded-xl border">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 220 96" preserveAspectRatio="none" aria-hidden>
        <circle cx="30" cy="26" r="8" fill="var(--teal)" opacity="0.85" />
        <circle cx="30" cy="26" r="2.6" fill="#fff" />
        <circle cx="190" cy="68" r="8" fill="var(--amber)" opacity="0.92" />
        <circle cx="190" cy="68" r="2.6" fill="#fff" />
        <path className="route-dash" d="M32 28 C80 18 150 46 188 66" stroke="var(--teal)" strokeWidth="2.5" fill="none" />
      </svg>
      <span dir="ltr" className="cluster-font absolute left-1.5 top-1.5 rounded bg-[#0B0E12]/85 px-2 py-0.5 text-[10px] text-teal">{coords}</span>
      <span className="absolute right-1.5 top-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-[#0B3D91]">{from}</span>
      <span className="absolute bottom-1.5 right-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: 'var(--amber)' }}>{to}</span>
    </div>
  );
}
/* شريط تتبع الطرق السريعة */
export function EgHighwayTicker({ items, label = 'EG-HIGHWAY // 2025' }: { items: string[]; label?: string }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden border-b py-1.5" style={{ background: 'var(--surface-2)' }}>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: 'var(--teal)' }}>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        {label}
      </span>
      <div className="relative flex-1 overflow-hidden" dir="ltr">
        <div className="ticker-track">
          {[0, 1].map((dup) =>
            items.map((item) => (
              <span key={`${dup}-${item}`} className="cluster-font shrink-0 text-[11px] text-dim">
                {item} <span style={{ color: 'var(--amber)' }}>◆</span>
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

/* مؤشر النسب الميداني */
export function ProgressMeter({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="fade-up">
      <div className="flex items-end justify-between gap-2">
        <p className="text-sm font-bold">{label}</p>
        <p className="cluster-font text-lg font-bold" style={{ color: 'var(--teal)' }}>{value.toFixed(1)}%</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div className="meter-fill h-full rounded-full" style={{ width: `${value}%`, background: 'linear-gradient(90deg, var(--teal), var(--amber))' }} />
      </div>
      {sub && <p className="mt-1.5 text-[11px] leading-5 text-dim">{sub}</p>}
    </div>
  );
}

/* عداد الطريق الرقمي (Instrument Cluster) */
export function ClusterCell({ label, value, suffix, accent }: { label: string; value: string; suffix?: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
      <p className="text-[10px] text-white/50">{label}</p>
      <p className="cluster-font mt-1 text-lg font-bold" style={accent ? { color: '#F2A93C' } : { color: '#EDEFF3' }}>
        {value}
        {suffix && <span className="ms-1 text-[10px] font-normal text-white/50">{suffix}</span>}
      </p>
    </div>
  );
}

export function Cluster({ title, cells, totalLabel, totalValue }: { title: string; cells: { label: string; value: string; suffix?: string; accent?: boolean }[]; totalLabel?: string; totalValue?: string }) {
  return (
    <div className="cluster-grid relative overflow-hidden rounded-2xl border p-4 sm:p-5" style={{ background: '#0B0E12', borderColor: 'rgba(58,166,166,.4)' }}>
      <span className="scan-line absolute inset-x-0 top-0" />
      <div className="mb-3 flex items-center justify-between">
        <p className="cluster-font text-[10px] font-bold tracking-[0.25em]" style={{ color: '#3AA6A6' }}>{title}</p>
        <span className="cluster-font flex items-center gap-1.5 text-[9px] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#4CAF7D' }} />CLUSTER LIVE
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cells.map((c) => <ClusterCell key={c.label} {...c} />)}
      </div>
      {totalLabel && totalValue && (
        <div className="mt-3 flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: 'rgba(242,169,60,.45)', background: 'rgba(242,169,60,.09)' }}>
          <p className="cluster-font text-[11px] tracking-wider text-white/70">{totalLabel}</p>
          <p className="cluster-font text-xl font-bold" style={{ color: '#F2A93C' }}>{totalValue}</p>
        </div>
      )}
    </div>
  );
}
/* رسم سيارة جانبي مسطح حسب النوع واللون */
const COLOR_HEX: Record<string, string> = {
  'أسود معدني': '#33383F',
  'أبيض لؤلؤي': '#E8EBF0',
  'رمادي فحمي': '#565C64',
  'فضي': '#C6CDD5',
};

export function CarArt({ car, className = 'h-28 w-full' }: { car: Car; className?: string }) {
  const body = COLOR_HEX[car.color] ?? '#3A6EA8';
  const isSuv = car.type === 'suv';
  const glass = '#20262E';
  return (
    <svg viewBox="0 0 220 96" className={className} aria-hidden="true">
      <ellipse cx="110" cy="84" rx="102" ry="6" fill="rgba(0,0,0,.16)" />
      {isSuv ? (
        <>
          <path d="M14 62 Q12 54 24 53 L40 53 Q52 53 58 44 L86 26 Q94 22 106 22 L158 22 Q176 22 188 36 L196 44 Q212 48 213 57 L213 63 Q210 66 206 66 L200 66 Q198 70 190 70 L44 70 Q38 70 36 66 L28 66 Q24 66 22 70 L18 70 Q16 70 14 62 Z" fill={body} />
          <path d="M52 66 L72 30 Q76 25 88 25 L136 25 Q146 25 156 36 L166 50 Q170 58 170 66 Z" fill={glass} />
          <path d="M86 25 V21 M140 25 V21" stroke={body} strokeWidth="2.5" />
        </>
      ) : (
        <>
          <path d="M16 62 Q14 54 24 53 L40 53 Q50 53 56 46 L74 30 Q80 26 92 26 L152 26 Q170 26 182 40 L190 44 Q208 48 210 57 L210 63 Q207 66 204 66 L198 66 Q196 70 188 70 L46 70 Q40 70 38 66 L28 66 Q24 66 22 70 L18 70 Q16 70 16 62 Z" fill={body} />
          <path d="M50 66 L66 34 Q70 30 80 30 L122 30 Q132 30 142 40 L152 56 Q155 61 155 66 Z" fill={glass} />
        </>
      )}
      <path d="M24 53 H196" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      <circle cx={isSuv ? 56 : 58} cy="74" r={isSuv ? 16 : 15} fill="#14161A" />
      <circle cx={isSuv ? 56 : 58} cy="74" r={isSuv ? 6.5 : 6} fill="#3A3F46" />
      <circle cx={isSuv ? 172 : 178} cy="74" r={isSuv ? 16 : 15} fill="#14161A" />
      <circle cx={isSuv ? 172 : 178} cy="74" r={isSuv ? 6.5 : 6} fill="#3A3F46" />
      <path d={isSuv ? 'M126 62 H164' : 'M136 56 H154'} stroke="rgba(0,0,0,.3)" strokeWidth="1" />
      <text x="170" y={isSuv ? '46' : '52'} fontSize="7" fontFamily="JetBrains Mono, monospace" fill="rgba(255,255,255,.55)" letterSpacing="1">
        {car.brand}
      </text>
    </svg>
  );
}

/* رمز استجابة سريعة عالي الدقة — نمط مولد من كود الحجز */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function QRView({ code, size = 128 }: { code: string; size?: number }) {
  const n = 25;
  const seed = [...code].reduce((acc, ch) => acc + ch.charCodeAt(0), 7);
  const rand = mulberry(seed);
  const cells: boolean[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => rand() > 0.5));
  for (let i = 0; i < n; i++) {
    if (i < 8 || i >= n - 8) continue;
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }
  const finder = (r: number, c: number) => {
    for (let i = -1; i < 8; i++) {
      for (let j = -1; j < 8; j++) {
        const rr = r + i;
        const cc = c + j;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        const inBox = i >= 0 && i < 7 && j >= 0 && j < 7;
        if (!inBox) continue;
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        cells[rr][cc] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (cells[r][c]) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} role="img" aria-label={`رمز استجابة رمزي ${code}`} className="rounded-md border border-black/10 bg-white p-1">
      <rect width={n} height={n} fill="#fff" />
      <path d={d} fill="#0B0E12" />
    </svg>
  );
}

/* مؤشر المراحل الثلاث للطريق السريع */
export function Stepper({ steps, current, onGo }: { steps: string[]; current: number; onGo?: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              onClick={() => onGo?.(i)}
              className="flex items-center gap-2 text-start"
              style={{ cursor: onGo ? 'pointer' : 'default' }}
              aria-current={active ? 'step' : undefined}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold"
                style={
                  done || active
                    ? { background: 'var(--amber)', borderColor: 'var(--amber)', color: '#fff' }
                    : { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--dim)' }
                }
              >
                <span className="cluster-font">{done ? '✓' : `0${i + 1}`}</span>
              </span>
              <span className={`hidden text-xs font-bold sm:block ${active ? '' : 'text-dim'}`}>{label}</span>
            </button>
            {i < steps.length - 1 && <span className="road-strip h-[2px] min-w-6 flex-1 opacity-60" />}
          </li>
        );
      })}
    </ol>
  );
}