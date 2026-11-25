// GlobalGetVisuals (V21.04): the three "What you get" pictures of the Global scalability page redrawn from the live page's pictures as plain
// HTML and SVG in the V21.04 colours (flags are small SVGs, the map is drawn from simple shapes):
//   Language:  flags in orbit around a dotted globe (30+ languages).
//   Patterns:  a lined world map with each region's score, and the dashed links between them.
//   Cost:      "10 interviews" and "10k interviews" over a list of conversations, "Same operational effort" floating on top.
// Each is drawn on a 400 × 300 stage (the card's 4:3) scaled to its width; the orbit and the floating card drift slowly, and hold still with
// reduced motion.
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Bars, Flag, Stage } from './GlobalScenes';

const W = 400, H = 300;
const FIG = "font-['Figtree',sans-serif]";
const PILL = 'rounded-full bg-white shadow-[0_14px_30px_-14px_rgba(26,23,20,0.4)] ring-1 ring-[#1a1714]/[0.06]';

// Drifts a little, forever (still with reduced motion).
function Drift({ reduce, dy = 5, dur = 5, delay = 0, className = '', style, children }) {
  // The outer box places it (and centres it); the inner one drifts, so the animation never touches the placing transform.
  return (
    <div className={'absolute ' + className} style={style}>
      <motion.div animate={reduce ? undefined : { y: [0, -dy, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}>
        {children}
      </motion.div>
    </div>
  );
}

// ——— 1. Languages in orbit around a dotted globe.
function Globe({ cx, cy, r }) {
  // A disc of dots, bigger and stronger toward the middle, like a halftone ball.
  const dots = useMemo(() => {
    const out = [];
    for (let ring = 0; ring * 6 <= r; ring++) {
      const rad = ring * 6, n = Math.max(1, Math.round(rad * 0.95));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + ring * 0.5;
        out.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 1.9 - (rad / r) * 1.1, 0.75 - (rad / r) * 0.5]);
      }
    }
    return out;
  }, [cx, cy, r]);
  return <g fill="#5f8f22">{dots.map(([x, y, s, o], i) => <circle key={i} cx={x} cy={y} r={Math.max(0.5, s)} opacity={Math.max(0.12, o)} />)}</g>;
}

export function LanguageVisual() {
  const reduce = !!useReducedMotion();
  const langs = [['de', 'German', 112, 70, 0], ['se', 'Swedish', 270, 46, 1], ['fr', 'France', 330, 118, 2], ['no', 'Norwegian', 304, 204, 3], ['it', 'Italian', 138, 214, 4], ['es', 'Spanish', 58, 144, 5]];
  return (
    <Stage w={W} h={H}>
      <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" fill="none">
        {[62, 104, 146].map((r, i) => (
          <circle key={r} cx="200" cy="150" r={r} stroke="rgba(26,23,20,0.2)" strokeWidth="1.2" strokeDasharray="2 6" strokeLinecap="round" opacity={1 - i * 0.2} />
        ))}
        <Globe cx={200} cy={150} r={44} />
      </svg>
      {langs.map(([code, name, x, y, i]) => (
        <Drift key={code} reduce={reduce} dy={4 + (i % 3)} dur={4.2 + i * 0.5} delay={i * 0.3} className="" style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}>
          <span className={PILL + ' flex items-center gap-2.5 py-1.5 pl-2.5 pr-4 font-sans text-[13.5px] text-ink'}><Flag code={code} w={22} />{name}</span>
        </Drift>
      ))}
    </Stage>
  );
}

// ——— 2. A lined world map with each region's score.
const LANDS = [
  'M34 42 L82 28 L126 32 L152 50 L146 70 L130 84 L116 100 L102 120 L86 108 L70 88 L50 72 L34 58 Z',   // North America
  'M168 20 L196 16 L202 30 L184 40 L168 34 Z',                                                         // Greenland
  'M112 132 L142 126 L158 148 L152 178 L136 208 L122 212 L118 178 L108 152 Z',                          // South America
  'M190 54 L216 44 L240 50 L234 74 L216 82 L196 78 Z',                                                 // Europe
  'M194 94 L234 92 L254 114 L250 152 L234 186 L216 188 L206 152 L190 120 Z',                            // Africa
  'M246 44 L302 34 L354 48 L374 76 L358 102 L324 110 L302 130 L276 114 L254 86 Z',                      // Asia
  'M332 152 L368 148 L376 174 L346 184 L328 170 Z',                                                    // Australia
];
const REGIONS = [['N. America', 82, 64, 98], ['S. America', 74, 100, 204], ['Europe', 67, 222, 108], ['Asia', 91, 330, 96]];

