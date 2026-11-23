// HeroGraphics — flat research artefacts scattered around the hero's edges: user-quote
// bubbles, theme tags, an interview waveform, an affinity-map sticky-note cluster, a
// transcript snippet with a marked insight, and a large Lora quotation mark.
//
// Calm by design: tones sit just off the #fffdf3 background, 1px outlines, solid fills.
// Motion: settle in one by one (120ms apart), then each floats a few px on its own 8–12s loop
// (never in sync), plus 4–12px cursor parallax by depth. When the feed finds the themes,
// dotted lines draw from the quotes to their theme tags (and the tags fill in).
// Layout: the full set only at ≥1280px, where the side gutters clear the headline/input;
// below that just two pieces (quote mark top-right, waveform under the templates).
// Decorative: aria-hidden. Reduced motion: everything still, lines shown as drawn.
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';

// Default palette (V4). A theme prop can override it (V5 editorial).
const DEFAULT_C = {
  ed: false, accent: null,
  line: '#e6dfc8', lineStrong: '#d6cdb0', fill: '#fbf8ea', text: '#9a927b', textStrong: '#7d7560',
  quote: '#eee8d2', mark: '#f4eab9', dots: '#c9bf9f',
  notes: ['#fbf3d2', '#f5f1e2', '#f8efdc'],
};
export const EDITORIAL_C = {
  ed: true, square: false, accent: '#0007cb',
  line: '#dedbd6', lineStrong: '#c9c4bb', fill: '#f1eee9', text: '#888888', textStrong: '#585858',
  quote: '#ebe7e0', mark: '#e4e0f7', dots: '#0007cb', tagOn: '#ffffff',
  notes: ['#f1eee9', '#ffffff', '#ebe7e0'],
};
const G = createContext(DEFAULT_C);
const CALM = [0.45, 0, 0.55, 1]; // sine-like in-out for slow floating

// Pointer position → shared motion values in [-1, 1], softened with a spring.
function usePointer(reduced) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18, mass: 1 });
  const sy = useSpring(y, { stiffness: 40, damping: 18, mass: 1 });
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const on = e => { x.set((e.clientX / window.innerWidth) * 2 - 1); y.set((e.clientY / window.innerHeight) * 2 - 1); };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [reduced, x, y]);
  return [sx, sy];
}

