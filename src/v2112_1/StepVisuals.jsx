// StepVisuals (V19) — what sits inside the "How it works" card, one scene per step, in Granola's
// way of showing a product: a soft painted field fills the card, a cream app window (three grey
// dots, a serif title, small rounded chips) floats on it and runs off the right and bottom edges,
// and a white panel rises over the window's lower half with the step's key content.
// All three tell one study — why shoppers abandon checkout:
//   1 Set up     — the landing page's chat: a template chip is chosen, shows in the box as a token,
//                  sends; Frank replies, and the interview is ready.
//   2 Interview  — Maya on a real video call; the transcript plays with it, her answer marked.
//   3 Insights   — charts filling in: interviews arriving over the week, then the themes as bars;
//                  the top one opens on Maya's exact words.
// The card is one solid Frank green with a light, fading grain (Granola uses scenery photos).
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUp, Calendar, Mic, MousePointer2, PhoneOff, Play, Plus, Users, Video, X } from 'lucide-react';
import Glasses from '../v3/Glasses';
import { cardGrain } from '../components/grain';
import FrankGlasses from '../components/FrankGlasses';
import PlaybookIcon from '../components/PlaybookIcon';
import { PLAYBOOKS } from '../data/playbooks';
import { TEMPLATE_ICONS } from '../data/templateIcons';

// Card background: one solid Frank green with a light grain that fades across it (grain.ts).
const CARD_GREEN = '#d1f899';

const Chip = ({ icon: Icon, children, live }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-solid border-[#e7e2d7] bg-white/60 px-2 py-[3px] font-sans text-[11px] leading-none text-ink-2">
    {live ? <span className="size-1.5 rounded-full bg-[#7fb83a]" /> : Icon && <Icon className="size-3" strokeWidth={1.75} />}
    {children}
  </span>
);

// The cream app window: three dots, then either a panel label (as in Frank's app) or the study's
// serif title with chips. Positioned by the caller.
function Window({ chips, label, bare, className = '', children, ...rest }) {
  return (
    <div {...rest} className={'absolute rounded-[18px] bg-[#fbfaf6] shadow-[0_24px_60px_-20px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.06] ' + className}>
      <div className="flex gap-1.5 px-4 pt-4" aria-hidden="true">
        {[0, 1, 2].map(i => <span key={i} className="size-[9px] rounded-full bg-[#e0dcd2]" />)}
      </div>
      <div className="px-5 pt-5">
        {bare ? null : label ? (
          <p className="m-0 font-sans text-[12px] text-ink-3">{label}</p>
        ) : (
          <>
            <p className="m-0 font-serif text-[22px] leading-tight tracking-[-0.01em] text-ink">Checkout drop-off</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{chips}</div>
          </>
        )}
        {children}
      </div>
    </div>
  );
}

// The white panel that rises over the window's lower half.
const Sheet = ({ className = '', children }) => (
  <div className={'absolute rounded-[16px] bg-white px-4 py-3.5 shadow-[0_-10px_40px_-18px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.06] ' + className}>
    {children}
  </div>
);

// Set up, with the landing page's own chat (the hero's composer and template chips), played as a
// short scene each time the step comes into view:
//   home — "What do you want to learn?", the composer, and the template chips under it; the
//          "Funnel drop-off" chip is chosen and appears in the box as a template token
//          (its icon tile, its name, the caret), as in Frank's design;
//   chat — it sends: the template becomes your message, Frank "types" and replies; then twice you
//          type a follow-up into the composer, letter by letter, send it, and Frank types and answers
//          (three messages from you in all; the thread scrolls up as it grows); then "Your voice
//          interview is ready" rises in place of the composer (V21.11).
// Reduced motion: the finished chat.
// Templates from Frank's Figma (✦ Frank Design › Study Creation — All Templates Dialog), with their
// names as written there; "Funnel drop-off" (where people quit, and why) is the one chosen.
const CHIP_IDS = ['churn', 'trial', 'funnel', 'activation'];
const FIGMA_NAME = { churn: 'Churn Reasons', trial: 'Trial Conversion', funnel: 'Funnel drop-off', activation: 'Activation Barriers' };
const PICK_ID = 'funnel';
const REPLY = 'Good pick. I’ve drafted a funnel drop-off study: research goals, a welcome message and follow-up questions.';
// V21.11: a longer chat, three messages from you (the template, then two you type), each answered by
// Frank. The thread is anchored to the bottom, so older messages slide up and fade at the top.
const FOLLOW_UP = 'Focus on mobile shoppers who leave at shipping.';
const REPLY_2 = 'Done. I’ll talk to mobile visitors only and dig into shipping costs and delivery times.';
const FOLLOW_UP_3 = 'Add a question about promo codes.';
const REPLY_3 = 'Added. I’ll ask whether looking for a promo code made them pause at checkout.';
const READY = 14; // the phase the ready card rises in
// The thread, by phase: each message shows from `at`; Frank's typing dots show from `at` until `until`.
const THREAD = [
  { id: 'u1', at: 3, who: 'you', token: true },
  { id: 't1', at: 4, until: 5, typing: true },
  { id: 'f1', at: 5, who: 'frank', text: REPLY },
  { id: 'u2', at: 7, who: 'you', text: FOLLOW_UP },
  { id: 't2', at: 8, until: 9, typing: true },
  { id: 'f2', at: 9, who: 'frank', text: REPLY_2 },
  { id: 'u3', at: 11, who: 'you', text: FOLLOW_UP_3 },
  { id: 't3', at: 12, until: 13, typing: true },
  { id: 'f3', at: 13, who: 'frank', text: REPLY_3 },
];
const TYPE_MS = 28; // per character, as you type a follow-up into the box

// A follow-up being typed into the composer, letter by letter, with the caret.
function Typing({ text, reduce }) {
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) { setN(text.length); return; }
    setN(0);
    const id = setInterval(() => setN(v => (v >= text.length ? v : v + 1)), TYPE_MS);
    return () => clearInterval(id);
  }, [text, reduce]);
  return <span className="text-ink">{text.slice(0, n)}<span className="ml-px inline-block h-[1.05em] w-px translate-y-[2px] bg-ink" /></span>;
}
// Phases: 0 home · 1 chip chosen · 2 token in the box · 3 sent · 4 Frank typing · 5 reply · 6 ready card
const RISE = { duration: 0.5, ease: [0.23, 1, 0.32, 1] };
// On-screen moves in the chat (the composer gliding down, the thread sliding up): a calm ease-in-out.
const GLIDE = { duration: 0.7, ease: [0.65, 0, 0.35, 1] };
// The thread making room for a new message: the older ones slide up first, and the new one fades in
// once the space is there (its entry waits ~80% of this), so lines never overlap mid-move.
const MAKE_ROOM = { duration: 0.45, ease: [0.65, 0, 0.35, 1] };
// The landing composer's resting shadow (HeroInput, skin="frank").
const COMPOSER_SHADOW = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(26,23,20,0.04), 0 6px 16px -4px rgba(26,23,20,0.06), 0 28px 56px -20px rgba(64,44,24,0.16)';
const CHIP = 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[11px] bg-white/70 pl-2 pr-2.5 font-sans text-[12px] font-medium text-ink-2 transition-shadow duration-200 ease-out';
const CHIP_IDLE = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(26,23,20,0.07)]';
const CHIP_ON = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_1px_rgba(26,23,20,0.2)]';

