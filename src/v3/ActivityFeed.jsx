// ActivityFeed — a live log of Frank running a study, modelled on Lassie's task ticker.
//   variant="card"   (wide screens): rows stack in a small flat card, ~650ms apart; each row
//                    slides up + fades in, its ring spins, then it ticks done before the next.
//                    After the last row: hold 2.5s, fade out, restart with the next study.
//   variant="ticker" (small screens): Lassie's exact pattern — one line in a clipped window,
//                    in from below / out through the top, 1s expo.out, a new line every 2.5s.
// The animated feed is aria-hidden; screen readers get one static sentence instead.
// Reduced motion: the first study, all rows done, no loop.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO_OUT } from './HeroHeadline';

export const STUDIES = [
  { name: 'Why users churn', rows: [
    'Launched study: Why users churn',
    'Interviewed 24 churned users',
    'Transcribed 6 hours of conversations',
    'Found 4 recurring themes',
    'Ranked cancellation reasons by impact',
  ] },
  { name: 'Trial conversion', rows: [
    'Launched study: What stops trials converting',
    'Interviewed 31 trial users',
    'Transcribed 7 hours of conversations',
    'Found 5 conversion blockers',
    'Ranked blockers by revenue at stake',
  ] },
  { name: 'Onboarding feedback', rows: [
    'Launched study: How onboarding feels',
    'Interviewed 18 new signups',
    'Transcribed 4 hours of conversations',
    'Found 3 moments of confusion',
    'Mapped the step people miss first',
  ] },
];

const ROW_GAP = 650;   // next row appears
const DONE_AT = 450;   // ring → check, before the next row
const HOLD = 2500;     // Lassie's cadence
const FADE = 600;
const TICK = 2500;     // ticker interval (Lassie)

function StatusIcon({ done, reduced, size = 16, doneFill = '#1a1714', checkColor = '#d1f899' }) {
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        {done ? (
          <motion.svg key="done" width={size} height={size} viewBox="0 0 16 16"
            initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EXPO_OUT }}>
            <circle cx="8" cy="8" r="8" fill={doneFill} />
            <path d="M4.6 8.3 7 10.6l4.4-4.9" fill="none" stroke={checkColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        ) : (
          <motion.svg key="spin" width={size} height={size} viewBox="0 0 16 16"
            initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: reduced ? 0 : 360 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 }, rotate: { duration: 0.8, ease: 'linear', repeat: Infinity } }}>
            <circle cx="8" cy="8" r="6.6" fill="none" stroke="rgba(26,23,20,0.16)" strokeWidth="1.6" />
            <path d="M8 1.4a6.6 6.6 0 0 1 6.6 6.6" fill="none" stroke="#1a1714" strokeWidth="1.6" strokeLinecap="round" />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}

