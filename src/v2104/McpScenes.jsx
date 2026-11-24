// McpScenes (V21.04): the three "How it works" visuals of the MCP page, rebuilt from the live hifrank.ai/mcp
// tab visuals (user, 2026-11-23: "use the old page's visuals, improve them"), same cards and words, drawn in the
// V21.04 style on the How it works card's lime. Each is a StepVisual `scene` ({ active, reduce }).
//   Define: the AI composer ("Where should we begin?") types the research prompt; then the "Real-time insights"
//           and "Live transcript" cards float in.
//   Engage: a phone video call with the Frank AI Researcher; the "Frank Research" quick-insights card and the
//           AI's "Thinking about your research" card under it, whose three checks tick one by one.
//   Query:  the composer types the question; the "Customer Cancellation Reasons" project card and the "Take
//           action" card float in.
// The scenes are drawn on a 520 × 578 stage (the card's 9:10) scaled to the card's width, so they read the same
// on phones and desktop. They play when their step becomes active; reduced motion shows the finished scene.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Check, ChevronRight, FileText, Lightbulb, Mic, MoreHorizontal, PhoneOff, Plus, Sparkles } from 'lucide-react';
import claudeLogo from './logos/claude.svg';

const W = 520, H = 578;
const EASE = [0.23, 1, 0.32, 1];

