// UseCases (V21.12.1) — "One interviewer. Every use case that matters." The eleven use cases as a card
// rail, after kokonutui's Momentum Rail (MIT, @dorianbaffier): flick it with the mouse and the
// release velocity projects an end point, a spring settles on the nearest card, the ends
// rubber-band. Scroll position drives a cover-flow depth (CSS scroll-driven animation, rail.css).
// Each card is white, with its template's small Figma icon top left (Template-Icons, node 2113:9800),
// then the name, the problem as you'd say it and what you learn. Choosing a card types its question into
// the chat at the bottom of the screen: pick one, tweak it, launch it.
// Entrance (reveal.jsx): the heading as in the other sections, then the rail rises in with the scroll.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlaybookIcon from '../components/PlaybookIcon';
import { TEMPLATE_ICONS } from '../data/templateIcons';
import { TITLE, Eyebrow } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle } from './reveal';
import './rail.css';

// The eleven interview templates, one card each. icon: its Figma template icon (Template-Icons,
// node 2113:9800); problem: what you'd say; learn: what Frank finds out; prompt: what choosing the card
// types into the chat.
const CASES = [
  { id: 'churn', name: 'Churn reasons', problem: 'Customers are cancelling.',
    learn: 'What led to cancellation, which expectations went unmet, and what customers will do instead.',
    prompt: 'Why are customers cancelling, and what will they do instead?' },
  { id: 'activation', name: 'Activation barriers', problem: 'People sign up but never really get started.',
    learn: 'What customers hoped to accomplish and what prevented their first useful result.',
    prompt: 'What stops new sign-ups from getting their first useful result?' },
  { id: 'trial', name: 'Trial conversion', problem: 'People try the product but don’t become paying customers.',
    learn: 'Whether they experienced enough value, what remained unresolved, and why they didn’t purchase.',
    prompt: 'Why don’t trial users become paying customers?' },
  { id: 'adoption', name: 'Feature adoption', problem: 'We built this feature, but people aren’t using it as expected.',
    learn: 'Whether customers know about it, need it, and can use it successfully, and what makes them continue or stop.',
    prompt: 'Why aren’t people using our new feature as expected?' },
  { id: 'funnel', name: 'Funnel drop-off', problem: 'People start a process but don’t finish it.',
    learn: 'What happened at a specific step, what people expected, and why they stopped. Applies to any workflow.',
    prompt: 'Why do people start our sign-up flow but not finish it?' },
  { id: 'engagement', name: 'Declining engagement', problem: 'Previously active customers are using the product less.',
    learn: 'What changed in their needs or experience, and whether another solution or workaround took over.',
    prompt: 'Why are previously active customers using the product less?' },
  { id: 'upgrade', name: 'Upgrade barriers', problem: 'Customers keep using their current plan but don’t upgrade.',
    learn: 'Whether they need additional capabilities and what prevents them from choosing a higher plan.',
    prompt: 'What stops customers on their current plan from upgrading?' },
  { id: 'requests', name: 'Feature request discovery', problem: 'We receive feature requests, but aren’t sure which problems deserve investment.',
    learn: 'The underlying problem, current workarounds, how often it occurs, and its consequences.',
    prompt: 'Which problems behind our feature requests deserve investment?' },
  { id: 'value', name: 'Customer value drivers', problem: 'Some customers keep coming back. What makes the product valuable to them?',
    learn: 'Which workflows and outcomes matter most, and why customers continue choosing the product.',
    prompt: 'What makes the product valuable to customers who keep coming back?' },
  { id: 'checkout', name: 'Checkout abandonment', problem: 'People reach checkout but don’t complete payment.',
    learn: 'What interrupted the purchase, from unresolved doubts and unexpected costs to payment friction.',
    prompt: 'Why do people reach checkout but not complete payment?' },
  { id: 'downgrade', name: 'Downgrade reasons', problem: 'Customers are moving to cheaper plans or reducing seats.',
    learn: 'Whether their needs, budgets, team usage, or perception of value changed.',
    prompt: 'Why are customers moving to cheaper plans or reducing seats?' },
];

// The title button is stretched over the whole card, so the card is one target (it types the
// use case's question into the chat).
const STRETCHED = "outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-['']";

