// HeroInput — the hero's focal point. A soft composer with attach, dictation and send.
// Exposes `fill(prompt)` so template pills can type a goal into it.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import { spring } from '../lib/motion';
import { PLACEHOLDER_PROMPTS } from '../data/playbooks';

const FILL_MS = 18; // template fill types faster than the idle placeholder, so it reads as a quick reply
const DRAFT_MS = 1800;

const SHADOW = {
  rest:  'inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 0px rgba(209,248,153,0), 0 1px 2px rgba(26,23,20,0.04), 0 6px 16px -4px rgba(26,23,20,0.06), 0 28px 56px -20px rgba(64,44,24,0.16)',
  hover: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 0px rgba(209,248,153,0), 0 1px 2px rgba(26,23,20,0.05), 0 8px 20px -6px rgba(26,23,20,0.08), 0 34px 64px -22px rgba(64,44,24,0.20)',
  focus: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 5px rgba(209,248,153,0.55), 0 1px 2px rgba(26,23,20,0.05), 0 10px 24px -6px rgba(26,23,20,0.08), 0 36px 72px -24px rgba(64,44,24,0.22)',
};
// skin="frank" (V7): V1's soft composer, with a calmer selected state — the border firms to
// ink, a hairline ink halo replaces the thick lime ring, and the input lifts (deeper soft
// shadow). Same layer count as SHADOW so it interpolates smoothly.
const SHADOW_FRANK = {
  ...SHADOW,
  focus: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 6px rgba(26,23,20,0.04), 0 1px 3px rgba(26,23,20,0.045), 0 10px 26px -8px rgba(26,23,20,0.08), 0 36px 72px -26px rgba(64,44,24,0.20)',
};
// skin="flat" (V3): no shadow depth, no blur, no glow. A crisp 1px line that firms up on
// hover, and a solid 2px ink ring on focus. Single layer, so it interpolates cleanly.
const SHADOW_FLAT = {
  rest:  '0 0 0 1px rgba(26,23,20,0.16)',
  hover: '0 0 0 1px rgba(26,23,20,0.4)',
  focus: '0 0 0 2px #1a1714',
};
// skin="parchment" (V7, DESIGN-5 inspired): white plate on parchment, pebble hairline, soft
// warm contact shadow; focus = sepia line + peach halo. Same layer count in every state.
const SHADOW_PA = {
  rest:  '0 0 0 1px #d9cfc3, 0 0 0 0px rgba(254,208,179,0), 0 14px 36px -18px rgba(43,24,10,0.14)',
  hover: '0 0 0 1px #c3b6a7, 0 0 0 0px rgba(254,208,179,0), 0 18px 44px -18px rgba(43,24,10,0.18)',
  focus: '0 0 0 1.5px #2b180a, 0 0 0 5px rgba(254,208,179,0.6), 0 18px 44px -18px rgba(43,24,10,0.18)',
};
// skin="editorial" (V5, DESIGN-4 inspired): warm hairline, ink focus line, rounded (oval) shapes.
const SHADOW_ED = {
  rest:  '0 0 0 1px #dedbd6',
  hover: '0 0 0 1px #b8b3ab',
  focus: '0 0 0 1.5px #111111',
};

// Buttons never move. Each icon has its own small hover animation, done with CSS
// transitions so it reverses smoothly when the pointer leaves mid-way.
// The icon wrapper also gives a quick squeeze on press.
const ICON_WRAP = 'relative grid place-items-center transition-transform duration-150 ease-out group-active:scale-90';

