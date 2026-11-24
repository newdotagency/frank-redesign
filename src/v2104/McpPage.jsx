// McpPage (V21.04): the MCP page, with the words of the live hifrank.ai/mcp page (2026-11-23), headings in sentence
// case. Drafted here and labelled "Example" on the page: the hero chat (question, Frank's tool call, the answer). The live page's fourth step ("Act") repeats the first step's text, so it is
// left out until it has its own words. Layout, on the home page's container (CLAUDE.md, "Frank landing pages"):
//   1. Hero: the forest-green panel. Left: title, description, the CTA and the "no API keys" line. Right: concept E
//      (AiStack), as in the V21.04 HTML export (user, 2026-11-24: "use HTML visual"). HERO_VISUAL = 'none' centres
//      the text with no visual. The earlier concepts (A chat, B hub, C voices, D instruct, E stack) stay in the file behind HERO_VISUAL.
//   2. Where it works: the styled first title (Lora italic phrase under the lime marker), then the supported AI
//      tools as logo tiles, the sixth tile "any MCP-compatible platform".
//   3. How it works: the home page's How it works (HowItWorks.jsx, "How it works" kicker) with the live page's
//      three steps and their visuals rebuilt (McpScenes.jsx); the "entire research loop" line and the CTA under them.
//   4. Built for every team: title and subtitle, the four roles in a 2 × 2 grid, each led by its question.
//   5. FAQ: the live page's seven questions in the home page's FAQ layout (FAQ.jsx).
//   6. Closing: the lime panel with the live page's closing words and CTA, then the footer.
// Later section titles are plain Figtree (user rule, 2026-11-23); every subtitle uses SUBTITLE from ./titles.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUp, Check, Mic, PhoneOff } from 'lucide-react';
import { siGithubcopilot, siGooglegemini } from 'simple-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { HandshakeIcon, Megaphone01Icon, PackageIcon, Rocket01Icon } from '@hugeicons/core-free-icons';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, SUBTITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import Footer from './Footer';
import FAQ from './FAQ';
import HowItWorks from './HowItWorks';
import { DefineScene, EngageScene, QueryScene } from './McpScenes';
import claudeLogo from './logos/claude.svg';
import openaiLogo from './logos/openai.svg';
import cursorLogo from './logos/cursor.svg';
import mcpLogo from './logos/mcp.svg';