// The stage: fixed design size, scaled to the card.
function Stage({ children }) {
  const box = useRef(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="absolute inset-0">
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${k})` }}>{children}</div>
    </div>
  );
}

// A card that floats in when the scene plays (after `at` seconds).
function Float({ on, reduce, at = 0, className = '', style, children }) {
  return (
    <motion.div className={'absolute ' + className} style={style}
      initial={false}
      animate={on || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: on && !reduce ? at : 0 }}>
      {children}
    </motion.div>
  );
}

const CARD = 'rounded-[16px] bg-white shadow-[0_22px_50px_-22px_rgba(26,23,20,0.38)] ring-1 ring-[#1a1714]/[0.06]';
const Head = ({ icon: Icon, children }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="flex items-center gap-2 font-sans text-[12.5px] font-medium text-ink">
      <span className="grid size-6 place-items-center rounded-[7px] bg-[#f4f2ec] text-ink-2"><Icon className="size-3.5" strokeWidth={1.75} /></span>
      {children}
    </span>
    <MoreHorizontal className="size-4 text-ink-3" strokeWidth={1.75} />
  </div>
);

// Types `text` once `on` (reduced motion: all at once). Returns the shown part.
function useTyping(text, on, reduce, start = 0.3, cps = 52) {
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) { setN(text.length); return; }
    if (!on) { setN(0); return; }
    let i = 0, t;
    const tick = () => { i += 1; setN(i); if (i < text.length) t = setTimeout(tick, 1000 / cps); };
    t = setTimeout(tick, start * 1000);
    return () => clearTimeout(t);
  }, [on, reduce, text, start, cps]);
  return text.slice(0, n);
}

// The AI composer: "Where should we begin?", the prompt typing in, Think / mic / send.
function Composer({ text, on, reduce, style }) {
  const shown = useTyping(text, on, reduce);
  const done = shown.length === text.length;
  return (
    <div className={'absolute rounded-[22px] bg-[#fbfaf6] p-5 ' + CARD.replace('rounded-[16px] bg-white ', '')} style={style}>
      <p className="m-0 text-center font-sans text-[17px] font-medium tracking-[-0.01em] text-ink">Where should we begin?</p>
      <div className="mt-4 flex items-end gap-2.5 rounded-[16px] bg-white p-3 ring-1 ring-[#1a1714]/[0.08]">
        <Plus className="mb-1 size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
        <p className="m-0 min-h-[40px] flex-1 font-sans text-[13px] leading-[1.5] text-ink">
          {shown}{!done && <span className="ml-px inline-block h-[14px] w-px translate-y-[2px] animate-pulse bg-ink" />}
        </p>
        <span className="mb-0.5 flex shrink-0 items-center gap-2 text-ink-3">
          <span className="inline-flex items-center gap-1 font-sans text-[11.5px]"><Lightbulb className="size-3.5" strokeWidth={1.75} />Think</span>
          <Mic className="size-3.5" strokeWidth={1.75} />
          <span className={'grid size-7 place-items-center rounded-full text-white transition-colors duration-300 ' + (done ? 'bg-[#1a1714]' : 'bg-[#1a1714]/30')}>
            <ArrowUp className="size-3.5" strokeWidth={2.25} />
          </span>
        </span>
      </div>
    </div>
  );
}

// ——— 1. Define.
const DEFINE_PROMPT = 'I’m doing a short interview about our customers’ recent experience to understand what made them decide to try our product.';
const TRANSCRIPT = [
  ['02:14', 'I was looking for a simpler tool to manage our customer communication.'],
  ['02:36', 'It felt like we were spending too much time switching between apps.'],
  ['03:02', 'The pricing was also a factor, we needed something more affordable.'],
];
export function DefineScene({ active, reduce }) {
  const typedFor = DEFINE_PROMPT.length / 52 + 0.4;
  return (
    <Stage>
      <Composer text={DEFINE_PROMPT} on={active} reduce={reduce} style={{ left: 30, top: 214, width: 460 }} />
      <Float on={active} reduce={reduce} at={typedFor} className={CARD + ' p-4'} style={{ left: 22, top: 40, width: 286 }}>
        <Head icon={Sparkles}>Real-time insights</Head>
        <p className="m-0 mt-3 font-sans text-[11.5px] text-ink-3">Common themes detected</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#d1f899] px-2.5 py-1 font-sans text-[11.5px] text-ink">Need for simpler communication</span>
          <span className="font-sans text-[12px] font-medium tabular-nums text-ink">42%</span>
        </div>
        <p className="m-0 mt-3 border-0 border-l-2 border-solid border-[#d1b2ff] pl-2.5 font-serif text-[12.5px] italic leading-[1.45] text-ink">“We were spending too much time switching between apps.”</p>
        <p className="m-0 mt-1.5 pl-3 font-sans text-[10.5px] text-ink-3">Customer interview · 02:14</p>
      </Float>
      <Float on={active} reduce={reduce} at={typedFor + 0.25} className={CARD + ' p-4'} style={{ left: 214, top: 372, width: 284 }}>
        <Head icon={FileText}>Live transcript</Head>
        <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
          {TRANSCRIPT.map(([t, s]) => (
            <li key={t} className="grid grid-cols-[38px_minmax(0,1fr)] gap-2 font-sans text-[11.5px] leading-[1.45]">
              <span className="tabular-nums text-ink-3">{t}</span><span className="text-ink-2">{s}</span>
            </li>
          ))}
        </ul>
      </Float>
    </Stage>
  );
}

// ——— 2. Engage.
const INSIGHTS = [
  ['Top reasons for churn', '3 themes · 38% pricing'],
  ['Common objections', '“Too expensive” · “Missing features”'],
  ['Customer sentiment', '62% negative · 28% neutral · 10% positive'],
  ['Key quotes', 'View 12 relevant quotes'],
];
const THINKING = ['Searching Frank research', 'Analyzing interview transcripts', 'Finding relevant themes and quotes'];
export function EngageScene({ active, reduce }) {
  const video = useRef(null);
  const [ticks, setTicks] = useState(reduce ? 3 : 0);
  useEffect(() => {
    const v = video.current;
    if (v) { if (active && !reduce) v.play().catch(() => {}); else v.pause(); }
    if (reduce) { setTicks(3); return; }
    if (!active) { setTicks(0); return; }
    const ts = [1.6, 2.3, 3.0].map((s, i) => setTimeout(() => setTicks(i + 1), s * 1000));
    return () => ts.forEach(clearTimeout);
  }, [active, reduce]);
  return (
    <Stage>
      {/* The call, on a phone. */}
      <div className="absolute overflow-hidden rounded-[34px] bg-[#1a1714] p-[6px] shadow-[0_30px_60px_-24px_rgba(26,23,20,0.5)]" style={{ left: 64, top: 44, width: 236, height: 452 }}>
        <div className="relative size-full overflow-hidden rounded-[28px] bg-[#2a2622]">
          <video ref={video} className="absolute inset-0 size-full object-cover" src="/videos/call-02-card.mp4" poster="/videos/call-02-card.jpg" muted loop playsInline preload="none" />
          <div className="absolute inset-x-0 top-0 bg-[linear-gradient(rgba(0,0,0,0.45),transparent)] px-4 pb-8 pt-3.5 font-sans text-white">
            <p className="m-0 text-[13px] font-medium leading-tight">Frank AI Researcher</p>
            <p className="m-0 mt-0.5 text-[11px] tabular-nums text-white/75">10:37</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-[linear-gradient(transparent,rgba(0,0,0,0.5))] pb-5 pt-10">
            <span className="grid size-10 place-items-center rounded-full bg-[#e5484d] text-white"><PhoneOff className="size-4" strokeWidth={2} /></span>
            <span className="grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur"><Mic className="size-4" strokeWidth={2} /></span>
          </div>
        </div>
      </div>
      <Float on={active} reduce={reduce} at={0.35} className={CARD + ' p-4'} style={{ left: 250, top: 40, width: 252 }}>
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-[#0f2e27] font-sans text-[12px] font-medium text-[#d1f899]">F</span>
          <span className="font-sans leading-tight"><span className="block text-[12.5px] font-medium text-ink">Frank Research</span><span className="block text-[11px] text-ink-3">42 interviews</span></span>
        </div>
        <p className="m-0 mt-3 flex items-center gap-1.5 font-sans text-[10.5px] uppercase tracking-[0.06em] text-ink-3"><Sparkles className="size-3" strokeWidth={1.75} />Quick insights</p>
        <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
          {INSIGHTS.map(([t, s]) => (
            <li key={t} className="flex items-center justify-between gap-2 rounded-[10px] px-2.5 py-2 ring-1 ring-inset ring-[#1a1714]/[0.07]">
              <span className="min-w-0 font-sans leading-tight"><span className="block text-[11.5px] text-ink">{t}</span><span className="mt-0.5 block text-[10.5px] leading-[1.35] text-ink-3">{s}</span></span>
              <ChevronRight className="size-3.5 shrink-0 text-ink-3" strokeWidth={1.75} />
            </li>
          ))}
        </ul>
      </Float>
      {/* Under the Frank Research card (user, 2026-11-23). */}
      <Float on={active} reduce={reduce} at={1.0} className={CARD + ' p-3.5'} style={{ left: 250, top: 367, width: 252 }}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <img src={claudeLogo} alt="" className="size-4" />
          <span className="font-sans text-[12px] font-medium text-ink">Claude</span>
          <span className="rounded-full bg-[#f4f2ec] px-2 py-0.5 font-sans text-[10.5px] text-ink-2">Thinking about your research…</span>
        </div>
        <ul className="m-0 mt-2.5 flex list-none flex-col gap-1.5 p-0">
          {THINKING.map((t, i) => (
            <li key={t} className="flex items-center gap-2 font-sans text-[11.5px] text-ink-2">
              <span className={'grid size-4 place-items-center rounded-full transition-colors duration-300 ' + (i < ticks ? 'bg-[#d1f899] text-ink' : 'bg-[#1a1714]/[0.06] text-transparent')}><Check className="size-2.5" strokeWidth={3} /></span>
              {t}
            </li>
          ))}
        </ul>
      </Float>
    </Stage>
  );
}

// ——— 3. Query.
const QUERY_PROMPT = 'What are the main reasons customers are cancelling? And what should we do about it?';
const PROJECT_ROWS = ['Edit details', 'Add interview questions', 'View preview'];
const ACTIONS = ['Create a product roadmap for these features', 'Summarize key customer quotes', 'Draft a cancellation reduction plan'];
export function QueryScene({ active, reduce }) {
  const typedFor = QUERY_PROMPT.length / 52 + 0.4;
  return (
    <Stage>
      <Float on={active} reduce={reduce} at={0.2} className={CARD + ' p-4'} style={{ left: 214, top: 24, width: 284 }}>
        <Head icon={FileText}>Research project</Head>
        <p className="m-0 mt-3 font-sans text-[14px] font-medium tracking-[-0.01em] text-ink">Customer Cancellation Reasons</p>
        <p className="m-0 mt-1.5 flex items-center gap-2 font-sans text-[10.5px] text-ink-3">
          <span className="rounded-full bg-[#d1f899] px-2 py-0.5 text-ink">Completed</span>42 interviews · Dec 30, 2025
        </p>
        <ul className="m-0 mt-3 list-none p-0">
          {PROJECT_ROWS.map(r => (
            <li key={r} className="flex items-center justify-between border-0 border-t border-solid border-[#1a1714]/[0.07] py-1.5 font-sans text-[11.5px] text-ink-2">
              {r}<ChevronRight className="size-3.5 text-ink-3" strokeWidth={1.75} />
            </li>
          ))}
        </ul>
      </Float>
      <Composer text={QUERY_PROMPT} on={active} reduce={reduce} style={{ left: 30, top: 222, width: 460 }} />
      <Float on={active} reduce={reduce} at={typedFor} className={CARD + ' p-3.5'} style={{ left: 46, top: 356, width: 312 }}>
        <div className="flex items-start gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-[#d1f899] text-ink"><Lightbulb className="size-3.5" strokeWidth={1.75} /></span>
          <span className="font-sans leading-tight"><span className="block text-[12.5px] font-medium text-ink">Take action</span><span className="mt-0.5 block text-[11px] leading-[1.4] text-ink-3">Ask your AI to create a plan, a summary, or a follow-up project.</span></span>
        </div>
        <ul className="m-0 mt-2.5 flex list-none flex-col gap-1 p-0">
          {ACTIONS.map(a => (
            <li key={a} className="flex items-center justify-between gap-2 rounded-[10px] px-2.5 py-1.5 font-sans text-[11.5px] text-ink ring-1 ring-inset ring-[#1a1714]/[0.07]">
              <span className="flex items-center gap-1.5"><Plus className="size-3 text-ink-3" strokeWidth={2} />{a}</span>
              <ChevronRight className="size-3.5 shrink-0 text-ink-3" strokeWidth={1.75} />
            </li>
          ))}
        </ul>
      </Float>
    </Stage>
  );
}
