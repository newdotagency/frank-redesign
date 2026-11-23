// LineBurst — animaapp.com's hero lines + mini stars, retold for Frank.
// Anima: a starburst of thin gradient lines that draw on, then erase from their start
// (~3.6s + ~3.4s, staggered, ~11s loop), plus tiny 4-point stars that twinkle fast
// (opacity 0→1 in 3 frames, gone by frame 8; scale .6→1).
// Frank: the rays leave the chat input and travel out to the edges — a question going out
// to many customers — and as each ray reaches its end a mini star twinkles there (an answer
// lands). A few more stars twinkle on their own in the gutters.
// CSS animations (predetermined motion, runs off the main thread): stroke-dashoffset on
// pathLength=1 lines, transform + opacity on the stars. Behind all content, aria-hidden.
// Reduced motion: rays shown still and faint, stars only fade (no scale/rotation).
import { useLayoutEffect, useState } from 'react';

const VIOLET = '#ba86fc', GREEN = '#a0d05f', INK = '#1a1714';
const CYCLE = 9;  // s, one ray: draw (0–35%) · erase (35–70%) · rest
// Ray directions in degrees (0 = right, 90 = down). Nothing points upward, so the title stays clean.
const ANGLES = [-12, 8, 28, 52, 76, 104, 128, 152, 172, 192];
// Deterministic stagger (s) so rays never fire in sync.
const DELAYS = [4.1, 1.7, 6.3, 2.9, 7.4, 0.9, 5.2, 3.6, 8.1, 2.2];
// Free-standing twinkles (positions in % of the hero, size px, colour, cycle s, delay s).
const STARS = [
  { x: 14, y: 30, s: 12, c: VIOLET, d: 4.2, t: 0.6 },
  { x: 86, y: 58, s: 10, c: GREEN, d: 5.1, t: 2.4 },
  { x: 24, y: 74, s: 9, c: INK, d: 3.6, t: 1.3 },
  { x: 76, y: 24, s: 11, c: GREEN, d: 4.8, t: 3.2 },
  { x: 9, y: 56, s: 8, c: VIOLET, d: 5.6, t: 4.0 },
  { x: 92, y: 36, s: 9, c: INK, d: 3.9, t: 0.2 },
  { x: 20, y: 18, s: 8, c: GREEN, d: 4.6, t: 1.9 },
  { x: 81, y: 14, s: 9, c: VIOLET, d: 5.3, t: 0.9 },
  { x: 26, y: 43, s: 7, c: VIOLET, d: 3.4, t: 2.8 },
  { x: 74, y: 47, s: 8, c: INK, d: 4.4, t: 3.7 },
  { x: 5, y: 82, s: 10, c: GREEN, d: 5.8, t: 0.4 },
  { x: 95, y: 80, s: 11, c: VIOLET, d: 4.0, t: 2.0 },
  { x: 30, y: 94, s: 8, c: GREEN, d: 3.8, t: 4.4 },
  { x: 69, y: 95, s: 9, c: VIOLET, d: 5.0, t: 1.1 },
  { x: 79, y: 71, s: 7, c: GREEN, d: 3.3, t: 3.0 },
  { x: 28, y: 60, s: 10, c: INK, d: 6.0, t: 2.6 },
  { x: 47, y: 12, s: 7, c: VIOLET, d: 4.9, t: 3.9 },
  { x: 58, y: 15, s: 8, c: GREEN, d: 4.3, t: 0.7 },
];