function IconButton({ label, pressed, onClick, children, active, halo, ed, pa, className = '' }) {
  const tone = pa
    ? (active ? 'bg-[#fed0b3] text-[#2b180a]' : 'text-[#7f6e60] hover:bg-[#f0e6dc] hover:text-[#2b180a]')
    : ed
    ? (active ? 'bg-[#f1eee9] text-[#111111]' : 'text-[#414141] hover:bg-[#f1eee9] hover:text-[#111111]')
    : (active ? 'bg-brand text-brand-fg' : 'text-ink-2 hover:bg-[#f1efea] hover:text-ink');
  return (
    <button type="button" aria-label={label} aria-pressed={pressed} onClick={onClick}
      className={'group relative grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-200 ease-out ' + tone + (className ? ' ' + className : '')}>
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

function SendButton({ ready, phase, onStop, ed, pa }) {
  const busy = phase === 'drafting';
  const live = ready || busy;
  return (
    <motion.button type={busy ? 'button' : 'submit'} onClick={busy ? onStop : undefined}
      aria-label={busy ? 'Stop drafting' : 'Send'}
      disabled={!live}
      initial={false}
      animate={pa
        // DESIGN-5 signature: chestnut fill with a warm peach bloom behind it when active
        ? { backgroundColor: live ? '#3e2407' : '#f0e6dc', color: live ? '#ffffff' : '#a99d93',
            boxShadow: live ? '0 6px 18px -4px rgba(254,208,179,1)' : '0 0px 0px 0px rgba(254,208,179,0)' }
        : ed
        ? { backgroundColor: live ? '#000000' : '#f1eee9', color: live ? '#ffffff' : '#a0a0a0' }
        : { backgroundColor: live ? '#171717' : '#ebe8e3', color: live ? '#ffffff' : '#8f887f' }}
      whileHover={live ? (pa ? { backgroundColor: '#2b180a' } : ed ? { backgroundColor: '#414141' } : { backgroundColor: '#d1f899', color: '#2a321e' }) : undefined}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={'group relative grid size-9 shrink-0 place-items-center rounded-full disabled:cursor-default'}>
      {busy && (
        <motion.span aria-hidden="true" className={'absolute inset-0 rounded-full ' + (pa ? 'ring-2 ring-[#fed0b3]' : ed ? 'ring-1 ring-[#111111]/40' : 'ring-2 ring-brand')}
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

// `docked` (V8): when true the composer collapses into one row — attach · text · mic · send —
// for the bottom dock. Same DOM in both layouts (only classes change), so the textarea keeps its
// value, caret and focus while it moves. Left undefined, nothing about the composer changes.
const HeroInput = forwardRef(function HeroInput({ reduced, onStatus, onUserEdit, startDelay, skin = 'soft', docked, prompts = PLACEHOLDER_PROMPTS, placeholderHold }, ref) {
  const ed = skin === 'editorial', pa = skin === 'parchment', fr = skin === 'frank';
  const flat = skin === 'flat' || ed || pa;
  const SH = fr ? SHADOW_FRANK : pa ? SHADOW_PA : ed ? SHADOW_ED : flat ? SHADOW_FLAT : SHADOW;
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
    el.style.height = Math.min(el.scrollHeight, docked ? 132 : 220) + 'px';
  }, [value, docked]);

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
          boxShadow: focused ? SH.focus : hovered ? SH.hover : SH.rest,
          ...(flat ? {} : { borderColor: focused ? (fr ? 'rgba(26,23,20,0.24)' : 'rgba(88,120,44,0.42)') : hovered ? 'rgba(26,23,20,0.16)' : 'rgba(26,23,20,0.10)' }),
          ...(docked == null ? {} : { borderRadius: docked ? 28 : 20 }),
        }}
        transition={spring.smooth}
        className={'relative cursor-text ' + (pa ? 'rounded-[18px] bg-white' : flat ? 'rounded-[20px] bg-white' : 'rounded-[20px] border bg-white/90 backdrop-blur-sm')
          + (docked ? ' flex items-end gap-1 p-2.5' : '')}>

        <AnimatePresence initial={false}>
          {file && (
            <motion.div key="file" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={spring.smooth}
              className={docked ? 'absolute bottom-full left-0 mb-3 overflow-hidden' : 'overflow-hidden px-4 pt-3 sm:px-5'}>
              <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-line-2 bg-canvas py-1 pl-2.5 pr-1 text-[13px] text-ink-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></svg>
                <span className="truncate">{file.name}</span>
                <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFile(null)}
                  className="grid size-6 place-items-center rounded-md text-ink-3 transition-colors duration-300 ease-frank hover:bg-line-2 hover:text-ink">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={docked ? 'relative min-w-0 flex-1 px-1.5 py-[5.6px] text-[16px] leading-[1.55] [&_span.block]:truncate' : 'relative px-4 pt-4 text-[16px] leading-[1.55] sm:px-5 sm:pt-5 sm:text-[17px]'}>
          <label htmlFor="hero-goal" className="sr-only">What do you want to learn from your customers?</label>
          <span id="hero-goal-hint" className="sr-only">For example: {prompts[0]} Press Enter to send, Shift and Enter for a new line.</span>
          <div className="relative">
          <textarea
            id="hero-goal" ref={ta} rows={docked ? 1 : 2} value={value}
            onChange={onChange} onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            aria-describedby="hero-goal-hint"
            className={(docked ? 'min-h-[1.55em]' : 'min-h-[2.6em]') + ' block w-full resize-none bg-transparent text-ink caret-ink outline-none placeholder:text-transparent focus-visible:outline-none'}
            style={{ outline: 'none' }}
          />
          <AnimatedPlaceholder prompts={prompts} state={placeholderState} reduced={reduced}
            startDelay={startDelay} holdMs={placeholderHold} focusHint="Describe what you want to learn…" />
          </div>
        </div>

        <div className={docked ? 'contents' : 'flex items-center gap-2 px-2.5 pb-2.5 pt-0.5 sm:px-3 sm:pb-3'}>
          <IconButton ed={ed} pa={pa} label="Attach a file" onClick={() => fileInput.current?.click()} className={docked ? 'order-first' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"
              className="transition-transform duration-200 ease-out motion-safe:group-hover:rotate-90"><path d="M12 5v14M5 12h14" /></svg>
          </IconButton>
          <input ref={fileInput} type="file" className="sr-only" tabIndex={-1} aria-hidden="true"
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); e.target.value = ''; }} />

          {/* Status rides in the toolbar so the layout below never shifts. */}
          {/* Docked: the status floats above the bar as a small chip instead. */}
          <div className={docked
            ? 'absolute bottom-full left-2 mb-3 max-w-[calc(100%-16px)] text-[13px] [&>*]:rounded-full [&>*]:bg-white/95 [&>*]:px-3 [&>*]:py-1.5 [&>*]:shadow-[0_0_0_1px_rgba(26,23,20,0.08),0_8px_20px_-8px_rgba(64,44,24,0.25)]'
            : 'min-w-0 flex-1 text-[13px]'} role="status" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {micNote && (
                <motion.p key="mic" className="truncate text-ink-3" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>{micNote}</motion.p>
              )}
              {!micNote && listening && (
                <motion.p key="listen" className="breathe truncate text-ink-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>Listening…</motion.p>
              )}
              {!micNote && !listening && phase === 'drafting' && (
                <motion.p key="draft" className="breathe truncate text-ink-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>Frank is drafting your interview guide…</motion.p>
              )}
              {!micNote && !listening && phase === 'ready' && (
                <motion.p key="ready" className="flex min-w-0 items-center gap-2 text-ink-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.smooth}>
                  <span className={'grid size-4 shrink-0 place-items-center rounded-full ' + (pa ? 'bg-[#3e2407] text-white' : ed ? 'bg-[#111111] text-white' : 'bg-brand text-brand-fg')}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span className="hidden truncate sm:inline">Your interview guide is ready.</span>
                  <a href="#signup" className="shrink-0 font-medium text-ink underline decoration-brand-strong decoration-2 underline-offset-4 transition-colors duration-300 ease-frank hover:decoration-ink">Sign up to run it →</a>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <IconButton ed={ed} pa={pa} label={listening ? 'Stop voice input' : 'Speak your question'} pressed={listening} active={listening} onClick={toggleMic}
            halo={listening && !reduced && (
              <motion.span aria-hidden="true" className={'absolute inset-0 rounded-full ' + (pa ? 'bg-[#fed0b3]' : ed ? 'bg-[#f1eee9]' : 'bg-brand')}
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
          <SendButton ed={ed} pa={pa} ready={hasText} phase={phase} onStop={() => { clearTimeout(draftTimer.current); setPhase('idle'); focusEnd(); }} />
        </div>
      </motion.div>
    </form>
  );
});

export default HeroInput;
