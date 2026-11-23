// AgenticWorkflow (V21.12) — "Use Frank with your AI assistant". The label, the title and the subtitle,
// centred; the assistants Frank works with, as a plain row; then a near-black stage
// with a quiet browser window on it, as in the widget section (claude.ai in a thin bar): the example always runs in Claude. One beat at a time: your request types in and is sent; the
// assistant hands it to Frank; his thinking shows as a step list (drafting, sending, interviewing, summing
// up), each running step with a spinner, a soft wave on its label and its log lines scrolling in; when he's
// done the list folds away and his finding lands in the chat, marked in lime. One plain takeaway line sits
// in the stage, under the window.
// Every line keeps its place from the start (it only fades in), so the window never resizes.
// Reduced motion: no tour, the finished conversation is simply there.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUp, ChevronDown } from 'lucide-react';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
// Assistant logos from LobeHub Icons (MIT; the marks belong to their owners). Dot and Instinct have
// no published mark there yet, so they get a quiet initial until their own logos are added.
import claudeLogo from './logos/claude.svg';
import openaiLogo from './logos/openai.svg';
import cursorLogo from './logos/cursor.svg';

// url: what the browser's address bar shows (only where the web address is certain).
const ASSISTANTS = [
  { name: 'Claude', logo: claudeLogo, url: 'claude.ai/new' },
  { name: 'ChatGPT', logo: openaiLogo, url: 'chatgpt.com' },
  { name: 'Cursor', logo: cursorLogo, url: 'cursor.com' },
  { name: 'Dot' },
  { name: 'Instinct' },
];
const EASE = [0.23, 1, 0.32, 1];
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
// What Frank heard, as themes across the 34 finished interviews (sample numbers; they add up to 34).
const THEMES = [
  { label: 'Wants a plan for their team', n: 21, top: true },
  { label: 'Price feels high for one seat', n: 8 },
  { label: 'Missing a Slack integration', n: 5 },
];
const HEARD = 34;

