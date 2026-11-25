// GlobalScenes (V21.04): the three "How it works" visuals of the Global scalability page, redrawn from the live page's pictures in
// the V21.04 colours as plain HTML and SVG (no images; flags are small SVGs). Each is a StepVisual `scene` ({ active, reduce }) on the
// card's lime:
//   Setup:    one interview template, three countries it adapts to on its own (English, Spanish, German).
//   Parallel: interviews running now: the three counters, a few live conversations with their waveforms, "+231 more".
//   Roll-up:  all insights in one place, translated: the tabs, the top themes with their mentions, a transcript preview.
// Drawn on a 520 × 578 stage (the card's 9:10) scaled to the card's width. They play when their step becomes active; reduced motion
// shows the finished scene.
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Layers, LayoutTemplate, Mic } from 'lucide-react';

const W = 520, H = 578;
const EASE = [0.23, 1, 0.32, 1];

export function Stage({ children, w = W, h = H }) {
  const box = useRef(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="absolute inset-0">
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform: `scale(${k})` }}>{children}</div>
    </div>
  );
}

// Floats in (after `at` seconds) when the scene plays.
export function Float({ on, reduce, at = 0, className = '', style, children }) {
  return (
    <motion.div className={'absolute ' + className} style={style} initial={false}
      animate={on || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: on && !reduce ? at : 0 }}>
      {children}
    </motion.div>
  );
}

export const CARD = 'rounded-[18px] bg-white shadow-[0_22px_50px_-22px_rgba(26,23,20,0.38)] ring-1 ring-[#1a1714]/[0.06]';
export const FIG = "font-['Figtree',sans-serif]";
const Pill = ({ children, dot = true, className = '' }) => (
  <span className={'inline-flex items-center gap-2 rounded-full bg-[#f1f9e3] px-3.5 py-1.5 font-sans text-[14px] text-[#3f6b12] ' + className}>
    {dot && <span aria-hidden="true" className="size-2 rounded-full bg-[#5f8f22]" />}{children}
  </span>
);

// Flags, drawn small (36 × 26, rounded).
export function Flag({ code, w = 36 }) {
  const h = Math.round(w * 26 / 36);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const body = {
    us: <>
      {Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 26 / 7} width="36" height={26 / 7} fill={i % 2 ? '#fff' : '#d8403a'} />)}
      <rect width="16" height={26 * 4 / 7} fill="#3b5aa8" />
      {[0, 1, 2].flatMap(r => [0, 1, 2, 3].map(c => <circle key={r + '-' + c} cx={2.6 + c * 3.6} cy={2.6 + r * 4.4} r="0.9" fill="#fff" />))}
    </>,
    mx: <>
      <rect width="12" height="26" fill="#2f8a4f" /><rect x="12" width="12" height="26" fill="#fff" /><rect x="24" width="12" height="26" fill="#d8403a" />
      <circle cx="18" cy="13" r="3.4" fill="#b08a3e" opacity="0.85" />
    </>,
    de: <>
      <rect width="36" height="8.7" fill="#1a1714" /><rect y="8.7" width="36" height="8.7" fill="#d8403a" /><rect y="17.3" width="36" height="8.7" fill="#f2c230" />
    </>,
    gb: <>
      <rect width="36" height="26" fill="#3b5aa8" />
      <path d="M0 0 36 26M36 0 0 26" stroke="#fff" strokeWidth="5" />
      <path d="M0 0 36 26M36 0 0 26" stroke="#d8403a" strokeWidth="1.8" />
      <path d="M18 0v26M0 13h36" stroke="#fff" strokeWidth="8" />
      <path d="M18 0v26M0 13h36" stroke="#d8403a" strokeWidth="4.6" />
    </>,
    fr: <>
      <rect width="12" height="26" fill="#3b5aa8" /><rect x="12" width="12" height="26" fill="#fff" /><rect x="24" width="12" height="26" fill="#d8403a" />
    </>,
    it: <>
      <rect width="12" height="26" fill="#2f8a4f" /><rect x="12" width="12" height="26" fill="#fff" /><rect x="24" width="12" height="26" fill="#d8403a" />
    </>,
    es: <>
      <rect width="36" height="26" fill="#d8403a" /><rect y="6.5" width="36" height="13" fill="#f2c230" />
    </>,
    se: <>
      <rect width="36" height="26" fill="#3b5aa8" /><rect x="10" width="5.5" height="26" fill="#f2c230" /><rect y="10.2" width="36" height="5.6" fill="#f2c230" />
    </>,
    no: <>
      <rect width="36" height="26" fill="#d8403a" /><rect x="9.5" width="7.5" height="26" fill="#fff" /><rect y="9.2" width="36" height="7.6" fill="#fff" />
      <rect x="11.5" width="3.5" height="26" fill="#3b5aa8" /><rect y="11.2" width="36" height="3.6" fill="#3b5aa8" />
    </>,
  }[code];
  const id = 'fl' + uid;
  return (
    <svg aria-hidden="true" viewBox="0 0 36 26" width={w} height={h} className="block shrink-0 drop-shadow-[0_0_0_rgba(0,0,0,0)]">
      <defs><clipPath id={id}><rect width="36" height="26" rx="5" /></clipPath></defs>
      <g clipPath={`url(#${id})`}>{body}</g>
      <rect width="36" height="26" rx="5" fill="none" stroke="rgba(26,23,20,0.12)" />
    </svg>
  );
}

