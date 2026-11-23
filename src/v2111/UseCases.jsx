// UseCases (V21) — "One interviewer. Every use case that matters." The eight use cases as a card
// rail, after kokonutui's Momentum Rail (MIT, @dorianbaffier): flick it with the mouse and the
// release velocity projects an end point, a spring settles on the nearest card, the ends
// rubber-band. Scroll position drives a cover-flow depth (CSS scroll-driven animation, rail.css).
// Each card is white, with its template's small Figma icon top left (Template-Icons, node 2113:9800),
// then the name, when Frank shows up and what you find out. Choosing a card types its question into
// the chat at the bottom of the screen: pick one, tweak it, launch it.
// Entrance (reveal.jsx): the heading as in the other sections, then the rail rises in with the scroll.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react';
import PlaybookIcon from '../components/PlaybookIcon';
import { TEMPLATE_ICONS } from '../data/templateIcons';
import { TITLE, Eyebrow } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle } from './reveal';
import './rail.css';

// icon: a Figma template icon id; idea validation has none there, so it gets a flask in Frank's lime.
const CASES = [
  { id: 'churn', icon: 'churn', name: 'Churn', when: 'Right after a user cancels',
    find: 'The real reason they left, and what would have kept them',
    prompt: 'Why are customers cancelling, and what would have made them stay?' },
  { id: 'trial', icon: 'activation', name: 'Trial drop-off', when: 'When a trial user stalls in onboarding',
    find: 'Where they got stuck and what they expected instead',
    prompt: 'Where do trial users get stuck in onboarding, and what did they expect instead?' },
  { id: 'discovery', icon: 'requests', name: 'Product discovery', when: 'With your most active users',
    find: 'The problems they still solve with workarounds, and what to build next',
    prompt: 'What do our most active users still solve with workarounds?' },
  { id: 'release', icon: 'adoption', name: 'Feature release', when: 'After someone first uses a new feature',
    find: 'Whether it solves the problem it was built for',
    prompt: 'Does our new feature solve the problem it was built for?' },
  { id: 'pricing', icon: 'upgrade', name: 'Pricing', when: 'When a visitor leaves the pricing page',
    find: 'What feels expensive, and compared to what',
    prompt: 'What feels expensive on our pricing page, and compared to what?' },
  { id: 'cart', icon: 'checkout', name: 'Abandoned cart', when: 'When a shopper leaves checkout',
    find: 'What stopped the purchase: price, shipping, trust or timing',
    prompt: 'What stopped shoppers from finishing checkout?' },
  { id: 'post', icon: 'value', name: 'Post-purchase', when: 'On the order confirmation page',
    find: 'Why they bought, how they found you, and what almost stopped them',
    prompt: 'Why did customers buy, how did they find us, and what almost stopped them?' },
  { id: 'idea', icon: null, name: 'Idea validation', when: 'With your target market, via the managed panel',
    find: 'Whether an idea lands before you have customers to ask',
    prompt: 'Would our target market want this idea?' },
];
const IDEA = { fg: '#5f8f22', bg: '#eef7dc' };

// The title button is stretched over the whole card, so the card is one target (it types the
// use case's question into the chat).
const STRETCHED = "outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-['']";

// A white card: the template's icon top left, the name, then when Frank shows up and what
// you find out, all inside.
function RailCard({ c, onSelect }) {
  const ic = c.icon ? TEMPLATE_ICONS[c.icon] : IDEA;
  return (
    <li className="uc-rail-card flex-none snap-center" style={{ width: 'var(--rail-card)' }}>
      <div className="uc-rail-tilt group relative">
        <div className="relative flex aspect-[4/5] flex-col rounded-[20px] bg-white p-6 font-sans ring-1 ring-[#1a1714]/[0.08] shadow-[0_24px_50px_-30px_rgba(26,23,20,0.35)] ring-offset-2 ring-offset-white group-has-[[data-rail-link]:focus-visible]:ring-2 group-has-[[data-rail-link]:focus-visible]:ring-ink">
          {/* The icon is the Figma glyph drawn 1.75× (its strokes and its hover motion scale with it).
              Hovering the card plays the icon's own motion (motion.css, ti-*): one part moves. */}
          <span aria-hidden="true" className="grid h-[52px] w-[52px] shrink-0 place-items-center self-start rounded-[14px]" style={{ background: ic.bg, color: ic.fg }}>
            {c.icon
              ? <span className="grid place-items-center" style={{ transform: 'scale(1.75)' }}><PlaybookIcon p={{ id: c.icon }} box={16} /></span>
              : <FlaskConical className="ti-tilt size-7" strokeWidth={1.6} />}
          </span>
          <h3 className="m-0 mt-5">
            <button type="button" data-rail-link="" onClick={() => onSelect(c)}
              className={STRETCHED + ' hiw-step-title cursor-pointer border-0 bg-transparent p-0 text-left text-[21px] leading-tight text-ink'}>
              {c.name}
            </button>
          </h3>
          <div className="mt-auto">
            <p className="m-0 text-[12px] text-ink-3">When Frank shows up</p>
            <p className="m-0 mt-1 text-[14.5px] leading-snug text-ink-2">{c.when}</p>
            <p className="m-0 mt-4 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-4 text-[12px] text-ink-3">What you find out</p>
            <p className="m-0 mt-1 text-[15px] leading-snug text-ink">{c.find}</p>
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
            <p className="m-0">Frank ships with 12 interview templates, each trained on a specific situation. He already knows what to ask someone who just cancelled versus someone who just bought. Pick one, tweak it, launch it.</p>
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