export function PatternsVisual() {
  return (
    <Stage w={W} h={H}>
      <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" fill="none">
        <defs>
          <pattern id="map-lines" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><path d="M1.2 0V3.4" stroke="rgba(26,23,20,0.34)" strokeWidth="1" /></pattern>
        </defs>
        <g transform="translate(0 22)" fill="url(#map-lines)">{LANDS.map(d => <path key={d} d={d} />)}</g>
        <g stroke="rgba(26,23,20,0.55)" strokeWidth="1.3" strokeDasharray="5 5" strokeLinecap="round">
          <circle cx="134" cy="152" r="78" />
          <ellipse cx="282" cy="140" rx="72" ry="52" />
        </g>
      </svg>
      {REGIONS.map(([name, pct, x, y]) => (
        <div key={name} className={'absolute grid size-[62px] place-items-center ' + PILL} style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}>
          <span className="flex flex-col items-center leading-none">
            <svg aria-hidden="true" viewBox="0 0 12 14" width="11" height="13" fill="none" stroke="#5f8f22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12.5V2M2 5.5 6 1.5l4 4" /></svg>
            <span className={FIG + ' mt-1 text-[14px] font-medium text-ink'}>{pct}%</span>
            <span className="mt-0.5 font-sans text-[8.5px] text-ink-2">{name}</span>
          </span>
        </div>
      ))}
    </Stage>
  );
}

// ——— 3. Same effort at 10 or 10,000 interviews.
export function CostVisual() {
  const reduce = !!useReducedMotion();
  const rows = ['45:04', '31:37', '20:14'];
  return (
    <Stage w={W} h={H}>
      <div className="absolute left-[24px] top-[22px] flex w-[352px] gap-[14px]">
        {['10 interviews', '10k interviews'].map(t => (
          <span key={t} className="flex flex-1 items-center gap-2.5 whitespace-nowrap rounded-[16px] bg-white px-3 py-3 shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]">
            <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Check className="size-3.5" strokeWidth={2.4} /></span>
            <span className="font-sans text-[14px] text-ink">{t}</span>
          </span>
        ))}
      </div>
      {rows.map((t, i) => (
        <div key={t} className="absolute left-[24px] flex w-[352px] items-center gap-4 rounded-[16px] bg-white px-4 py-3 shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]" style={{ top: 92 + i * 66, height: 54 }}>
          <span className="w-[44px] shrink-0 font-sans text-[14.5px] tabular-nums text-ink-2">{t}</span>
          <span className="flex min-w-0 flex-1 justify-center overflow-hidden"><Bars live={false} n={24} h={24} /></span>
          <svg aria-hidden="true" viewBox="0 0 14 16" width="14" height="16" className="shrink-0"><path d="M2 2.2c0-.9 1-1.4 1.7-.9l8.4 5.8c.6.4.6 1.4 0 1.8l-8.4 5.8c-.7.5-1.7 0-1.7-.9z" fill="#5f8f22" /></svg>
        </div>
      ))}
      <Drift reduce={reduce} dy={5} dur={4.6} className="left-1/2 top-[132px] -translate-x-1/2">
        <span className="block whitespace-nowrap rounded-[18px] bg-white px-9 py-4 font-sans text-[19px] text-ink shadow-[0_24px_46px_-18px_rgba(26,23,20,0.5)] ring-1 ring-[#1a1714]/[0.07]">Same operational effort</span>
      </Drift>
    </Stage>
  );
}

export const GLOBAL_GET_VISUALS = [LanguageVisual, PatternsVisual, CostVisual];