// One positioned artefact: parallax (outer) → settle-in (middle) → slow float (inner).
function Piece({ i, start, reduced, depth, float, className, style, children, pointer, innerRef }) {
  const [px, py] = pointer;
  const x = useTransform(px, v => v * depth), y = useTransform(py, v => v * depth);
  return (
    <motion.div className={'absolute ' + className} style={{ ...style, x, y }}>
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.4 : 1.2, ease: EXPO_OUT, delay: start + i * 0.12 }}>
        <motion.div ref={innerRef}
          animate={reduced ? undefined : { y: [0, -float.amp, 0], rotate: float.rot ? [0, float.rot, 0] : 0 }}
          transition={reduced ? undefined : { duration: float.dur, ease: CALM, repeat: Infinity, delay: float.delay }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Bubble({ children, tail = 'left' }) {
  const C = useContext(G);
  return (
    <div className={'max-w-[210px] border px-3.5 py-2.5 font-serif text-[14px] italic leading-[1.4] ' + (C.square ? 'rounded-[4px]' : tail === 'left' ? 'rounded-[16px] rounded-bl-[4px]' : 'rounded-[16px] rounded-br-[4px]')}
      style={{ background: C.fill, borderColor: C.line, color: C.text }}>
      {children}
    </div>
  );
}

function Tag({ children, on }) {
  const C = useContext(G);
  return (
    <span className={'inline-flex items-center gap-1.5 border px-2.5 py-1 transition-[background-color,color,border-color] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ' + (C.square ? 'rounded-[4px] ' : 'rounded-full ') + (C.ed ? 'font-gmono text-[11px] tracking-[0.1em]' : 'text-[12px] font-medium')}
      style={{ background: on ? (C.tagOn || '#f1ead0') : 'transparent', borderColor: on ? C.lineStrong : C.line, color: on ? C.textStrong : C.text }}>
      <span className={'size-1.5 ' + (C.square ? 'rounded-[1px]' : 'rounded-full')} style={{ background: on ? (C.accent || C.textStrong) : C.lineStrong }} />
      {children}
    </span>
  );
}

// Deterministic interview waveform: 56 hairline bars, speech-like envelope.
const BARS = Array.from({ length: 56 }, (_, k) => {
  const env = 0.35 + 0.65 * Math.sin((k / 55) * Math.PI);
  const v = Math.abs(Math.sin(k * 0.61) * 0.55 + Math.sin(k * 0.23 + 1) * 0.3 + Math.sin(k * 1.7) * 0.15);
  return Math.max(0.12, Math.min(1, v) * env);
});
function Waveform({ width = 200, reduced, caption = true }) {
  const C = useContext(G);
  return (
    <div>
      <svg width={width} height="34" viewBox={`0 0 ${BARS.length * 4} 34`} className="block">
        {BARS.map((h, k) => (
          <line key={k} x1={k * 4 + 2} x2={k * 4 + 2} y1={17 - h * 15} y2={17 + h * 15}
            stroke={C.lineStrong} strokeWidth="1" strokeLinecap="round"
            className={reduced ? '' : 'wave-bar'} style={{ animationDelay: `${-(k % 9) * 0.31}s` }} />
        ))}
      </svg>
      {caption && (
        <div className={'mt-1.5 flex justify-between [font-variant-numeric:tabular-nums] ' + (C.ed ? 'font-gmono text-[10.5px] tracking-[0.08em]' : 'text-[11px]')} style={{ color: C.text }}>
          <span>Interview with Maya</span><span>12:04</span>
        </div>
      )}
    </div>
  );
}

function Notes() {
  const C = useContext(G);
  const n = [
    { t: 'Setup took too long', r: -5, x: 0, y: 8 },
    { t: 'Pricing feels unclear', r: 4, x: 70, y: 0 },
    { t: 'Wants exports', r: -2, x: 34, y: 66 },
  ];
  return (
    <div className="relative h-[140px] w-[150px]">
      {n.map((s, k) => (
        <div key={k} className="absolute flex size-[76px] items-start border p-2 text-[11px] leading-[1.3]"
          style={{ left: s.x, top: s.y, transform: `rotate(${s.r}deg)`, background: C.notes[k], borderColor: C.line, color: C.textStrong }}>
          {s.t}
        </div>
      ))}
    </div>
  );
}

function Transcript() {
  const C = useContext(G);
  return (
    <div className={'w-[214px] border p-3 text-[12.5px] leading-[1.5] ' + (C.square ? 'rounded-[4px]' : 'rounded-[12px]')} style={{ background: C.ed ? '#ffffff' : '#fdfbf1', borderColor: C.line, color: C.text }}>
      <p className={C.ed ? 'font-gmono text-[11px] tracking-[0.08em]' : 'font-medium'} style={{ color: C.textStrong }}>What made you cancel?</p>
      <p className="mt-1">Honestly, <mark className="rounded-[3px] px-0.5" style={{ background: C.mark, color: C.textStrong }}>the setup took forever</mark> and I gave up.</p>
    </div>
  );
}

// Dotted quote → theme lines. Endpoints are measured every frame while visible, so they
// stay attached to the floating pieces (in the container's unscaled coordinate space).
function Links({ anchors, linked, reduced, containerRef }) {
  const C = useContext(G);
  const [paths, setPaths] = useState([]);
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const box = containerRef.current; if (!box) return;
      const b = box.getBoundingClientRect();
      const k = b.width / (box.offsetWidth || 1); // undo the scroll-card scale
      const pt = (el, side) => {
        const r = el.getBoundingClientRect();
        const x = side === 'r' ? r.right : side === 'l' ? r.left : (r.left + r.right) / 2;
        const y = side === 'b' ? r.bottom : side === 't' ? r.top : (r.top + r.bottom) / 2;
        return [(x - b.left) / k, (y - b.top) / k];
      };
      const next = anchors.map(([from, fs, to, ts]) => {
        if (!from.current || !to.current || !from.current.offsetParent) return null;
        const [x1, y1] = pt(from.current, fs), [x2, y2] = pt(to.current, ts);
        const my = (y1 + y2) / 2;
        return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
      });
      setPaths(next);
      // Track the floating pieces frame by frame only while the lines are showing.
      if (follow) raf = requestAnimationFrame(measure);
    };
    const follow = linked && !reduced;
    measure();
    const on = () => measure();
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', on); };
  }, [anchors, reduced, containerRef, linked]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        {paths.map((d, i) => d && (
          <mask key={i} id={`hg-link-${i}`} maskUnits="userSpaceOnUse">
            <motion.path d={d} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"
              initial={false}
              animate={{ pathLength: linked ? 1 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: linked ? 1.4 : 0.6, ease: [0.77, 0, 0.175, 1], delay: linked ? i * 0.18 : 0 }} />
          </mask>
        ))}
      </defs>
      {paths.map((d, i) => d && (
        <path key={i} d={d} fill="none" stroke={C.dots} strokeWidth="1.25" strokeLinecap="round" strokeDasharray="0.5 5" mask={`url(#hg-link-${i})`} />
      ))}
    </svg>
  );
}