// The chosen template as it sits in the box (and in the sent message): icon tile + name.
function TemplateToken({ p, caret }) {
  const ic = TEMPLATE_ICONS[p.id];
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-[26px] shrink-0 place-items-center rounded-[7px]" style={{ backgroundColor: ic.bg, color: ic.fg }}>
        <PlaybookIcon p={p} box={14} />
      </span>
      <span className="text-[13.5px] text-ink">{FIGMA_NAME[p.id] ?? p.nm}</span>
      {caret && <span className="tmn-caret ml-0.5 inline-block h-[16px] w-px bg-ink" />}
    </span>
  );
}

// The interview preview: Frank's call room, opened from the ready card's "Preview" button (as in
// the app's set-up flow). A recording chip shows the status; "Start test call" starts recording and
// Frank asks his first question; the red button ends the call; × or Escape closes the preview.
const FIRST_QUESTION = 'Hi, thanks for joining. Think back to your last checkout: where did you stop, and why?';
const clockText = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function CallRoom({ onClose, reduce }) {
  const [live, setLive] = useState(false);
  const [secs, setSecs] = useState(0);
  const start = useRef(null), end = useRef(null);
  // Focus follows the call: Start when idle (and on open), End while live.
  useEffect(() => {
    if (!live) { setSecs(0); start.current?.focus(); return; }
    end.current?.focus();
    const id = setInterval(() => setSecs(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [live]);
  // Escape closes the preview wherever focus is.
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  const stopCall = () => setLive(false);
  return (
    <motion.div role="dialog" aria-label="Interview preview"
      initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
      className="pointer-events-auto absolute inset-[6%] flex origin-center flex-col rounded-[18px] bg-[#0e1016] font-sans text-white shadow-[0_24px_60px_-20px_rgba(14,16,22,0.6)]">
      <div className="flex items-center gap-2 px-4 pt-3.5">
        {/* Recording status, with the call time while live. */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] tabular-nums text-white/85" aria-live="polite">
          <span className={'size-1.5 rounded-full ' + (live ? 'tmn-live bg-[#ff5a5f]' : 'bg-white/40')} aria-hidden="true" />
          {live ? `Recording · ${clockText(secs)}` : 'Not recording'}
        </span>
        <button type="button" onClick={onClose} aria-label="Close preview"
          className="ml-auto grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative grid size-[88px] place-items-center rounded-full bg-[#1c202b]">
          {live && !reduce && [0, 1].map(i => (
            <motion.span key={i} aria-hidden="true" className="absolute inset-0 rounded-full border border-solid border-[#d1f899]/50"
              animate={{ scale: [1, 1.45], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.9 }} />
          ))}
          <span className="block w-[56%]" aria-hidden="true">
            <FrankGlasses pose={live ? 'Listening' : 'Ready'} ink="#fffdf3" follow={false} shift={false} blink reducedMotion={reduce} />
          </span>
        </div>
        <span className="mt-3 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/85">Frank · AI Researcher</span>
        <AnimatePresence>
          {live && (
            <motion.p key="q" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
              className="m-0 mt-4 max-w-[30ch] text-center font-serif text-[13.5px] leading-[1.5] text-white/90">
              {FIRST_QUESTION}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2.5 pb-4">
        {live ? (
          <>
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/10 text-white"><Mic className="size-4" /></span>
            <button ref={end} type="button" onClick={stopCall} aria-label="End test call"
              className="grid size-9 cursor-pointer place-items-center rounded-full border-0 bg-[#e5484d] text-white transition-transform duration-150 ease-out active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <PhoneOff className="size-4" />
            </button>
          </>
        ) : (
          <button ref={start} type="button" onClick={() => setLive(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-white px-4 py-2 text-[12.5px] font-medium text-[#0e1016] transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Play className="size-3" fill="currentColor" strokeWidth={0} />Start test call
          </button>
        )}
      </div>
    </motion.div>
  );
}

function SetUp({ active, reduce }) {
  const root = useRef(null);
  const inView = useInView(root, { amount: 0.5 });
  const run = active && inView && !reduce;
  const [phase, setPhase] = useState(reduce ? READY : 0);
  const phaseRef = useRef(phase); phaseRef.current = phase;
  // The scene's height and the composer's, to seat the composer at the window's foot during the chat.
  const composer = useRef(null), readyCard = useRef(null), pickChip = useRef(null), sendBtn = useRef(null);
  const [box, setBox] = useState({ h: 0, w: 0, c: 84, r: 120 });
  // Where the pointer goes: the chosen chip and the send button, in the scene's own (unscaled) px.
  const [aim, setAim] = useState(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    const at = node => {
      if (!node) return null;
      const r = el.getBoundingClientRect(), b = node.getBoundingClientRect(), k = el.offsetWidth / (r.width || 1);
      return { x: (b.left - r.left + b.width * 0.55) * k, y: (b.top - r.top + b.height * 0.6) * k };
    };
    const measure = () => {
      setBox({ h: el.offsetHeight, w: el.offsetWidth, c: composer.current?.offsetHeight || 84, r: readyCard.current?.offsetHeight || 120 });
      if (phaseRef.current < 3) setAim({ chip: at(pickChip.current), send: at(sendBtn.current) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  // Gap between the composer and the window's bottom edge: the same as its gap to the window's sides
  // (window at 6% of the width, composer at 11%, so 5% of the scene's width).
  const FOOT = box.w ? Math.round(0.05 * box.w) : 28;
  const chatY = box.h ? Math.round(0.94 * box.h - FOOT - box.c - 0.29 * box.h) : 176;
  // When the ready card (taller than the composer) takes the composer's place, the thread slides up
  // by the difference so Frank's last reply stays clear of it.
  const readyBottom = 0.12 * box.h, composerBottom = 0.06 * box.h + FOOT;
  const lift = box.h ? Math.max(0, Math.round(readyBottom + box.r - (composerBottom + box.c))) : 40;
  const [call, setCall] = useState(false);
  const previewBtn = useRef(null);
  const closeCall = () => { setCall(false); requestAnimationFrame(() => previewBtn.current?.focus()); };
  useEffect(() => { if (!active) setCall(false); }, [active]);
  const pick = PLAYBOOKS.find(p => p.id === PICK_ID);
  const chips = CHIP_IDS.map(id => PLAYBOOKS.find(p => p.id === id));

  useEffect(() => {
    if (reduce) { setPhase(READY); return; }
    if (!run) { setPhase(0); return; }
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    window.dispatchEvent(new Event('resize'));
    at(1100, () => setPhase(1));    // chip chosen
    at(1500, () => setPhase(2));    // token in the box
    at(2700, () => setPhase(3));    // sent
    at(3200, () => setPhase(4));    // Frank typing
    at(4200, () => setPhase(5));    // reply
    at(5100, () => setPhase(6));    // you type the first follow-up into the box (~1.3 s)
    at(6900, () => setPhase(7));    // sent
    at(7300, () => setPhase(8));    // Frank typing
    at(8300, () => setPhase(9));    // his answer
    at(9200, () => setPhase(10));   // you type the second follow-up (~0.9 s)
    at(10600, () => setPhase(11));  // sent
    at(11000, () => setPhase(12));  // Frank typing
    at(12000, () => setPhase(13));  // his answer
    at(13100, () => setPhase(READY)); // ready card
    return () => timers.forEach(clearTimeout);
  }, [run, reduce]);

  const home = phase < 3;
  const show = n => (phase >= n ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 });
  return (
    <div ref={root} className="absolute inset-0">
      {/* The chat scene. While the preview is open it steps back out of sight (fades, shrinks a touch),
          so only the call room shows, centred in the card. */}
      <motion.div className="absolute inset-0" initial={false}
        animate={call ? { opacity: 0, scale: reduce ? 1 : 0.97 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        style={{ pointerEvents: call ? 'none' : undefined }} aria-hidden={call || undefined}>
      {/* V21.11: the whole scene sits inside the card (even 6% margins, every corner rounded), so
          nothing looks cropped at the larger card size. */}
      <Window bare aria-hidden className="inset-[6%]">
        <motion.p initial={false} animate={{ opacity: home ? 0 : 1 }} transition={{ duration: 0.3 }}
          className="m-0 -mt-1 font-sans text-[12px] text-ink-3">Set your research goals</motion.p>
      </Window>

      {/* The thread: between the window's label and the composer at the chat's foot, anchored to the
          bottom; new messages push the older ones up, and they fade out under the label. */}
      <div aria-hidden="true" className="absolute left-[calc(11%-8px)] right-[calc(11%-8px)] overflow-hidden px-2"
        style={{ top: 'calc(6% + 74px)', bottom: `calc(6% + ${FOOT + box.c + 12}px)`, WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 28px)', maskImage: 'linear-gradient(to bottom, transparent, #000 28px)' }}>
        <motion.div initial={false} animate={{ y: phase >= READY ? -lift : 0 }} transition={GLIDE} className="flex h-full flex-col justify-end gap-5">
          <AnimatePresence initial={false} mode="popLayout">
            {THREAD.filter(m => (m.typing ? phase >= m.at && phase < m.until : phase >= m.at)).map(m => (
              <motion.div key={m.id} layout="position" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...RISE, delay: reduce ? 0 : MAKE_ROOM.duration * 0.8, layout: MAKE_ROOM }} className={m.who === 'frank' || m.typing ? 'pr-6' : 'self-start'}>
                {m.typing ? (
                  <span className="flex h-5 items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="size-1.5 rounded-full bg-ink-3" animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
                    ))}
                  </span>
                ) : m.who === 'frank' ? (
                  <p className="m-0 font-serif text-[13.5px] leading-[1.5] text-ink-2">{m.text}</p>
                ) : (
                  <div className={'inline-flex rounded-[12px] bg-white font-sans shadow-[0_1px_2px_rgba(26,23,20,0.05)] ring-1 ring-[#1a1714]/[0.08] ' + (m.token ? 'px-3 py-2.5' : 'px-3 py-2 text-[13px] leading-[1.45] text-ink')}>
                    {m.token ? <TemplateToken p={pick} /> : m.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Home title, as on the landing page and in the app. */}
      <motion.p aria-hidden="true" initial={false} animate={home ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }}
        className="m-0 absolute left-[11%] right-[11%] top-[17%] font-serif text-[21px] leading-tight text-ink">
        What do you want to learn?
      </motion.p>

      {/* The landing composer. On send it glides down to the foot of the window; the ready card then takes its place. */}
      <motion.div ref={composer} aria-hidden="true" initial={false}
        animate={phase >= READY ? { y: chatY, opacity: 0 } : home ? { y: 0, opacity: 1 } : { y: chatY, opacity: 1 }}
        transition={phase >= READY ? { duration: 0.3, ease: 'easeOut' } : GLIDE}
        className="absolute left-[11%] right-[11%] top-[29%] rounded-[18px] border border-solid border-[rgba(26,23,20,0.10)] bg-white/90"
        style={{ boxShadow: COMPOSER_SHADOW }}>
        <div className="h-[48px] px-3.5 pt-3.5 font-sans text-[13.5px] leading-[1.5]">
          {phase === 2
            ? <TemplateToken p={pick} caret />
            : phase === 6
              ? <Typing key="f1" text={FOLLOW_UP} reduce={reduce} />
              : phase === 10
                ? <Typing key="f2" text={FOLLOW_UP_3} reduce={reduce} />
                : <span className="text-ink-3">Describe what you want to learn…</span>}
        </div>
        <div className="flex items-center gap-1.5 px-2 pb-2 text-ink-2" aria-hidden="true">
          <span className="grid size-7 place-items-center rounded-full"><Plus className="size-4" strokeWidth={1.9} /></span>
          <span className="flex-1" />
          <span className="grid size-7 place-items-center rounded-full"><Mic className="size-4" strokeWidth={1.8} /></span>
          <span ref={sendBtn} className={'grid size-7 place-items-center rounded-full text-white transition-colors duration-200 ' + (phase === 2 || phase === 6 || phase === 10 ? 'bg-[#1a1714]' : 'bg-[#cfcac0]')}>
            <ArrowUp className="size-3.5" strokeWidth={2.25} />
          </span>
        </div>
      </motion.div>

      {/* Template chips (Figma names), as under the landing composer; "Funnel drop-off" gets chosen. */}
      <motion.div aria-hidden="true" initial={false} animate={home ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pointer-events-none absolute left-[11%] right-[11%] top-[56%]">
        <p className="m-0 mb-2 font-sans text-[11.5px] text-ink-3">Start from a problem</p>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {chips.map(p => {
            const on = phase >= 1 && p.id === PICK_ID;
            const ic = TEMPLATE_ICONS[p.id];
            return (
              <li key={p.id} ref={p.id === PICK_ID ? pickChip : undefined} className={CHIP + ' ' + (on ? CHIP_ON : CHIP_IDLE) + (on && phase === 1 ? ' scale-[0.96]' : '') + ' transition-transform'}>
                <span className="grid place-items-center transition-colors duration-200" style={{ color: on ? ic.fg : '#7d766e' }}>
                  <PlaybookIcon p={p} box={14} />
                </span>
                {FIGMA_NAME[p.id] ?? p.nm}
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* The pointer: glides to the "Funnel drop-off" chip and clicks it (the template drops into the
          box), then to the send button and clicks, then fades as the chat starts. */}
      {!reduce && aim?.chip && aim?.send && (
        <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10"
          initial={false}
          animate={phase === 0
            ? { x: aim.chip.x, y: aim.chip.y, opacity: 1 }
            : phase === 1
              ? { x: aim.chip.x, y: aim.chip.y, opacity: 1 }
              : phase === 2
                ? { x: aim.send.x, y: aim.send.y, opacity: 1 }
                : { x: aim.send.x + 6, y: aim.send.y + 10, opacity: 0 }}
          transition={phase === 0
            ? { x: { duration: 0.9, delay: 0.15, ease: [0.65, 0, 0.35, 1] }, y: { duration: 0.9, delay: 0.15, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.3 } }
            : phase === 2
              ? { duration: 0.75, ease: [0.65, 0, 0.35, 1] }
              : { duration: 0.35, ease: 'easeOut' }}
          style={{ x: aim.chip.x + 120, y: aim.chip.y + 90 }}>
          {/* The click: a quick press on the chip (phase 1) and on the send button, just before it sends. */}
          <motion.span className="block" initial={false}
            animate={phase === 1 || phase === 2 ? { scale: [1, 1, 0.82, 1] } : { scale: 1 }}
            transition={phase === 1 ? { duration: 0.35, times: [0, 0.01, 0.5, 1] } : phase === 2 ? { duration: 1.15, times: [0, 0.7, 0.8, 0.95] } : { duration: 0.2 }}>
            <MousePointer2 className="size-[22px] drop-shadow-[0_2px_4px_rgba(26,23,20,0.25)]" fill="#1a1714" stroke="#ffffff" strokeWidth={1.6} />
          </motion.span>
        </motion.div>
      )}

      <motion.div initial={false} animate={phase >= READY ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }} transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: phase >= READY ? 0.12 : 0 }}
        ref={readyCard} className="absolute left-[3%] right-[3%] bottom-[12%]">
        <div className="rounded-[16px] bg-[#fdfbf2] px-4 py-3.5 shadow-[0_-10px_40px_-18px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.06]">
          <div className="flex items-start gap-3" aria-hidden="true">
            <span className="mt-0.5 block w-9 shrink-0"><Glasses pose="Ready" reduced /></span>
            <div className="min-w-0 font-sans">
              <p className="m-0 text-[14px] font-medium leading-snug text-ink">Your voice interview is ready</p>
              <p className="m-0 mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
                <span className="size-1.5 rounded-full bg-[#a0d05f]" />{pick.len} min · English (US) · Frank
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3 pr-5 font-sans text-[12px]">
            <span className="text-ink-2" aria-hidden="true">Keep editing</span>
            {/* The one live control in the scene: opens the call room preview. */}
            <button ref={previewBtn} type="button" onClick={() => setCall(true)} disabled={phase < READY} tabIndex={phase >= READY ? 0 : -1}
              aria-label="Preview the interview"
              className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-[#1a1714] px-3 py-1.5 font-sans text-[12px] text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#3a3a2f] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
              <Play className="size-3" fill="currentColor" strokeWidth={0} />Preview
            </button>
          </div>
        </div>
      </motion.div>

      </motion.div>

      <AnimatePresence>{call && <CallRoom key="call" onClose={closeCall} reduce={reduce} />}</AnimatePresence>
    </div>
  );
}

// The call transcript, timed to Maya's clip (call-01-calm-card, 9 s): she explains calmly while
// answering the first question and smiles, hand on heart, as she says she loved the product.
// Maya's turns are captions, revealed word by word; [[…]] marks the phrase the highlighter wipes over.
const TURNS = [
  { who: 'Maya', time: '01:58', text: 'I had two things in my cart and was ready to pay.', past: true },
  { who: 'Frank', time: '02:09', text: 'Where did you stop, and why?', at: 200 },
  { who: 'Maya', time: '02:14', text: 'I gave up halfway through checkout — there were [[too many steps.]]', at: 700 },
  { who: 'Frank', time: '02:21', text: 'What would bring you back?', at: 4000 },
  { who: 'Maya', time: '02:24', text: 'A [[one-page checkout.]] Honestly, I loved the product.', at: 4500 },
];
const WORD_MS = 210;
// Each turn's words, with whether they sit under the highlighter.
const words = text => text.split(/(\[\[.*?\]\])/).filter(Boolean).flatMap(part => {
  const mark = part.startsWith('[[');
  return part.replace(/\[\[|\]\]/g, '').trim().split(/\s+/).map(w => ({ w, mark }));
});
const SCRIPT = TURNS.map(t => ({ ...t, words: words(t.text) }));
// When each turn's last word lands; the highlight wipes 250 ms later.
const doneAt = t => t.at + (t.who === 'Maya' ? t.words.length * WORD_MS : 0);
const END = Math.max(...SCRIPT.filter(t => !t.past).map(doneAt)) + 800;

// Interview: Maya on her call and the transcript playing in step with it each time the step comes
// into view: an earlier line already there, then Frank's question, Maya's answer arriving word by word
// like live captions, the highlighter wiping across what matters, Frank's follow-up and her second
// answer. Reduced motion: the whole transcript, video still.
function Interview({ active, reduce }) {
  const video = useRef(null);
  const root = useRef(null);
  const inView = useInView(root, { amount: 0.5 });
  const run = active && inView && !reduce;
  // Milliseconds since the scene started, stepped by the timers below.
  const [now, setNow] = useState(reduce ? Infinity : 0);

  useEffect(() => {
    const v = video.current;
    if (reduce) { setNow(Infinity); v?.pause(); return; }
    if (!run) { setNow(0); v?.pause(); return; }
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    const marks = new Set([END]);
    SCRIPT.forEach(t => {
      if (t.past) return;
      marks.add(t.at);
      if (t.who === 'Maya') { t.words.forEach((_, i) => marks.add(t.at + (i + 1) * WORD_MS)); marks.add(doneAt(t) + 250); }
    });
    const timers = [...marks].map(ms => setTimeout(() => setNow(ms), ms));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce]);

  const ease = [0.23, 1, 0.32, 1];
  const shown = t => t.past || now >= t.at;
  const heard = t => (t.past || t.who !== 'Maya' ? Infinity : Math.floor((now - t.at) / WORD_MS));
  const live = !reduce && now > 0 && now < END;
  return (
    <div ref={root} className="absolute inset-0">
      {/* Transcript of Maya's call (02:14 is the moment the Insights step cites). The panel runs off
          the card's right and bottom edges; the words stay inside the visible part. */}
      <div className="absolute left-[38%] top-[8%] h-full w-[72%] rounded-[18px] bg-[#fbfaf6] pb-6 pl-10 pr-8 pt-11 font-sans shadow-[0_24px_60px_-20px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.06]">
        {/* The same three window dots as the app windows in the other steps. */}
        <div className="absolute left-4 top-4 flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map(i => <span key={i} className="size-[9px] rounded-full bg-[#e0dcd2]" />)}
        </div>
        <div className="max-w-[86%]">
          <p className="m-0 flex items-center gap-1.5 text-[11.5px] text-ink-3">
            {live && <span className="tmn-live size-1.5 rounded-full bg-[#7fb83a]" />}
            Transcript
          </p>
          {SCRIPT.map(t => {
            const maya = t.who === 'Maya';
            const n = heard(t);
            const marked = now >= doneAt(t) + 250;
            // Consecutive highlighted words share one highlighter.
            const runs = [];
            t.words.forEach((x, i) => {
              const last = runs[runs.length - 1];
              if (last && last.mark === x.mark) last.items.push([x.w, i]); else runs.push({ mark: x.mark, items: [[x.w, i]] });
            });
            const reveal = runs.map((r, k) => {
              const ws = r.items.map(([w, i], j) => (
                <motion.span key={i} initial={false} animate={{ opacity: i < n ? 1 : 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
                  {w}{j < r.items.length - 1 ? ' ' : ''}
                </motion.span>
              ));
              const gap = k < runs.length - 1 ? ' ' : '';
              if (!r.mark) return <span key={k}>{ws}{gap}</span>;
              return (
                <span key={k}>
                  {/* The highlighter is the phrase's own background, so it follows the words when they
                      wrap; it grows from 0 to full width, running along the first line then the next. */}
                  <motion.span className="rounded-[3px] bg-no-repeat px-[3px] -mx-[3px] [background-image:linear-gradient(#e3cfff,#e3cfff)] [background-position:0_55%]"
                    initial={false} animate={{ backgroundSize: marked ? '100% 88%' : '0% 88%' }}
                    transition={{ duration: reduce ? 0 : 0.6, ease: [0.77, 0, 0.175, 1] }}>
                    {ws}
                  </motion.span>{gap}
                </span>
              );
            });
            return (
              <motion.div key={t.time} initial={false} animate={shown(t) ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.35, ease }} className="mt-3.5">
                <div className={t.past ? 'opacity-50' : ''}>
                  <p className="m-0 flex items-baseline gap-2 text-[11.5px]">
                    <span className={'font-medium ' + (maya ? 'text-ink' : 'text-ink-2')}>{t.who}</span>
                    <span className="tabular-nums text-ink-3">{t.time}</span>
                  </p>
                  {maya && !t.past
                    ? <p className="m-0 mt-1 font-serif text-[15.5px] leading-[1.42] tracking-[-0.01em] text-ink">{reveal}</p>
                    : <p className={'m-0 mt-1 text-[13px] leading-snug ' + (maya ? 'text-ink' : 'text-ink-2')}>{t.text.replace(/\[\[|\]\]/g, '')}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Maya on the call, in a dark call frame. Plays once per visit, in step with the transcript. */}
      <div className="absolute left-[5%] top-[16%] w-[36%] overflow-hidden rounded-[14px] bg-[#1a1714] p-1 shadow-[0_20px_50px_-16px_rgba(26,23,20,0.5)]">
        <video ref={video} src="/videos/call-01-calm-card.mp4" poster="/videos/call-01-calm-card.jpg" muted playsInline preload="metadata"
          className="block aspect-[4/5] w-full rounded-[10px] object-cover" />
        <div className="flex justify-center gap-1.5 py-1.5" aria-hidden="true">
          <span className="grid size-5 place-items-center rounded-full bg-white/15 text-white"><Mic className="size-2.5" /></span>
          <span className="grid size-5 place-items-center rounded-full bg-white/15 text-white"><Video className="size-2.5" /></span>
          <span className="grid size-5 place-items-center rounded-full bg-[#e5484d] text-white"><PhoneOff className="size-2.5" /></span>
        </div>
      </div>
    </div>
  );
}

const THEMES = [
  { name: 'Too many checkout steps', count: 46 },
  { name: 'Surprise shipping costs', count: 31 },
  { name: 'Account needed to pay', count: 18 },
];
const THEME_MAX = 50;
// Interviews done by the end of each day of the study week (cumulative).
const DAILY = [0, 9, 24, 41, 63, 88, 104, 120];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''];
const CH_W = 300, CH_H = 84, CH_TOP = 6;
const pts = DAILY.map((v, i) => [(i / (DAILY.length - 1)) * CH_W, CH_TOP + (1 - v / 120) * (CH_H - CH_TOP)]);
// A smooth line through the points (Catmull-Rom as cubic Béziers).
const LINE = pts.reduce((d, [x, y], i) => {
  if (i === 0) return `M${x},${y}`;
  const p0 = pts[i - 2] || pts[i - 1], p1 = pts[i - 1], p3 = pts[i + 1] || [x, y];
  const c1 = [p1[0] + (x - p0[0]) / 6, p1[1] + (y - p0[1]) / 6];
  const c2 = [x - (p3[0] - p1[0]) / 6, y - (p3[1] - p1[1]) / 6];
  return `${d} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${x},${y}`;
}, '');
const AREA = `${LINE} L${CH_W},${CH_H} L0,${CH_H} Z`;
const DRAW_S = 1.8;

// Insights: the study's results filling in each time the step comes into view. The window's chart
// draws the week's interviews arriving while the count runs up to 120; then the themes' bars grow
// to how many people raised each, and the top theme opens on the exact words behind it (Maya, 02:14).
// Reduced motion: the finished charts.
function Insights({ active, reduce }) {
  const root = useRef(null);
  const clipId = 'ins' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const inView = useInView(root, { amount: 0.5 });
  const run = active && inView && !reduce;
  // stage: 0 empty · 1 interviews arriving · 2 themes · 3 receipt open · 4 done
  const [stage, setStage] = useState(reduce ? 4 : 0);
  const count = useMotionValue(reduce ? 120 : 0);
  const shownCount = useTransform(count, v => Math.round(v));

  useEffect(() => {
    if (reduce) { setStage(4); count.set(120); return; }
    if (!run) { setStage(0); count.set(0); return; }
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    let anim;
    at(150, () => { setStage(1); anim = animate(count, 120, { duration: DRAW_S, ease: [0.33, 0, 0.2, 1] }); });
    at(150 + DRAW_S * 1000 - 300, () => setStage(2));
    at(150 + DRAW_S * 1000 + 1100, () => setStage(3));
    at(150 + DRAW_S * 1000 + 1700, () => setStage(4));
    return () => { timers.forEach(clearTimeout); anim?.stop(); };
  }, [run, reduce, count]);

  const ease = [0.23, 1, 0.32, 1];
  const t = reduce ? 0 : 1; // transition time multiplier
  return (
    <div ref={root} className="absolute inset-0">
      <Window className="left-[7%] top-[6%] h-full w-[100%]"
        chips={<>
          {stage >= 4 ? <Chip icon={Calendar}>Done</Chip> : <Chip live>Live</Chip>}
          <Chip icon={Users}><motion.span className="tabular-nums">{shownCount}</motion.span>&nbsp;interviews</Chip>
        </>}>
        {/* Interviews this week, a line over a soft green area, drawn from left to right. */}
        <div className="mt-4 w-[90%] font-sans">
          <svg viewBox={`0 0 ${CH_W} ${CH_H}`} preserveAspectRatio="none" className="block h-[36px] w-full overflow-visible">
            {[0.33, 0.66].map(f => (
              <line key={f} x1="0" x2={CH_W} y1={CH_TOP + f * (CH_H - CH_TOP)} y2={CH_TOP + f * (CH_H - CH_TOP)}
                stroke="#1a1714" strokeOpacity="0.08" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2={CH_W} y1={CH_H} y2={CH_H} stroke="#1a1714" strokeOpacity="0.14" vectorEffect="non-scaling-stroke" />
            <defs>
              <clipPath id={clipId}>
                <motion.rect x="0" y="-10" height={CH_H + 20} initial={false}
                  animate={{ width: stage >= 1 ? CH_W : 0 }} transition={{ duration: stage >= 1 ? DRAW_S * t : 0, ease: [0.33, 0, 0.2, 1] }} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <path d={AREA} fill="#d1b2ff" fillOpacity="0.45" />
              <path d={LINE} fill="none" stroke="#8931da" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-ink-3">
            {DAYS.slice(0, -1).map(d => <span key={d}>{d}</span>)}
          </div>
        </div>
      </Window>

      {/* Themes: how many of the 120 raised each, as bars; the top one opens on its receipt. */}
      <Sheet className="bottom-[-4%] left-[4%] right-[-4%] top-[44%] !bg-[#fbfaf6] !px-3 !py-1.5">
        <div className="w-[95%] font-sans">
          <p className="m-0 px-4 pt-4 text-[11.5px] text-ink-3">Top reasons</p>
          <ul className="m-0 mt-2 list-none p-0">
            {THEMES.map((th, i) => {
              const open = i === 0 && stage >= 3;
              return (
                <li key={th.name} className={'rounded-[16px] px-4 py-[5px] transition-[padding] ease-out' + (reduce ? '' : ' duration-300') + (open ? ' pb-4' : '')}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-ink">{th.name}</span>
                    <motion.span className="tabular-nums text-ink-2" initial={false}
                      animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.3 * t, delay: stage >= 2 ? (0.35 + i * 0.12) * t : 0 }}>
                      {th.count}
                    </motion.span>
                  </div>
                  <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-[#efece4]">
                    <motion.div className="h-full origin-left rounded-full" style={{ width: `${(th.count / THEME_MAX) * 100}%`, backgroundColor: i === 0 ? '#8fc24f' : '#c9ec95' }}
                      initial={false} animate={{ transform: stage >= 2 ? 'scaleX(1)' : 'scaleX(0)' }}
                      transition={{ duration: stage >= 2 ? 0.7 * t : 0, delay: stage >= 2 ? i * 0.12 * t : 0, ease }} />
                  </div>
                  {/* The receipt: the exact words, who said them, and the moment in the call (step 2). */}
                  {i === 0 && (
                    <motion.div initial={false} animate={open ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 * t, ease }} className="overflow-hidden">
                      <div className="mt-2 rounded-[10px] border border-solid border-[#e9e5dc] bg-white px-3 py-2">
                        <p className="m-0 font-serif text-[13px] leading-snug text-ink">
                          “I gave up halfway through checkout — there were too many steps.”
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-3">
                          <img src="/videos/call-01-calm-card.jpg" alt="" className="size-[18px] rounded-full object-cover object-top" />
                          <span><span className="text-ink-2">Maya L.</span> · Online shopper</span>
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#eef6dd] px-1.5 py-[2px] tabular-nums text-[#4d6a24]">
                            <Play className="size-2.5" fill="currentColor" strokeWidth={0} />02:14
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Sheet>
    </div>
  );
}

const SCENES = [SetUp, Interview, Insights];

// One step's scene, filling its card (the card itself is the caller's).
export default function StepVisual({ index, active = true, reduce = false }) {
  const Scene = SCENES[index];
  return (
    <div className="absolute inset-0 overflow-hidden text-left" style={{ backgroundColor: CARD_GREEN }} aria-hidden={index === 0 ? undefined : true}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cardGrain} />
      <Scene active={active} reduce={reduce} />
    </div>
  );
}
