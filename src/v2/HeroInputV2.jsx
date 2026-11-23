// HeroInputV2 — V1's composer (same behaviour) restyled to DESIGN-2: eggshell card with the
// whisper shadow, an ink focus ring instead of a coloured glow, black/stone buttons only.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedPlaceholder from '../components/AnimatedPlaceholder';
import { spring } from '../lib/motion';
import { PLACEHOLDER_PROMPTS } from '../data/playbooks';

const FILL_MS = 18; // template fill types faster than the idle placeholder, so it reads as a quick reply
const DRAFT_MS = 1800;

// DESIGN-2 elevation: 1px hard edge + 1px + 4px blur at 4%. Focus adds an ink hairline ring.
const SHADOW = {
  rest:  '0 0 0 0px rgba(0,0,0,0), 0 0 1px 0 rgba(0,0,0,0.4), 0 1px 1px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.04)',
  hover: '0 0 0 0px rgba(0,0,0,0), 0 0 1px 0 rgba(0,0,0,0.5), 0 1px 2px 0 rgba(0,0,0,0.05), 0 4px 10px 0 rgba(0,0,0,0.05)',
  focus: '0 0 0 1px rgba(0,0,0,0.9), 0 0 1px 0 rgba(0,0,0,0.4), 0 1px 1px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.04)',
};

// Buttons never move. Each icon has its own small hover animation, done with CSS
// transitions so it reverses smoothly when the pointer leaves mid-way.
// The icon wrapper also gives a quick squeeze on press.
const ICON_WRAP = 'relative grid place-items-center transition-transform duration-150 ease-out group-active:scale-90';

function IconButton({ label, pressed, onClick, children, active, halo }) {
  return (
    <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick}
      className={'group relative grid size-9 place-items-center rounded-full transition-colors duration-200 ease-out ' +
        (active ? 'bg-stone text-black' : 'text-graphite hover:bg-taupe hover:text-black')}>
      {halo}
      <span aria-hidden="true" className={ICON_WRAP}>{children}</span>
    </button>
  );
}

