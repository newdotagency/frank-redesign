// ClosingCTA (V21.1) — the page's last moment, centred. The one bold move: a full-width panel in
// Frank's own lime (the only full-strength block of it on the page), flat, no grain,
// and Frank's glasses above the title, glancing toward the pointer as if listening. Title in three
// lines ("tell Frank." highlighted like the hero's "anything."), the subtitle, then two actions: "Try a live interview" (ink) scrolls up to the Interview
// example; "Sign up" (quiet white) goes where the header's sign-up goes (#signup, until a real page).
// Entrance (reveal.jsx): the panel rises and grows in with the scroll; the title lines slide up.
// After V5's closing: four small white pills from the product sit around the statement, one format
// (a small live indicator, a label, a muted figure), each showing something happening: a study turns
// ready (its check draws), an interview runs (a waveform and a ticking timer), last night's count keeps
// climbing, the top theme's bar fills. They drift in from their corners as the card arrives, then float
// slowly and lean away from the pointer a few pixels, at different depths, as the glasses follow it.
// Only on screens at least 1280px wide and 760px tall, where they clear the copy; everything stops off
// screen, and with reduced motion they sit still showing their final state.
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Mic } from 'lucide-react';
import Glasses from '../v3/Glasses';
import HighlightMarker from '../components/HighlightMarker';
import { TITLE } from './titles';
import { ScrubText, ScrubTitle, useScrubIn } from './reveal';
import './cta.css';

const MONO = 'font-gmono text-[12px] tabular-nums text-ink/50';

// A check in a lime circle that draws itself once the card is on screen.
function Check({ live, reduce }) {
  return (
    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-[#d1f899]">
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="#1a1714" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M2.5 6.3 5 8.6l4.5-5" initial={false} animate={{ pathLength: live || reduce ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }} />
      </svg>
    </span>
  );
}

// The interview's clock, running while the card is on screen.
function Timer({ live }) {
  const [t, setT] = useState(24 * 60 + 12);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setT(v => v + 1), 1000);
    return () => clearInterval(id);
  }, [live]);
  return <span className={MONO}>{Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')}</span>;
}