// A waveform that moves while `live` (the voice page's bars).
const PATTERN = [3, 6, 10, 5, 8, 14, 9, 4, 12, 16, 7, 5, 11, 15, 8, 4, 9, 13, 6, 3, 8, 12];
export function Bars({ live, n = 22, h = 28, w = 3, gap = 3, color = 'rgba(26,23,20,0.22)' }) {
  return (
    <span aria-hidden="true" className={'vo-wave flex items-center ' + (live ? 'on' : '')} style={{ height: h, gap }}>
      {Array.from({ length: n }, (_, i) => PATTERN[i % PATTERN.length]).map((b, i) => (
        <span key={i} className="vo-bar block rounded-full" style={{ width: w, height: `${Math.max(14, (b / 16) * 100)}%`, background: color, animationDelay: `${(i * 97) % 900}ms`, animationDuration: `${900 + ((i * 131) % 600)}ms` }} />
      ))}
    </span>
  );
}
export const Avatar = ({ c, size = 40 }) => (
  <span aria-hidden="true" className="grid shrink-0 place-items-center rounded-full bg-[#f1f9e3] font-sans text-[15px] font-medium text-[#3f6b12]" style={{ width: size, height: size }}>{c}</span>
);

// ——— 1. Setup: one template, three countries.
export function SetupScene({ active, reduce }) {
  const on = active;
  const rows = [['us', 'United States', 'English'], ['mx', 'Mexico', 'Spanish'], ['de', 'Germany', 'German']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0.05} className="left-[36px] top-[48px] w-[448px]">
        <div className={CARD + ' flex items-center gap-5 px-6 py-5'}>
          <span aria-hidden="true" className="grid size-[56px] place-items-center rounded-[16px] bg-[#d1f899] text-[#2a321e]"><LayoutTemplate className="size-6" strokeWidth={1.6} /></span>
          <span className={FIG + ' flex-1 text-[21px] font-medium tracking-[-0.02em] text-ink'}>Interview template</span>
          <Pill dot={false} className="!bg-[#1a1714]/[0.06] !text-ink-2">Active</Pill>
        </div>
      </Float>
      {/* The connector: from the template down, to each country. */}
      <Float on={on} reduce={reduce} at={0.35} className="inset-0">
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" fill="none" stroke="rgba(26,23,20,0.28)" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round">
          <path d="M260 138V176" />
          <path d="M26 176H494" />
          <path d="M26 176V262H36" />
          <path d="M494 176V362H484M494 462H484" />
        </svg>
      </Float>
      {rows.map(([code, name, lang], i) => (
        <Float key={code} on={on} reduce={reduce} at={0.55 + i * 0.18} className="left-[36px] w-[448px]" style={{ top: 206 + i * 112 }}>
          <div className={CARD + ' flex items-center gap-5 px-6 py-5'}>
            <Flag code={code} w={52} />
            <span className="flex flex-1 flex-col">
              <span className={FIG + ' text-[20px] font-medium tracking-[-0.02em] text-ink'}>{name}</span>
              <span className="mt-0.5 font-sans text-[14px] text-ink-3">{lang}</span>
            </span>
            <Pill>Auto-adapted</Pill>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

// ——— 2. Parallel: interviews running now.
export function ParallelScene({ active, reduce }) {
  const on = active;
  const stats = [[Layers, '128', 'interviews running'], [BadgeCheck, '98%', 'Success rate'], [Mic, '36', 'live right now']];
  const rows = [['S', 'Sarah M.', 'Marketing Lead', 'gb', 'English'], ['L', 'Luca D.', 'Project Manager', 'mx', 'Mexico'], ['D', 'Daniel L.', 'Designer', 'fr', 'France']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0.05} className="left-[36px] top-[44px] w-[448px]">
        <div className={CARD + ' grid grid-cols-3 gap-2 px-4 py-4'}>
          {stats.map(([Icon, n, label]) => (
            <div key={label} className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-[42px] shrink-0 place-items-center rounded-[13px] bg-[#d1f899] text-[#2a321e]"><Icon className="size-5" strokeWidth={1.6} /></span>
              <span className="flex flex-col leading-tight">
                <span className={FIG + ' text-[23px] font-medium tracking-[-0.02em] text-ink'}>{n}</span>
                <span className="font-sans text-[12px] text-ink-3">{label}</span>
              </span>
            </div>
          ))}
        </div>
      </Float>
      {rows.map(([c, name, role, flag, lang], i) => (
        <Float key={name} on={on} reduce={reduce} at={0.3 + i * 0.16} className="left-[36px] w-[448px]" style={{ top: 160 + i * 100 }}>
          <div className={CARD + ' flex items-center gap-3.5 px-4 py-4'}>
            <Avatar c={c} size={42} />
            <span className="flex w-[92px] shrink-0 flex-col leading-tight">
              <span className="font-sans text-[15px] font-medium text-ink">{name}</span>
              <span className="mt-0.5 font-sans text-[12px] text-ink-3">{role}</span>
            </span>
            <span aria-hidden="true" className="h-9 w-px shrink-0 bg-[#1a1714]/[0.08]" />
            <span className="flex w-[74px] shrink-0 items-center gap-2 font-sans text-[13.5px] text-ink"><Flag code={flag} w={22} />{lang}</span>
            <span className="flex min-w-0 flex-1 justify-center overflow-hidden"><Bars live={on && !reduce} n={12} h={26} /></span>
            <span className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[13.5px] font-medium text-[#3f6b12]"><span aria-hidden="true" className="size-2 rounded-full bg-[#5f8f22]" />Live now</span>
          </div>
        </Float>
      ))}
      <Float on={on} reduce={reduce} at={0.85} className="left-[36px] w-[448px]" style={{ top: 468 }}>
        <div className="rounded-[16px] bg-[#fffdf3] py-4 text-center font-sans text-[16px] font-medium text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)]">+231 more interviews</div>
      </Float>
    </Stage>
  );
}

// ——— 3. Roll-up: all insights, translated. One panel holds it all: the tabs float on top as their own card, then the top themes
// and a transcript preview.
export function RollupScene({ active, reduce }) {
  const on = active;
  const tabs = ['All insights', 'By theme', 'By region', 'By language'];
  const themes = [['Onboarding friction', '48 mentions'], ['Feature discovery', '37 mentions'], ['Pricing perception', '29 mentions']];
  const rows = [['S', 'Sarah M.', 'Marketing Lead', 'gb', 'English'], ['L', 'Luca D.', 'Project Manager', 'mx', 'Mexico']];
  return (
    <Stage>
      {/* The panel everything sits in. */}
      <Float on={on} reduce={reduce} at={0} className="left-[28px] top-[28px] h-[524px] w-[464px]">
        <div className="size-full rounded-[28px] bg-[#fffdf3] shadow-[0_26px_60px_-26px_rgba(26,23,20,0.42)] ring-1 ring-[#1a1714]/[0.06]" />
      </Float>
      {/* The tabs, floating above it. */}
      <Float on={on} reduce={reduce} at={0.15} className="left-[48px] top-[46px] w-[424px]">
        <div className="grid grid-cols-4 gap-1 rounded-[18px] bg-white p-1.5 shadow-[0_18px_36px_-14px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.07]">
          {tabs.map((t, i) => (
            <span key={t} className={'rounded-[13px] py-2.5 text-center font-sans text-[13.5px] ' + (i === 0 ? 'bg-[#d1f899] font-medium text-[#2a321e]' : 'text-ink-3')}>{t}</span>
          ))}
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.3} className="left-[50px] top-[124px] w-[420px]">
        <span className={FIG + ' text-[16px] font-medium text-ink'}>Top themes (translated)</span>
      </Float>
      {themes.map(([t, m], i) => (
        <Float key={t} on={on} reduce={reduce} at={0.42 + i * 0.12} className="left-[50px] w-[420px]" style={{ top: 158 + i * 54 }}>
          <div className="flex items-center justify-between rounded-[13px] bg-white px-4 py-3 shadow-[0_8px_18px_-12px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]">
            <span className="flex items-center gap-3 font-sans text-[15px] text-ink"><span aria-hidden="true" className="size-2.5 rounded-full bg-[#5f8f22]" />{t}</span>
            <span className="font-sans text-[13.5px] text-ink-3">{m}</span>
          </div>
        </Float>
      ))}
      <Float on={on} reduce={reduce} at={0.8} className="left-[50px] top-[338px] w-[420px]">
        <span className={FIG + ' text-[16px] font-medium text-ink'}>Transcript preview</span>
      </Float>
      {rows.map(([c, name, role, flag, lang], i) => (
        <Float key={name} on={on} reduce={reduce} at={0.92 + i * 0.14} className="left-[50px] w-[420px]" style={{ top: 374 + i * 84 }}>
          <div className="flex items-center gap-3.5 rounded-[16px] bg-white px-4 py-3.5 shadow-[0_10px_22px_-14px_rgba(26,23,20,0.32)] ring-1 ring-[#1a1714]/[0.06]">
            <Avatar c={c} size={40} />
            <span className="flex w-[104px] shrink-0 flex-col leading-tight">
              <span className="font-sans text-[14.5px] font-medium text-ink">{name}</span>
              <span className="mt-0.5 font-sans text-[11.5px] text-ink-3">{role}</span>
            </span>
            <span aria-hidden="true" className="h-8 w-px shrink-0 bg-[#1a1714]/[0.08]" />
            <span className="flex w-[78px] shrink-0 items-center gap-2 font-sans text-[13px] text-ink"><Flag code={flag} w={22} />{lang}</span>
            <span className="flex min-w-0 flex-1 justify-end"><Bars live={false} n={14} h={22} /></span>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

export const GLOBAL_SCENES = [SetupScene, ParallelScene, RollupScene];