// A white card: the template's icon top left, the name, then the problem as you'd say it and what
// you learn, all inside. One minimum height (400px, 440px on phones), tall enough for the longest
// texts, so the cards stay even; the problem and what you learn sit at the bottom.
function RailCard({ c, onSelect }) {
  const ic = TEMPLATE_ICONS[c.id];
  return (
    <li className="uc-rail-card flex-none snap-center" style={{ width: 'var(--rail-card)' }}>
      <div className="uc-rail-tilt group relative">
        <div className="relative flex min-h-[440px] flex-col sm:min-h-[400px] rounded-[20px] bg-white p-6 font-sans ring-1 ring-[#1a1714]/[0.08] shadow-[0_24px_50px_-30px_rgba(26,23,20,0.35)] ring-offset-2 ring-offset-white group-has-[[data-rail-link]:focus-visible]:ring-2 group-has-[[data-rail-link]:focus-visible]:ring-ink">
          {/* The icon is the Figma glyph drawn 1.75× (its strokes and its hover motion scale with it).
              Hovering the card plays the icon's own motion (motion.css, ti-*): one part moves. */}
          <span aria-hidden="true" className="grid h-[52px] w-[52px] shrink-0 place-items-center self-start rounded-[14px]" style={{ background: ic.bg, color: ic.fg }}>
            <span className="grid place-items-center" style={{ transform: 'scale(1.75)' }}><PlaybookIcon p={{ id: c.id }} box={16} /></span>
          </span>
          <h3 className="m-0 mt-5">
            <button type="button" data-rail-link="" onClick={() => onSelect(c)}
              className={STRETCHED + ' hiw-step-title cursor-pointer border-0 bg-transparent p-0 text-left text-[21px] leading-tight text-ink'}>
              {c.name}
            </button>
          </h3>
          <div className="mt-auto pt-6">
            <p className="m-0 text-[12px] text-ink-3">The problem</p>
            <p className="m-0 mt-1 text-[14.5px] leading-snug text-ink-2">“{c.problem}”</p>
            <p className="m-0 mt-4 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-4 text-[12px] text-ink-3">What you learn</p>
            <p className="m-0 mt-1 text-[15px] leading-snug text-ink">{c.learn}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

/* Momentum: drag, project, spring to a card, rubber-band at the ends. */
const STIFFNESS = 170;
const DAMPING = 26; // about 2·√170: critically damped, so no bounce at the card
const DECELERATION = 0.997; // UIScrollView's normal rate, per ms
const DRAG_THRESHOLD = 4;
const rubber = (over, size) => Math.sign(over) * (1 - 1 / ((Math.abs(over) * 0.55) / size + 1)) * size;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const maxScroll = s => s.scrollWidth - s.clientWidth;
const snapPoints = (scroller, track) => {
  const max = maxScroll(scroller);
  return Array.from(track.children, card => clamp(track.offsetLeft + card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2, 0, max));
};
const nearestIndex = (points, pos) => points.reduce((best, p, i) => (Math.abs(p - pos) < Math.abs(points[best] - pos) ? i : best), 0);
// Release velocity in px/ms from the last 100 ms of samples; a pause before letting go means no flick.
const releaseVelocity = (samples, now) => {
  const first = samples[0], last = samples[samples.length - 1] ?? first;
  const dt = last.t - first.t;
  if (dt <= 0 || now - last.t > 60) return 0;
  return -(last.x - first.x) / dt;
};

function useMomentumRail(scrollerRef, trackRef, onIndex) {
  const state = useRef({ mode: 'idle', pointerId: -1, startX: 0, startPos: 0, pos: 0, vel: 0, target: 0, samples: [], raf: 0, last: 0, suppressClick: false, caught: false });
  const onIndexRef = useRef(onIndex);
  onIndexRef.current = onIndex;

  // The in-range part scrolls natively; the rest becomes a damped translate on the track.
  const apply = useCallback(pos => {
    const scroller = scrollerRef.current, track = trackRef.current;
    if (!scroller || !track) return;
    const inRange = clamp(pos, 0, maxScroll(scroller));
    scroller.scrollLeft = inRange;
    const over = pos - inRange;
    track.style.transform = Math.abs(over) > 0.1 ? `translate3d(${(-rubber(over, scroller.clientWidth)).toFixed(2)}px,0,0)` : '';
  }, [scrollerRef, trackRef]);
  const setFree = useCallback(free => { if (scrollerRef.current) scrollerRef.current.dataset.free = String(free); }, [scrollerRef]);

  const step = useCallback(now => {
    const s = state.current;
    const dt = Math.min((now - s.last) / 1000, 1 / 30);
    s.last = now;
    const h = dt / 4; // semi-implicit Euler substeps keep the spring stable at any frame rate
    for (let i = 0; i < 4; i++) {
      s.vel += (-STIFFNESS * (s.pos - s.target) - DAMPING * s.vel) * h;
      s.pos += s.vel * h;
    }
    if (Math.abs(s.pos - s.target) < 0.5 && Math.abs(s.vel) < 8) {
      s.pos = s.target; s.vel = 0; s.mode = 'idle';
      apply(s.target); setFree(false);
      return;
    }
    apply(s.pos);
    s.raf = requestAnimationFrame(step);
  }, [apply, setFree]);

  const springTo = useCallback((target, velocity) => {
    const s = state.current, scroller = scrollerRef.current;
    if (!scroller) return;
    cancelAnimationFrame(s.raf);
    if (s.mode === 'idle') s.pos = scroller.scrollLeft;
    s.target = target; s.vel = velocity;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.mode = 'idle'; s.pos = target; apply(target); setFree(false);
      return;
    }
    s.mode = 'spring'; setFree(true);
    s.last = performance.now();
    s.raf = requestAnimationFrame(step);
  }, [apply, scrollerRef, setFree, step]);

  const goTo = useCallback(index => {
    const scroller = scrollerRef.current, track = trackRef.current;
    if (!scroller || !track) return;
    const s = state.current, points = snapPoints(scroller, track);
    springTo(points[clamp(index, 0, points.length - 1)], s.mode === 'spring' ? s.vel : 0);
  }, [scrollerRef, springTo, trackRef]);

  const currentIndex = useCallback(() => {
    const scroller = scrollerRef.current, track = trackRef.current;
    if (!scroller || !track) return 0;
    const s = state.current;
    return nearestIndex(snapPoints(scroller, track), s.mode === 'spring' ? s.target : scroller.scrollLeft);
  }, [scrollerRef, trackRef]);

  useEffect(() => {
    const scroller = scrollerRef.current, track = trackRef.current;
    if (!scroller || !track) return;
    const s = state.current;
    let scrollRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => onIndexRef.current(nearestIndex(snapPoints(scroller, track), scroller.scrollLeft)));
    };
    const suppressNextClick = () => { s.suppressClick = true; setTimeout(() => { s.suppressClick = false; }, 0); };
    const onPointerDown = e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(s.raf);
      s.caught = s.mode === 'spring'; // catching a moving rail keeps its position, overshoot included
      s.pos = s.caught ? s.pos : scroller.scrollLeft;
      s.mode = 'pressing'; s.pointerId = e.pointerId; s.startX = e.clientX; s.startPos = s.pos;
      s.samples = [{ t: e.timeStamp, x: e.clientX }];
    };
    const onPointerMove = e => {
      if (e.pointerId !== s.pointerId) return;
      const dx = e.clientX - s.startX;
      if (s.mode === 'pressing' && Math.abs(dx) > DRAG_THRESHOLD) {
        s.mode = 'dragging';
        scroller.setPointerCapture(e.pointerId);
        scroller.dataset.dragging = 'true';
        setFree(true);
      }
      if (s.mode !== 'dragging') return;
      s.pos = s.startPos - dx;
      apply(s.pos);
      s.samples.push({ t: e.timeStamp, x: e.clientX });
      while (s.samples.length > 2 && e.timeStamp - s.samples[0].t > 100) s.samples.shift();
    };
    const onRelease = e => {
      if (e.pointerId !== s.pointerId) return;
      s.pointerId = -1;
      if (s.mode !== 'dragging') {
        if (s.caught) { // a rail caught mid-flight settles on the nearest card; that tap doesn't open one
          suppressNextClick();
          const points = snapPoints(scroller, track);
          springTo(points[nearestIndex(points, s.pos)], 0);
          return;
        }
        s.mode = 'idle'; setFree(false);
        return;
      }
      scroller.dataset.dragging = 'false';
      suppressNextClick();
      const v = releaseVelocity(s.samples, e.timeStamp);
      const projected = s.pos + (v * DECELERATION) / (1 - DECELERATION);
      const points = snapPoints(scroller, track);
      springTo(points[nearestIndex(points, projected)], v * 1000);
    };
    const onClickCapture = e => { if (s.suppressClick) { e.preventDefault(); e.stopPropagation(); s.suppressClick = false; } };
    const onNativeInput = () => { // wheel or touch takes over from a running spring
      if (s.mode !== 'spring') return;
      cancelAnimationFrame(s.raf);
      s.mode = 'idle';
      apply(clamp(s.pos, 0, maxScroll(scroller)));
      setFree(false);
    };
    const onKeyDown = e => { // arrows step one card; Home and End jump to the ends
      if (e.target !== scroller) return;
      const index = nearestIndex(snapPoints(scroller, track), s.mode === 'spring' ? s.target : scroller.scrollLeft);
      const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: track.children.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      goTo(next);
    };
    scroller.addEventListener('keydown', onKeyDown);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('pointerdown', onPointerDown);
    scroller.addEventListener('pointermove', onPointerMove);
    scroller.addEventListener('pointerup', onRelease);
    scroller.addEventListener('pointercancel', onRelease);
    scroller.addEventListener('lostpointercapture', onRelease);
    scroller.addEventListener('click', onClickCapture, true);
    scroller.addEventListener('wheel', onNativeInput, { passive: true });
    scroller.addEventListener('touchstart', onNativeInput, { passive: true });
    return () => {
      cancelAnimationFrame(scrollRaf); cancelAnimationFrame(s.raf);
      scroller.removeEventListener('keydown', onKeyDown);
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointermove', onPointerMove);
      scroller.removeEventListener('pointerup', onRelease);
      scroller.removeEventListener('pointercancel', onRelease);
      scroller.removeEventListener('lostpointercapture', onRelease);
      scroller.removeEventListener('click', onClickCapture, true);
      scroller.removeEventListener('wheel', onNativeInput);
      scroller.removeEventListener('touchstart', onNativeInput);
    };
  }, [apply, goTo, scrollerRef, setFree, springTo, trackRef]);

  return { goTo, currentIndex };
}

