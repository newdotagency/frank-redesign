// HowItWorks (V21.11; from V21) — the three steps after "What is Frank": a centred eyebrow, title and
// subtitle, then a two-column split. Left: the steps as one list on a thin rule; the active step opens
// to show its title and description (the others stay one-line: number, name, title), so the steps and
// their copy read as one unit. Right: the step's visual, larger.
// Desktop: the split pins while you scroll through a 300svh track; each third of the scroll is one
// step. The active step's rule segment (brand violet) fills as you scroll through it. Behind it, a
// few faint light green lines (Background Paths) drift slowly and part around the cursor. Clicking a
// step scrolls to it. The visual card stays put and only its scene changes (StepVisuals); the open
// step's description unfolds and its paragraphs rise in.
// Below 1024px: stacked cards, the visual then the centred title and description, no pinning.
// Entrance: the eyebrow, title and subtitle rise in one after another, then the step menu, card and
// copy as the stage arrives (reveal.js); on phones each step card rises in.
// Reduced motion: the steps still change with scroll; copy fades without rising and the lines hold still.
// Opt-in content (V21.04, for the AI voice interviewer page): `steps` ({ name, title, body, scene? — a
// StepVisuals scene to show instead of that step's own}), `label` (the
// eyebrow), `lines` (the title), `subtitle` (null for none), `id` (the title's id; tab ids derive from it) and
// `icon` on a step (an image address: a small icon beside its number), `name` may be empty; `action` (one element under the whole list of steps, e.g. a "Try it now" button). The homepage passes none.
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import BackgroundPaths from '@/components/ui/background-paths';
import StepVisual from './StepVisuals';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
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
const ACCENT = '#ba86fc'; // Frank's brand violet, for the active step's rule segment
const EASE_OUT = [0.23, 1, 0.32, 1];

// A step's card on phones: the same scene as on desktop, in its own card.
const Visual = ({ index, reduce, scene }) => (
  <div className="relative aspect-[9/10] w-full overflow-hidden rounded-[22px] sm:rounded-[28px]">
    <StepVisual index={index} reduce={reduce} active={!reduce} scene={scene} />
  </div>
);

const Body = ({ step, className = '' }) => step.body.map(t => (
  <p key={t} className={'m-0 mt-3 font-sans text-[16px] leading-[1.55] text-ink-2 ' + className}>{t}</p>
));

