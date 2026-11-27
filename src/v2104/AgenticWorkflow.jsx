// AgenticWorkflow (V21.04, as in V21.03: V21.22 with the card in deep forest green, #0f2e27) — "Use Frank with your AI assistant". A split: on the left the label, the title,
// the subtitle and the assistants Frank works with (a picker, with two short rows about the pick); on
// the right a quiet browser window, all in one cream card (as Interview example) (claude.ai in a thin bar): the
// example always runs in Claude. One beat at a time: your request types in and is sent; the assistant hands
// it to Frank; his thinking shows as a step list (drafting, sending, interviewing, summing up), each running
// step with a spinner, a soft wave on its label and its log lines scrolling in; when he's done the list
// folds away and his answer lands in the chat as plain text, the key parts marked in lime. Below 1024px the two stack, text first.
// Every line keeps its place from the start (it only fades in), so the window never resizes.
// Reduced motion: no tour, the finished conversation is simply there.
// V21.04: the assistants are a picker. Choosing one shows two short rows about it under the chips
// (how it connects, what it's good for) and switches the browser to it, replaying the run there.
import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion, useInView, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUp, Check, ChevronDown, Copy, Maximize2, Pause, Play, Plug, Volume2, X } from 'lucide-react';
import Glasses from '../v3/Glasses';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow, SUBTITLE_SIZE } from './titles';
import { ScrubText, ScrubTitle, useProgress } from './reveal';
// Assistant logos from LobeHub Icons (MIT; the marks belong to their owners). Grok and Muse have
// no published mark here yet, so they get a quiet initial until their own logos are added.
import claudeLogo from './logos/claude.svg';
import openaiLogo from './logos/openai.svg';

// url: what the browser's address bar shows (only where the web address is certain).
// connect / use: the two rows shown when it's picked. Grounded in hifrank.ai/mcp: Frank connects
// through its MCP server, you sign in and approve access in your browser once, and new studies start as
// drafts that need your OK before they go out.
const ASSISTANTS = [
  { name: 'Claude', logo: claudeLogo, url: 'claude.ai/new',
    connect: 'Add Frank’s MCP server as a connector, then sign in once in your browser.',
    use: 'Create a study, launch it and read the themes, all in one chat.' },
  { name: 'ChatGPT', logo: openaiLogo, url: 'chatgpt.com',
    connect: 'Connect Frank’s MCP server and approve access once.',
    use: 'Ask what customers said about pricing and get answers with their quotes.' },
  { name: 'Grok',
    connect: 'Connect Frank’s MCP server and sign in once.',
    use: 'Check what users asked for before you build the next feature.' },
  { name: 'Muse',
    connect: 'Connect Frank’s MCP server and sign in once.',
    use: 'Ask quick questions about your customers between meetings.' },
  { name: 'Other MCP clients', short: 'other MCP clients', reply: 'your assistant', url: 'your AI assistant', any: true,
    connect: 'Clients that support remote servers with OAuth: point them at Frank’s server and sign in.',
    use: 'New studies start as drafts, so nothing goes out without your OK.' },
];
const EASE = [0.23, 1, 0.32, 1];
// Frank's lime highlight on the key words of his answer.
const MARK = 'rounded-[4px] bg-[#e6f8c9] px-0.5 text-ink [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
// The example study (sample numbers).
const ASK = 'Find out why trial users don’t upgrade. Talk to 40 of them this week.';
// Frank's steps, each with a few log lines that tick in while it runs (LOG_MS apart). STEP_MS is how
// long each step runs; the log lines fit inside it.
const STEPS = [
  { id: 'draft', label: 'Drafting the interview', detail: ['reading your request', '3 questions, about 5 minutes', 'voice, with follow-ups on'] },
  { id: 'send', label: 'Sending it to 40 trial users', detail: ['email invites: 40', 'on-site widget: billing page', 'reminders for anyone who hasn’t answered'] },
  { id: 'talk', label: 'Interviewing them', detail: ['12 of 40 done', '23 of 40 done', '34 of 40 done'] },
  { id: 'sum', label: 'Summing up what they said', detail: ['grouping answers into themes', 'picking the clearest quotes'] },
];
const STEP_MS = [2600, 2600, 2600, 2200], START_MS = 2600, TYPE_MS = 1700, HOLD_MS = 7000, LOG_MS = 650;
const DONE = STEPS.length;

// The assistant's mark in an even white circle (the stand-in letter where there is no logo yet).
const Mark = ({ a }) => (
  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-white">
    {a.logo ? <img src={a.logo} alt="" className="size-4" /> : <span className="font-sans text-[12px] font-semibold text-ink-2">{a.name[0]}</span>}
  </span>
);

