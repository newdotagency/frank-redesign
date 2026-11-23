// Lovable-style typewriter placeholder, drawn as an overlay above an empty input.
// It is purely visual: aria-hidden + aria-live="off" so screen readers never hear it
// re-typed. The input carries its own label and a static example for assistive tech.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { spring } from '../lib/motion';

const TYPE_MS = 40;     // per character
const DELETE_MS = 20;   // per character
const HOLD_MS = 2000;   // full prompt on screen
const GAP_MS = 360;     // empty beat before the next prompt
const FADE_MS = 3600;   // reduced-motion crossfade interval

// holdMs (opt-in): how long a full prompt stays on screen; also stretches the reduced-motion crossfade.
export default function AnimatedPlaceholder({ prompts, state, reduced, startDelay = 0, focusHint, holdMs = HOLD_MS }) {
  // state: 'animate' | 'focused' | 'hidden'
  const running = state === 'animate';
  const [text, setText] = useState('');
  const [mode, setMode] = useState('typing');
  const [fadeIdx, setFadeIdx] = useState(0);
  const r = useRef({ i: 0, c: 0, mode: 'typing', started: false });

  useEffect(() => {
    if (!running || reduced) return;
    const s = r.current;
    let t;
    // Resuming after focus/typing: start clean on the next prompt instead of
    // finishing a half-typed one.
    if (s.started && s.c > 0) { s.i = (s.i + 1) % prompts.length; s.c = 0; setText(''); }
    s.mode = 'typing'; setMode('typing');
    const step = () => {
      s.started = true; // set on the first tick, so StrictMode's double effect keeps the entrance delay
      const full = prompts[s.i];
      if (s.mode === 'typing') {
        if (s.c < full.length) {
          s.c++; setText(full.slice(0, s.c));
          t = setTimeout(step, TYPE_MS + (Math.random() * 16 - 8));
        } else {
          s.mode = 'holding'; setMode('holding');
          t = setTimeout(() => { s.mode = 'deleting'; setMode('deleting'); step(); }, holdMs);
        }
      } else if (s.mode === 'deleting') {
        if (s.c > 0) { s.c--; setText(full.slice(0, s.c)); t = setTimeout(step, DELETE_MS); }
        else { s.i = (s.i + 1) % prompts.length; s.mode = 'typing'; setMode('typing'); t = setTimeout(step, GAP_MS); }
      }
    };
    t = setTimeout(step, s.started ? GAP_MS : startDelay);
    return () => clearTimeout(t);
  }, [running, reduced, prompts, startDelay, holdMs]);

  // Reduced motion: whole prompts, gently crossfading.
  useEffect(() => {
    if (!running || !reduced) return;
    const id = setInterval(() => setFadeIdx(i => (i + 1) % prompts.length), FADE_MS + holdMs - HOLD_MS);
    return () => clearInterval(id);
  }, [running, reduced, prompts.length, holdMs]);

  return (
    <div aria-hidden="true" aria-live="off"
      className="pointer-events-none absolute inset-0 select-none text-[#6f6860]">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'focused' && (
          <motion.span key="hint" className="block text-[#6f6860]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: spring.snappy }} transition={spring.smooth}>
            {focusHint}
          </motion.span>
        )}
        {running && reduced && (
          <motion.span key={'f' + fadeIdx} className="block"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring.soft}>
            {prompts[fadeIdx]}
          </motion.span>
        )}
        {running && !reduced && (
          <motion.span key="type" className="block"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: spring.snappy }} transition={spring.smooth}>
            {text}
            <span className={'ml-[1px] inline-block h-[1.1em] w-[1.5px] translate-y-[0.18em] rounded-full bg-ink/60 ' + (mode === 'holding' ? 'caret-blink' : '')} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
