// TemplatePills — every playbook in one scrolling row under the input.
// A quiet label and a paired arrow control sit above the row; chips are soft
// rounded rectangles in the same frosted material as the input. Chips never move:
// only their icons animate on hover. The chosen template stays marked until the
// user edits the text.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PlaybookIcon from './PlaybookIcon';
import { PLAYBOOKS } from '../data/playbooks';
import { TEMPLATE_ICONS } from '../data/templateIcons';

const FADE = 28; // px of soft edge where more chips are hidden

// The chip itself stays neutral. On hover (and when selected) only the icon changes:
// it takes its template's colour (Figma <template>/foreground) and plays its own motion.
const CHIP = 'chip group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[12px] bg-white/55 pl-2.5 pr-3 text-[13.5px] font-medium text-ink-2 backdrop-blur-sm transition-shadow duration-200 ease-out';
const CHIP_IDLE = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(26,23,20,0.07)]';
const CHIP_ON = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(26,23,20,0.2)]';
// skin="flat" (V3): solid white, no blur, a plain 1px line; selected = solid ink line.
const CHIP_FLAT = 'chip group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[12px] bg-white pl-2.5 pr-3 text-[13.5px] font-medium text-ink-2 transition-shadow duration-200 ease-out';
const CHIP_FLAT_IDLE = 'shadow-[0_0_0_1px_rgba(26,23,20,0.12)] hover:shadow-[0_0_0_1px_rgba(26,23,20,0.32)]';
const CHIP_FLAT_ON = 'shadow-[0_0_0_1.5px_#1a1714]';
// skin="editorial" (V5): oval pills, warm hairline; selected = ink line.
const CHIP_ED = 'chip group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-white pl-2.5 pr-3 text-[13.5px] text-[#414141] transition-shadow duration-200 ease-out';
const CHIP_ED_IDLE = 'shadow-[0_0_0_1px_#dedbd6] hover:shadow-[0_0_0_1px_#b8b3ab]';
const CHIP_ED_ON = 'shadow-[0_0_0_1px_#111111]';
// skin="parchment" (V7): oval white pills on parchment, pebble hairline, sepia when selected.
const CHIP_PA = 'chip group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-white pl-3 pr-3.5 text-[13.5px] text-[#2b180a] transition-shadow duration-200 ease-out';
const CHIP_PA_IDLE = 'shadow-[0_0_0_1px_#d9cfc3] hover:shadow-[0_0_0_1px_#b9ab9c,0_6px_14px_-8px_rgba(43,24,10,0.2)]';
const CHIP_PA_ON = 'shadow-[0_0_0_1.5px_#2b180a]';
// skin="button" (V21.04): chips that read as buttons. Solid white pills with a clear hairline and a small
// resting shadow; the icon sits in a round tile that takes its template's own colours (Figma
// Template-Icons) on hover and when chosen; hovering lifts the chip 1px and
// deepens its shadow, pressing sinks it. Selected = ink line.
const CHIP_BTN = 'chip group inline-flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-white pl-1.5 pr-3.5 text-[14px] font-medium text-ink transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:translate-y-0 active:scale-[0.97] motion-safe:hover:-translate-y-px';
const CHIP_BTN_IDLE = 'shadow-[0_0_0_1px_rgba(26,23,20,0.1),0_1px_2px_rgba(26,23,20,0.06)] hover:shadow-[0_0_0_1px_rgba(26,23,20,0.16),0_6px_14px_-6px_rgba(26,23,20,0.22)]';
const CHIP_BTN_ON = 'shadow-[0_0_0_1.5px_#1a1714,0_1px_2px_rgba(26,23,20,0.06)]';