// The request typing itself into the composer, letter by letter, before it's sent.
function useTyped(text, on) {
  const [n, setN] = useState(on ? 0 : text.length);
  useEffect(() => {
    if (!on) { setN(text.length); return; }
    setN(0);
    const t0 = Date.now();
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / TYPE_MS);
      setN(Math.round(k * text.length));
      if (k >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [text, on]);
  return n;
}

// A line that keeps its place and fades up when its moment comes.
const shown = on => 'transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] '
  + (on ? 'opacity-100 [transform:translateY(0)]' : 'opacity-0 [transform:translateY(6px)]');

// ——— Frank's thinking: an agent step list (after Kokonut UI's "AI Loading State", MIT, ported to this
// page). A header with the current step; under it the steps on a rail: a spinner and a soft brightness wave
// on the running one, with its latest log lines scrolling up in mono; a check that draws itself when a step
// is done; the rail filling between done steps. Once every step is done the list folds away under
// "Frank finished".
const LINE_H = 22, SHOW_LINES = 1;

function StepIcon({ status }) {
  return (
    <span className="relative flex size-4 shrink-0 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={status} className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, filter: 'blur(2px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: 0.18, ease: EASE }}>
          {status === 'pending' && <span className="size-1.5 rounded-full bg-[#1a1714]/20" />}
          {status === 'running' && (
            <svg aria-hidden="true" className="size-3.5 motion-safe:animate-spin" style={{ animationDuration: '0.8s' }} fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="6.25" stroke="rgba(26,23,20,0.12)" strokeWidth="1.5" />
              <path d="M8 1.75a6.25 6.25 0 0 1 6.25 6.25" stroke="#1a1714" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          )}
          {status === 'done' && (
            <svg aria-hidden="true" className="size-3.5 text-[#5f8f22]" fill="none" viewBox="0 0 16 16">
              <motion.path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE, delay: 0.05 }} />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The running step's latest log lines, scrolling up as new ones arrive.
function StepLog({ lines }) {
  const offset = Math.max(0, lines.length - SHOW_LINES);
  const mask = SHOW_LINES > 1 && lines.length > SHOW_LINES - 1 ? 'linear-gradient(to bottom, rgb(0 0 0 / 0.25), black 70%)' : undefined;
  return (
    <div aria-hidden="true" className="relative overflow-hidden font-gmono text-[11.5px]"
      style={{ height: LINE_H * Math.min(lines.length, SHOW_LINES), maskImage: mask, WebkitMaskImage: mask, transition: 'height 240ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
      <div className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none" style={{ transform: `translateY(${-offset * LINE_H}px)` }}>
        {lines.map((line, k) => (
          <motion.div key={k + line} className="flex items-center gap-2 text-ink-3" style={{ height: LINE_H }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: EASE }}>
            <span className="w-4 select-none text-right tabular-nums text-[#1a1714]/25">{k + 1}</span>
            <span className="truncate">{line}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// A soft brightness wave through the running step's letters (.ag-wave in v19.css).
const WaveText = ({ text }) => Array.from(text).map((ch, k) => (
  <span key={k} className="ag-wave whitespace-pre" style={{ animationDelay: `${k * 0.05}s` }}>{ch}</span>
));

const LABEL = { pending: 'text-ink-3/70', running: 'text-ink', done: 'text-ink-3' };

function StepRow({ st, status, lines, last }) {
  return (
    <li className="relative flex gap-3 pt-3">
      {!last && (
        <span aria-hidden="true" className="absolute bottom-[-8px] left-[7.5px] top-[30px] w-px overflow-hidden bg-[#1a1714]/[0.08]">
          <span className={'block size-full origin-top bg-[#8fc24f] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (status === 'done' ? 'scale-y-100' : 'scale-y-0')} />
        </span>
      )}
      <StepIcon status={status} />
      <div className="-mt-0.5 min-w-0 flex-1">
        <p className={'m-0 truncate text-[13.5px] transition-colors duration-200 ' + LABEL[status]}>
          {status === 'running'
            ? <><span className="sr-only">{st.label}</span><span aria-hidden="true"><WaveText text={st.label} /></span></>
            : st.label}
        </p>
        {status === 'running' && lines.length > 0 && <div className="mt-1"><StepLog lines={lines} /></div>}
      </div>
    </li>
  );
}

// result: what lands when he's done. It shares one spot with the step list (one grid cell), so the
// window keeps its size: the list folds away and the result fades in where it was.
function AgentRun({ step, reduce, result }) {
  // Log lines of the running step tick in one by one.
  const [line, setLine] = useState(0);
  useEffect(() => {
    setLine(0);
    if (step < 0 || step >= DONE || reduce) return;
    const id = setInterval(() => setLine(n => Math.min(n + 1, STEPS[step].detail.length)), LOG_MS);
    return () => clearInterval(id);
  }, [step, reduce]);
  const done = step >= DONE;
  // Open while he works; folded once he's done, until opened again.
  const [open, setOpen] = useState(!done);
  const [wasDone, setWasDone] = useState(done);
  if (wasDone !== done) { setWasDone(done); setOpen(!done); }
  const status = i => (i < step || done ? 'done' : i === step ? 'running' : 'pending');
  const title = done ? 'Frank finished' : step < 0 ? 'Getting ready' : STEPS[step].label;
  return (
    <MotionConfig reducedMotion="user">
      <div>
        <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}
          className="group flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] border-0 bg-transparent p-0 py-1 text-left font-sans text-[13.5px] font-medium text-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
          <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-[#d1f899]">
            <span className="block w-[66%]"><Glasses pose={done ? 'Grateful' : 'Thinking'} reduced={reduce} /></span>
          </span>
          <output className="min-w-0 truncate">{title}</output>
          {done && <span className="font-normal text-ink-3">4 steps</span>}
          <ChevronDown aria-hidden="true" className={'ml-auto size-4 shrink-0 text-ink-3 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-ink-2 ' + (open ? 'rotate-180' : '')} />
        </button>
        <div className="grid grid-cols-[minmax(0,1fr)] items-start [&>*]:[grid-area:1/1]">
        <div aria-hidden={!(done && !open)} className={'pt-3 ' + shown(done && !open) + (done && !open ? '' : ' pointer-events-none')}>{result}</div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ol className="m-0 list-none overflow-hidden p-0 pl-1"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}>
              {STEPS.map((st, i) => (
                <StepRow key={st.id} st={st} status={status(i)} last={i === STEPS.length - 1}
                  lines={i === step ? st.detail.slice(0, line) : []} />
              ))}
              <li aria-hidden="true" className="h-1.5" />
            </motion.ol>
          )}
        </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

// chrome: replaces the top strip (dots and address) — the tabbed layout puts the assistants there.
// flush: the window sits on its card's bottom edge (square bottom corners, no bottom inset), as if it
// rises out of the card.
function ChatWindow({ a, step, reduce, chrome, short, flush }) {
  const typing = step < 0 && !reduce;
  const n = useTyped(ASK, typing);
  return (
    // The browser, after the Frank Components frame (node 2226:248): a flat shell with three dots and the
    // address pill in its top strip, and the page as a white panel inset 6px inside it, its corners
    // concentric with the shell's (24px outside, 18px inside). Coloured like the Widget section's browser:
    // the pale bar grey for the shell, grey dots, a white pill with a hairline, a hairline ring and the
    // same soft warm shadow.
    <div className={'relative flex flex-col rounded-[24px] bg-[#f7f6f2] p-1.5 lg:h-full ' + (flush ? 'rounded-b-none pb-0 ' : '') + 'ring-1 ring-[#1a1714]/[0.08] shadow-[0_1px_1px_rgba(26,23,20,0.03),0_2px_4px_rgba(26,23,20,0.03),0_8px_16px_-4px_rgba(26,23,20,0.04),0_24px_48px_-12px_rgba(26,23,20,0.06),0_48px_96px_-24px_rgba(26,23,20,0.08)]'}>
      {chrome || <div className="flex items-center gap-3 px-2.5 pb-2 pt-1 sm:px-3">
        <span aria-hidden="true" className="flex gap-1.5">{[0, 1, 2].map(k => <span key={k} className="size-2 rounded-full bg-[#1a1714]/[0.12]" />)}</span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-[5px] font-sans text-[11.5px] text-ink-3 ring-1 ring-[#1a1714]/[0.05]">
          {a.logo
            ? <img src={a.logo} alt="" className="size-3 shrink-0" />
            : <span aria-hidden="true" className="text-[9.5px] font-semibold text-ink-2">{a.name[0]}</span>}
          <span className="truncate">{a.url || a.name}</span>
        </span>
      </div>}
      <div className={'relative flex flex-1 flex-col overflow-hidden rounded-[18px] bg-white ' + (short ? 'min-h-[400px]' : 'min-h-[420px]') + (flush ? ' rounded-b-none' : '') + ' text-left ring-1 ring-[#1a1714]/[0.06]'}>
          <div className="flex flex-col gap-4 px-5 pb-6 pt-6 text-[14.5px] leading-[1.55] sm:px-8">
            <p className={'m-0 ml-auto max-w-[80%] rounded-[16px] rounded-br-[6px] bg-[#1a1714]/[0.05] px-4 py-2.5 text-ink ' + shown(step >= 0)}>{ASK}</p>
            <p className={'m-0 text-ink-2 ' + shown(step >= 0)}>I’ll ask Frank to run this.</p>

            {/* Frank's thinking, as a step list in the chat. */}
            {/* His findings land where the step list was; what he found is marked, like a change in a doc. */}
            <div className={shown(step >= 0)}>
              <AgentRun step={step} reduce={reduce} result={(
                // His answer, short like a chat reply: the main finding highlighted in lime, one customer's
                // words, and a next step.
                <div className="flex flex-col gap-3 text-[14.5px] leading-[1.55] text-ink">
                  <p className="m-0">Frank talked to 34 trial users. <mark className={MARK}>21 wanted a plan for their team.</mark></p>
                  <p className="m-0 border-0 border-l-2 border-solid border-[#a8d86a] pl-3.5 font-serif text-[15px] leading-[1.5]">“We’d have paid today if I could add my two co-founders.”</p>
                  <p className="m-0">Next step: <mark className={MARK}>test a 3-seat team plan.</mark></p>
                </div>
              )} />
            </div>
          </div>

          <div className="mt-auto px-3 pb-3 sm:px-5 sm:pb-5">
            <div className="flex items-center gap-2 rounded-[18px] bg-[#1a1714]/[0.04] py-1.5 pl-4 pr-1.5 text-[14px]">
              <span className={'min-w-0 flex-1 leading-[1.45] ' + (typing ? '' : 'truncate')}>
                {typing
                  ? <span className="text-ink">{ASK.slice(0, n)}<span aria-hidden="true" className="ag-caret ml-px inline-block h-[1.05em] w-px translate-y-[2px] bg-[#1a1714]" /></span>
                  : <span className="text-ink-3">Reply to {a.reply || a.name}…</span>}
              </span>
              <span aria-hidden="true" className={'grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-200 '
                + (typing && n >= ASK.length ? 'bg-[#1a1714] text-white' : 'bg-[#1a1714]/[0.08] text-ink-3')}><ArrowUp className="size-4" /></span>
            </div>
          </div>
      </div>
    </div>
  );
}

function Flow({ reduce, a, chrome, short, flush }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(reduce ? DONE : -1);
  // A new assistant replays the run from the start (without remounting, so a focused tab keeps focus).
  useEffect(() => { if (!reduce) setStep(-1); }, [a.name, reduce]);
  useEffect(() => {
    if (reduce || !inView) return;
    const ms = step < 0 ? START_MS : step >= DONE ? HOLD_MS : STEP_MS[step];
    const t = setTimeout(() => {
      if (step >= DONE) setStep(-1);
      else setStep(s => s + 1);
    }, ms);
    return () => clearTimeout(t);
  }, [step, inView, reduce]);
  // The run plays in whichever assistant is picked (Flow is keyed by it, so a new pick replays it).
  return (
    <div ref={ref} className="lg:h-full">
      <ChatWindow a={a} step={step} reduce={reduce} chrome={chrome} short={short} flush={flush} />
    </div>
  );
}

// Where Frank works: a picker of chips (a radio group: click, or arrow keys once focused). The picked
// chip turns solid white; the others stay glassy on the green. Under it, two short rows about the pick
// (how it connects, in white; what it's good for, softer), no labels,
// in one spot that never changes height (every pick's rows are laid out in the same grid cell; only
// the picked one shows), crossfading 200ms on a change.
const LBL = 'm-0 font-sans text-[12px] font-light uppercase leading-none tracking-[0.08em] text-white/45';
function WorksWith({ pick, onPick }) {
  const refs = useRef([]);
  const onKey = e => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (pick + d + ASSISTANTS.length) % ASSISTANTS.length;
    onPick(n); refs.current[n]?.focus();
  };
  return (
    <div>
      <p id="ag-works" className={LBL}>Works with · pick one</p>
      <div role="radiogroup" aria-labelledby="ag-works" onKeyDown={onKey} className="mt-3 flex flex-wrap items-center gap-2">
        {ASSISTANTS.map((x, k) => {
          const on = k === pick;
          return (
            <button key={x.name} ref={el => { refs.current[k] = el; }} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              onClick={() => onPick(k)}
              className={'inline-flex cursor-pointer items-center gap-2 rounded-full border-0 font-sans text-[13.5px] transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 '
                + (x.any ? 'px-3.5 py-1.5 ' : 'py-1 pl-1 pr-3.5 ')
                + (on ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
                  : x.any ? 'bg-transparent text-white/60 [outline:1px_dashed_rgba(255,255,255,0.25)] [outline-offset:-1px] hover:text-white/85'
                  : 'bg-white/[0.08] text-white/80 ring-1 ring-inset ring-white/[0.12] hover:bg-white/[0.14] hover:text-white')}>
              {!x.any && <Mark a={x} />}{x.any ? '+ any MCP client' : x.name}
            </button>
          );
        })}
      </div>
      {/* The two rows about the pick. */}
      <div className="mt-4 grid rounded-[18px] bg-white/[0.05] px-5 py-4 ring-1 ring-inset ring-white/[0.09] [&>*]:[grid-area:1/1]">
        {ASSISTANTS.map((x, k) => {
          const on = k === pick;
          return (
            <div key={x.name} aria-hidden={!on} aria-live={on ? 'polite' : undefined}
              className={'flex flex-col gap-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transform-none '
                + (on ? 'opacity-100 [transform:translateY(0)]' : 'pointer-events-none opacity-0 [transform:translateY(4px)]')}>
              <p className="m-0 text-[15px] leading-[1.45] text-white">{x.connect}</p>
              <p className="m-0 text-[15px] leading-[1.45] text-white/65">{x.use}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AgenticWorkflow() {
  const reduce = !!useReducedMotion();
  const [pick, setPick] = useState(0);
  // The card's entrance, the same as the Interview example's: tied to the scroll, it rises, fades up and
  // opens out sideways from a narrower, inset shape to its full width (a clip, so its content never
  // squashes), done as its top nears the upper fifth of the window. Reduced motion keeps only the fade.
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: useTransform(cp, [0, 0.35], [0, 1]),
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  return (
    <section aria-labelledby="ag-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      {/* The whole section sits in one cream card, the same size and colour as the Interview example's: full width
          with a 16px (phones) / 40px gap from the window's edges, a screen's height, 32/44px corners, and
          the content held to 1120px inside. The story on the left (label, title, subtitle, where Frank
          works, the takeaway), the live chat on the right. Below 1024px they stack, text first. */}
      <motion.div ref={card} style={cardIn} data-dark-card className="relative grid min-h-[calc(100svh-32px)] items-center rounded-[32px] bg-[#0f2e27] [--r:32px] md:[--r:44px] px-5 py-12 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)] lg:py-[clamp(56px,5.85vw,86px)]">
      {/* The same faint grainy yellow glow as the Widget card, in the top-right corner, at 40% so it stays subtle. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
      <div className="relative mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-16">
        <div className="relative lg:right-[30px]">
          <ScrubText reduce={reduce}><Eyebrow line={false} align="start" className="mb-6 !text-white/85 sm:mb-8">Frank’s agentic workflow</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ag-title" className={'m-0 leading-[1.04] text-white [text-wrap:balance] ' + TITLE}
            lines={['Use Frank with', 'your AI assistant']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'mb-0 max-w-[46ch] mt-6 text-white/70 ' + SUBTITLE_SIZE}>
            Works with ChatGPT, Claude, Grok and Muse, plus other MCP clients that support remote servers with OAuth. From there, you can design, launch and analyze customer interviews without ever leaving your AI assistant.
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.2} className="mt-8">
            <WorksWith pick={pick} onPick={setPick} />
          </ScrubText>
        </div>

        {/* On desktop the browser stretches to the text column's full height (label to the picker's rows). */}
        <ScrubText reduce={reduce} lag={0.1} className="relative lg:left-[30px] lg:h-full">
          <Flow key={ASSISTANTS[pick].name} reduce={reduce} a={ASSISTANTS[pick]} />
        </ScrubText>
      </div>
      </motion.div>
    </section>
  );
}

// ——— AgenticWorkflowD (V21.04, a minimal second layout, under the first). Everything that isn't the
// point is gone: no browser, no step list, no tiles. One centred column in the same green card, with the
// same entrance: the label, title and subtitle; a single row of round logos (a radio group: click, or arrow
// keys once focused; the picked one fully lit with a lime ring, the rest dimmed); one quiet line with the
// pick's name and how it connects; then the video's frame, sitting on the card's bottom edge.
// The video for the minimal layout: set src (and optionally poster) when it's ready. Until then the play
// button still opens the player to show its playing view (a preview tag and a player bar).
const AG_VIDEO = { src: null, poster: null };

export function AgenticWorkflowD({ docsHref }) {
  const reduce = !!useReducedMotion();
  const [pick, setPick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ready = !!AG_VIDEO.src;
  // At rest the frame is a wide 3:1 strip (16:9 on phones); playing, it opens to a full 16:9 player and the
  // page glides so the player sits in the middle of the window. Pause closes it back to the strip.
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const fig = useRef(null);
  const play = () => {
    setPlaying(true);
    // Measured a frame later, once the rise is switched off, so a click mid-rise still centres correctly.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = fig.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const h2 = r.width * 9 / 16;
      window.scrollTo({ top: r.top + window.scrollY - Math.max(16, (window.innerHeight - h2) / 2), behavior: reduce ? 'auto' : 'smooth' });
    }));
  };
  const refs = useRef([]);
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: useTransform(cp, [0, 0.35], [0, 1]),
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  // The video rises with the scroll: it starts low, mostly hidden under the card's bottom edge, and slides
  // up as the card comes into view, arriving on the edge as the card's bottom meets the window's bottom
  // (tied to the scroll, eased by a light spring so it glides). Reduced motion: it simply sits in place.
  const { scrollYProgress: vp } = useScroll({ target: card, offset: ['start end', 'end end'] });
  const vs = useSpring(vp, { stiffness: 140, damping: 30, mass: 0.5, restDelta: 0.0005 });
  const vy = useTransform(vs, [0.25, 1], [reduce ? 0 : 72, 0], { clamp: true });
  const rise = useMotionTemplate`translateY(${vy}%)`;
  const onKey = e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (pick + d + CLIENTS.length) % CLIENTS.length;
    setPick(n); refs.current[n]?.focus();
  };
  return (
    <section aria-labelledby="ag4-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      <motion.div ref={card} style={cardIn} data-dark-card className="relative grid min-h-[calc(100svh-32px)] items-end overflow-hidden rounded-[32px] bg-[#0f2e27] [--r:32px] md:[--r:44px] px-5 pb-0 pt-14 sm:px-10 sm:pt-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)] lg:pt-[clamp(48px,4.5vw,64px)]">
        <div className="relative mx-auto w-full min-w-0 max-w-[1000px] text-center">
          {/* V21.04: the MCP setup copy, as in the two-column layout, centred: the server URL pill, the round
              logos and, under them, the pick's steps (left-aligned in a centred block), the prompt and the guide. */}
          <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-5 !text-white/85 sm:mb-6">For AI assistants</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ag4-title" className={'m-0 leading-[1.04] text-white [text-wrap:balance] ' + TITLE}
            lines={['Add Frank', 'to your AI']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[52ch] [text-wrap:balance] mt-6 text-white/60 ' + SUBTITLE_SIZE}>
            Connect once, then design, launch and analyze AI-moderated voice interviews from your assistant. MCP is included on every plan, including Free.
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.2} className="mt-6 sm:mt-7">
            <ServerUrl idp="mcp4" center />
          </ScrubText>

          <ScrubText reduce={reduce} lag={0.2} className="mt-8 sm:mt-10">
            <div role="tablist" aria-label="Your AI assistant" onKeyDown={onKey} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {CLIENTS.map((x, k) => {
                const on = k === pick;
                return (
                  <button key={x.name} ref={el => { refs.current[k] = el; }} type="button" role="tab" id={'mcp4-tab-' + k} aria-selected={on} aria-controls={'mcp4-panel-' + k} aria-label={x.name} tabIndex={on ? 0 : -1}
                    onClick={() => setPick(k)}
                    className={'relative grid size-10 cursor-pointer place-items-center rounded-full sm:size-11 border-0 transition-[opacity,box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 '
                      + (x.any ? 'bg-transparent text-white [outline:1px_dashed_rgba(255,255,255,0.5)] [outline-offset:-1px] ' : 'bg-white ')
                      + (on ? 'opacity-100 shadow-[0_0_0_2px_#0f2e27,0_0_0_4px_#d1f899]' : 'opacity-40 hover:opacity-75')}>
                    {x.any ? <span aria-hidden="true" className="text-[18px] leading-none">+</span>
                      : x.logo ? <img src={x.logo} alt="" className="size-5" />
                      : <span aria-hidden="true" className="text-[14px] font-semibold text-ink-2">{x.name[0]}</span>}
                    {x.cli && <span aria-hidden="true" className="absolute -bottom-1 -right-1 grid h-[18px] place-items-center rounded-full bg-[#0f2e27] px-1 font-gmono text-[9px] leading-none text-white ring-1 ring-white/30">&gt;_</span>}
                  </button>
                );
              })}
            </div>
            {/* The pick: its name (and whether it's verified), centred; its steps left-aligned under it. All panels
                share one cell so the card keeps its height when the pick changes. */}
            <div className="mx-auto mt-5 grid max-w-[52ch] [&>*]:[grid-area:1/1]">
              {CLIENTS.map((x, k) => (
                <div key={x.name} role="tabpanel" id={'mcp4-panel-' + k} aria-labelledby={'mcp4-tab-' + k} aria-hidden={k !== pick} inert={k !== pick ? INERT : undefined}
                  className={'transition-opacity duration-300 ease-out ' + (k === pick ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                  <p className="m-0 mb-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] leading-[1.5] text-white">
                    <span>{x.name}{x.note && <span className="text-white/55"> ({x.note})</span>}.</span>
                    {!x.any && (x.verified
                      ? <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-[#d1f899]/[0.14] px-2 text-[12px] text-[#d1f899]"><Check aria-hidden="true" className="size-3" strokeWidth={2.5} />Verified</span>
                      : <span className="inline-flex h-[22px] items-center rounded-full bg-white/[0.08] px-2 text-[12px] text-white/60">Unconfirmed</span>)}
                  </p>
                  <div className={'mx-auto w-fit max-w-full ' + (x.any ? 'text-center' : 'text-left')}><McpSteps c={x} /></div>
                </div>
              ))}
            </div>

            {/* The prompt to paste into the agent, and the full guide. */}
            <div className="mx-auto mt-7 max-w-[52ch] rounded-[16px] bg-white/[0.05] p-4 text-left ring-1 ring-inset ring-white/[0.08]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-white/55">Copy this prompt for your agent</span>
                <CopyButton text={MCP_PROMPT} what="prompt" />
              </div>
              <p className="m-0 mt-2 text-[14px] leading-[1.55] text-white/80">“<Inline text={MCP_PROMPT.replace(MCP_URL, '`' + MCP_URL + '`')} />”</p>
            </div>
            <a href={docsHref ? [docsHref, 'frank-mcp-connector'].join('#/') : undefined}
              className={'group mt-5 inline-flex items-center gap-1.5 rounded-full text-[14px] text-white no-underline ' + FOCUS_W}>
              <span className="underline decoration-[#d1f899]/60 decoration-1 underline-offset-[5px] transition-colors duration-200 group-hover:decoration-[#d1f899]">Full setup guide</span>
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} />
            </a>
          </ScrubText>

          {/* The video, sitting on the card's bottom edge (square bottom corners), as if it rises out of it.
              While it plays it holds still (no rise) and opens to 16:9. */}
          <motion.div style={{ transform: playing ? 'translateY(0%)' : rise }} className="mt-8 sm:mt-10">
            <motion.figure ref={fig} initial={false}
              animate={{ aspectRatio: playing || !wide ? 16 / 9 : 3 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ aspectRatio: wide ? 3 : 16 / 9 }}
              className="relative m-0 w-full overflow-hidden rounded-t-[24px] bg-[#0a211b] ring-1 ring-inset ring-white/[0.1] sm:rounded-t-[28px]">
              {playing && ready ? (
                <video src={AG_VIDEO.src} poster={AG_VIDEO.poster || undefined} controls autoPlay playsInline onPause={() => setPlaying(false)} className="absolute inset-0 size-full bg-black object-cover" />
              ) : (
                <>
                  {AG_VIDEO.poster
                    ? <img src={AG_VIDEO.poster} alt="" className="absolute inset-0 size-full object-cover" />
                    : <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(209,248,153,0.10),rgba(209,248,153,0)_70%)]" />}
                  <AnimatePresence initial={false}>
                    {playing ? (
                      // The playing view, until the real video is added: a preview tag, and the player bar
                      // (pause, a progress line that runs, time, sound, full screen).
                      <motion.div key="bar" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.3, duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                        <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-white/70 sm:left-5 sm:top-5">Preview · video coming soon</span>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-10 sm:px-6 sm:pb-5">
                          <div className="flex items-center gap-3 text-white sm:gap-4">
                            <button type="button" onClick={() => setPlaying(false)} aria-label="Pause"
                              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink transition-transform duration-200 ease-out active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                              <Pause aria-hidden="true" className="size-4 fill-current" strokeWidth={0} />
                            </button>
                            <span className="font-gmono text-[12px] tabular-nums text-white/80">0:14</span>
                            <span className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
                              <span className={'ag-progress absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#d1f899]' + (reduce ? ' [transform:scaleX(0.16)]' : '')} />
                            </span>
                            <span className="font-gmono text-[12px] tabular-nums text-white/50">1:30</span>
                            <Volume2 aria-hidden="true" className="hidden size-[18px] text-white/75 sm:block" strokeWidth={1.5} />
                            <Maximize2 aria-hidden="true" className="hidden size-[18px] text-white/75 sm:block" strokeWidth={1.5} />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button key="play" type="button" onClick={play} aria-label="Play video: Frank inside your AI assistant"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-[72px]">
                        <Play aria-hidden="true" className="ml-1 size-7 fill-current" strokeWidth={0} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.figure>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ——— MCP setup copy, used by AgenticWorkflowE (V21.04). "Add Frank to your AI": the server URL, one logo per
// client with its own steps (verified or not), a prompt to paste into the agent and the full guide.
const MCP_URL = 'https://api.hifrank.ai/mcp';
const MCP_CHECK = 'To check it works, ask “List my Frank studies”.';
const MCP_PROMPT = 'Connect to Frank AI Researcher at https://api.hifrank.ai/mcp, list my studies, and summarize the key themes from my latest AI-moderated voice interviews.';
// steps: plain strings; `code` (URLs, commands) shows as an inline mono chip, with no copy button.
const CLIENTS = [
  { name: 'Claude', note: 'web and desktop', logo: claudeLogo, verified: true, steps: [
    'Open Settings → Connectors → Add custom connector.',
    'Paste the server URL `https://api.hifrank.ai/mcp`. Keep “Use Claude’s published identity” if that option is shown.',
    'Sign in to Frank in your browser and approve access. There is no API key.',
    MCP_CHECK] },
  { name: 'Claude Code', logo: claudeLogo, cli: true, verified: true, steps: [
    'Run `claude mcp add --transport http frank https://api.hifrank.ai/mcp`',
    'Then run `/mcp`, pick frank, and choose Authenticate. Your browser opens the approval screen.',
    MCP_CHECK] },
  { name: 'Codex', logo: openaiLogo, cli: true, verified: true, steps: [
    'Run `codex mcp add frank --url https://api.hifrank.ai/mcp`. It opens the browser sign-in right away, so there’s no separate authenticate step.',
    'Sign in to Frank in your browser and approve access.',
    MCP_CHECK] },
  { name: 'Grok Bot', verified: true, steps: [
    'Add the Frank connector in Grok Bot and sign in to Frank in your browser. Grok Bot is a verified client and has been submitted to the Grok marketplace.',
    MCP_CHECK] },
  { name: 'ChatGPT', logo: openaiLogo, verified: false, steps: [
    'Open Settings → Connectors (developer mode) and add the server URL `https://api.hifrank.ai/mcp`.',
    'Sign in to Frank in your browser when prompted.',
    'If the connection completes, ask “List my Frank studies” to check it works.'] },
  { name: 'Other clients', any: true,
    text: 'Cursor and Gemini CLI aren’t supported yet. Verified working clients today are Claude, Claude Code, Codex and Grok Bot.' },
];
// React 18 sets unknown attributes as strings: '' turns inert on (hidden panels can't be tabbed into).
const INERT = '';
const FOCUS_W = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70';
// `code` in a step becomes a mono chip.
function Inline({ text }) {
  return text.split(/(`[^`]+`)/).map((part, i) => part.startsWith('`') && part.endsWith('`')
    ? <code key={i} className="rounded-[6px] bg-white/[0.08] px-1.5 py-px font-gmono text-[0.86em] text-white/90 [overflow-wrap:anywhere] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{part.slice(1, -1)}</code>
    : <Fragment key={i}>{part}</Fragment>);
}
// Clipboard API first; when it's missing or refused (e.g. inside a sandboxed iframe), fall back to a hidden textarea.
function copyFallback(text) {
  return new Promise((ok, no) => {
    const t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); } finally { t.remove(); }
  });
}
function copyText(text) {
  if (!navigator.clipboard?.writeText) return copyFallback(text);
  return navigator.clipboard.writeText(text).catch(() => copyFallback(text));
}
function CopyButton({ text, what }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => copyText(text).then(() => {
    setDone(true); clearTimeout(timer.current); timer.current = setTimeout(() => setDone(false), 1600);
  }).catch(() => {});
  return (
    <button type="button" onClick={copy} aria-label={done ? 'Copied' : 'Copy ' + what}
      className={'inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-0 px-2.5 font-sans text-[12px] transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.96] '
        + (done ? 'bg-[#d1f899] text-[#0f2e27]' : 'bg-white/[0.08] text-white/75 hover:bg-white/[0.14]') + ' ' + FOCUS_W}>
      {done ? <Check aria-hidden="true" className="size-3.5" strokeWidth={2.25} /> : <Copy aria-hidden="true" className="size-3.5" strokeWidth={1.75} />}
      <span aria-hidden="true">{done ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
// The server URL: a small label, then one pill (a plug icon, the URL in lime, a round copy icon). The whole
// pill is the copy button; copied, the icon turns into a lime check for a moment. The URL is never cut off.
function ServerUrl({ idp = 'mcp', center = false }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => copyText(MCP_URL).then(() => {
    setDone(true); clearTimeout(timer.current); timer.current = setTimeout(() => setDone(false), 1600);
  }).catch(() => {});
  return (
    <div className={center ? 'flex flex-col items-center' : undefined}>
      <p id={idp + '-url-label'} className={'m-0 mb-2 font-sans' + (center ? ' text-center' : '') + ' text-[12px] font-light uppercase tracking-[0.08em] text-white/50'}>Server URL</p>
      <button type="button" onClick={copy} aria-describedby={idp + '-url-label'} aria-label={done ? 'Server URL copied' : 'Copy server URL ' + MCP_URL}
        className={'group inline-flex h-11 max-w-full cursor-pointer items-center gap-2.5 rounded-full border-0 bg-white/[0.05] pl-3.5 pr-1.5 text-left ring-1 ring-inset ring-white/[0.1] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-white/[0.08] hover:ring-white/[0.16] active:scale-[0.98] sm:gap-3 sm:pl-4 ' + FOCUS_W}>
        <Plug aria-hidden="true" className="hidden size-4 shrink-0 text-white/45 sm:block" strokeWidth={1.75} />
        <code className="whitespace-nowrap font-gmono text-[13px] text-[#d1f899] sm:text-[14px]">{MCP_URL}</code>
        <span aria-hidden="true" className={'relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-200 '
          + (done ? 'bg-[#d1f899] text-[#0f2e27]' : 'bg-white/[0.08] text-white/75 group-hover:bg-white/[0.14] group-hover:text-white')}>
          <Copy className={'absolute size-3.5 transition-[opacity,transform] duration-200 ease-out ' + (done ? 'scale-50 opacity-0' : 'scale-100 opacity-100')} strokeWidth={1.75} />
          <Check className={'absolute size-3.5 transition-[opacity,transform] duration-200 ease-out ' + (done ? 'scale-100 opacity-100' : 'scale-50 opacity-0')} strokeWidth={2.5} />
        </span>
        <span className="sr-only" aria-live="polite">{done ? 'Copied' : ''}</span>
      </button>
    </div>
  );
}
function McpSteps({ c }) {
  if (c.any) return <p className="m-0 text-[14px] leading-[1.55] text-white/60">{c.text}</p>;
  return (
    <ol className="m-0 grid list-none gap-2.5 p-0">
      {c.steps.map((st, i) => (
        <li key={i} className="grid grid-cols-[22px_minmax(0,1fr)] gap-3 text-[14px] leading-[1.55] text-white/60">
          <span aria-hidden="true" className="mt-px grid size-[22px] place-items-center rounded-full bg-white/[0.08] font-gmono text-[11px] tabular-nums text-white/70">{i + 1}</span>
          <span><Inline text={st} /></span>
        </li>
      ))}
    </ol>
  );
}

// ——— AgenticWorkflowE (V21.04, the minimal layout in two columns, under it). The same green card and
// entrance. Left, centred in the card's height: the label, title and subtitle, the row of round logos and
// the pick's one-line note, all left-aligned. Right: the video in a 4:3 frame running to the card's right
// edge, with the card's padding under it, rising with the scroll like the minimal layout's. A column is too narrow to watch in, so play opens
// the video in a large 16:9 player over the dimmed page (a portal, since the card is clipped): pause,
// Escape, the close button or a click outside closes it. Below 1024px the columns stack, the video last.
function VideoLightbox({ open, onClose, reduce }) {
  const closeBtn = useRef(null);
  const ready = !!AG_VIDEO.src;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const back = document.activeElement;
    closeBtn.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); back?.focus?.(); };
  }, [open, onClose]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="lb" role="dialog" aria-modal="true" aria-label="Video: Frank inside your AI assistant"
          className="fixed inset-0 z-[70] grid place-items-center bg-[#0b1a16]/80 p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }} exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
          onClick={onClose}>
          <motion.div onClick={e => e.stopPropagation()}
            initial={reduce ? false : { opacity: 0, transform: 'translateY(12px) scale(0.97)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)', transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px) scale(0.98)', transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
            className="relative w-full max-w-[1120px]">
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close video"
              className="absolute -top-12 right-0 grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
            </button>
            <figure className="relative m-0 aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-[#0a211b] ring-1 ring-inset ring-white/[0.1] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] sm:rounded-[28px]">
              {ready ? (
                <video src={AG_VIDEO.src} poster={AG_VIDEO.poster || undefined} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-cover" />
              ) : (
                <>
                  <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(209,248,153,0.10),rgba(209,248,153,0)_70%)]" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-white/70 sm:left-5 sm:top-5">Preview · video coming soon</span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-10 sm:px-6 sm:pb-5">
                    <div className="flex items-center gap-3 text-white sm:gap-4">
                      <button type="button" onClick={onClose} aria-label="Pause"
                        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink transition-transform duration-200 ease-out active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        <Pause aria-hidden="true" className="size-4 fill-current" strokeWidth={0} />
                      </button>
                      <span className="font-gmono text-[12px] tabular-nums text-white/80">0:14</span>
                      <span className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
                        <span className={'ag-progress absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#d1f899]' + (reduce ? ' [transform:scaleX(0.16)]' : '')} />
                      </span>
                      <span className="font-gmono text-[12px] tabular-nums text-white/50">1:30</span>
                      <Volume2 aria-hidden="true" className="hidden size-[18px] text-white/75 sm:block" strokeWidth={1.5} />
                      <Maximize2 aria-hidden="true" className="hidden size-[18px] text-white/75 sm:block" strokeWidth={1.5} />
                    </div>
                  </div>
                </>
              )}
            </figure>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function AgenticWorkflowE({ docsHref }) {
  const reduce = !!useReducedMotion();
  const [pick, setPick] = useState(0);
  const [open, setOpen] = useState(false);
  const refs = useRef([]);
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: useTransform(cp, [0, 0.35], [0, 1]),
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  // The video rises with the scroll, as in the minimal layout.
  const { scrollYProgress: vp } = useScroll({ target: card, offset: ['start end', 'end end'] });
  const vs = useSpring(vp, { stiffness: 140, damping: 30, mass: 0.5, restDelta: 0.0005 });
  const vy = useTransform(vs, [0.25, 1], [reduce ? 0 : 60, 0], { clamp: true });
  const rise = useMotionTemplate`translateY(${vy}%)`;
  const onKey = e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (pick + d + CLIENTS.length) % CLIENTS.length;
    setPick(n); refs.current[n]?.focus();
  };
  return (
    <section aria-labelledby="ag5-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      <motion.div ref={card} style={cardIn} data-dark-card className="relative grid min-h-[calc(100svh-32px)] overflow-hidden rounded-[32px] bg-[#0f2e27] [--r:32px] md:[--r:44px] px-5 py-14 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:py-[clamp(48px,4.5vw,64px)] lg:pl-[clamp(48px,6vw,96px)] lg:pr-0">
        <div className="relative mx-auto grid w-full min-w-0 max-w-[1120px] grid-cols-1 gap-10 lg:max-w-none lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {/* Left: the story and the picker, centred in the card's height. V21.04: the MCP setup copy —
              the server URL, a round logo per client (as before) and, under it, the pick's steps, then the
              prompt to paste and the full guide. */}
          <div className="min-w-0 self-center">
            <ScrubText reduce={reduce}><Eyebrow line={false} align="start" className="mb-5 !text-white/85 sm:mb-6">For AI assistants</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id="ag5-title" className={'m-0 leading-[1.04] text-white [text-wrap:balance] ' + TITLE}
              lines={['Add Frank', 'to your AI']} />
            <ScrubText as="p" reduce={reduce} lag={0.15} className={'mb-0 max-w-[46ch] mt-6 text-white/60 ' + SUBTITLE_SIZE}>
              Connect once, then design, launch and analyze AI-moderated voice interviews from your assistant. MCP is included on every plan, including Free.
            </ScrubText>
            <ScrubText reduce={reduce} lag={0.2} className="mt-6 sm:mt-7">
              {/* The server URL: one pill, click anywhere on it to copy. */}
              <ServerUrl />
            </ScrubText>
            <ScrubText reduce={reduce} lag={0.2} className="mt-8 sm:mt-10">
              <div role="tablist" aria-label="Your AI assistant" onKeyDown={onKey} className="flex flex-wrap items-center gap-2 sm:gap-3">
                {CLIENTS.map((x, k) => {
                  const on = k === pick;
                  return (
                    <button key={x.name} ref={el => { refs.current[k] = el; }} type="button" role="tab" id={'mcp-tab-' + k} aria-selected={on} aria-controls={'mcp-panel-' + k} aria-label={x.name} tabIndex={on ? 0 : -1}
                      onClick={() => setPick(k)}
                      className={'relative grid size-10 cursor-pointer place-items-center rounded-full border-0 transition-[opacity,box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 sm:size-11 '
                        + (x.any ? 'bg-transparent text-white [outline:1px_dashed_rgba(255,255,255,0.5)] [outline-offset:-1px] ' : 'bg-white ')
                        + (on ? 'opacity-100 shadow-[0_0_0_2px_#0f2e27,0_0_0_4px_#d1f899]' : 'opacity-40 hover:opacity-75')}>
                      {x.any ? <span aria-hidden="true" className="text-[18px] leading-none">+</span>
                        : x.logo ? <img src={x.logo} alt="" className="size-5" />
                        : <span aria-hidden="true" className="text-[14px] font-semibold text-ink-2">{x.name[0]}</span>}
                      {/* Claude Code and Codex share a mark with Claude and ChatGPT: a small terminal tag tells them apart. */}
                      {x.cli && <span aria-hidden="true" className="absolute -bottom-1 -right-1 grid h-[18px] place-items-center rounded-full bg-[#0f2e27] px-1 font-gmono text-[9px] leading-none text-white ring-1 ring-white/30">&gt;_</span>}
                    </button>
                  );
                })}
              </div>
              {/* The pick: its name (and whether it's verified), then its steps. All panels share one cell so the
                  column keeps its height when the pick changes. */}
              <div className="mt-5 grid max-w-[46ch] [&>*]:[grid-area:1/1]">
                {CLIENTS.map((x, k) => (
                  <div key={x.name} role="tabpanel" id={'mcp-panel-' + k} aria-labelledby={'mcp-tab-' + k} aria-hidden={k !== pick} inert={k !== pick ? INERT : undefined}
                    className={'transition-opacity duration-300 ease-out ' + (k === pick ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                    <p className="m-0 mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[1.5] text-white">
                      <span>{x.name}{x.note && <span className="text-white/55"> ({x.note})</span>}.</span>
                      {!x.any && (x.verified
                        ? <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-[#d1f899]/[0.14] px-2 text-[12px] text-[#d1f899]"><Check aria-hidden="true" className="size-3" strokeWidth={2.5} />Verified</span>
                        : <span className="inline-flex h-[22px] items-center rounded-full bg-white/[0.08] px-2 text-[12px] text-white/60">Unconfirmed</span>)}
                    </p>
                    <McpSteps c={x} />
                  </div>
                ))}
              </div>

              {/* The prompt to paste into the agent, and the full guide. */}
              <div className="mt-7 max-w-[46ch] rounded-[16px] bg-white/[0.05] p-4 ring-1 ring-inset ring-white/[0.08]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-white/55">Copy this prompt for your agent</span>
                  <CopyButton text={MCP_PROMPT} what="prompt" />
                </div>
                <p className="m-0 mt-2 text-[14px] leading-[1.55] text-white/80">“<Inline text={MCP_PROMPT.replace(MCP_URL, '`' + MCP_URL + '`')} />”</p>
              </div>
              <a href={docsHref ? [docsHref, 'frank-mcp-connector'].join('#/') : undefined}
                className={'group mt-5 inline-flex items-center gap-1.5 rounded-full text-[14px] text-white no-underline ' + FOCUS_W}>
                <span className="underline decoration-[#d1f899]/60 decoration-1 underline-offset-[5px] transition-colors duration-200 group-hover:decoration-[#d1f899]">Full setup guide</span>
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} />
              </a>
            </ScrubText>
          </div>

          {/* Right: the video, running to the card's right edge (square right corners) with the card's
              padding under it, centred in the card's height, rising with the scroll. */}
          <motion.div style={{ transform: rise }} className="self-center">
            <figure className="relative m-0 aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-[#0a211b] ring-1 ring-inset ring-white/[0.1] sm:rounded-[28px] lg:aspect-[4/3] lg:rounded-r-none">
              {AG_VIDEO.poster
                ? <img src={AG_VIDEO.poster} alt="" className="absolute inset-0 size-full object-cover" />
                : <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_90%_at_50%_0%,rgba(209,248,153,0.10),rgba(209,248,153,0)_70%)]" />}
              <button type="button" onClick={() => setOpen(true)} aria-label="Play video: Frank inside your AI assistant"
                className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-[72px]">
                <Play aria-hidden="true" className="ml-1 size-7 fill-current" strokeWidth={0} />
              </button>
            </figure>
          </motion.div>
        </div>
      </motion.div>
      <VideoLightbox open={open} onClose={() => setOpen(false)} reduce={reduce} />
    </section>
  );
}

// ——— AgenticWorkflowF (V21.04, a fourth layout: two columns, no video). The same green card and entrance.
// Left, centred in the card's height: the label, title and subtitle, the server URL pill and the full guide.
// Right: one quiet panel holding the round logos, the pick's name and steps, and (under a hairline) the
// prompt to paste. Below 1024px the columns stack, the panel last.
export function AgenticWorkflowF({ docsHref }) {
  const reduce = !!useReducedMotion();
  const [pick, setPick] = useState(0);
  const refs = useRef([]);
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: useTransform(cp, [0, 0.35], [0, 1]),
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  const onKey = e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (pick + d + CLIENTS.length) % CLIENTS.length;
    setPick(n); refs.current[n]?.focus();
  };
  return (
    <section aria-labelledby="ag6-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      <motion.div ref={card} style={cardIn} data-dark-card className="relative grid min-h-[calc(100svh-32px)] items-center overflow-hidden rounded-[32px] bg-[#0f2e27] [--r:32px] md:[--r:44px] px-5 py-14 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)] lg:py-[clamp(56px,5vw,80px)]">
        <div className="relative mx-auto grid w-full min-w-0 max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-[clamp(48px,6vw,96px)]">
          {/* Left: the story, the server URL and the full guide. */}
          <div className="min-w-0">
            <ScrubText reduce={reduce}><Eyebrow line={false} align="start" className="mb-5 !text-white/85 sm:mb-6">For AI assistants</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id="ag6-title" className={'m-0 leading-[1.04] text-white [text-wrap:balance] ' + TITLE}
              lines={['Add Frank', 'to your AI']} />
            <ScrubText as="p" reduce={reduce} lag={0.15} className={'mb-0 max-w-[42ch] mt-6 text-white/60 ' + SUBTITLE_SIZE}>
              Connect once, then design, launch and analyze AI-moderated voice interviews from your assistant. MCP is included on every plan, including Free.
            </ScrubText>
            <ScrubText reduce={reduce} lag={0.2} className="mt-8 sm:mt-10">
              <ServerUrl idp="mcp6" />
              <a href={docsHref ? [docsHref, 'frank-mcp-connector'].join('#/') : undefined}
                className={'group mt-7 inline-flex items-center gap-1.5 rounded-full text-[14px] text-white no-underline ' + FOCUS_W}>
                <span className="underline decoration-[#d1f899]/60 decoration-1 underline-offset-[5px] transition-colors duration-200 group-hover:decoration-[#d1f899]">Full setup guide</span>
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" strokeWidth={1.75} />
              </a>
            </ScrubText>
          </div>

          {/* Right: the picker, the pick's steps and the prompt, in one quiet panel. */}
          <ScrubText reduce={reduce} lag={0.25} className="min-w-0">
            <div className="rounded-[24px] bg-white/[0.04] p-5 ring-1 ring-inset ring-white/[0.08] sm:rounded-[28px] sm:p-8">
              <p className="m-0 mb-4 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-white/50">Pick your assistant</p>
              <div role="tablist" aria-label="Your AI assistant" onKeyDown={onKey} className="flex flex-wrap items-center gap-2 sm:gap-3">
                {CLIENTS.map((x, k) => {
                  const on = k === pick;
                  return (
                    <button key={x.name} ref={el => { refs.current[k] = el; }} type="button" role="tab" id={'mcp6-tab-' + k} aria-selected={on} aria-controls={'mcp6-panel-' + k} aria-label={x.name} tabIndex={on ? 0 : -1}
                      onClick={() => setPick(k)}
                      className={'relative grid size-9 cursor-pointer place-items-center rounded-full border-0 transition-[opacity,box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 sm:size-11 '
                        + (x.any ? 'bg-transparent text-white [outline:1px_dashed_rgba(255,255,255,0.5)] [outline-offset:-1px] ' : 'bg-white ')
                        + (on ? 'opacity-100 shadow-[0_0_0_2px_#13332c,0_0_0_4px_#d1f899]' : 'opacity-40 hover:opacity-75')}>
                      {x.any ? <span aria-hidden="true" className="text-[18px] leading-none">+</span>
                        : x.logo ? <img src={x.logo} alt="" className="size-5" />
                        : <span aria-hidden="true" className="text-[14px] font-semibold text-ink-2">{x.name[0]}</span>}
                      {x.cli && <span aria-hidden="true" className="absolute -bottom-1 -right-1 grid h-[18px] place-items-center rounded-full bg-[#0f2e27] px-1 font-gmono text-[9px] leading-none text-white ring-1 ring-white/30">&gt;_</span>}
                    </button>
                  );
                })}
              </div>
              {/* All panels share one cell so the panel keeps its height when the pick changes. */}
              <div className="mt-8 grid [&>*]:[grid-area:1/1] sm:mt-10">
                {CLIENTS.map((x, k) => (
                  <div key={x.name} role="tabpanel" id={'mcp6-panel-' + k} aria-labelledby={'mcp6-tab-' + k} aria-hidden={k !== pick} inert={k !== pick ? INERT : undefined}
                    className={'transition-opacity duration-300 ease-out ' + (k === pick ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                    <p className="m-0 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-[1.5] text-white">
                      <span>{x.name}{x.note && <span className="text-white/55"> ({x.note})</span>}</span>
                      {!x.any && (x.verified
                        ? <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-[#d1f899]/[0.14] px-2 text-[12px] text-[#d1f899]"><Check aria-hidden="true" className="size-3" strokeWidth={2.5} />Verified</span>
                        : <span className="inline-flex h-[22px] items-center rounded-full bg-white/[0.08] px-2 text-[12px] text-white/60">Unconfirmed</span>)}
                    </p>
                    <McpSteps c={x} />
                  </div>
                ))}
              </div>
              {/* The prompt to paste, under a hairline. */}
              <div className="mt-7 border-0 border-t border-solid border-white/[0.08] pt-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-white/55">Copy this prompt for your agent</span>
                  <CopyButton text={MCP_PROMPT} what="prompt" />
                </div>
                <p className="m-0 mt-2.5 text-[14px] leading-[1.55] text-white/80">“<Inline text={MCP_PROMPT.replace(MCP_URL, '`' + MCP_URL + '`')} />”</p>
              </div>
            </div>
          </ScrubText>
        </div>
      </motion.div>
    </section>
  );
}
