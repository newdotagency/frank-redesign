// HeroScrollCard — the hero is sticky and, as you scroll, wraps from full-bleed into a
// rounded card with an even margin from the viewport edges. Fully scrubbable both ways.
//
// Smoothness rules:
//  • Transform only. The corners are NOT an animated border-radius (that repaints the whole
//    hero every frame). Instead four flat corner pieces in the page colour grow over the
//    card's corners with transform: scale — true R-px circles, zero repaint.
//  • Compositor-driven where possible: a native CSS scroll-driven animation
//    (animation-timeline: scroll()) runs off the main thread, so it stays smooth while JS is
//    busy (glasses loop, feed timers). Endpoints are computed once per resize as CSS vars.
//  • Fallback (no scroll timelines, e.g. Firefox): Framer Motion useScroll, transform-only,
//    with a light spring on progress so stepped wheel scrolling glides instead of jumping.
//
// Even margins on a non-square viewport need different X/Y scales; the content counter-
// scales so it shrinks uniformly by a few percent instead of squashing.
// Reduced motion: no scaling, the hero just fades a little as you scroll.
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import './HeroScrollCard.css';

const RADIUS = 44;          // corner radius of the formed card
const CONTENT_SHRINK = 0.07;   // content ends 7% smaller (keeps pace with the larger margin)
const RUN = 0.8;               // extra scroll (in viewport heights) the sticky hero occupies
const WRAP_PART = 0.55;        // the wrap completes over the first 55% of that run
const PAPER = '#F9F8F5';       // default page colour behind the card (V5 canvas)

const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: scroll()');

// The real visible size. The hero is sized from this (not only from 100dvh), so it always
// covers exactly what the window shows, even where a browser/webview reports dvh differently.
function useViewport() {
  const [vp, setVp] = useState(() => typeof window === 'undefined'
    ? { w: 1280, h: 800 } : { w: window.innerWidth, h: window.visualViewport?.height || window.innerHeight });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.visualViewport?.height || window.innerHeight });
    on();
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    return () => { window.removeEventListener('resize', on); window.visualViewport?.removeEventListener('resize', on); };
  }, []);
  return vp;
}

// Flat inverse corner: a square minus a quarter circle, filled with the page colour.
function Corner({ pos, style, className = '', color = PAPER }) {
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  const place = { tl: 'left-0 top-0', tr: 'right-0 top-0', br: 'right-0 bottom-0', bl: 'left-0 bottom-0' }[pos];
  const origin = { tl: '0 0', tr: '100% 0', br: '100% 100%', bl: '0 100%' }[pos];
  return (
    <motion.svg aria-hidden="true" width={RADIUS} height={RADIUS} viewBox="0 0 28 28"
      className={`pointer-events-none absolute z-10 ${place} ${className}`}
      style={{ transformOrigin: origin, ...style }}>
      <path d="M0 0h28C12.536 0 0 12.536 0 28Z" fill={color} transform={`rotate(${rot} 14 14)`} />
    </motion.svg>
  );
}

function geometry(vp) {
  const margin = vp.w < 768 ? 16 : 40; // even gap from the viewport edges once the card forms
  const sx = 1 - (2 * margin) / vp.w, sy = 1 - (2 * margin) / vp.h;
  // Content scale at 50% / 100% of the wrap, so the counter-scale stays uniform mid-way.
  const at = m => {
    const x = 1 - (2 * margin / vp.w) * m, y = 1 - (2 * margin / vp.h) * m, c = 1 - CONTENT_SHRINK * m;
    return [c / x, c / y];
  };
  const [csx50, csy50] = at(0.5), [csx, csy] = at(1);
  return { margin, sx, sy, csx, csy, csx50, csy50 };
}

// ── Native, compositor-driven version ────────────────────────────────────────────
function CssScrollCard({ children, background, vp, pageColor }) {
  const g = geometry(vp);
  const vars = {
    '--hsc-sx': g.sx, '--hsc-sy': g.sy, '--hsc-csx': g.csx, '--hsc-csy': g.csy,
    '--hsc-csx50': g.csx50, '--hsc-csy50': g.csy50, '--hsc-m': `${g.margin}px`,
    '--hsc-range': `${Math.round(vp.h * RUN * WRAP_PART)}px`,
  };
  return (
    <div className="relative" style={{ height: Math.round(vp.h * (1 + RUN)) }}>
      <div className="sticky top-0 overflow-hidden" style={{ ...vars, height: vp.h }}>
        <div className="hsc-card absolute inset-0" style={{ background }}>
          <div className="hsc-content absolute inset-0">{children}</div>
        </div>
        {['tl', 'tr', 'br', 'bl'].map(p => <Corner key={p} pos={p} color={pageColor} className={`hsc-corner hsc-${p}`} />)}
      </div>
    </div>
  );
}

// ── Framer Motion fallback ───────────────────────────────────────────────────────
// Corner piece follows the card's edge inward and grows to full radius.
const useCorner = (m, margin, dx, dy) =>
  useTransform(m, v => `translate(${dx * margin * v}px, ${dy * margin * v}px) scale(${v})`);

function MotionScrollCard({ children, background, vp, pageColor }) {
  const wrap = useRef(null);
  const g = geometry(vp);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  // Light spring: wheel steps glide; settles in ~150ms so it still feels attached to the scroll.
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.5, restDelta: 0.0005 });
  const m = useTransform(smooth, [0, WRAP_PART], [0, 1], { clamp: true });
  const card = useTransform(m, v => `scale(${1 - (1 - g.sx) * v}, ${1 - (1 - g.sy) * v})`);
  const content = useTransform(m, v => {
    const x = 1 - (1 - g.sx) * v, y = 1 - (1 - g.sy) * v, c = 1 - CONTENT_SHRINK * v;
    return `scale(${c / x}, ${c / y})`;
  });
  const cTL = useCorner(m, g.margin, 1, 1), cTR = useCorner(m, g.margin, -1, 1);
  const cBR = useCorner(m, g.margin, -1, -1), cBL = useCorner(m, g.margin, 1, -1);
  return (
    <div ref={wrap} className="relative" style={{ height: Math.round(vp.h * (1 + RUN)) }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: vp.h }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ background, transform: card }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ transform: content }}>{children}</motion.div>
        </motion.div>
        <Corner pos="tl" color={pageColor} style={{ transform: cTL }} />
        <Corner pos="tr" color={pageColor} style={{ transform: cTR }} />
        <Corner pos="br" color={pageColor} style={{ transform: cBR }} />
        <Corner pos="bl" color={pageColor} style={{ transform: cBL }} />
      </div>
    </div>
  );
}

// ── Reduced motion ───────────────────────────────────────────────────────────────
function FadeCard({ children, background, vp }) {
  const wrap = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);
  return (
    <div ref={wrap} className="relative" style={{ height: vp.h }}>
      <motion.div className="relative h-full" style={{ background, opacity: fade }}>{children}</motion.div>
    </div>
  );
}

export default function HeroScrollCard({ children, reduced, background = '#d1f899', pageColor = PAPER }) {
  const vp = useViewport();
  const [native, setNative] = useState(false);
  useEffect(() => { setNative(supportsScrollTimeline()); }, []);
  if (reduced) return <FadeCard background={background} vp={vp}>{children}</FadeCard>;
  return native
    ? <CssScrollCard background={background} vp={vp} pageColor={pageColor}>{children}</CssScrollCard>
    : <MotionScrollCard background={background} vp={vp} pageColor={pageColor}>{children}</MotionScrollCard>;
}