// The assistant's mark in an even white tile (the stand-in letter where there is no logo yet).
const Mark = ({ a }) => (
  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-white">
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
const LINE_H = 22, SHOW_LINES = 3;

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
  const mask = lines.length > SHOW_LINES - 1 ? 'linear-gradient(to bottom, rgb(0 0 0 / 0.25), black 70%)' : undefined;
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
    <li className="relative flex gap-3 pt-3.5">
      {!last && (
        <span aria-hidden="true" className="absolute bottom-[-10px] left-[7.5px] top-[34px] w-px overflow-hidden bg-[#1a1714]/[0.08]">
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
        <div className="grid items-start [&>*]:[grid-area:1/1]">
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

// Frank's report, back in the chat: a flat card with the study, the themes as hairline bars that fill
// in one after another (only the top one in lime), and the clearest quote under one divider.
function Report({ on }) {
  return (
    <div className={'rounded-[12px] bg-white px-5 py-5 ring-1 ring-[#1a1714]/[0.08] ' + shown(on)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="m-0 min-w-0 truncate text-[14px] font-medium text-ink">Why trial users don’t upgrade</p>
        <span className="shrink-0 text-[12px] tabular-nums text-ink-3">{HEARD} of 40 interviewed</span>
      </div>
      <ul aria-label="Themes" className="m-0 mt-5 flex list-none flex-col gap-4 p-0">
        {THEMES.map((t, i) => (
          <li key={t.label}>
            <div className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className={t.top ? 'text-ink' : 'text-ink-2'}>{t.label}</span>
              <span className="tabular-nums text-ink-3">{t.n}</span>
            </div>
            <span aria-hidden="true" className="mt-2 block h-[3px] overflow-hidden rounded-full bg-[#1a1714]/[0.06]">
              <span className={'block h-full origin-left rounded-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none '
                + (t.top ? 'bg-[#8fc24f]' : 'bg-[#1a1714]/[0.22]')}
                style={{ width: `${(t.n / HEARD) * 100}%`, transform: `scaleX(${on ? 1 : 0})`, transitionDelay: on ? `${250 + i * 120}ms` : '0ms' }} />
            </span>
          </li>
        ))}
      </ul>
      <blockquote className="m-0 mt-5 border-0 border-t border-solid border-[#1a1714]/[0.06] pt-4">
        <p className="m-0 font-serif text-[15px] leading-[1.5] text-ink">“We’d have paid today if I could add my two co-founders.”</p>
        <p className="m-0 mt-1 text-[12px] text-ink-3">Trial user, interview 17</p>
      </blockquote>
    </div>
  );
}

function ChatWindow({ a, step, reduce }) {
  const typing = step < 0 && !reduce;
  const n = useTyped(ASK, typing);
  return (
    // The stage: a near-black card, and on it a quiet browser window (three dots and the address in a thin
    // bar), as in the widget section.
    // Behind the window: a faint dot grid fading out from the centre, and a soft lime glow from the top.
    <div className="relative isolate overflow-hidden rounded-[22px] bg-[#141311] px-4 py-8 sm:rounded-[28px] sm:px-8 sm:py-12 lg:py-16">
      <span aria-hidden="true" className="absolute inset-0 -z-10 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />
      <span aria-hidden="true" className="absolute left-1/2 top-[-30%] -z-10 h-[70%] w-[80%] -translate-x-1/2 rounded-full bg-[#d1f899] opacity-[0.13] blur-[90px]" />
      <div className="relative mx-auto flex min-h-[600px] max-w-[880px] flex-col overflow-hidden rounded-[18px] bg-white text-left ring-1 ring-white/10 shadow-[0_0_0_6px_rgba(255,255,255,0.04),0_50px_100px_-40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 border-0 border-b border-solid border-[#1a1714]/[0.06] bg-[#f7f6f2] px-4 py-2.5">
            <span aria-hidden="true" className="flex gap-1.5">{[0, 1, 2].map(k => <span key={k} className="size-2 rounded-full bg-[#1a1714]/[0.12]" />)}</span>
            <motion.span key={a.name} className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1 font-sans text-[11px] text-ink-3 ring-1 ring-[#1a1714]/[0.05]"
              initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>
              {a.logo
                ? <img src={a.logo} alt="" className="size-3 shrink-0" />
                : <span aria-hidden="true" className="text-[9.5px] font-semibold text-ink-2">{a.name[0]}</span>}
              <span className="truncate">{a.url || a.name}</span>
            </motion.span>
          </div>
          <div className="flex flex-col gap-4 px-5 pb-6 pt-6 text-[14.5px] leading-[1.55] sm:px-8">
            <p className={'m-0 ml-auto max-w-[80%] rounded-[16px] rounded-br-[6px] bg-[#1a1714]/[0.05] px-4 py-2.5 text-ink ' + shown(step >= 0)}>{ASK}</p>
            <p className={'m-0 text-ink-2 ' + shown(step >= 0)}>I’ll ask Frank to run this.</p>

            {/* Frank's thinking, as a step list in the chat. */}
            {/* His findings land where the step list was; what he found is marked, like a change in a doc. */}
            <div className={shown(step >= 0)}>
              <AgentRun step={step} reduce={reduce} result={(
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-ink">
                    Here’s what Frank heard:{' '}
                    <mark className="rounded-[4px] bg-[#e6f8c9] px-0.5 text-ink [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">most of them would have upgraded for a team plan.</mark>
                  </p>
                  <Report on={step >= DONE} />
                </div>
              )} />
            </div>
          </div>

          <div className="mt-auto px-3 pb-3 sm:px-5 sm:pb-5">
            <div className="flex items-center gap-2 rounded-[18px] bg-[#1a1714]/[0.04] py-1.5 pl-4 pr-1.5 text-[14px]">
              <span className={'min-w-0 flex-1 leading-[1.45] ' + (typing ? '' : 'truncate')}>
                {typing
                  ? <span className="text-ink">{ASK.slice(0, n)}<span aria-hidden="true" className="ag-caret ml-px inline-block h-[1.05em] w-px translate-y-[2px] bg-[#1a1714]" /></span>
                  : <span className="text-ink-3">Reply to {a.name}…</span>}
              </span>
              <span aria-hidden="true" className={'grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-200 '
                + (typing && n >= ASK.length ? 'bg-[#1a1714] text-white' : 'bg-[#1a1714]/[0.08] text-ink-3')}><ArrowUp className="size-4" /></span>
            </div>
          </div>
      </div>
      {/* The takeaway, inside the stage under the window, as one plain line. */}
      <p className="relative mx-auto mb-0 mt-7 max-w-[60ch] text-center text-[16px] leading-[1.55] text-white/55 [text-wrap:balance] sm:mt-10 sm:text-[18px]">
        Same studies, same insights, same dashboard. <span className="text-white">You just never have to switch tabs.</span>
      </p>
    </div>
  );
}

function Flow({ reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(reduce ? DONE : -1);
  useEffect(() => {
    if (reduce || !inView) return;
    const ms = step < 0 ? START_MS : step >= DONE ? HOLD_MS : STEP_MS[step];
    const t = setTimeout(() => {
      if (step >= DONE) setStep(-1);
      else setStep(s => s + 1);
    }, ms);
    return () => clearTimeout(t);
  }, [step, inView, reduce]);
  // The example always runs in Claude; the row above just lists where Frank works.
  const a = ASSISTANTS[0];
  return (
    <div ref={ref}>
      <ul aria-label="Works with" className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 text-[13.5px] text-ink-2">
        {ASSISTANTS.map(x => (
          <li key={x.name} className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3.5 ring-1 ring-[#1a1714]/[0.08] shadow-[0_1px_2px_rgba(26,23,20,0.04)]"><Mark a={x} />{x.name}</li>
        ))}
        <li className="inline-flex items-center rounded-full px-3.5 py-1.5 text-ink-3 [outline:1px_dashed_rgba(26,23,20,0.18)] [outline-offset:-1px]">+ any MCP client</li>
      </ul>

      <div className="mt-5 sm:mt-6">
        <ChatWindow a={a} step={step} reduce={reduce} />
      </div>

    </div>
  );
}

export default function AgenticWorkflow() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="ag-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[860px] text-center">
          <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">The agentic workflow</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ag-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Use Frank with', 'your AI assistant']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className="mx-auto mb-0 mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink-2 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
            Connect Frank to Claude, ChatGPT, Cursor, Dot, Instinct or any MCP client once. From there, you can design, launch and analyze customer interviews without ever leaving your AI assistant.
          </ScrubText>
        </div>

        {/* The assistants, the one chat window, and the takeaway under it. */}
        <ScrubText reduce={reduce} lag={0.1} className="mt-[clamp(28px,4vw,48px)]">
          <Flow reduce={reduce} />
        </ScrubText>
      </div>
    </section>
  );
}
