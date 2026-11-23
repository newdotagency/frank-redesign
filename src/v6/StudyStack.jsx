// Study cards — the live study told visually, with very little text, as four small cards that
// sit around the centred chat (two each side), all driven by ONE shared timeline (useStudy):
//   QuoteCard (customer voice) · StatsCard (counting interviews / hours)
//   ProgressCard (5-step bar + one status line) · ThemesCard (three ranked bars)
// Loop per study: launch → interview (count up) → transcribe → find themes (bars grow) → rank
// → hold → fade → next study. Lassie-style motion: 1s expo.out, steps ~650–1400ms apart.
// Styling follows V1: warm canvas, white frosted surfaces, layered soft shadows, lime accent.
// Reduced motion: final state of the first study, static. Decorative: one sr-only sentence.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';

export const STUDIES = [
  { name: 'Why users churn', people: 24, hours: 6,
    themes: [['Onboarding friction', 42], ['Price vs. usage', 31], ['Missing exports', 18]],
    quote: 'I didn’t know where to start.', who: 'Churned user' },
  { name: 'What stops trials converting', people: 31, hours: 7,
    themes: [['Unclear value', 38], ['Setup effort', 27], ['Pricing tiers', 21]],
    quote: 'I never got to the good part.', who: 'Trial user' },
  { name: 'How onboarding feels', people: 18, hours: 4,
    themes: [['First-run confusion', 45], ['Too many steps', 29], ['Great support', 16]],
    quote: 'Support saved me on day one.', who: 'New signup' },
];
const STEP_LINE = [
  s => `Launching “${s.name}”`,
  s => `Interviewing ${s.people} customers`,
  s => `Transcribing ${s.hours} hours of conversations`,
  () => 'Finding recurring themes',
  () => 'Ranked by impact',
];
// When each step starts (ms from study start); then hold and loop.
const AT = [0, 700, 2300, 3200, 4100];
const HOLD = 3200, FADE = 600;

// V1 surface language
export const SURFACE = 'border border-[rgba(26,23,20,0.10)] bg-white/90 backdrop-blur-sm';
export const SHADOW = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(26,23,20,0.04), 0 6px 16px -4px rgba(26,23,20,0.06), 0 28px 56px -20px rgba(64,44,24,0.16)';

export function useStudy({ start, reduced, onState }) {
  const [s, setS] = useState(reduced ? { study: 0, step: 5, leaving: false } : { study: 0, step: 0, leaving: false });
  const timers = useRef([]);
  useEffect(() => {
    if (reduced) return;
    const T = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const run = (study, at) => {
      T(() => setS({ study, step: 0, leaving: false }), at);
      AT.forEach((ms, i) => T(() => setS(x => ({ ...x, step: i + 1 })), at + 40 + ms));
      const end = at + 40 + AT[AT.length - 1] + HOLD;
      T(() => setS(x => ({ ...x, leaving: true })), end);
      T(() => run((study + 1) % STUDIES.length, 0), end + FADE + 200);
    };
    run(0, start * 1000);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [start, reduced]);
  const cb = useRef(onState); cb.current = onState;
  useEffect(() => { cb.current?.(s); }, [s]);
  return s;
}

function Counter({ to, active, reduced, suffix = '' }) {
  const v = useMotionValue(reduced ? to : 0);
  const text = useTransform(v, n => Math.round(n) + suffix);
  useEffect(() => {
    if (reduced) { v.set(to); return; }
    if (!active) { v.set(0); return; }
    const c = animate(v, to, { duration: 1.4, ease: EXPO_OUT });
    return () => c.stop();
  }, [to, active, reduced, v]);
  return <motion.span>{text}</motion.span>;
}

function StepIcon({ done, reduced }) {
  return (
    <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        {done ? (
          <motion.svg key="d" width="16" height="16" viewBox="0 0 16 16" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EXPO_OUT }}>
            <circle cx="8" cy="8" r="8" fill="#1a1714" />
            <path d="M4.6 8.3 7 10.6l4.4-4.9" fill="none" stroke="#d1f899" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        ) : (
          <motion.svg key="s" width="16" height="16" viewBox="0 0 16 16" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: reduced ? 0 : 360 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 }, rotate: { duration: 0.9, ease: 'linear', repeat: Infinity } }}>
            <circle cx="8" cy="8" r="6.6" fill="none" stroke="rgba(26,23,20,0.14)" strokeWidth="1.6" />
            <path d="M8 1.4a6.6 6.6 0 0 1 6.6 6.6" fill="none" stroke="#1a1714" strokeWidth="1.6" strokeLinecap="round" />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}