export default function HowItWorks({ eyebrow = true, steps = STEPS, label = 'How Frank works',
  lines = ['Your first customer interview', 'in under 5 minutes'],
  subtitle = 'From question to answer, without writing a single line of code.', id = 'hiw-title', action = null, slider = false }) {
  const reduce = !!useReducedMotion();
  const N = steps.length;
  const tid = id.replace(/-title$/, '');
  const track = useRef(null);
  const tabs = useRef([]);
  const [active, setActive] = useState(0);
  const [dot, setDot] = useState(0);
  const onRail = e => { const el = e.currentTarget; const card = el.children[0]; if (!card) return; setDot(Math.max(0, Math.min(N - 1, Math.round(el.scrollLeft / (card.offsetWidth + 16))))); };
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
    <section aria-labelledby={id} className="relative pb-[clamp(128px,15vw,232px)] lg:pb-[clamp(16px,2vw,40px)]">
      {/* From 1024px the pinned track already leaves room under the centred card (it fills the
          screen), so the section's own bottom padding is small there; the gap to the next section
          then matches the others. */}
      <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-[clamp(16px,4vw,48px)]">
        <div ref={head} className="mx-auto max-w-[860px]">
          {eyebrow && <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">{label}</Eyebrow></ScrubText>}
          <ScrubTitle reduce={reduce} id={id} className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={lines} />
          {subtitle && (
            <ScrubText as="p" reduce={reduce} lag={0.1} className={'mx-auto mb-0 max-w-[40ch] [text-wrap:balance] sm:max-w-none mt-6 ' + SUBTITLE}>
              {subtitle}
            </ScrubText>
          )}
        </div>
      </div>

      {/* Desktop: the columns pin while the track scrolls by; each third of it is one step. */}
      <div ref={track} className="relative hidden h-[300svh] lg:block">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          {/* A few faint, light green lines (kokonutui Background Paths) behind the steps: they drift
              slowly (a third of the default speed) and part softly around the mouse, the parting
              gliding after the cursor. They fade out toward the right, behind the step's copy (v19.css). */}
          <BackgroundPaths className="hiw-paths !absolute inset-0 !min-h-0" count={9} speed={0.3} partRadius={230} partPush={30} smooth={0.35} children={null} />

          {/* pointer-events-none lets the mouse reach the lines; the steps and card take it back. */}
          <div className="pointer-events-none relative mx-auto grid w-full max-w-[1240px] grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-16 px-[clamp(16px,4vw,48px)] xl:gap-24">
            {/* The steps: one list; the open step carries its own title and description. */}
            <motion.div {...reveal(reduce, 0)} className="pointer-events-auto relative lg:right-[30px]">
            <div role="tablist" aria-label={label} aria-orientation="vertical" className="flex flex-col" onKeyDown={onKey}>
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <div key={s.name} className="relative border-0 border-l-2 border-solid border-[#e5e1d8] pl-7">
                    {/* The open step's segment of the rule fills as you scroll through the step. */}
                    {on && (
                      <motion.span aria-hidden="true" className="absolute -left-[2px] top-0 h-full w-[2px] origin-top"
                        style={{ backgroundColor: ACCENT, scaleY: reduce ? 1 : within }} />
                    )}
                    <button ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`${tid}-tab-${i}`}
                      aria-selected={on} aria-controls={`${tid}-panel-${i}`} tabIndex={on ? 0 : -1} onClick={() => goTo(i)}
                      className={'group block w-full cursor-pointer border-0 bg-transparent p-0 pt-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1714]' + (i === 0 ? ' !pt-1' : '') + (i === N - 1 && !on ? ' pb-1' : '')}>
                      <span className={'block font-sans text-[14px] leading-none' + (on ? ' text-ink-2' : ' text-ink-3')}>
                        <span className="mr-2 tabular-nums">{i + 1}</span>
                        {s.icon && <img src={s.icon} alt="" aria-hidden="true" draggable={false} className={'mr-2 inline-block size-[15px] align-[-2px] ' + (on ? 'opacity-70' : 'opacity-35')} />}{s.name}
                      </span>
                      <span className={'hiw-step-title mt-2.5 block leading-[1.15] [text-wrap:balance]' + (reduce ? '' : ' transition-[color] duration-300 ease-out')
                        + (on ? ' text-[30px] text-ink' : ' text-[22px] text-ink-3 group-hover:text-ink-2')}>
                        {s.title}
                      </span>
                    </button>
                    {/* The description unfolds under the open step (grid rows 0fr to 1fr). */}
                    <div id={`${tid}-panel-${i}`} role="tabpanel" aria-labelledby={`${tid}-tab-${i}`} hidden={!on && reduce}
                      className={'grid' + (reduce ? '' : ' transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]') + (on ? ' grid-rows-[1fr]' : ' grid-rows-[0fr]')}>
                      <div className="overflow-hidden">
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.div key="copy" variants={copy} initial="hidden" animate="shown" exit="gone" className="pb-1">
                              {s.body.map(t => (
                                <motion.p key={t} variants={line} className="m-0 mt-3 max-w-[42ch] font-sans text-[16px] leading-[1.55] text-ink-2">{t}</motion.p>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {action && <div className="mt-9 pl-7">{action}</div>}
            </motion.div>

            {/* One card that stays put; only the scene inside it changes with the step (StepVisuals). */}
            <motion.div style={cardIn} className="pointer-events-auto relative aspect-[9/10] w-full max-w-[580px] justify-self-end lg:left-[30px] overflow-hidden rounded-[28px] bg-[#d1f899] [max-height:calc(100svh-120px)]">
              {steps.map((s, i) => (
                <div key={s.name} className={'absolute inset-0' + fade + shown(i)}>
                  <StepVisual index={i} active={i === active} reduce={reduce} scene={s.scene} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Below 1024px: outlined cards, visual then the left-aligned title and description: stacked, or (slider) one swipeable row. */}
      {slider ? (
        <div className="lg:hidden">
          <ol onScroll={onRail} aria-label={label} className="m-0 mt-12 flex list-none snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-[clamp(16px,4vw,48px)]">
            {steps.map((s, i) => (
              <li key={s.name} className="w-[86%] max-w-[420px] shrink-0 snap-center rounded-[28px] bg-white p-3 text-left shadow-[0_0_0_1.5px_rgba(26,23,20,0.14)]">
                <Visual index={i} reduce={reduce} scene={s.scene} />
                <p className="m-0 mt-6 px-3 font-sans text-[14px] text-ink-2"><span className="tabular-nums">{i + 1}</span>&ensp;{s.name}</p>
                <h3 className="hiw-step-title m-0 mt-2 px-3 text-[24px] leading-[1.15] text-ink">{s.title}</h3>
                <div className="px-3 pb-3"><Body step={s} /></div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
            {steps.map((s, i) => <span key={s.name} className={'h-2 rounded-full transition-all duration-300 ' + (i === dot ? 'w-6 bg-ink' : 'w-2 bg-ink/20')} />)}
          </div>
        </div>
      ) : (
      <ol className="m-0 mt-12 flex list-none flex-col gap-14 px-4 sm:px-[clamp(16px,4vw,48px)] lg:hidden">
        {steps.map((s, i) => (
          <motion.li key={s.name} {...reveal(reduce, 0, { amount: 0.2 })} className="mx-auto w-full max-w-[480px] rounded-[28px] p-3 text-left shadow-[0_0_0_1.5px_rgba(26,23,20,0.14)]">
            <Visual index={i} reduce={reduce} scene={s.scene} />
            <p className="m-0 mt-6 px-3 font-sans text-[14px] text-ink-2"><span className="tabular-nums">{i + 1}</span>&ensp;{s.name}</p>
            <h3 className="hiw-step-title m-0 mt-2 px-3 text-[24px] leading-[1.15] text-ink">{s.title}</h3>
            <div className="px-3 pb-3"><Body step={s} /></div>
          </motion.li>
        ))}
      </ol>
      )}
      {action && <div className="mt-10 flex justify-center px-4 lg:hidden">{action}</div>}
    </section>
  );
}