const ArrowUp = props => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SendButton({ ready, phase, onStop }) {
  const busy = phase === 'drafting';
  const live = ready || busy;
  return (
    <motion.button type={busy ? 'button' : 'submit'} onClick={busy ? onStop : undefined}
      aria-label={busy ? 'Stop drafting' : 'Send'}
      disabled={!live}
      initial={false}
      animate={{ backgroundColor: live ? '#000000' : '#ebe8e4', color: live ? '#ffffff' : '#a59f97' }}
      whileHover={live ? { backgroundColor: '#44403b' } : undefined}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="group relative grid size-9 place-items-center rounded-full disabled:cursor-default">
      {busy && (
        <motion.span aria-hidden="true" className="absolute inset-0 rounded-full ring-1 ring-black/40"
          animate={{ scale: [1, 1.28], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], repeat: Infinity }} />
      )}
      <span aria-hidden="true" className={ICON_WRAP}>
        <AnimatePresence mode="wait" initial={false}>
          {busy ? (
            <motion.span key="stop" className="block size-[10px] rounded-[2.5px] bg-current"
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={spring.snappy} />
          ) : (
            // Arrow loop: on hover the arrow exits upward and a fresh one rises in from
            // below, inside a clipped 16px window, so the icon never leaves its spot.
            <motion.span key="arrow" className="relative block size-4 overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring.snappy}>
              <ArrowUp className={'absolute inset-0 transition-transform duration-300 ease-out ' + (ready ? 'motion-safe:group-hover:-translate-y-full' : '')} />
              <ArrowUp className={'absolute inset-0 translate-y-full transition-transform duration-300 ease-out ' + (ready ? 'motion-safe:group-hover:translate-y-0' : '')} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

const HeroInputV2 = forwardRef(function HeroInputV2({ reduced, onStatus, onUserEdit, startDelay }, ref) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [filling, setFilling] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | drafting | ready
  const [file, setFile] = useState(null);
  const [listening, setListening] = useState(false);
  const [micNote, setMicNote] = useState('');
  const ta = useRef(null);
  const fileInput = useRef(null);
  const fillTimer = useRef(0);
  const draftTimer = useRef(0);
  const rec = useRef(null);

  const hasText = value.trim().length > 0;

  // Auto-grow the textarea up to a comfortable cap.
  useEffect(() => {
    const el = ta.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [value]);

  useEffect(() => { onStatus?.({ focused, hasText, filling, phase, listening }); }, [focused, hasText, filling, phase, listening, onStatus]);
  useEffect(() => () => { clearTimeout(fillTimer.current); clearTimeout(draftTimer.current); rec.current?.abort?.(); }, []);

  const stopFill = () => { clearTimeout(fillTimer.current); setFilling(false); };

  const focusEnd = () => {
    const el = ta.current; if (!el) return;
    el.focus({ preventScroll: true });
    const n = el.value.length; el.setSelectionRange(n, n);
  };

  const fill = useCallback(prompt => {
    clearTimeout(fillTimer.current);
    setPhase('idle');
    if (reduced) { setValue(prompt); requestAnimationFrame(focusEnd); return; }
    setFilling(true);
    setValue('');
    let i = 0;
    const tick = () => {
      i++;
      setValue(prompt.slice(0, i));
      if (i < prompt.length) fillTimer.current = setTimeout(tick, FILL_MS);
      else { setFilling(false); requestAnimationFrame(focusEnd); }
    };
    fillTimer.current = setTimeout(tick, 120);
  }, [reduced]);

  useImperativeHandle(ref, () => ({ fill, focus: focusEnd }), [fill]);

  const submit = e => {
    e?.preventDefault();
    if (!hasText || phase === 'drafting') return;
    stopFill();
    setPhase('drafting');
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => setPhase('ready'), DRAFT_MS);
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };

  const onChange = e => {
    onUserEdit?.();
    if (filling) stopFill(); // the user took over
    if (phase === 'ready') setPhase('idle');
    setValue(e.target.value);
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicNote('Voice input isn’t supported in this browser'); setTimeout(() => setMicNote(''), 2600); return; }
    if (listening) { rec.current?.stop(); return; }
    stopFill();
    const r = new SR();
    r.lang = navigator.language || 'en-US'; r.interimResults = true; r.continuous = false;
    const base = value ? value.replace(/\s*$/, ' ') : '';
    r.onresult = ev => { onUserEdit?.(); let t = ''; for (const res of ev.results) t += res[0].transcript; setValue(base + t); };
    r.onend = () => { setListening(false); focusEnd(); };
    r.onerror = () => setListening(false);
    rec.current = r; setListening(true); r.start();
  };

  const placeholderState = hasText || filling ? 'hidden' : focused ? 'focused' : 'animate';

  return (
    <form onSubmit={submit} className="relative" aria-label="Start a study">
      <motion.div
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        onClick={e => { if (e.target === e.currentTarget) focusEnd(); }}
        initial={false}
        animate={{
          boxShadow: focused ? SHADOW.focus : hovered ? SHADOW.hover : SHADOW.rest,
          borderColor: focused ? 'rgba(88,120,44,0.42)' : hovered ? 'rgba(26,23,20,0.16)' : 'rgba(26,23,20,0.10)',
        }}
        transition={spring.smooth}
        className="relative cursor-text rounded-[20px] bg-egg">

        <AnimatePresence initial={false}>
          {file && (
            <motion.div key="file" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={spring.smooth}
              className="overflow-hidden px-4 pt-3 sm:px-5">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-stone bg-taupe py-1 pl-3 pr-1 text-[13px] text-graphite">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></svg>
                <span className="truncate">{file.name}</span>
                <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFile(null)}
                  className="grid size-6 place-items-center rounded-md text-smoke transition-colors duration-200 hover:bg-stone hover:text-black">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative px-4 pt-4 text-[16px] leading-[1.5] tracking-[0.01em] sm:px-5 sm:pt-5">
          <label htmlFor="hero-goal" className="sr-only">What do you want to learn from your customers?</label>
          <span id="hero-goal-hint" className="sr-only">For example: {PLACEHOLDER_PROMPTS[0]} Press Enter to send, Shift and Enter for a new line.</span>
          <div className="relative">
          <textarea
            id="hero-goal" ref={ta} rows={2} value={value}
            onChange={onChange} onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            aria-describedby="hero-goal-hint"
            className="block min-h-[2.6em] w-full resize-none bg-transparent text-black caret-black outline-none placeholder:text-transparent focus-visible:outline-none"
            style={{ outline: 'none' }}
          />
          <AnimatedPlaceholder prompts={PLACEHOLDER_PROMPTS} state={placeholderState} reduced={reduced}
            startDelay={startDelay} focusHint="Describe what you want to learn…" />
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-0.5 sm:px-3 sm:pb-3">
          <IconButton label="Attach a file" onClick={() => fileInput.current?.click()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"
              className="transition-transform duration-200 ease-out motion-safe:group-hover:rotate-90"><path d="M12 5v14M5 12h14" /></svg>
          </IconButton>
          <input ref={fileInput} type="file" className="sr-only" tabIndex={-1} aria-hidden="true"
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); e.target.value = ''; }} />

          {/* Status rides in the toolbar so the layout below never shifts. */}
          <div className="min-w-0 flex-1 text-[13px]" role="status" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {micNote && (
                <motion.p key="mic" className="truncate text-smoke" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>{micNote}</motion.p>
              )}
              {!micNote && listening && (
                <motion.p key="listen" className="breathe truncate text-graphite" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>Listening…</motion.p>
              )}
              {!micNote && !listening && phase === 'drafting' && (
                <motion.p key="draft" className="breathe truncate text-graphite" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>Frank is drafting your interview guide…</motion.p>
              )}
              {!micNote && !listening && phase === 'ready' && (
                <motion.p key="ready" className="flex min-w-0 items-center gap-2 text-graphite" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-black text-white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span className="hidden truncate sm:inline">Your interview guide is ready.</span>
                  <a href="#signup" className="shrink-0 font-medium text-black underline decoration-stone decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-black">Sign up to run it →</a>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <IconButton label={listening ? 'Stop voice input' : 'Speak your question'} pressed={listening} active={listening} onClick={toggleMic}
            halo={listening && !reduced && (
              <motion.span aria-hidden="true" className="absolute inset-0 rounded-full bg-stone"
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], repeat: Infinity }} />
            )}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              className={listening ? 'eq-live' : ''}>
              {/* mic: steps back on hover (and while listening) to make room for the equalizer */}
              <g className={'transition-[opacity,transform] duration-200 ease-out [transform-origin:12px_12px] ' + (listening ? 'opacity-0 scale-75' : 'group-hover:opacity-0 group-hover:scale-75')}>
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
              </g>
              {/* voice equalizer: three bars bouncing out of phase */}
              <g fill="currentColor" stroke="none" className={'transition-opacity duration-200 ease-out ' + (listening ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                <rect className="eq-bar" x="5.5" y="5" width="3" height="14" rx="1.5" />
                <rect className="eq-bar" x="10.5" y="5" width="3" height="14" rx="1.5" />
                <rect className="eq-bar" x="15.5" y="5" width="3" height="14" rx="1.5" />
              </g>
            </svg>
          </IconButton>
          <SendButton ready={hasText} phase={phase} onStop={() => { clearTimeout(draftTimer.current); setPhase('idle'); focusEnd(); }} />
        </div>
      </motion.div>
    </form>
  );
});

export default HeroInputV2;