// Drives the shared timeline: which study, how many rows are visible, how many are done.
function useFeed({ start, reduced, variant, onState }) {
  const [s, setS] = useState(() => reduced ? { study: 0, shown: 5, done: 5, leaving: false } : { study: 0, shown: 0, done: 0, leaving: false });
  const timers = useRef([]);
  useEffect(() => {
    if (reduced) return;
    const T = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    let t = start * 1000;
    const runStudy = (study, at) => {
      const n = STUDIES[study].rows.length;
      const gap = variant === 'ticker' ? TICK : ROW_GAP;
      const doneAt = variant === 'ticker' ? 900 : DONE_AT;
      T(() => setS({ study, shown: 0, done: 0, leaving: false }), at);
      for (let i = 0; i < n; i++) {
        T(() => setS(x => ({ ...x, shown: i + 1 })), at + 20 + i * gap);
        T(() => setS(x => ({ ...x, done: i + 1 })), at + 20 + i * gap + doneAt);
      }
      const end = at + 20 + (n - 1) * gap + doneAt + (variant === 'ticker' ? TICK - doneAt : HOLD);
      T(() => setS(x => ({ ...x, leaving: true })), end);
      T(() => runStudy((study + 1) % STUDIES.length, 0), end + FADE + 250 - 0);
    };
    // Each cycle schedules the next relative to "now", so restarting from 0 is safe.
    const kick = (study, at) => runStudy(study, at);
    kick(0, t);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [start, reduced, variant]);
  // Let the page react to progress (e.g. draw the quote → theme lines when themes are found).
  const cb = useRef(onState); cb.current = onState;
  useEffect(() => { cb.current?.(s); }, [s]);
  return s;
}

function SrSummary() {
  const r = STUDIES[0].rows;
  return <p className="sr-only">Example: Frank {r.map(x => x.charAt(0).toLowerCase() + x.slice(1)).join(', ')}.</p>;
}

// skin="editorial" (V5): warm hairline, mono labels, violet done-checks, soft corners.
const ED = { done: '#0007cb', check: '#ffffff' };

export function ActivityCard({ start = 1.2, reduced, onState, skin }) {
  const ed = skin === 'editorial';
  const { study, shown, done, leaving } = useFeed({ start, reduced, variant: 'card', onState });
  const rows = STUDIES[study].rows;
  const complete = done === rows.length;
  return (
    <div className={'w-[300px] bg-white p-4 text-left ' + 'rounded-[18px] ' + (ed ? 'shadow-[0_0_0_1px_#dedbd6]' : 'shadow-[0_0_0_1px_rgba(26,23,20,0.12)]')}>
      <SrSummary />
      <div aria-hidden="true">
        <div className={'flex items-center justify-between border-b pb-3 ' + (ed ? 'border-[#dedbd6]' : 'border-[rgba(26,23,20,0.1)]')}>
          <span className={ed ? 'font-gmono text-[12px] tracking-[0.1em] text-[#111111]' : 'text-[13px] font-medium text-ink'}>{STUDIES[study].name}</span>
          <span className={'flex items-center gap-1.5 ' + (ed ? 'font-gmono text-[11px] tracking-[0.1em] text-[#585858]' : 'text-[12px] text-ink-2')}>
            <span className={'size-1.5 rounded-full ' + (complete ? (ed ? 'bg-[#0007cb]' : 'bg-ink') : (ed ? 'bg-[#585858] ' : 'bg-[#58782c] ') + (reduced ? '' : 'breathe'))} />
            {complete ? 'Done' : 'Running'}
          </span>
        </div>
        <motion.ul className="mt-3 grid gap-2.5" animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: FADE / 1000, ease: EXPO_OUT }}>
          {rows.map((row, i) => (
            <li key={study + '-' + i} className="h-5 overflow-hidden">
              {i < shown && (
                <motion.div className="flex items-center gap-2.5"
                  initial={reduced ? false : { y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 1, ease: EXPO_OUT }}>
                  <StatusIcon done={i < done} reduced={reduced} {...(ed ? { doneFill: ED.done, checkColor: ED.check } : {})} />
                  <span className={'truncate text-[13.5px] ' + (i < done ? 'text-ink' : 'text-ink-2')}>{row}</span>
                </motion.div>
              )}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export function ActivityTicker({ start = 1.2, reduced, onState, skin }) {
  const ed = skin === 'editorial';
  const { study, shown, done, leaving } = useFeed({ start, reduced, variant: 'ticker', onState });
  const rows = STUDIES[study].rows;
  const i = Math.max(0, shown - 1);
  const visible = shown > 0 && !leaving;
  return (
    <div className="flex justify-center">
      <SrSummary />
      <div aria-hidden="true" className="relative h-6 w-full max-w-[360px] overflow-hidden">
        <AnimatePresence initial={false}>
          {visible && (
            <motion.div key={study + '-' + i} className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap"
              initial={reduced ? { opacity: 0 } : { y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
              transition={{ duration: reduced ? 0.3 : 1, ease: EXPO_OUT }}>
              <StatusIcon done={reduced || i < done} reduced={reduced} size={14} {...(ed ? { doneFill: ED.done, checkColor: ED.check } : {})} />
              <span className="truncate text-[14px] text-ink-2">{rows[i]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
