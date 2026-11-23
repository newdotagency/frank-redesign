// HowItWorks (V21; from V19) — the three steps after "What is Frank", laid out like Wispr Flow's "How it
// works": a centred eyebrow, title and subtitle, then three columns — a step menu on a thin rule
// (left), the step's visual (centre) and its title and description, sitting on the visual's
// bottom edge (right).
// Desktop: the columns pin while you scroll through a 300svh track; each third of the scroll is
// one step. The active step's rule segment (brand violet) fills as you scroll through it. Behind the
// columns, a few faint light green lines (Background Paths) drift slowly and part around the cursor.
// Clicking a step scrolls to it. The visual card stays put and only its scene changes (StepVisuals,
// Granola-style product scenes); the step's
// title and paragraphs rise in one after another (the previous copy fades out first).
// Below 1024px: stacked cards, the visual then the centred title and description, no pinning.
// Entrance: the eyebrow, title and subtitle rise in one after another, then the step menu, card and
// copy as the stage arrives (reveal.js); on phones each step card rises in.
// Reduced motion: the steps still change with scroll; copy fades without rising and the lines hold still.
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import BackgroundPaths from '@/components/ui/background-paths';
import StepVisual from './StepVisuals';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle, reveal, useScrubIn } from './reveal';

const STEPS = [
  {
    name: 'Set up', title: <>Describe it.<br />Frank builds it.</>,
    body: [
      'Type your goal here or tell Dot, Claude, Gemini or your favorite LLM. Frank drafts the study, the questions and the follow-up logic.',
      'Frank can embed itself automatically into any page or user flow, or provide you with an easy link to share.',
    ],
  },
  {
    name: 'Interview', title: 'Frank talks. Customers open up.',
    body: [
      'Frank runs voice and video conversations with hundreds of customers at once, in their own language.',
      'He follows up on every answer while a second agent keeps each conversation on track.',
    ],
  },
  {
    name: 'Insights', title: 'Get the why, with receipts.',
    body: [
      'Themes, sentiment and action items build up as interviews come in.',
      'Click any theme to see the exact words, and the exact customer, behind it.',
    ],
  },
];
const N = STEPS.length;
const ACCENT = '#ba86fc'; // Frank's brand violet, for the active step's rule segment
const EASE_OUT = [0.23, 1, 0.32, 1];

// A step's card on phones: the same scene as on desktop, in its own card.
const Visual = ({ index, reduce }) => (
  <div className="relative aspect-[9/10] w-full overflow-hidden rounded-[22px] sm:rounded-[28px]">
    <StepVisual index={index} reduce={reduce} active={!reduce} />
  </div>
);

const Body = ({ step, className = '' }) => step.body.map(t => (
  <p key={t} className={'m-0 mt-3 font-sans text-[16px] leading-[1.55] text-ink-2 ' + className}>{t}</p>
));