// Shared entrance + slow float for every card (offset loops so nothing moves in sync).
function Card({ i, start, reduced, tilt = 0, float = 10, className = '', style, children }) {
  return (
    <motion.div aria-hidden="true" className={'w-full max-w-[280px] ' + className}
      initial={reduced ? { opacity: 0, rotate: tilt } : { opacity: 0, y: 14, rotate: tilt }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: reduced ? 0.4 : 1.2, ease: EXPO_OUT, delay: start + i * 0.12 }}>
      <motion.div className={'rounded-[20px] p-5 ' + SURFACE} style={{ boxShadow: SHADOW, ...style }}
        animate={reduced ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: float, ease: [0.45, 0, 0.55, 1], repeat: Infinity, delay: i * 0.7 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

const fade = leaving => ({ animate: { opacity: leaving ? 0 : 1 }, transition: { duration: FADE / 1000, ease: EXPO_OUT } });

export function QuoteCard({ st, i, start, reduced }) {
  const s = STUDIES[st.study];
  return (
    <Card i={i} start={start} reduced={reduced} tilt={-4} float={11}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={st.study} initial={{ opacity: 0 }} exit={{ opacity: 0 }} {...fade(st.leaving)}>
          <p className="font-serif text-[18px] italic leading-[1.35] text-ink">“{s.quote}”</p>
          <p className="mt-2 text-[12px] text-ink-3">{s.who}</p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export function StatsCard({ st, i, start, reduced }) {
  const s = STUDIES[st.study];
  return (
    <Card i={i} start={start} reduced={reduced} float={9}>
      <motion.div className="grid grid-cols-2 gap-4" {...fade(st.leaving)}>
        <div>
          <p className="font-serif text-[34px] leading-none tracking-[-0.02em] text-ink"><Counter to={s.people} active={st.step >= 2} reduced={reduced} /></p>
          <p className="mt-1.5 text-[12px] text-ink-3">interviews</p>
        </div>
        <div>
          <p className="font-serif text-[34px] leading-none tracking-[-0.02em] text-ink"><Counter to={s.hours} active={st.step >= 3} reduced={reduced} suffix="h" /></p>
          <p className="mt-1.5 text-[12px] text-ink-3">of conversations</p>
        </div>
      </motion.div>
    </Card>
  );
}

export function ProgressCard({ st, i, start, reduced }) {
  const s = STUDIES[st.study];
  const done = st.step >= 5;
  const line = STEP_LINE[Math.max(0, Math.min(4, st.step - 1))](s);
  return (
    <Card i={i} start={start} reduced={reduced} float={10.5}>
      <motion.div {...fade(st.leaving)}>
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[14px] font-medium text-ink">{s.name}</p>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f4f2ec] px-2.5 py-1 text-[12px] text-ink-2">
            <span className={'size-1.5 rounded-full ' + (done ? 'bg-ink' : 'bg-brand-strong ' + (reduced ? '' : 'breathe'))} />
            {done ? 'Done' : 'Live'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {AT.map((_, k) => (
            <span key={k} className="h-1 overflow-hidden rounded-full bg-[#ece9e2]">
              <motion.span className="block h-full origin-left rounded-full bg-ink"
                initial={false} animate={{ scaleX: st.step > k ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.8, ease: EXPO_OUT }} />
            </span>
          ))}
        </div>
        <div className="mt-3 flex h-5 items-center gap-2 overflow-hidden">
          <StepIcon done={done} reduced={reduced} />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={line} className="truncate text-[13px] text-ink-2"
              initial={reduced ? false : { y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 1, ease: EXPO_OUT }}>
              {line}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </Card>
  );
}

export function ThemesCard({ st, i, start, reduced }) {
  const s = STUDIES[st.study];
  const themesIn = st.step >= 4, done = st.step >= 5;
  return (
    <Card i={i} start={start} reduced={reduced} float={11.5}>
      <motion.div {...fade(st.leaving)}>
        <p className="text-[12px] text-ink-3">Top themes</p>
        <ul className="mt-3 grid gap-3">
          {s.themes.map(([name, pct], k) => (
            <li key={st.study + name}>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <motion.span className="truncate text-ink" initial={false} animate={{ opacity: themesIn ? 1 : 0.25 }} transition={{ duration: 0.6, delay: themesIn ? k * 0.12 : 0 }}>{name}</motion.span>
                <motion.span className="text-ink-3 [font-variant-numeric:tabular-nums]" initial={false} animate={{ opacity: themesIn ? 1 : 0 }} transition={{ duration: 0.6, delay: themesIn ? 0.3 + k * 0.12 : 0 }}>{pct}%</motion.span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#ece9e2]">
                <motion.div className={'h-full origin-left rounded-full ' + (k === 0 && done ? 'bg-brand-strong' : 'bg-ink')}
                  style={{ width: `${pct * 2}%` }}
                  initial={false} animate={{ scaleX: themesIn ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 1, ease: EXPO_OUT, delay: themesIn ? k * 0.12 : 0 }} />
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </Card>
  );
}