function Pill({ p, active, onPick, onHover, flat, ed, pa, btn: asButton, tooltips }) {
  const [tip, setTip] = useState(false);
  const timer = useRef(0);
  const btn = useRef(null);
  const tipRef = useRef(null);
  const [nudge, setNudge] = useState(0);
  const tipId = `tip-${p.id}`;
  const ic = TEMPLATE_ICONS[p.id];

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
    if (!tooltips) return;
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
        style={{ '--tpl-fg': ic.fg, '--tpl-bg': ic.bg }}
        className={asButton ? CHIP_BTN + ' ' + (active ? CHIP_BTN_ON : CHIP_BTN_IDLE) : pa ? CHIP_PA + ' ' + (active ? CHIP_PA_ON : CHIP_PA_IDLE) : ed ? CHIP_ED + ' ' + (active ? CHIP_ED_ON : CHIP_ED_IDLE) : flat ? CHIP_FLAT + ' ' + (active ? CHIP_FLAT_ON : CHIP_FLAT_IDLE) : CHIP + ' ' + (active ? CHIP_ON : CHIP_IDLE)}>
        {asButton ? (
          <span className={'grid size-7 place-items-center rounded-full transition-colors duration-200 ease-[ease] ' + (active ? 'bg-[var(--tpl-bg)] text-[var(--tpl-fg)]' : 'bg-[#f3f2ee] text-ink-2 group-hover:bg-[var(--tpl-bg)] group-hover:text-[var(--tpl-fg)]')}>
            <PlaybookIcon p={p} />
          </span>
        ) : (
          <span className="grid place-items-center transition-transform duration-150 ease-out group-active:scale-90">
            <PlaybookIcon p={p} className={'transition-colors duration-200 ease-[ease] ' + (active ? 'text-[var(--tpl-fg)]' : 'text-ink-3 group-hover:text-[var(--tpl-fg)]')} />
          </span>
        )}
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
            className={'pointer-events-none absolute left-1/2 top-full z-20 mt-2 flex items-center gap-2 whitespace-nowrap px-2.5 py-1.5 text-[12.5px] text-[#efece6] rounded-lg' + (pa ? ' bg-[#2b180a]' : ' bg-ink') + (flat ? '' : ' shadow-[0_10px_24px_-10px_rgba(26,23,20,0.5)]')}>
            {p.pr}
            <span className="text-[#a8a199] [font-variant-numeric:tabular-nums]">{p.n} interviews · {p.len} min</span>
          </motion.span>
        )}
      </AnimatePresence>
    </li>
  );
}

// Paired arrow control. Buttons never move; only the chevron nudges on hover.
function Arrow({ dir, enabled, onClick, ed }) {
  const prev = dir < 0;
  return (
    <button type="button" onClick={onClick} disabled={!enabled} aria-controls="template-rail"
      aria-label={prev ? 'Previous templates' : 'More templates'}
      className={'group grid size-8 place-items-center text-ink-2 transition-[background-color,color,opacity] duration-200 ease-out hover:bg-[#ece9e3] hover:text-ink disabled:pointer-events-none disabled:opacity-30 rounded-full'}>
      <span className="grid place-items-center transition-transform duration-150 ease-out group-active:scale-90">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={'transition-transform duration-200 ease-out ' + (prev ? 'motion-safe:group-hover:-translate-x-[2px]' : 'motion-safe:group-hover:translate-x-[2px]')}>
          <path d={prev ? 'M14.5 6 8.5 12l6 6' : 'M9.5 6l6 6-6 6'} />
        </svg>
      </span>
    </button>
  );
}

// tooltips={false} drops the hover tooltip (the description stays available to screen readers).
export default function TemplatePills({ onPick, onHover, activeId, skin = 'soft', tooltips = true }) {
  const ed = skin === 'editorial', pa = skin === 'parchment', asButton = skin === 'button';
  const flat = skin === 'flat' || ed || pa;
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
        <p id="template-label" className={pa ? 'text-[12.5px] text-[#7f6e60]' : ed ? 'font-gmono text-[12px] tracking-[0.1em] text-[#585858]' : 'text-[12.5px] font-medium ' + (flat || asButton ? 'text-ink-2' : 'text-ink-3')}>{asButton ? 'Pick a problem to start' : 'Start from a problem'}</p>
        <div className="hidden items-center gap-0.5 md:flex">
          <Arrow ed={ed} dir={-1} enabled={edges.prev} onClick={() => page(-1)} />
          <Arrow ed={ed} dir={1} enabled={edges.next} onClick={() => page(1)} />
        </div>
      </div>
      {/* Bottom padding gives tooltips room inside the scroll clip; the negative margin keeps layout unchanged. */}
      <ul id="template-rail" ref={rail} aria-labelledby="template-label"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        className="rail -mx-4 -mb-12 flex snap-x snap-mandatory scroll-px-4 items-start gap-2 overflow-x-auto px-4 pb-12 pt-1.5 md:-mx-1.5 md:scroll-px-1.5 md:px-1.5">
        {PLAYBOOKS.map(p => <Pill key={p.id} p={p} active={activeId === p.id} onPick={onPick} onHover={onHover} flat={flat} ed={ed} pa={pa} btn={asButton} tooltips={tooltips} />)}
      </ul>
    </div>
  );
}