const Star = ({ size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className="block">
    <path d="M12 0C12.6 6.6 17.4 11.4 24 12 17.4 12.6 12.6 17.4 12 24 11.4 17.4 6.6 12.6 0 12 6.6 11.4 11.4 6.6 12 0Z" fill={color} />
  </svg>
);

// `rays={false}` (V10): only the free twinkling stars — no lines and no stars at their ends.
export default function LineBurst({ anchor, container, start = 1.6, rays: showRays = true }) {
  const [g, setG] = useState(null);
  useLayoutEffect(() => {
    if (!anchor || !container) return;
    const measure = () => {
      const b = container.getBoundingClientRect(), r = anchor.getBoundingClientRect();
      // Downward rays start below the template row that follows the chat, not behind it.
      const below = anchor.nextElementSibling?.getBoundingClientRect();
      const k = b.width / (container.offsetWidth || 1); // undo the scroll-wrap scale
      setG({
        w: container.offsetWidth, h: container.offsetHeight,
        cx: (r.left + r.width / 2 - b.left) / k, cy: (r.top + r.height / 2 - b.top) / k,
        hw: r.width / k / 2 + 28, hh: r.height / k / 2 + 28,
        hhDown: ((below ? below.bottom : r.bottom) - (r.top + r.height / 2)) / k + 20,
        // Content the free stars must keep clear of (title, chat, templates), in hero px.
        blocks: [container.querySelector('#hero-title'), anchor, anchor.nextElementSibling].filter(Boolean).map(e => {
          const q = e.getBoundingClientRect();
          return { l: (q.left - b.left) / k - 14, t: (q.top - b.top) / k - 14, r: (q.right - b.left) / k + 14, b: (q.bottom - b.top) / k + 14 };
        }),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container); ro.observe(anchor);
    const t = setTimeout(measure, 1600);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [anchor, container]);

  if (!g) return null;
  const rays = ANGLES.map((deg, i) => {
    const a = deg * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a);
    // From just outside the input box…
    const t0 = Math.min(Math.abs(dx) > 1e-6 ? g.hw / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-6 ? (dy > 0 ? g.hhDown : g.hh) / Math.abs(dy) : Infinity);
    // …to 6% short of the hero edge.
    const tx = dx > 0 ? (g.w - g.cx) / dx : dx < 0 ? -g.cx / dx : Infinity;
    const ty = dy > 0 ? (g.h - g.cy) / dy : dy < 0 ? -g.cy / dy : Infinity;
    const t1 = Math.min(tx, ty) * 0.94;
    return {
      i, x1: g.cx + dx * t0, y1: g.cy + dy * t0, x2: g.cx + dx * t1, y2: g.cy + dy * t1,
      color: i % 2 ? GREEN : VIOLET, delay: start + DELAYS[i],
    };
  }).filter(r => showRays && Math.hypot(r.x2 - r.x1, r.y2 - r.y1) > 60);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none overflow-hidden md:block">
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${g.w} ${g.h}`} fill="none">
        <defs>
          {rays.map(r => (
            <linearGradient key={r.i} id={`v9-ray-${r.i}`} gradientUnits="userSpaceOnUse" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}>
              <stop offset="0" stopColor={r.color} stopOpacity="0" />
              <stop offset="0.45" stopColor={r.color} stopOpacity="0.75" />
              <stop offset="1" stopColor={r.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {rays.map(r => (
          <line key={r.i} className="v9-ray" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} pathLength="1"
            stroke={`url(#v9-ray-${r.i})`} strokeWidth="1.25" strokeLinecap="round"
            style={{ animationDuration: `${CYCLE}s`, animationDelay: `${r.delay}s` }} />
        ))}
      </svg>

      {/* A star lands at the end of each ray, timed to the ray's arrival. */}
      {rays.map(r => (
        <span key={'e' + r.i} className="absolute" style={{ left: r.x2, top: r.y2, transform: 'translate(-50%, -50%)' }}>
          <span className="v9-ray-star block" style={{ animationDuration: `${CYCLE}s`, animationDelay: `${r.delay}s` }}>
            <Star size={r.i % 3 ? 9 : 12} color={r.color} />
          </span>
        </span>
      ))}

      {STARS.filter(s => {
        const x = s.x / 100 * g.w, y = s.y / 100 * g.h;
        return !g.blocks.some(q => x > q.l && x < q.r && y > q.t && y < q.b);
      }).map((s, i) => (
        <span key={'s' + i} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
          <span className="v9-twinkle block" style={{ animationDuration: `${s.d}s`, animationDelay: `${start + s.t}s` }}>
            <Star size={s.s} color={s.c} />
          </span>
        </span>
      ))}
    </div>
  );
}