// aria-disabled rather than disabled at the ends, so focus stays put.
const ARROW = 'grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink ring-1 ring-[#1a1714]/[0.12] transition-[background-color,opacity] duration-150 ease-out hover:bg-[#f4f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-white';

export default function UseCases({ onUse }) {
  const reduce = !!useReducedMotion();
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const { goTo, currentIndex } = useMomentumRail(scrollerRef, trackRef, setActive);
  const step = d => goTo(currentIndex() + d);
  const select = c => onUse?.({ id: 'uc-' + c.id, prompt: c.prompt });

  return (
    <section aria-labelledby="uc-title" className="relative overflow-x-clip px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20">
          <div>
            <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Use cases</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id="uc-title" className={'m-0 leading-[1.04] text-ink ' + TITLE}
              lines={['One interviewer.', 'Every use case that matters.']} />
          </div>
          <ScrubText reduce={reduce} lag={0.2} offset={END_OFFSET} className="max-w-[48ch] text-[17px] leading-[1.55] text-ink-2 sm:text-[18px]">
            <p className="m-0">Frank ships with 11 interview templates, each trained on a specific situation. He already knows what to ask someone who just cancelled versus someone who just bought. Pick one, tweak it, launch it.</p>
          </ScrubText>
        </div>

        <ScrubText reduce={reduce} lag={0.1} aria-roledescription="carousel" aria-label="Use cases" className="uc-rail mt-[clamp(28px,4vw,48px)]">
          <div className="flex items-center justify-end gap-2 font-sans">
            <span aria-live="polite" className="mr-1 text-[13px] tabular-nums text-ink-3">
              <span className="sr-only">Use case </span>{String(active + 1).padStart(2, '0')}
              <span aria-hidden="true"> / </span><span className="sr-only"> of </span>{String(CASES.length).padStart(2, '0')}
            </span>
            <button type="button" aria-label="Previous use case" aria-disabled={active === 0} onClick={() => step(-1)} className={ARROW}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button type="button" aria-label="Next use case" aria-disabled={active === CASES.length - 1} onClick={() => step(1)} className={ARROW}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* A focusable scroller is how keyboard users reach the arrow keys. It runs edge to edge
              across the window (the section clips the overhang), so cards slide in from the sides.
              A scroller clips on both axes, so its padding leaves room for the cards' shadow (it
              reaches ~44px below a card). */}
          <div ref={scrollerRef} tabIndex={0} aria-label="Use cases, use arrow keys to move"
            className="uc-rail-scroller relative mx-[calc(50%-50vw)] overflow-x-auto overscroll-x-contain pb-16 pt-8 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink">
            <ul ref={trackRef} className="relative m-0 flex w-max list-none gap-5 p-0" style={{ paddingInline: 'calc(50% - var(--rail-card) / 2)' }}>
              {CASES.map(c => <RailCard key={c.id} c={c} onSelect={select} />)}
            </ul>
          </div>
        </ScrubText>
      </div>
    </section>
  );
}