const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const CURVE = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';
const H2 = 'm-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE;
const SECTION = 'pt-[clamp(112px,13vw,200px)] ';

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// A pill with its arrow in a soft circle of the pill's own colour, in the AI voice page's style (CLAUDE.md, "buttons
// on dark green"). tone: 'lime' (on dark), 'ink' (on light).
function Pill({ href, tone, children }) {
  const look = { lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84] focus-visible:outline-[#d1f899]', ink: 'bg-[#1a1714] text-white hover:bg-[#2a2622] focus-visible:outline-ink' }[tone];
  const circle = { lime: 'bg-[#1a1714]/[0.07]', ink: 'bg-white/[0.12]' }[tone];
  return (
    <a href={href}
      className={'group inline-flex h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' + CURVE + ' ' + look}>
      {children}
      <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 ' + CURVE + ' ' + circle}>
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </span>
    </a>
  );
}

// ——— 1. Hero: the AI chat that plays the whole loop (Example), redesigned 2026-11-23 ("redesign MCP first section's
// visual"). Purpose: explanation. One pass, about 11 s, looping only while the card is on screen:
//   0 the question types into the composer · 1 it's sent and rises in as a bubble · 2–4 Frank's tool call opens and
//   its three steps finish one by one (a spinner on the running step) · 5 the call settles · 6 the steps fold into a
//   one-line summary as the answer streams in,
//   three reasons each with its count and a bar that grows to its share (no track) · 7 a customer quote lands and
//   the scene holds · 8 the conversation fades out and the loop starts again.
// Entrances: transform + opacity, ease-out (0.23, 1, 0.32, 1), 400 ms, rows 70 ms apart; the spinner is a linear CSS
// rotation (constant motion). Reduced motion: the finished conversation, no typing, no loop.
const CHAT_Q = 'Why did customers cancel last month?';
const CHAT_STEPS = ['Reading 31 churn interviews', 'Grouping the reasons', 'Counting customers per reason'];
const CHAT_A = [['The price went up for small teams', 12], ['Reporting moved into their CRM', 8], ['The admin who set it up left', 6]];
const CHAT_QUOTE = ['We were paying for ten seats and three of us logged in.', 'Customer interview · 04:12'];
const HOLD = [null, 450, 700, 700, 700, 350, 1500, 4600, 450]; // ms in each phase (phase 0 waits for the typing)
const IN = { duration: 0.4, ease: EASE };

function AiChat({ reduce }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [phase, setPhase] = useState(reduce ? 7 : 0);
  const [chars, setChars] = useState(reduce ? CHAT_Q.length : 0);
  const live = seen && !reduce;

  // The typing (phase 0), then each phase's hold; everything pauses off screen.
  useEffect(() => {
    if (reduce) { setPhase(7); setChars(CHAT_Q.length); return; }
    if (!live) return;
    let t;
    if (phase === 0) {
      if (chars < CHAT_Q.length) t = setTimeout(() => setChars(c => c + 1), chars === 0 ? 500 : 38);
      else t = setTimeout(() => setPhase(1), 320);
    } else if (phase === 8) {
      t = setTimeout(() => { setChars(0); setPhase(0); }, HOLD[8]);
    } else {
      t = setTimeout(() => setPhase(p => p + 1), HOLD[phase]);
    }
    return () => clearTimeout(t);
  }, [phase, chars, live, reduce]);

  const sent = phase >= 1;
  const stepDone = i => phase >= i + 3;      // step i is finished from phase i + 3
  const stepRun = i => phase === i + 2;      // and running in phase i + 2
  const rise = { initial: { opacity: 0, transform: 'translateY(10px)' }, animate: { opacity: 1, transform: 'translateY(0px)' }, transition: IN };

  return (
    <div ref={box} className="relative overflow-hidden rounded-[26px] bg-white p-1.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]">
      <div className="flex flex-col rounded-[21px] bg-[#fbfaf6] ring-1 ring-inset ring-[#1a1714]/[0.05]">
        <div className="flex items-center justify-between gap-3 border-0 border-b border-solid border-[#1a1714]/[0.07] px-5 py-3.5">
          <span className="font-sans text-[13.5px] text-ink">Your AI assistant</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-sans text-[12px] text-ink-2 ring-1 ring-inset ring-[#1a1714]/[0.08]">
            <img src={mcpLogo} alt="" className="size-3" /> Frank connected
          </span>
        </div>

        {/* The conversation; it fades out as a whole at the end of a pass. */}
        <motion.div className="flex h-[486px] flex-col gap-3 overflow-hidden p-4 sm:h-[404px] sm:p-5"
          animate={{ opacity: phase === 8 ? 0 : 1 }} transition={{ duration: 0.4, ease: EASE }}>
          {sent && (
            <motion.div key="q" {...(reduce ? {} : rise)} className="self-end rounded-[18px] rounded-br-[6px] bg-[#1a1714] px-4 py-2.5 font-sans text-[14.5px] leading-[1.45] text-white">{CHAT_Q}</motion.div>
          )}
          {phase >= 2 && (
            <motion.div key="tool" {...(reduce ? {} : rise)} className="self-start rounded-[16px] bg-white px-3.5 py-3 ring-1 ring-inset ring-[#1a1714]/[0.07]">
              <p className="m-0 flex items-center gap-2 font-sans text-[12.5px] text-ink">
                <img src={mcpLogo} alt="" className="size-3.5" /><span className="font-medium">Frank</span>
                <span className="text-ink-3">{phase >= 6 ? 'Read 31 churn interviews' : phase >= 5 ? 'Done' : 'Working…'}</span>
                {phase >= 6 && <span className="grid size-4 place-items-center rounded-full bg-[#d1f899] text-ink"><Check className="size-2.5" strokeWidth={3} /></span>}
              </p>
              {/* Once the answer arrives the finished steps fold away (grid rows 1fr to 0fr), leaving the summary line. */}
              <div className={'grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (phase >= 6 ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100')}>
              <div className="min-h-0 overflow-hidden">
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0 pt-2">
                {CHAT_STEPS.map((s, i) => (stepDone(i) || stepRun(i)) && (
                  <motion.li key={s} {...(reduce ? {} : { initial: { opacity: 0, transform: 'translateY(4px)' }, animate: { opacity: 1, transform: 'translateY(0px)' }, transition: { duration: 0.25, ease: EASE } })}
                    className="flex items-center gap-2 font-sans text-[12.5px] text-ink-2">
                    <span className="grid size-4 place-items-center">
                      {stepDone(i)
                        ? <span className="grid size-4 place-items-center rounded-full bg-[#d1f899] text-ink"><Check className="size-2.5" strokeWidth={3} /></span>
                        : <span className="mcp-spin block size-3 rounded-full border-[1.5px] border-solid border-[#1a1714]/15 border-t-[#1a1714]/70" />}
                    </span>
                    {s}
                  </motion.li>
                ))}
              </ul>
              </div>
              </div>
            </motion.div>
          )}
          {phase >= 6 && (
            <motion.div key="answer" {...(reduce ? {} : rise)} className="self-start rounded-[18px] rounded-bl-[6px] bg-white px-4 py-3.5 font-sans text-[14.5px] leading-[1.5] text-ink ring-1 ring-inset ring-[#1a1714]/[0.06]">
              <p className="m-0">Three reasons came up most:</p>
              <ol className="m-0 mt-2.5 flex list-none flex-col gap-2.5 p-0">
                {CHAT_A.map(([r, n], i) => (
                  <motion.li key={r} {...(reduce ? {} : { initial: { opacity: 0, transform: 'translateY(6px)' }, animate: { opacity: 1, transform: 'translateY(0px)' }, transition: { ...IN, delay: 0.12 + i * 0.07 } })}>
                    <span className="flex items-baseline gap-2.5">
                      <span className="flex-1">{r}</span>
                      <span className="shrink-0 font-sans text-[12.5px] tabular-nums text-ink-2">{n} customers</span>
                    </span>
                    {/* The share as a bar that grows to its length (no track behind it). */}
                    <motion.span aria-hidden="true" className="mt-1.5 block h-[3px] origin-left rounded-full bg-[#ba86fc]"
                      style={{ width: `${(n / CHAT_A[0][1]) * 100}%` }}
                      initial={reduce ? false : { transform: 'scaleX(0)' }} animate={{ transform: 'scaleX(1)' }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.07 }} />
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
          {phase >= 7 && (
            <motion.div key="quote" {...(reduce ? {} : rise)} className="self-start rounded-[14px] bg-[#f4f2ec] px-3.5 py-2.5">
              <p className="m-0 font-serif text-[13.5px] italic leading-[1.45] text-ink">&ldquo;{CHAT_QUOTE[0]}&rdquo;</p>
              <p className="m-0 mt-1 font-sans text-[11.5px] text-ink-3">{CHAT_QUOTE[1]}</p>
            </motion.div>
          )}
        </motion.div>

        {/* The composer: the question types in here, then clears when it's sent. */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-3 rounded-[16px] bg-white py-2 pl-4 pr-2 ring-1 ring-inset ring-[#1a1714]/[0.08]">
            <span className="min-h-[20px] flex-1 font-sans text-[13.5px] text-ink">
              {sent ? <span className="text-ink-3">Ask a follow-up…</span> : <>{CHAT_Q.slice(0, chars)}<span className="ml-px inline-block h-[14px] w-px translate-y-[2px] animate-pulse bg-ink" /></>}
            </span>
            <span className="font-sans text-[11px] text-ink-3">Example</span>
            <span aria-hidden="true" className={'grid size-8 place-items-center rounded-full text-white transition-[background-color,transform] duration-200 ease-out ' + (!sent && chars === CHAT_Q.length ? 'scale-[0.94] bg-[#1a1714]' : sent ? 'bg-[#1a1714]/30' : 'bg-[#1a1714]/30')}>
              <ArrowUp className="size-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// A logo from simple-icons, drawn from its path.
const PathLogo = ({ icon, color }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full"><path d={icon.path} fill={color} /></svg>
);

// ——— 1b. Hero, concept B: one research base, every AI. Drawn straight on the green panel. Frank's research in the
// middle (the lime node with the glasses), four AI clients in the corners, each joined to Frank by a line.
// Clearer animation (user, 2026-11-23: "design clear animation"): one story per turn, told in one place —
//   0 ask: the client lights up (the others dim) and its question appears beside it · 1 out: a lime dot travels its
//   line (now solid lime) to Frank · 2 Frank works: the node pulses, "Reading 31 interviews…" under it · 3 back: the
//   dot returns · 4 answer: the answer unfolds under the question, in the same card beside the AI that asked.
// About 6 s a turn, only while on screen. Entrances: transform + opacity, ease-out (0.23, 1, 0.32, 1); the answer
// unfolds with grid rows (0fr to 1fr, 500 ms); the dot follows the line (SVG animateMotion, ease-in-out). Reduced motion:
// Claude's answered card, still. The questions and answers are examples.
// HERO_VISUAL picks the concept: 'voices' (C, below), 'hub' (B) or 'chat' (A, AiChat above). B and C show the chat
// on phones, where their text would be too small.
// 'instruct' (D, AiInstruct further down) is the current one (user, 2026-11-24) and shows at every width.
// 'stack' (E, AiStack): the current one (user, 2026-11-24: "use HTML visual", the V21.04 export's hero).
// 'none': no visual; the hero's text is centred in the panel.
const HERO_VISUAL = 'stack';
const HUB_W = 520, HUB_H = 520, HUB_C = [260, 260];
const HUB = [
  { name: 'Claude', logo: <img src={claudeLogo} alt="" className="size-full" />, at: [0, 0], ask: 'Top churn reasons this month?',
    reply: { lines: [['The price went up for small teams', '12'], ['Reporting moved into their CRM', '8']] } },
  { name: 'ChatGPT', logo: <img src={openaiLogo} alt="" className="size-full invert" />, at: [380, 0], ask: 'Find quotes about onboarding',
    reply: { quote: 'The setup took one call. After that, the team just used it.' } },
  { name: 'Gemini', logo: <PathLogo icon={siGooglegemini} color="#c9b6ff" />, at: [0, 476], ask: 'Set up a study on pricing',
    reply: { lines: [['Pricing perception study', 'Draft'], ['6 questions, ready to review', '']] } },
  { name: 'Cursor', logo: <img src={cursorLogo} alt="" className="size-full invert" />, at: [380, 476], ask: 'What do users say about the API?',
    reply: { lines: [['Wants webhooks for new answers', '9'], ['Docs need more examples', '5']] } },
];
const BEATS = [900, 800, 1100, 800, 2700]; // ask · out · Frank works · back · answer
const chipC = ([x, y]) => [x + 70, y + 22]; // the chip's centre (chips are 140 × 44)
const curve = c => { const [x, y] = chipC(c.at); const [cx, cy] = HUB_C; return `M${x},${y} Q${(x + cx) / 2},${(y + cy) / 2 + (y < cy ? 30 : -30)} ${cx},${cy}`; };

function AiHub({ reduce }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [k, setK] = useState(1);
  const [turn, setTurn] = useState(0);
  const [beat, setBeat] = useState(reduce ? 4 : 0);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / HUB_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (reduce) { setBeat(4); return; }
    if (!seen) return;
    const t = setTimeout(() => {
      if (beat < 4) setBeat(b => b + 1);
      else { setBeat(0); setTurn(n => (n + 1) % HUB.length); }
    }, BEATS[beat]);
    return () => clearTimeout(t);
  }, [beat, seen, reduce]);
  const c = HUB[turn];
  const top = c.at[1] < HUB_C[1], left = c.at[0] < HUB_C[0];
  // The card sits beside its chip: under the top ones, over the bottom ones; flush to the chip's outer edge.
  const place = { ...(left ? { left: 0 } : { right: 0 }), ...(top ? { top: 56 } : { bottom: HUB_H - c.at[1] + 12 }) };
  return (
    <div ref={box} className="relative w-full" style={{ height: HUB_H * k }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: HUB_W, height: HUB_H, transform: `scale(${k})` }}>
        <svg width={HUB_W} height={HUB_H} className="absolute inset-0 overflow-visible" aria-hidden="true">
          {HUB.map((h, i) => {
            const on = i === turn && beat >= 1 && beat <= 3;
            return <path key={h.name} d={curve(h)} fill="none" stroke={on ? '#d1f899' : 'rgba(255,255,255,0.14)'} strokeOpacity={on ? 0.7 : 1}
              strokeWidth={on ? 2 : 1.5} strokeDasharray={on ? 'none' : '3 6'} style={{ transition: 'stroke 300ms ease, stroke-width 300ms ease' }} />;
          })}
          {/* The dot that carries the question to Frank (beat 1) and the answer back (beat 3). */}
          {!reduce && (beat === 1 || beat === 3) && (
            <circle key={turn + '-' + beat} r="6" fill="#d1f899">
              <animateMotion dur={BEATS[beat] + 'ms'} fill="freeze" path={curve(c)} calcMode="spline"
                keyPoints={beat === 1 ? '0;1' : '1;0'} keyTimes="0;1" keySplines="0.77 0 0.175 1" />
            </circle>
          )}
        </svg>

        {/* Frank's research, in the middle; it pulses while it works. */}
        <div className="absolute grid place-items-center" style={{ left: HUB_C[0] - 50, top: HUB_C[1] - 50, width: 100, height: 100 }}>
          {!reduce && beat === 2 && (
            <motion.span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-solid border-[#d1f899]"
              initial={{ transform: 'scale(0.8)', opacity: 0.8 }} animate={{ transform: 'scale(1.45)', opacity: 0 }}
              transition={{ duration: 1.05, ease: 'easeOut', repeat: 1 }} />
          )}
          <span className="relative grid size-[80px] place-items-center rounded-full bg-[#d1f899] shadow-[0_0_0_8px_rgba(209,248,153,0.08)]">
            <span className="block w-[50%]"><Glasses pose="Ready" reduced /></span>
          </span>
        </div>
        <div className="absolute w-[220px] text-center font-sans text-[12px]" style={{ left: HUB_C[0] - 110, top: HUB_C[1] + 56 }}>
          <AnimatePresence mode="wait">
            <motion.span key={beat === 2 ? 'work' : 'idle'} className={'block ' + (beat === 2 ? 'text-[#d1f899]' : 'text-white/55')}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {beat === 2 && !reduce ? 'Reading 31 interviews…' : 'Frank research'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* The AI clients; the one asking stays lit, the others dim. */}
        {HUB.map((h, i) => (
          <div key={h.name} className={'absolute flex h-11 w-[140px] items-center gap-2.5 rounded-full px-3.5 transition-[opacity,background-color,box-shadow] duration-300 '
            + (i === turn ? 'bg-white/[0.14] opacity-100 shadow-[inset_0_0_0_1px_rgba(209,248,153,0.55)]' : 'bg-white/[0.06] opacity-45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]')}
            style={{ left: h.at[0], top: h.at[1] }}>
            <span className="block size-5 shrink-0">{h.logo}</span>
            <span className="font-sans text-[14px] text-white">{h.name}</span>
          </div>
        ))}

        {/* The question beside the AI that asked; the answer unfolds under it in the same card (rows 0fr to 1fr). */}
        <AnimatePresence mode="wait">
          <motion.div key={'card-' + turn}
            initial={reduce ? false : { opacity: 0, transform: `translateY(${top ? 8 : -8}px)` }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: `translateY(${top ? -6 : 6}px)` }} transition={{ duration: 0.38, ease: EASE }}
            className="absolute w-[236px] rounded-[16px] bg-[#fbfaf6] px-3.5 py-3 shadow-[0_22px_50px_-20px_rgba(0,0,0,0.6)]"
            style={place}>
            <p className="m-0 font-sans text-[13.5px] leading-[1.4] text-ink">{c.ask}</p>
            <div className={'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (beat === 4 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="min-h-0 overflow-hidden">
                <div className="mt-2.5 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-2.5">
                  <p className="m-0 mb-1.5 flex items-center gap-1.5 font-sans text-[11px] text-ink-3"><img src={mcpLogo} alt="" className="size-3" />From Frank</p>
                  {c.reply.lines && (
                    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                      {c.reply.lines.map(([t, n]) => (
                        <li key={t} className="flex items-baseline justify-between gap-3 font-sans text-[13px] leading-[1.35] text-ink">
                          <span>{t}</span>{n && <span className="shrink-0 rounded-full bg-[#d1f899] px-2 py-0.5 text-[11px] tabular-nums">{n}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.reply.quote && <p className="m-0 font-serif text-[13.5px] italic leading-[1.45] text-ink">&ldquo;{c.reply.quote}&rdquo;</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <span className="absolute font-sans text-[11px] text-white/40" style={{ left: HUB_C[0] - 20, bottom: -2 }}>Example</span>
      </div>
    </div>
  );
}

// ——— 1c. Hero, concept C (user, 2026-11-23: "design other concept"): customers' voices into your AI. Top: three
// customers in live interviews (the call clips' first frames, /videos). Bottom: your AI, asked why customers
// cancelled. The customers speak one at a time (their voice bars move); each one's line appears under them, then
// flies into the AI's answer as evidence (Motion layoutId, so it travels the real distance). After the third, the AI
// writes its conclusion; the scene holds, fades and starts again. About 10 s a pass, only while on screen.
// Purpose: explanation (the answer in your AI comes from real customer interviews). Ease-out (0.23, 1, 0.32, 1);
// voice bars are a constant CSS scaleY loop. Reduced motion: the finished answer, still. Quotes, names and the
// conclusion are examples.
const VOICES = [
  { name: 'Marco', img: '/videos/call-03-card.jpg', quote: 'It got too expensive for the three of us still using it.' },
  { name: 'Tomás', img: '/videos/call-07-card.jpg', quote: 'We only needed the reports, and our CRM does those now.' },
  { name: 'Lena', img: '/videos/call-10-card.jpg', quote: 'Ten seats, three logins. The new price made us notice.' },
];
const VOICE_Q = 'Why did customers cancel last month?';
const VOICE_SUM = 'All three point to price for small teams paying for seats they no longer use.';
const V_W = 520, V_H = 520;
const V_X = [96, 260, 424]; // the customers' centres
const V_HOLD = [1300, 650, 1300, 650, 1300, 650, 700, 3400, 450]; // speak/land × 3 · conclusion · hold · fade

function VoiceBars({ on }) {
  return (
    <span aria-hidden="true" className={'flex h-4 items-center gap-[3px] ' + (on ? 'mcp-voice-on' : '')}>
      {[0.5, 0.9, 0.65, 1, 0.55].map((h, i) => (
        <span key={i} className="mcp-voice-bar block w-[3px] origin-center rounded-full bg-[#d1f899]" style={{ height: `${h * 100}%`, animationDelay: `${i * 110}ms` }} />
      ))}
    </span>
  );
}

function AiVoices({ reduce }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [k, setK] = useState(1);
  const [p, setP] = useState(reduce ? 7 : 0);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / V_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (reduce) { setP(7); return; }
    if (!seen) return;
    const t = setTimeout(() => setP(x => (x + 1) % V_HOLD.length), V_HOLD[p]);
    return () => clearTimeout(t);
  }, [p, seen, reduce]);
  const speaking = p < 6 && p % 2 === 0 ? p / 2 : -1;
  const landed = i => p >= 2 * i + 1 && p < 8;   // in the AI's answer
  const waiting = i => speaking === i;             // under the customer, about to fly
  const fly = { type: 'tween', duration: 0.6, ease: EASE };
  return (
    <div ref={box} className="relative w-full" style={{ height: V_H * k }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: V_W, height: V_H, transform: `scale(${k})` }}>
        <p className="absolute left-0 right-0 top-0 m-0 text-center font-sans text-[12px] text-white/60">Frank is interviewing · 3 live</p>

        {/* The customers. */}
        {VOICES.map((v, i) => (
          <div key={v.name} className="absolute flex w-[120px] flex-col items-center" style={{ left: V_X[i] - 60, top: 28 }}>
            <span className={'relative block size-[76px] overflow-hidden rounded-full transition-[box-shadow,opacity] duration-300 ' + (speaking === i ? 'opacity-100 shadow-[0_0_0_3px_#d1f899]' : p >= 6 || landed(i) ? 'opacity-80 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]' : 'opacity-60 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]')}>
              <img src={v.img} alt="" className="size-full object-cover" />
            </span>
            <span className="mt-2 flex items-center gap-2 font-sans text-[12.5px] text-white">
              {v.name}<VoiceBars on={speaking === i && !reduce} />
            </span>
          </div>
        ))}

        {/* A line, just said, under its customer; it then flies into the answer (same layoutId). */}
        {VOICES.map((v, i) => waiting(i) && (
          <motion.div key={'w' + i} layoutId={reduce ? undefined : 'vq-' + i} transition={fly}
            initial={{ opacity: 0, transform: 'translateY(-6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
            className="absolute w-[210px] rounded-[12px] bg-white px-3 py-2 font-serif text-[13px] italic leading-[1.4] text-ink shadow-[0_16px_36px_-16px_rgba(0,0,0,0.6)]"
            style={{ left: Math.min(Math.max(V_X[i] - 105, 0), V_W - 210), top: 150 }}>
            &ldquo;{v.quote}&rdquo;
          </motion.div>
        ))}

        {/* Your AI. */}
        <motion.div className="absolute rounded-[22px] bg-[#fbfaf6] p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)]" style={{ left: 0, top: 218, width: V_W }}
          animate={{ opacity: p === 8 ? 0.5 : 1 }} transition={{ duration: 0.4, ease: EASE }}>
          <div className="flex items-center justify-between gap-3">
            <span className="font-sans text-[13px] text-ink">Your AI assistant</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-sans text-[11.5px] text-ink-2 ring-1 ring-inset ring-[#1a1714]/[0.08]"><img src={mcpLogo} alt="" className="size-3" /> Frank connected</span>
          </div>
          <div className="mt-3 flex justify-end">
            <span className="rounded-[16px] rounded-br-[6px] bg-[#1a1714] px-3.5 py-2 font-sans text-[13.5px] text-white">{VOICE_Q}</span>
          </div>
          <div className="mt-3 rounded-[16px] bg-white p-3 ring-1 ring-inset ring-[#1a1714]/[0.06]">
            <p className="m-0 flex items-center gap-1.5 font-sans text-[11.5px] text-ink-3"><img src={mcpLogo} alt="" className="size-3" />From your Frank interviews</p>
            <ul className="m-0 mt-2 flex min-h-[132px] list-none flex-col gap-1.5 p-0">
              {VOICES.map((v, i) => landed(i) && (
                <motion.li key={'l' + i} layoutId={reduce ? undefined : 'vq-' + i} transition={fly}
                  className="flex items-baseline gap-2 rounded-[10px] bg-[#f6f4ef] px-2.5 py-1.5 font-serif text-[13px] italic leading-[1.4] text-ink">
                  <span className="flex-1">&ldquo;{v.quote}&rdquo;</span>
                  <span className="shrink-0 font-sans text-[11px] not-italic text-ink-3">{v.name}</span>
                </motion.li>
              ))}
            </ul>
            <div className={'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (p >= 6 && p < 8 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="min-h-0 overflow-hidden">
                <p className="m-0 mt-2.5 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-2.5 font-sans text-[13.5px] leading-[1.45] text-ink">{VOICE_SUM}</p>
              </div>
            </div>
          </div>
          <span className="mt-2 block text-right font-sans text-[11px] text-ink-3">Example</span>
        </motion.div>
      </div>
    </div>
  );
}

// ——— 1d. Hero, concept D (user, 2026-11-24: "show that they can give instructions in any LLM and it can make an
// interview in Frank"). Purpose: explanation. Built in normal flow (no scaled stage), so it reads at every width.
//   Minimal (user, 2026-11-24: "make minimal interface", "don't show everything at once"). Top: the five AI tools as
//   logos only; the one in use is lit. Then that tool's chat: its name, the instruction typing in, and one status line
//   (creating · created · publishing · live). A line draws down and the Frank card rises in only once Frank has the
//   instruction: the interview's name, then three questions one by one, then "Live" and the customers answering.
//   The next tool then takes a turn with its own instruction. About 9 s a turn, five turns, only while on screen.
//   On first view the logos come in 50 ms apart, then the chat, then the typing starts.
// Instructions, interview names, questions and customers are examples (labelled under the visual). Entrances:
// transform + opacity, ease-out (0.23, 1, 0.32, 1), 300 to 450 ms; the dot runs ease-in-out; avatars on a spring
// (0.5 s, bounce 0.2). Reduced motion: Claude's turn, finished and still.
const LLMS = [
  { name: 'Claude', dark: <img src={claudeLogo} alt="" className="size-full" />, light: <img src={claudeLogo} alt="" className="size-full" />,
    ask: 'Interview customers who cancelled last month. Find out why they left.',
    study: 'Why customers cancel', qs: ['What made you decide to cancel?', 'When did it stop feeling worth the price?', 'What are you using instead?'] },
  { name: 'ChatGPT', dark: <img src={openaiLogo} alt="" className="size-full invert" />, light: <img src={openaiLogo} alt="" className="size-full" />,
    ask: 'Talk to this week’s new sign-ups about their first few days.',
    study: 'First-week onboarding', qs: ['What did you want to get done first?', 'Where did you get stuck?', 'What almost made you give up?'] },
  { name: 'Gemini', dark: <PathLogo icon={siGooglegemini} color="#c9b6ff" />, light: <PathLogo icon={siGooglegemini} color={'#' + siGooglegemini.hex} />,
    ask: 'Ask our power users how they would price a team plan.',
    study: 'Team plan pricing', qs: ['How does your team use it today?', 'Who decides on new tools?', 'What would a fair price per seat be?'] },
  { name: 'Copilot', dark: <PathLogo icon={siGithubcopilot} color="#ffffff" />, light: <PathLogo icon={siGithubcopilot} color="#1a1714" />,
    ask: 'Find out why trial users never invite their team.',
    study: 'Team invites in the trial', qs: ['Who else would use this with you?', 'What stopped you from inviting them?', 'What would make sharing easier?'] },
  { name: 'Cursor', dark: <img src={cursorLogo} alt="" className="size-full invert" />, light: <img src={cursorLogo} alt="" className="size-full" />,
    ask: 'Ask developers what is missing from our API.',
    study: 'API feedback', qs: ['What did you try to build with the API?', 'Where did the docs fall short?', 'What would you add first?'] },
];
const JOINED = ['/videos/call-03-card.jpg', '/videos/call-07-card.jpg', '/videos/call-10-card.jpg'];
// ms per phase after the typing (phase 0): create runs · drafting · q1 · q2 · q3 · publish runs · live · fade
const D_HOLD = [null, 900, 550, 420, 420, 650, 750, 3000, 450];

// One quiet line under the instruction: what Frank is doing, a spinner while it works, a check when done.
function StatusLine({ text, done }) {
  return (
    <span className="flex items-center gap-2 font-sans text-[13px] text-ink-2">
      {done ? <span className="grid size-4 place-items-center rounded-full bg-[#d1f899] text-ink"><Check className="size-2.5" strokeWidth={3} /></span>
        : <span className="mcp-spin block size-3.5 rounded-full border-[1.5px] border-solid border-[#1a1714]/15 border-t-[#1a1714]/70" />}
      {text}
    </span>
  );
}

function AiInstruct({ reduce }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [turn, setTurn] = useState(0);
  const [p, setP] = useState(reduce ? 7 : 0);
  const c = LLMS[turn];
  const [chars, setChars] = useState(reduce ? c.ask.length : 0);
  const live = seen && !reduce;
  const first = useRef(true); // the first turn waits for the chips and the chat to come in

  useEffect(() => {
    if (reduce) { setTurn(0); setP(7); setChars(LLMS[0].ask.length); return; }
    if (!live) return;
    let t;
    if (p === 0) {
      if (chars < c.ask.length) t = setTimeout(() => { first.current = false; setChars(n => n + 1); }, chars === 0 ? (first.current ? 1400 : 450) : 30);
      else t = setTimeout(() => setP(1), 300);
    } else if (p === 8) {
      t = setTimeout(() => { setChars(0); setP(0); setTurn(n => (n + 1) % LLMS.length); }, D_HOLD[8]);
    } else {
      t = setTimeout(() => setP(x => x + 1), D_HOLD[p]);
    }
    return () => clearTimeout(t);
  }, [p, chars, live, reduce, c.ask.length]);

  const rise = { initial: { opacity: 0, transform: 'translateY(8px)' }, animate: { opacity: 1, transform: 'translateY(0px)' }, transition: { duration: 0.38, ease: EASE } };
  const fade = { animate: { opacity: p === 8 ? 0 : 1 }, transition: { duration: 0.35, ease: EASE } };
  const shown = reduce || (p >= 2 && p < 8); // the Frank card is on screen
  // The one status line under the instruction, by phase.
  const line = p === 1 ? ['Creating the interview in Frank', false] : p >= 2 && p <= 5 ? ['Interview created in Frank', true]
    : p === 6 ? ['Publishing', false] : p >= 7 ? ['Live in Frank', true] : null;

  return (
    <div ref={box} className="flex flex-col">
      {/* Any AI tool, as logos only; the one in use is lit. */}
      <ul className="m-0 flex list-none gap-2 p-0" aria-label="AI tools Frank works in">
        {LLMS.map((l, i) => (
          <motion.li key={l.name} initial={reduce ? false : { opacity: 0, transform: 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.4 + i * 0.05 }}>
            <span className={'grid size-9 place-items-center rounded-full transition-[opacity,background-color,box-shadow] duration-300 '
              + (i === turn ? 'bg-white/[0.12] opacity-100 shadow-[inset_0_0_0_1px_rgba(209,248,153,0.6)]' : 'bg-white/[0.05] opacity-40')}>
              <span className="block size-4">{l.dark}</span>
              <span className="sr-only">{l.name}</span>
            </span>
          </motion.li>
        ))}
      </ul>

      {/* The AI tool's chat: its name, the instruction, one status line. */}
      <motion.div className="mt-4 rounded-[20px] bg-[#fbfaf6] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.6)]"
        initial={reduce ? false : { opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.7 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={c.name} className="flex items-center gap-2 font-sans text-[13px] text-ink-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <span className="block size-4">{c.light}</span>{c.name}
          </motion.span>
        </AnimatePresence>
        <motion.div {...fade}>
          <div className="mt-3 flex min-h-[64px] items-start justify-end">
            {chars > 0 && <span className={'max-w-[88%] rounded-[16px] rounded-br-[6px] px-3.5 py-2.5 font-sans text-[14px] leading-[1.45] transition-colors duration-300 '
              + (p >= 1 ? 'bg-[#1a1714] text-white' : 'bg-white text-ink ring-1 ring-inset ring-[#1a1714]/[0.08]')}>
              {c.ask.slice(0, chars)}
              {p === 0 && !reduce && <span aria-hidden="true" className="tmn-caret ml-px inline-block h-[1em] w-px translate-y-[2px] bg-current" />}
            </span>}
          </div>
          <div className="mt-3 min-h-[20px]">
            <AnimatePresence mode="wait" initial={false}>
              {line && (
                <motion.div key={line[0]} initial={{ opacity: 0, transform: 'translateY(4px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                  <StatusLine text={line[0]} done={line[1]} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* The line from the AI to Frank: it draws down once the instruction is sent; a lime dot runs along it when Frank
          receives the interview and when it goes live. */}
      <div aria-hidden="true" className="relative mx-auto h-7 w-px">
        <span className="absolute inset-0 bg-white/[0.1]" />
        <motion.span className="absolute inset-0 origin-top bg-[#d1f899]/70"
          initial={false} animate={{ transform: `scaleY(${p >= 1 && p < 8 ? 1 : 0})` }} transition={{ duration: 0.45, ease: EASE }} />
        {!reduce && (p === 2 || p === 6) && (
          <motion.span key={turn + '-' + p} className="absolute left-1/2 top-0 -ml-[4px] size-2 rounded-full bg-[#d1f899]"
            initial={{ transform: 'translateY(-4px)', opacity: 0 }} animate={{ transform: 'translateY(24px)', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }} />
        )}
      </div>

      {/* The interview in Frank: its space is kept so nothing jumps, but it only rises in once Frank has the
          instruction, then its name and the three questions arrive one by one; "Live" and the customers come last. */}
      <motion.div className="rounded-[20px] bg-white p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.6)]"
        initial={false}
        animate={shown ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
        transition={{ duration: 0.45, ease: EASE, delay: shown && p === 2 ? 0.3 : 0 }}>
        <div className="flex min-h-6 items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[62%]"><Glasses pose="Ready" reduced /></span></span>
            {p >= 2 && <motion.span key={'t' + turn} {...rise} transition={{ duration: 0.38, ease: EASE, delay: 0.55 }}
              className={FIG + ' truncate text-[17px] leading-[1.25] tracking-[-0.01em] text-ink'}>{c.study}</motion.span>}
          </span>
          {p >= 7 && (
            <motion.span {...rise} className="flex shrink-0 items-center gap-1.5 font-sans text-[12.5px] text-ink-2">
              <span className="tmn-live block size-1.5 rounded-full bg-[#6e9738]" />Live
            </motion.span>
          )}
        </div>
        <ol className="m-0 mt-3 flex min-h-[150px] list-none flex-col p-0 sm:min-h-[132px]">
          {c.qs.map((q, i) => (
            <li key={turn + q} className="min-h-[44px] border-0 border-t border-solid border-[#1a1714]/[0.06] first:border-t-0">
              {p >= 3 + i && (
                <motion.span {...rise} className="flex gap-3 py-3 font-sans text-[14px] leading-[1.4] text-ink">
                  <span className="pt-px font-mono text-[11.5px] tabular-nums text-ink-3">{String(i + 1).padStart(2, '0')}</span>{q}
                </motion.span>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-2 flex min-h-6 items-center">
          {p >= 7 && (
            <motion.span {...rise} className="flex items-center gap-2.5 whitespace-nowrap font-sans text-[12.5px] text-ink-2">
              <span className="flex -space-x-1.5">
                {JOINED.map((src, i) => (
                  <motion.img key={src} src={src} alt="" className="size-6 rounded-full object-cover ring-2 ring-white"
                    initial={reduce ? false : { opacity: 0, transform: 'scale(0.6)' }} animate={{ opacity: 1, transform: 'scale(1)' }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.2, delay: 0.15 + i * 0.18 }} />
                ))}
              </span>
              3 customers answering now
            </motion.span>
          )}
        </div>
      </motion.div>
      <span className="mt-2 self-end font-sans text-[11px] text-white/40">Example</span>
    </div>
  );
}

// ——— 1e. Hero, concept E (user, 2026-11-24: "make an animation alike hifrank.ai/churn's first section"). As on
// that page: a stack of three tilted cards, one step each; the front card is sharp, the two behind it sit up and to
// the right, smaller and blurred, and every few seconds the next step comes forward while the front one goes to the
// back. A handwritten tag (Kalam, the design system's hand for marketing tags) names the step, with a drawn arrow
// pointing at the front card. The steps tell this page's story:
//   1 Ask in any AI: the instruction typing into Claude (the example AI, user 2026-11-24; the other tools show as
//     dimmed logos under it), and Frank's create_research call ticking off.
//   2 Frank interviews: a customer on a voice call, Frank's question, the customer's voice bars.
//   3 Back in your AI: the reasons, each with its count and a bar that grows, in the same AI tool.
// Purpose: explanation. Card moves: transform + opacity + blur, 700 ms on the drawer curve (0.32, 0.72, 0, 1); inner
// entrances ease-out (0.23, 1, 0.32, 1). 3.6 s a step, only while on screen. Drawn on a 500 × 520 stage that scales
// down to fit. Reduced motion: step 1 in front, no cycling. Instructions, questions, reasons and the customer are
// examples (labelled under the stack).
const S_W = 500, S_H = 520, STEP_MS = 3600;
const S_TAGS = ['Ask in any AI', 'Frank interviews', 'Back in your AI'];
// Where a card sits by its place in the stack (0 = front): x, y, scale, blur, opacity.
// The stack starts 40px down, leaving the top-left row for the handwritten tag, on the bare green panel.
const SLOTS = [[10, 136, 1, 0, 1], [178, 60, 0.86, 3, 0.6], [156, 222, 0.8, 5, 0.35]];
const S_REASONS = [['The price went up for small teams', 12], ['Reporting moved into their CRM', 8], ['The admin who set it up left', 6]];
const S_CARD = 'absolute left-0 top-0 w-[316px] rounded-[22px] bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.65)]';

function StackAsk({ on, tool, reduce }) {
  const text = 'Interview customers who cancelled last month. Find out why they left.';
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!on || reduce) { setN(text.length); return; }
    setN(0);
    let i = 0, t;
    const tick = () => { i += 2; setN(Math.min(i, text.length)); if (i < text.length) t = setTimeout(tick, 28); };
    t = setTimeout(tick, 350);
    return () => clearTimeout(t);
  }, [on, reduce]);
  const done = n >= text.length;
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-sans text-[13px] font-medium text-ink"><span className="block size-4">{tool.light}</span>{tool.name}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f6f4ef] px-2 py-0.5 font-sans text-[11px] text-ink-2"><img src={mcpLogo} alt="" className="size-2.5" />Frank</span>
      </div>
      <p className="m-0 ml-6 mt-4 min-h-[86px] rounded-[16px] rounded-br-[6px] bg-[#1a1714] px-3.5 py-2.5 font-sans text-[14px] leading-[1.45] text-white">{text.slice(0, n)}</p>
      <div className="mt-3 flex min-h-5 items-center gap-2 font-sans text-[12.5px] text-ink-2">
        {done && (<>
          <motion.span initial={reduce ? false : { opacity: 0, transform: 'scale(0.9)' }} animate={{ opacity: 1, transform: 'scale(1)' }} transition={{ duration: 0.3, ease: EASE, delay: on ? 0.3 : 0 }}
            className="grid size-4 place-items-center rounded-full bg-[#d1f899] text-ink"><Check className="size-2.5" strokeWidth={3} /></motion.span>
          <span>Frank <span className="text-ink-3">›</span> <code className="font-mono text-[11.5px] text-ink">create_research</code></span>
        </>)}
      </div>
      <div className="mt-4 flex items-center gap-2 border-0 border-t border-solid border-[#1a1714]/[0.07] pt-3">
        <span className="font-sans text-[11.5px] text-ink-3">Works in</span>
        {LLMS.map(l => <span key={l.name} className={'block size-3.5 transition-opacity duration-300 ' + (l.name === tool.name ? 'opacity-100' : 'opacity-35')}>{l.light}</span>)}
      </div>
    </>
  );
}

function StackInterview({ on, reduce }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f4ef] px-2 py-0.5 font-sans text-[11px] text-ink-2">
          <span className="tmn-live block size-1.5 rounded-full bg-[#e5484d]" />AI voice interview
        </span>
        <span className="font-mono text-[11.5px] tabular-nums text-ink-3">02:14</span>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <img src="/videos/call-08-card.jpg" alt="" className="size-[84px] rounded-full object-cover shadow-[0_0_0_4px_#f6f4ef]" />
        <span className="mt-3 rounded-full bg-[#0f2e27] px-2.5 py-1.5"><VoiceBars on={on && !reduce} /></span>
      </div>
      <div className="mt-4 flex items-start gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[62%]"><Glasses pose="Ready" reduced /></span></span>
        <p className="m-0 rounded-[14px] rounded-tl-[6px] bg-[#f6f4ef] px-3 py-2 font-sans text-[13.5px] leading-[1.4] text-ink">When did it stop feeling worth the price?</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-[#f6f4ef] text-ink-2"><Mic className="size-3.5" strokeWidth={1.75} /></span>
        <span className="grid size-8 place-items-center rounded-full bg-[#e5484d] text-white"><PhoneOff className="size-3.5" strokeWidth={1.75} /></span>
      </div>
    </>
  );
}

function StackAnswer({ on, tool, reduce }) {
  const grow = on || reduce;
  return (
    <>
      <span className="flex items-center gap-2 font-sans text-[13px] font-medium text-ink"><span className="block size-4">{tool.light}</span>{tool.name}</span>
      <p className={FIG + ' m-0 mt-4 text-[17px] leading-[1.25] tracking-[-0.01em] text-ink'}>Why customers cancelled</p>
      <p className="m-0 mt-1 flex items-center gap-1.5 font-sans text-[11.5px] text-ink-3"><img src={mcpLogo} alt="" className="size-3" />From 31 Frank interviews</p>
      <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
        {S_REASONS.map(([t, k], i) => (
          <li key={t}>
            <div className="flex items-baseline justify-between gap-3 font-sans text-[13px] leading-[1.35] text-ink"><span>{t}</span><span className="tabular-nums text-ink-2">{k}</span></div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#1a1714]/[0.06]">
              <motion.span className="block h-full origin-left rounded-full bg-[#6e9738]" style={{ width: `${(k / 12) * 100}%` }}
                initial={false} animate={{ transform: `scaleX(${grow ? 1 : 0})` }}
                transition={{ duration: 0.7, ease: EASE, delay: grow && !reduce ? 0.35 + i * 0.12 : 0 }} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function AiStack({ reduce }) {
  const box = useRef(null);
  const seen = useInView(box, { amount: 0.35 });
  const [k, setK] = useState(1);
  const [step, setStep] = useState(0); // counts up; the front card is step % 3
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(Math.min(1, e.contentRect.width / S_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (reduce || !seen) return;
    const t = setTimeout(() => setStep(n => n + 1), STEP_MS + (step === 0 ? 600 : 0));
    return () => clearTimeout(t);
  }, [step, seen, reduce]);
  const front = step % 3;
  const tool = LLMS[0]; // Claude, as the example AI (user, 2026-11-24)
  const cards = [
    <StackAsk key="a" on={front === 0 && seen} tool={tool} reduce={reduce} />,
    <StackInterview key="b" on={front === 1} reduce={reduce} />,
    <StackAnswer key="c" on={front === 2} tool={tool} reduce={reduce} />,
  ];
  return (
    <div ref={box} className="relative w-full" style={{ height: S_H * k }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: S_W, height: S_H, transform: `scale(${k})` }}>
        {cards.map((card, i) => {
          const r = (i - front + 3) % 3;
          const [x, y, sc, blur, op] = SLOTS[r];
          return (
            <motion.div key={i} aria-hidden={r !== 0} className={S_CARD + (r === 0 ? ' ring-2 ring-[#d1f899]' : ' ring-1 ring-[#1a1714]/[0.06]')}
              style={{ zIndex: 3 - r, transformOrigin: 'left top' }}
              initial={false}
              animate={{ transform: `perspective(1200px) translate(${x}px, ${y}px) rotateY(-9deg) rotateX(4deg) scale(${sc})`, filter: `blur(${blur}px)`, opacity: op }}
              transition={{ duration: reduce ? 0 : 0.7, ease: [0.32, 0.72, 0, 1] }}>
              {card}
            </motion.div>
          );
        })}

        {/* The handwritten tag, top left on the bare green (never over a card, user 2026-11-24: "make these texts
            visible"), with a drawn arrow down to the front card. */}
        <div aria-live="polite" className="absolute left-[14px] top-0 h-[134px] w-[300px]" style={{ zIndex: 5 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={front} className="relative h-full" initial={{ opacity: 0, transform: 'translateY(6px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(-4px)' }} transition={{ duration: 0.35, ease: EASE }}>
              <p className="m-0 origin-left -rotate-3 whitespace-nowrap font-['Kalam',cursive] text-[30px] font-bold leading-[1.1] text-[#d1f899]">{S_TAGS[front]}</p>
              <svg viewBox="0 0 80 90" className="absolute left-[64px] top-[42px] block h-[90px] w-[80px] overflow-visible" aria-hidden="true">
                <motion.path d="M56 2 C 60 34, 46 62, 22 84" fill="none" stroke="#d1f899" strokeWidth="2.5" strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }} />
                <motion.path d="M20 70 L 21 85 L 35 80" fill="none" stroke="#d1f899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.65 }} />
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="absolute bottom-0 right-0 font-sans text-[11px] text-white/40">Example</span>
      </div>
    </div>
  );
}

function Hero({ reduce }) {
  const bare = HERO_VISUAL === 'none';
  return (
    <section aria-labelledby="mcp-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className={'relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)] ' + (bare ? 'py-[clamp(64px,8vw,120px)]' : 'py-[clamp(48px,6vw,88px)]')}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className={'relative mx-auto grid grid-cols-1 items-center gap-12 lg:gap-16 ' + (bare ? 'max-w-[880px] text-center' : 'max-w-[1232px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]')}>
          <div className={bare ? 'flex flex-col items-center' : undefined}>
            <Rise reduce={reduce}><Eyebrow align={bare ? 'center' : 'start'} className="mb-6 !text-white/85 sm:mb-8">MCP</Eyebrow></Rise>
            <Rise as="h1" reduce={reduce} delay={0.06} id="mcp-title" className={'m-0 pb-1 leading-[1.05] text-white [text-wrap:balance] ' + (bare ? 'text-[clamp(36px,5.4vw,72px)] ' : 'text-[clamp(36px,4.6vw,60px)] ') + TITLE}>
              Run customer research from within your <span className="italic">favorite LLM</span>
            </Rise>
            <Rise as="p" reduce={reduce} delay={0.14} className={'m-0 mt-5 max-w-[52ch] font-sans text-[17px] leading-[1.6] text-white/70 sm:mt-6' + (bare ? ' mx-auto [text-wrap:pretty]' : '')}>
              Connect Frank to Claude, OpenAI, Gemini, and the AI tools you already love to use. Create new research projects, run interviews, explore transcripts, analyze correlations, and uncover real customer insights without leaving your workflow.
            </Rise>
            <Rise reduce={reduce} delay={0.22} className="mt-9">
              <Pill href={SIGNUP} tone="lime">Sign up to get started</Pill>
              <p className="m-0 mt-5 font-sans text-[14px] text-white/70">No API keys required. No new workflow. Just connect Frank and start asking.</p>
            </Rise>
          </div>
          {!bare && <Rise reduce={reduce} delay={0.3} className="mx-auto w-full max-w-[520px] lg:mr-0">{HERO_VISUAL === 'stack' ? <AiStack reduce={reduce} /> : HERO_VISUAL === 'instruct' ? <AiInstruct reduce={reduce} /> : HERO_VISUAL !== 'chat' ? (<>
            {/* Concept B or C from 640px; on phones their text would be too small, so the chat (concept A) shows there. */}
            <div className="hidden sm:block">{HERO_VISUAL === 'voices' ? <AiVoices reduce={reduce} /> : <AiHub reduce={reduce} />}</div>
            <div className="sm:hidden"><AiChat reduce={reduce} /></div>
          </>) : <AiChat reduce={reduce} />}</Rise>}
        </div>
      </div>
    </section>
  );
}

// ——— 2. Where it works: the tools from the live page (Claude, ChatGPT, Gemini, Copilot, Cursor), then any
// MCP-compatible platform. Logos: the project's own (logos/), Gemini and Copilot from simple-icons.
const TOOLS = [
  ['Claude', <img src={claudeLogo} alt="" className="size-full" />],
  ['ChatGPT', <img src={openaiLogo} alt="" className="size-full" />],
  ['Gemini', <PathLogo icon={siGooglegemini} color={'#' + siGooglegemini.hex} />],
  ['Copilot', <PathLogo icon={siGithubcopilot} color="#1a1714" />],
  ['Cursor', <img src={cursorLogo} alt="" className="size-full" />],
];
function Where({ reduce }) {
  return (
    <section aria-labelledby="mcp-where-title" className={SECTION + PAD}>
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-16">
        <div>
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Where it works</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="mcp-where-title" className={H2}
            lines={['Works with all major LLMs', 'and AI platforms']} />
          {/* All plain Figtree: no lime highlighter and no Lora italic (user, 2026-11-24: "remove highlight", then "simple font"). */}
        </div>
        {/* Every tile the same size, its logo centred above its name (user, 2026-11-24: "align centre all icons"). The
            logo and name are centred in the middle of the tile (user, 2026-11-24: "logos should be in the centre of
            the box"); every label box is one line tall, so the logos also line up across each row. */}
        <ul className="m-0 grid list-none auto-rows-fr grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:gap-4">
          {TOOLS.map(([name, logo], i) => (
            <ScrubText as="li" key={name} reduce={reduce} lag={i * 0.03} className="h-full">
              <span className="flex h-full min-h-[148px] flex-col items-center justify-center gap-3.5 rounded-[20px] bg-white px-4 py-6 text-center ring-1 ring-inset ring-[#1a1714]/[0.08]">
                <span className="grid size-8 place-items-center"><span className="block size-8">{logo}</span></span>
                <span className={FIG + ' text-[18px] leading-[1.2] tracking-[-0.01em] text-ink'}>{name}</span>
              </span>
            </ScrubText>
          ))}
          <ScrubText as="li" reduce={reduce} lag={0.15} className="h-full">
            <span className="flex h-full min-h-[148px] flex-col items-center justify-center gap-3.5 rounded-[20px] bg-[#d1f899] px-4 py-6 text-center">
              <img src={mcpLogo} alt="" className="block size-8" />
              {/* The label box is one line tall, as in the other tiles, so this logo sits at the same height as theirs;
                  the second line runs below it. */}
              <span className="relative block h-[22px] w-full">
                <span className={FIG + ' absolute inset-x-0 top-0 text-[16px] leading-[1.35] tracking-[-0.01em] text-ink [text-wrap:balance]'}>and any <span className="whitespace-nowrap">MCP-compatible</span> platform</span>
              </span>
            </span>
          </ScrubText>
        </ul>
      </div>
    </section>
  );
}

// ——— 3. How it works (user, 2026-11-23: the "How it works" kicker, the home page's How it works layout, and the
// old page's visuals improved): HowItWorks.jsx with this page's steps (the live page's words) and McpScenes. The
// "entire research loop" line and the CTA sit under the steps.
const STEPS = [
  { name: 'Define', title: 'Create research', scene: DefineScene,
    body: ['Tell your AI what you want to learn. Create a research project, define what you want to discover, and get it ready to run without opening another platform.'] },
  { name: 'Engage', title: 'Talk to customers', scene: EngageScene,
    body: ['Frank conducts the interviews for you. It asks questions, adapts its follow-ups, digs deeper into interesting answers, and captures the full conversation.'] },
  { name: 'Query', title: 'Ask your AI', scene: QueryScene,
    body: ['Your AI works directly with Frank research. Explore transcripts, compare responses, find patterns, surface quotes, and dig into the reasons behind what customers do.'] },
];
function How() {
  return (
    <div className="pt-[clamp(112px,13vw,200px)]">
      <HowItWorks steps={STEPS} label="How it works" lines={['Your AI. Your research.', 'One workflow.']}
        subtitle="Frank’s Model Context Protocol (MCP) server bridges your customer research database directly into the AI prompts you run every day."
        id="mcp-how-title"
        action={(
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <p className="m-0 max-w-[40ch] font-sans text-[16px] leading-[1.5] text-ink">Experience the entire research loop, inside the AI you already use.</p>
            <Pill href={SIGNUP} tone="ink">Connect Frank</Pill>
          </div>
        )} />
    </div>
  );
}

// ——— 4. Built for every team: the live page's four roles in simple cards (icon and role, the question as a prompt, the line),
// laid out like the Churn page's "What you get" (user, 2026-11-24: "like this section"): the kicker, title and subtitle
// pinned on the left; on the right the cards stack as you scroll, each new card sliding up over the one before, so one
// team shows at a time. The cards are that section's cream with the corner glow. Plain CSS sticky (no scroll script).
// Two equal columns from 1024px; below that the cards are a plain list.
const TEAMS = [
  ['Founders', Rocket01Icon, 'Why are we losing these customers?', 'Pull together interviews from recent wins, losses, and cancellations. Find the patterns behind them and get to the answer before the next decision.'],
  ['Product', PackageIcon, 'What do users actually want next?', 'Explore interviews, test assumptions, compare customer segments, and pressure-test roadmap ideas without digging through research reports.'],
  ['Marketing', Megaphone01Icon, 'Why do customers choose us?', 'Find the language customers naturally use, uncover objections and motivations, and understand what makes people convert.'],
  ['Sales and accounts', HandshakeIcon, 'Why did we win this deal?', 'Analyze winning and losing conversations to uncover the objections, competitors, buying triggers, and gaps shaping your sales funnel.'],
];

// One team card: the icon tile and role, the question as a prompt in your AI (user, 2026-11-24: keep the icons and the
// chat input), and the line. The question types in once the card is mostly in view and the send button darkens;
// screen readers get the whole question as the heading. Reduced motion: shown typed.
function TeamCard({ role, icon, q, text, reduce }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(reduce ? q.length : 0);
  useEffect(() => {
    if (reduce) { setN(q.length); return; }
    if (!seen) return;
    let i = 0, id;
    const tick = () => { i += 1; setN(i); if (i < q.length) id = setTimeout(tick, 34); };
    id = setTimeout(tick, 300);
    return () => clearTimeout(id);
  }, [seen, reduce, q]);
  const typed = n >= q.length;
  return (
    <div ref={ref} className="relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px] bg-[#fffdf3] p-7 shadow-[0_-10px_30px_-12px_rgba(26,23,20,0.12)] ring-1 ring-[#1a1714]/[0.06] sm:p-9">
      {/* The Churn page's "What you get" card: cream with the faint grainy yellow glow in the corner. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cornerGlowGrain} />
      <span className="relative flex items-center gap-2.5 font-sans text-[15px] text-ink-2">
        <span className="grid size-8 place-items-center rounded-[10px] bg-white text-ink ring-1 ring-inset ring-[#1a1714]/[0.07]">
          <HugeiconsIcon icon={icon} size={17} strokeWidth={1.6} aria-hidden="true" />
        </span>
        {role}
      </span>
      <div className="relative mt-6 flex items-center gap-3 rounded-[18px] bg-white py-2.5 pl-4 pr-2.5 shadow-[0_8px_24px_-18px_rgba(26,23,20,0.35)] ring-1 ring-inset ring-[#1a1714]/[0.08] sm:pl-5">
        <h3 className={FIG + ' relative m-0 min-w-0 flex-1 text-[clamp(19px,1.8vw,24px)] leading-[1.3] tracking-[-0.02em] text-ink'}>
          <span className="sr-only">{q}</span>
          <span aria-hidden="true" className="invisible block">{q}</span>
          <span aria-hidden="true" className="absolute inset-0">
            {q.slice(0, n)}
            {!typed && <span className="ml-px inline-block h-[0.95em] w-[1.5px] translate-y-[0.12em] animate-pulse bg-ink" />}
          </span>
        </h3>
        <span aria-hidden="true" className={'grid size-9 shrink-0 place-items-center rounded-full text-white transition-colors duration-300 ' + (typed ? 'bg-[#1a1714]' : 'bg-[#1a1714]/25')}>
          <ArrowUp className="size-4" strokeWidth={2.25} />
        </span>
      </div>
      <span aria-hidden="true" className="block min-h-6 flex-1" />
      <p className="relative m-0 mt-6 max-w-[52ch] font-sans text-[16px] leading-[1.6] text-ink-2">{text}</p>
    </div>
  );
}

function Teams({ reduce }) {
  return (
    <section aria-labelledby="mcp-teams-title" className={SECTION + PAD}>
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Built for every team</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="mcp-teams-title" className={H2} lines={['Customer research', 'built around your work']} />
          <ScrubText as="p" reduce={reduce} lag={0.12} className={'mb-0 mt-6 max-w-[52ch] ' + SUBTITLE}>
            You don’t need to become a researcher, learn new skills, or dedicate hours to managing interviews to reap the benefits of customer insights. With Frank connected to your AI, customer insight effortlessly becomes part of the work you already do every day.
          </ScrubText>
        </div>

        <ul aria-label="Teams" className="m-0 flex list-none flex-col gap-4 p-0 lg:gap-0">
          {TEAMS.map(([role, icon, q, text], i) => (
            <li key={role} className="lg:sticky lg:mb-[28vh] lg:last:mb-0" style={{ top: `${112 + i * 18}px` }}>
              <TeamCard role={role} icon={icon} q={q} text={text} reduce={reduce} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ——— 5. FAQ: the live page's seven questions.
const MCP_FAQ = [
  { q: 'What is the Frank MCP server?', a: ['Frank’s MCP server connects your Frank account to compatible AI clients such as Claude, ChatGPT and Gemini. This lets your AI assistant work with your Frank research, interviews, and transcripts, and, with the right permissions, create and manage research too.'] },
  { q: 'What can I do with Frank through MCP?', a: ['You can use your AI assistant to work across the research lifecycle. Create research projects, access studies and interviews, read transcripts, explore customer responses, and analyze what people said.'] },
  { q: 'Do I need to use a separate Frank workflow?', a: ['No. That’s the point. Once Frank is connected, you can work with your customer research from the AI environment you already use. You don’t need to copy transcripts into another tool or switch between platforms every time you have a question.'] },
  { q: 'Can my AI create research with Frank?', a: ['Yes. With the appropriate permissions, your AI can create a research project in Frank. New research is created as a draft, so it isn’t published to participants without separate approval.'] },
  { q: 'Can I analyze existing interviews?', a: ['Yes. Your connected AI can access your Frank research and interview transcripts, allowing you to ask questions, investigate themes, compare responses, and dig into what customers actually said.'] },
  { q: 'Does connecting Frank give the AI access to everything in my account?', a: ['No. Access is permission-based. The connection only gets the permissions you approve, and actions that can change your account are separated from read-only access.'] },
  { q: 'How do I connect Frank?', a: ['Connect Frank from your compatible AI client using the Frank MCP server. You’ll authenticate in your browser and approve the permissions once. After that, your AI can work with Frank according to the access you’ve granted.'] },
];

// ——— 6. Closing.
function Closing({ reduce }) {
  return (
    <section aria-labelledby="mcp-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="mcp-cta-title" className={H2} lines={['Customer research shouldn’t', 'take more time']} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 mt-6 max-w-[46ch] [text-wrap:balance] ' + SUBTITLE}>
          Connect Frank to the AI you already use and make customer insight part of every decision.
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9 flex flex-col items-center gap-5">
          <Pill href={SIGNUP} tone="ink">Connect Frank to your AI</Pill>
          <p className="m-0 font-sans text-[14.5px] text-[#1a1714]/75">Create research. Talk to customers. Find the answer. All from one workflow.</p>
        </ScrubText>
      </div>
    </section>
  );
}

export default function McpPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Platform"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero reduce={reduce} />
          <Where reduce={reduce} />
          <How />
          <Teams reduce={reduce} />
          <div className="pt-[clamp(112px,13vw,200px)]">
            <FAQ items={MCP_FAQ} label="FAQ" lines={['Have questions?', 'We have answers.']} id="mcp-faq-title" />
          </div>
          <Closing reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