// Last night's count, climbing by one every few seconds; each new number rolls up into place.
function Count({ live, reduce }) {
  const [n, setN] = useState(114);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setN(v => (v < 139 ? v + 1 : v)), 3200);
    return () => clearInterval(id);
  }, [live]);
  return (
    <span className="relative inline-flex h-[18px] overflow-hidden font-medium tabular-nums">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={n} initial={reduce ? false : { transform: 'translateY(100%)', opacity: 0 }}
          animate={{ transform: 'translateY(0%)', opacity: 1 }} exit={{ transform: 'translateY(-100%)', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>{n}</motion.span>
      </AnimatePresence>
    </span>
  );
}

// The pills. `at`: where each settles in the card; `from`: how far outward it starts (vw, vh); `lag`
// staggers arrivals; `depth`: how many px it leans from the pointer; `dur`/`delay`: its float.
const CHIPS = [
  { at: 'left-[7%] top-[12%]', from: [-4, -3], lag: 0, depth: 10, dur: 6.5, delay: 0,
    body: ({ live, reduce }) => <><Check live={live} reduce={reduce} /><span className="font-medium">Study ready</span><span className={MONO}>6 questions</span></> },
  { at: 'right-[5%] top-[20%]', from: [4, -3], lag: 0.08, depth: 16, dur: 7.5, delay: -2,
    body: ({ live }) => <><span className={'cta-wave flex h-5 w-5 flex-none items-center justify-center gap-[2px] text-ink ' + (live ? 'on' : '')}><i /><i /><i /><i /></span><span className="font-medium">Interview in Spanish</span><Timer live={live} /></> },
  { at: 'left-[4%] bottom-[18%]', from: [-4, 3], lag: 0.16, depth: 14, dur: 7, delay: -4,
    body: ({ live, reduce }) => <><span className="h-2 w-2 flex-none rounded-full bg-[#8fc24f]" /><Count live={live} reduce={reduce} /><span className={MONO}>interviews overnight</span></> },
  { at: 'right-[8%] bottom-[10%]', from: [4, 3], lag: 0.24, depth: 8, dur: 6, delay: -1,
    body: ({ live, reduce }) => <><span className="font-medium">Setup takes too long</span>
      <span className="block h-1.5 w-12 overflow-hidden rounded-full bg-[#1a1714]/[0.08]">
        <motion.i className="block h-full w-full origin-left rounded-full bg-[#8fc24f]" initial={false}
          animate={{ transform: `scaleX(${live || reduce ? 0.42 : 0})` }} transition={{ duration: 1.1, delay: 0.7, ease: [0.23, 1, 0.32, 1] }} />
      </span><span className={MONO}>42%</span></> },
];

function Chip({ p, px, py, live, reduce, at, from: [dx, dy], lag, depth, dur, delay, body: Body }) {
  const q = useTransform(p, [lag, lag + 0.6], [0, 1], { clamp: true });
  const x = useTransform(q, v => dx * (1 - v));
  const y = useTransform(q, v => dy * (1 - v));
  const enter = useMotionTemplate`translate(${x}vw, ${y}vh)`;
  const lx = useTransform(px, v => -v * depth);
  const ly = useTransform(py, v => -v * depth);
  const lean = useMotionTemplate`translate(${lx}px, ${ly}px)`;
  return (
    <motion.div aria-hidden="true" style={reduce ? undefined : { transform: enter, opacity: q }}
      className={'absolute hidden xl:block [@media(max-height:760px)]:!hidden ' + at}>
      <motion.div style={reduce ? undefined : { transform: lean }}>
        <div className={live ? 'cta-float' : ''} style={{ '--dur': dur + 's', '--delay': delay + 's' }}>
          <div className="flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full bg-white/90 pl-3 pr-5 font-sans text-[14px] text-ink shadow-[0_1px_2px_rgba(42,50,30,0.06),0_18px_40px_-22px_rgba(42,50,30,0.35)]">
            <Body live={live} reduce={reduce} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function ClosingCTA() {
  const reduce = !!useReducedMotion();
  const panel = useRef(null);
  const scrub = useScrubIn(panel, reduce);
  // The cards' progress: from the card's top entering the screen to its top near the screen's top
  // (the page ends with the card in full view, its top 16–40px down, so the range always completes).
  const { scrollYProgress } = useScroll({ target: panel, offset: ['start 0.9', 'start 0.1'] });
  const chipsP = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6, restDelta: 0.0005 });
  const onScreen = useInView(panel, { amount: 0.5 });
  const live = onScreen && !reduce;
  // The pointer's place over the card, -1 to 1 each way, eased; the pills lean away from it.
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 20 }), py = useSpring(rawY, { stiffness: 60, damping: 20 });
  const onMove = e => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };
  // "tell Frank?" is set like the hero's "anything.": Lora italic with the hand-drawn highlighter,
  // in the brand violet on the lime panel. It draws once the title is in view (and again on hover, as in the hero).
  // Frank's glasses behave as in the hero chat (the same component): they turn toward the pointer and
  // blink (a slow idle blink on touch), resting "Ready", and look "Curious" while a button is hovered.
  const [pose, setPose] = useState('Ready');
  const look = { onPointerEnter: () => setPose('Curious'), onPointerLeave: () => setPose('Ready') };
  const titleBox = useRef(null);
  const titleIn = useInView(titleBox, { once: true, amount: 0.6 });
  const tellFrank = titleIn
    ? <HighlightMarker reduced={reduce} delay={0.6} color="#d1b2ff" shade="#c4a0fb">tell Frank?</HighlightMarker>
    : <span className="relative inline-block">tell Frank?</span>;
  // "Try a live interview": a smooth scroll to the Interview example, its title clear of the header.
  const toInterview = e => {
    const el = document.getElementById('ie-title');
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    // The same footprint as the hero's chat screen once it has wrapped into a card: an even 16px
    // (phones) / 40px gap from the window's edges, 44px corners, a screen's height. No frame or border:
    // a soft light along the top of the lime, and no shadow.
    <section aria-labelledby="cta-title" className="relative px-4 pb-4 md:px-10 md:pb-10">
      <motion.div ref={panel} style={scrub}
        className="relative rounded-[44px]">
        <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative grid min-h-[calc(100svh-32px)] place-items-center overflow-hidden rounded-[44px] bg-[#d1f899] px-6 py-[clamp(64px,9vw,128px)] text-center md:min-h-[calc(100svh-80px)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 100%)' }} />
          {CHIPS.map((c, i) => <Chip key={i} p={chipsP} px={px} py={py} live={live} reduce={reduce} {...c} />)}
          <div className="relative z-[1] mx-auto max-w-[900px]">
            <div aria-hidden="true" className="mx-auto w-[84px] sm:w-[104px]">
              <Glasses pose={pose} reduced={reduce} />
            </div>
            <div ref={titleBox}>
              <ScrubTitle reduce={reduce} id="cta-title" className={'m-0 mt-8 leading-[1.06] text-ink [text-wrap:balance] sm:mt-10 ' + TITLE}
                lines={['Your customers have', 'something to say.', <>Maybe they want to <span className="italic">{tellFrank}</span></>]} />
            </div>
            <ScrubText as="p" reduce={reduce} lag={0.15} className="mx-auto mb-0 mt-6 max-w-[44ch] font-sans text-[17px] leading-[1.5] text-ink/75 [text-wrap:balance] sm:mt-7 sm:text-[19px]">
              Describe what you want to learn and hear from your customers before your next standup.
            </ScrubText>
            <ScrubText reduce={reduce} lag={0.25} className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              {/* Primary: the mic sits in its own circle at the button's end; on hover it nudges up and
                  out and grows a touch, on press the whole button sinks. */}
              <a href="#ie-title" onClick={toInterview} {...look}
                className={'group inline-flex h-14 items-center gap-3 rounded-full bg-black py-1.5 pl-6 pr-1.5 font-sans text-[16px] text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#262626] active:scale-[0.98] ' + FOCUS}>
                Try a live interview
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:-translate-y-px motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:scale-105">
                  <Mic className="size-[18px]" strokeWidth={1.75} />
                </span>
              </a>
              <a href="#signup" {...look}
                className={'inline-flex h-14 items-center rounded-full bg-white/75 px-7 font-sans text-[16px] text-ink no-underline ring-1 ring-[#1a1714]/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white active:scale-[0.98] ' + FOCUS}>
                Sign up
              </a>
            </ScrubText>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