export default function HowItWorks({ eyebrow = true }) {
  const reduce = !!useReducedMotion();
  const track = useRef(null);
  const tabs = useRef([]);
  const [active, setActive] = useState(0);
  const head = useRef(null);
  // The step card rises and grows in as the track scrolls up to the point where the columns pin.
  const cardIn = useScrubIn(track, reduce, { offset: ['start end', 'start start'] });
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', p => setActive(Math.min(N - 1, Math.floor(p * N))));
  // How far through the active step the scroll is (0–1): fills that step's rule segment.
  const within = useTransform(scrollYProgress, p => Math.min(1, Math.max(0, p * N - Math.min(N - 1, Math.floor(p * N)))));

  // Clicking a step scrolls to the middle of its third of the track.
  const goTo = i => {
    const el = track.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / N) * (el.offsetHeight - window.innerHeight), behavior: reduce ? 'auto' : 'smooth' });
  };
  const onKey = e => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = Math.min(N - 1, Math.max(0, active + d));
    goTo(n); tabs.current[n]?.focus();
  };
  // Inside the card: the old step's content fades out in 150 ms, then the new one fades in.
  const fade = reduce ? '' : ' transition-[opacity,visibility] ease-out';
  const shown = i => (i === active
    ? ' visible opacity-100' + (reduce ? '' : ' duration-300 delay-150')
    : ' invisible opacity-0' + (reduce ? '' : ' duration-150'));
  // Copy: the outgoing step fades out quickly, then the title and each paragraph rise in, 70 ms apart.
  const copy = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.07 } },
    gone: { opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } },
  };
  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  };

  return (
    <section aria-labelledby="hiw-title" className="relative pb-[clamp(128px,15vw,232px)] lg:pb-[clamp(16px,2vw,40px)]">
      {/* From 1024px the pinned track already leaves room under the centred card (it fills the
          screen), so the section's own bottom padding is small there; the gap to the next section
          then matches the others. */}
      <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-[clamp(16px,4vw,48px)]">
        <div ref={head} className="mx-auto max-w-[860px]">
          {eyebrow && <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">How it works</Eyebrow></ScrubText>}
          <ScrubTitle reduce={reduce} id="hiw-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Frank talks to your customers,', 'so you can build what they want']} />
          <ScrubText as="p" reduce={reduce} lag={0.1} className="mx-auto mb-0 mt-5 max-w-[40ch] text-[17px] leading-[1.5] text-ink-2 [text-wrap:balance] sm:mt-6 sm:max-w-none sm:text-[20px]">
            From question to answer, without writing a single line of code.
          </ScrubText>
        </div>
      </div>

      {/* Desktop: the columns pin while the track scrolls by; each third of it is one step. */}
      <div ref={track} className="relative hidden h-[300svh] lg:block">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          {/* A few faint, light green lines (kokonutui Background Paths) behind the steps: they drift
              slowly (a third of the default speed) and part softly around the mouse, the parting
              gliding after the cursor. They fade out toward the right, behind the step's copy (v19.css). */}
          <BackgroundPaths className="hiw-paths !absolute inset-0 !min-h-0" count={9} speed={0.3} partRadius={230} partPush={30} smooth={0.35} children={null} />

          {/* pointer-events-none lets the mouse reach the lines; the steps and copy take it back. */}
          <div className="pointer-events-none relative mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(0,440px)_minmax(0,1fr)] gap-12 px-[clamp(16px,4vw,64px)] xl:gap-16">
            <motion.div {...reveal(reduce, 0)} role="tablist" aria-label="How it works" aria-orientation="vertical" className="pointer-events-auto flex flex-col self-start" onKeyDown={onKey}>
              {STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <button key={s.name} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`hiw-tab-${i}`}
                    aria-selected={on} aria-controls="hiw-panel" tabIndex={on ? 0 : -1} onClick={() => goTo(i)}
                    className={'hiw-step-title relative cursor-pointer border-0 border-l-2 border-solid border-[#e5e1d8] bg-transparent py-2 pl-5 pr-0 text-left text-[19px] leading-[1.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]'
                      + (reduce ? '' : ' transition-colors duration-200') + (on ? ' text-ink' : ' text-ink-3 hover:text-ink-2')}>
                    {/* The active step's segment of the rule fills as you scroll through the step. */}
                    {on && (
                      <motion.span aria-hidden="true" className="absolute -left-[2px] top-0 h-full w-[2px] origin-top"
                        style={{ backgroundColor: ACCENT, scaleY: reduce ? 1 : within }} />
                    )}
                    <span className="mr-2.5 tabular-nums">{i + 1}</span>{s.name}
                  </button>
                );
              })}
            </motion.div>

            {/* One card that stays put; only the scene inside it changes with the step (StepVisuals). */}
            <motion.div style={cardIn} className="pointer-events-auto relative aspect-[9/10] w-full overflow-hidden rounded-[28px] bg-[#d1f899]">
              {STEPS.map((s, i) => (
                <div key={s.name} className={'absolute inset-0' + fade + shown(i)}>
                  <StepVisual index={i} active={i === active} reduce={reduce} />
                </div>
              ))}
            </motion.div>

            {/* Pushed to the right edge, the step menu to the left one. */}
            <motion.div {...reveal(reduce, 0.2)} className="pointer-events-auto w-[min(100%,340px)] self-end justify-self-end text-left">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} role="tabpanel" id="hiw-panel" aria-labelledby={`hiw-tab-${active}`}
                  variants={copy} initial="hidden" animate="shown" exit="gone">
                  <motion.h3 variants={line} className="hiw-step-title m-0 text-[28px] leading-[1.15] text-ink [text-wrap:balance]">{STEPS[active].title}</motion.h3>
                  {STEPS[active].body.map(t => (
                    <motion.p key={t} variants={line} className="m-0 mt-3 max-w-[34ch] font-sans text-[16px] leading-[1.55] text-ink-2">{t}</motion.p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Below 1024px: stacked cards — visual, then the centred title and description. */}
      <ol className="m-0 mt-12 flex list-none flex-col gap-14 px-4 sm:px-[clamp(16px,4vw,48px)] lg:hidden">
        {STEPS.map((s, i) => (
          <motion.li key={s.name} {...reveal(reduce, 0, { amount: 0.2 })} className="mx-auto w-full max-w-[480px] text-center">
            <Visual index={i} reduce={reduce} />
            <p className="m-0 mt-6 font-sans text-[14px] text-ink-2"><span className="tabular-nums">{i + 1}</span>&ensp;{s.name}</p>
            <h3 className="hiw-step-title m-0 mt-2 text-[24px] leading-[1.15] text-ink">{s.title}</h3>
            <Body step={s} />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