export default function HeroGraphics({ reduced, start = 1, linked = false, containerRef, theme }) {
  const C = theme || DEFAULT_C;
  const pointer = usePointer(reduced);
  const bubbleA = useRef(null), bubbleB = useRef(null), bubbleC = useRef(null);
  const tagOnb = useRef(null), tagPrice = useRef(null);
  const anchors = useRef([
    [bubbleA, 'b', tagOnb, 't'],
    [bubbleB, 'b', tagPrice, 't'],
    [bubbleC, 'b', tagPrice, 't'],
  ]).current;
  const P = (i, props) => ({ i, start, reduced, pointer, ...props });

  return (
    <G.Provider value={C}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {/* Full set: wide screens only, where the side gutters clear the centre column */}
      <div className="absolute inset-0 hidden xl:block">
        <Links anchors={anchors} linked={linked || reduced} reduced={reduced} containerRef={containerRef} />

        <Piece {...P(0, { depth: 4, float: { amp: 3, dur: 12, delay: 0.4 }, className: 'left-[3%] top-[13%]' })}>
          <span className="block font-serif text-[168px] leading-none" style={{ color: C.quote }}>“</span>
        </Piece>
        <Piece {...P(1, { depth: 10, float: { amp: 5, dur: 9, delay: 0 }, className: 'left-[5%] top-[22%]', innerRef: bubbleA })}>
          <Bubble>I didn’t know where to start</Bubble>
        </Piece>
        <Piece {...P(2, { depth: 6, float: { amp: 3, dur: 11, delay: 1.2 }, className: 'left-[14%] top-[37%]', innerRef: tagOnb })}>
          <Tag on={linked || reduced}>Onboarding</Tag>
        </Piece>
        <Piece {...P(3, { depth: 8, float: { amp: 4, dur: 10, delay: 0.8 }, className: 'left-[4.5%] top-[52%]' })}>
          <Waveform reduced={reduced} />
        </Piece>
        <Piece {...P(4, { depth: 12, float: { amp: 4, dur: 11.5, delay: 2, rot: 1 }, className: 'bottom-[8%] left-[5%]' })}>
          <Notes />
        </Piece>

        <Piece {...P(5, { depth: 10, float: { amp: 5, dur: 10.5, delay: 0.6 }, className: 'right-[5%] top-[18%]', innerRef: bubbleB })}>
          <Bubble tail="right">Too expensive for what I use</Bubble>
        </Piece>
        <Piece {...P(6, { depth: 7, float: { amp: 4, dur: 8.5, delay: 1.6 }, className: 'right-[4%] top-[31%]', innerRef: bubbleC })}>
          <Bubble tail="right">I’d pay for this</Bubble>
        </Piece>
        <Piece {...P(7, { depth: 5, float: { amp: 3, dur: 12, delay: 0.2 }, className: 'right-[13%] top-[45%]', innerRef: tagPrice })}>
          <Tag on={linked || reduced}>Pricing</Tag>
        </Piece>
        {/* Transcript needs the wider gutter (and sits above the feed card there) */}
        <div className="absolute inset-0 hidden min-[1400px]:block">
          <Piece {...P(8, { depth: 9, float: { amp: 4, dur: 9.5, delay: 1 }, className: 'right-[4%] top-[55%]' })}>
            <Transcript />
          </Piece>
        </div>
      </div>

      {/* Smaller screens: just two quiet pieces */}
      <div className="absolute inset-0 xl:hidden">
        <Piece {...P(0, { depth: 4, float: { amp: 3, dur: 12, delay: 0.4 }, className: 'right-[6%] top-[178px] sm:top-[120px]' })}>
          <span className="block font-serif text-[96px] leading-none sm:text-[128px]" style={{ color: C.quote }}>”</span>
        </Piece>
        <Piece {...P(1, { depth: 6, float: { amp: 3, dur: 10, delay: 0.8 }, className: 'inset-x-0 bottom-[14px] flex justify-center' })}>
          {/* Phones: bars only, low in the gutter so it never touches the templates */}
          <div className="w-[160px]"><Waveform width={160} reduced={reduced} caption={false} /></div>
        </Piece>
      </div>
    </div>
    </G.Provider>
  );
}
