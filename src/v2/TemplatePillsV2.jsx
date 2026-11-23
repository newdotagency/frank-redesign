// TemplatePillsV2 — V1's template row restyled as DESIGN-2 "Tab Pills": eggshell pills with
// a hairline border, monochrome icons (each keeps its own hover motion), filled black pill
// when selected. Template colours are intentionally not used: the spec is ~97% achromatic.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PlaybookIcon from '../components/PlaybookIcon';
import { PLAYBOOKS } from '../data/playbooks';

const FADE = 28; // px of soft edge where more chips are hidden

const CHIP = 'chip group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border pl-3 pr-3.5 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ease-[ease]';
const CHIP_IDLE = 'border-hair bg-egg text-graphite hover:text-black';
const CHIP_ON = 'border-black bg-black text-white';

function Pill({ p, active, onPick, onHover }) {
  const [tip, setTip] = useState(false);
  const timer = useRef(0);
  const btn = useRef(null);
  const tipRef = useRef(null);
  const [nudge, setNudge] = useState(0);
  const tipId = `tip-${p.id}`;

  // Only chips that are mostly in view (outside the edge fades) get a tooltip.
  const inView = () => {
    const b = btn.current?.getBoundingClientRect(), r = btn.current?.closest('ul').getBoundingClientRect();
    if (!b || !r) return false;
    const seen = Math.min(b.right, r.right - FADE) - Math.max(b.left, r.left + FADE);
    return seen >= b.width * 0.6;
  };
  const show = () => {
    onHover?.(p);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { if (inView()) setTip(true); }, 160);
  };
  const hide = () => { clearTimeout(timer.current); setTip(false); onHover?.(null); };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Paging the row closes any open tooltip.
  useEffect(() => {
    if (!tip) return;
    const ul = btn.current?.closest('ul'); if (!ul) return;
    const close = () => { clearTimeout(timer.current); setTip(false); };
    ul.addEventListener('scroll', close, { passive: true });
    return () => ul.removeEventListener('scroll', close);
  }, [tip]);

  // Keep the tooltip inside the visible part of the row, never shifting further than the chip is wide.
  useLayoutEffect(() => {
    if (!tip || !tipRef.current || !btn.current) { setNudge(0); return; }
    const t = tipRef.current.getBoundingClientRect();
    const r = btn.current.closest('ul').getBoundingClientRect();
    const limit = btn.current.offsetWidth;
    const pad = FADE + 4;
    const over = t.right - (r.right - pad), under = (r.left + pad) - t.left;
    const n = over > 0 ? -over : under > 0 ? under : 0;
    setNudge(Math.max(-limit, Math.min(limit, n)));
  }, [tip]);

  return (
    <li className="relative shrink-0 snap-start">
      <button ref={btn} type="button" aria-pressed={active}
        onPointerEnter={e => { if (e.pointerType === 'mouse') show(); }}
        onPointerLeave={hide}
        onFocus={e => { if (e.target.matches(':focus-visible')) show(); }} onBlur={hide}
        onClick={() => { hide(); onPick(p); }}
        aria-describedby={tipId}
        className={CHIP + ' ' + (active ? CHIP_ON : CHIP_IDLE)}>
        <span className="grid place-items-center transition-transform duration-150 ease-out group-active:scale-90">
          <PlaybookIcon p={p} className={'transition-colors duration-200 ease-[ease] ' + (active ? 'text-white' : 'text-ash group-hover:text-black')} />
        </span>
        {p.nm}
      </button>
      <span id={tipId} className="sr-only">{p.pr}. {p.n} interviews, about {p.len} minutes each.</span>
      <AnimatePresence>
        {tip && (
          <motion.span ref={tipRef} aria-hidden="true" data-tip
            initial={{ opacity: 0, y: -3, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ x: '-50%', marginLeft: nudge, transformOrigin: 'top center' }}
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-black px-2.5 py-1.5 text-[12px] text-egg">
            {p.pr}
            <span className="font-gmono text-[11px] text-ash">{p.n} interviews · {p.len} min</span>
          </motion.span>
        )}
      </AnimatePresence>
    </li>
  );
}

// Paired arrow control. Buttons never move; only the chevron nudges on hover.
function Arrow({ dir, enabled, onClick }) {
  const prev = dir < 0;
  return (
    <button type="button" onClick={onClick} disabled={!enabled} aria-controls="template-rail"
      aria-label={prev ? 'Previous templates' : 'More templates'}
      className="group grid size-8 place-items-center rounded-full border border-hair bg-egg text-black transition-[background-color,opacity] duration-200 ease-[ease] hover:bg-taupe disabled:pointer-events-none disabled:opacity-35">
      <span className="grid place-items-center transition-transform duration-150 ease-out group-active:scale-90">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={'transition-transform duration-200 ease-out ' + (prev ? 'motion-safe:group-hover:-translate-x-[2px]' : 'motion-safe:group-hover:translate-x-[2px]')}>
          <path d={prev ? 'M14.5 6 8.5 12l6 6' : 'M9.5 6l6 6-6 6'} />
        </svg>
      </span>
    </button>
  );
}

export default function TemplatePillsV2({ onPick, onHover, activeId }) {
  const reduced = useReducedMotion();
  const rail = useRef(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const el = rail.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = { prev: el.scrollLeft > 2, next: el.scrollLeft < max - 2 };
    setEdges(e => (e.prev === next.prev && e.next === next.next ? e : next));
  }, []);

  useEffect(() => {
    const el = rail.current; if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro.disconnect(); };
  }, [measure]);

  const page = dir => {
    const el = rail.current; if (!el) return;
    el.scrollBy({ left: dir * Math.max(220, el.clientWidth * 0.75), behavior: reduced ? 'auto' : 'smooth' });
  };

  const mask = `linear-gradient(90deg, ${edges.prev ? 'transparent 0, #000 ' + FADE + 'px' : '#000 0'}, ${edges.next ? '#000 calc(100% - ' + FADE + 'px), transparent 100%' : '#000 100%'})`;

  return (
    <div>
      <div className="mb-2 flex h-8 items-center justify-between">
        <p id="template-label" className="text-[13px] text-smoke">Start from a problem</p>
        <div className="hidden items-center gap-1.5 md:flex">
          <Arrow dir={-1} enabled={edges.prev} onClick={() => page(-1)} />
          <Arrow dir={1} enabled={edges.next} onClick={() => page(1)} />
        </div>
      </div>
      {/* Bottom padding gives tooltips room inside the scroll clip; the negative margin keeps layout unchanged. */}
      <ul id="template-rail" ref={rail} aria-labelledby="template-label"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        className="rail -mx-4 -mb-12 flex snap-x snap-mandatory scroll-px-4 items-start gap-2 overflow-x-auto px-4 pb-12 pt-1.5 md:-mx-1.5 md:scroll-px-1.5 md:px-1.5">
        {PLAYBOOKS.map(p => <Pill key={p.id} p={p} active={activeId === p.id} onPick={onPick} onHover={onHover} />)}
      </ul>
    </div>
  );
}
