// AgenticWorkflow (V21) — "Use Frank with your AI assistant". All centred: the label, the title and
// the subtitle under it, then a connection map: Frank's logo in the centre, a line out to each
// assistant around him (Claude, ChatGPT, Cursor, Dot, Instinct). Frank is his wordmark on a white disc;
// each assistant's logo sits in an even white tile. The curved
// lines draw in as the map scrolls into view, then slow lime pulses travel them one at a time into Frank:
// requests arriving from wherever you work. Hovering an assistant lights its line.
// The supporting line sits under the map.
// Reduced motion: the lines are simply there, no pulses.
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
// Assistant logos from LobeHub Icons (MIT; the marks belong to their owners). Dot and Instinct have
// no published mark there yet, so they get a quiet initial until their own logos are added.
import claudeLogo from './logos/claude.svg';
import openaiLogo from './logos/openai.svg';
import cursorLogo from './logos/cursor.svg';

// Assistants around Frank, evenly spaced (angle in degrees, 0 = right, clockwise). Desktop sets them
// on a wide oval (800×520 box) so the map fills the width; phones keep a circle (600×600).
const CLIENTS = [
  { name: 'Claude', a: -90, logo: claudeLogo },
  { name: 'ChatGPT', a: -18, logo: openaiLogo },
  { name: 'Cursor', a: 54, logo: cursorLogo },
  { name: 'Dot', a: 126 },
  { name: 'Instinct', a: 198 },
];
const WIDE = { w: 800, h: 520, rx: 318, ry: 196 };
const ROUND = { w: 600, h: 600, rx: 222, ry: 222 };
const EASE = [0.23, 1, 0.32, 1];
// Pulse timing (s): each takes TRAVEL to reach Frank; the next line starts STEP later; every line
// fires once per CYCLE (all five, one after another).
const TRAVEL = 3.2, STEP = 2.4, CYCLE = STEP * 5;

const pos = (g, a) => [g.w / 2 + g.rx * Math.cos((a * Math.PI) / 180), g.h / 2 + g.ry * Math.sin((a * Math.PI) / 180)];
// A soft curve from the assistant into Frank's centre (bowed a little to one side, so the map
// reads as connections, not spokes). The pill and the hub sit on top of its two ends.
const curve = (g, a) => {
  const [x, y] = pos(g, a), cx = g.w / 2, cy = g.h / 2;
  const mx = (x + cx) / 2, my = (y + cy) / 2, dx = cx - x, dy = cy - y;
  return `M${x.toFixed(1)} ${y.toFixed(1)} Q${(mx - dy * 0.14).toFixed(1)} ${(my + dx * 0.14).toFixed(1)} ${cx} ${cy}`;
};

function useWide() {
  const q = '(min-width: 640px)';
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q), on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return wide;
}

// The assistant's mark in an even white tile, so colour and mono logos (and the stand-in letters)
// sit at the same weight. The chip around it is the tile's corner plus the 6px gap (12 + 6 = 18),
// so the two curves run parallel.
const Mark = ({ c }) => (
  <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-white ring-1 ring-[#1a1714]/[0.08] sm:h-[42px] sm:w-[42px]">
    {c.logo
      ? <img src={c.logo} alt="" className="h-[21px] w-[21px] sm:h-[23px] sm:w-[23px]" />
      : <span className="font-sans text-[15px] font-semibold text-ink-2">{c.name[0]}</span>}
  </span>
);

function ConnectionMap({ reduce }) {
  const [hot, setHot] = useState(null);
  const g = useWide() ? WIDE : ROUND;
  return (
    <div className="relative mx-auto w-full max-w-[880px] font-sans" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
      <svg aria-hidden="true" viewBox={`0 0 ${g.w} ${g.h}`} className="absolute inset-0 size-full overflow-visible">
        {/* One soft halo around Frank. */}
        <ellipse cx={g.w / 2} cy={g.h / 2} rx={g.rx * 0.56} ry={g.ry * 0.56} fill="none" stroke="#1a1714" strokeOpacity="0.05" />
        {CLIENTS.map((c, i) => {
          const d = curve(g, c.a), on = hot === i, id = `ag-path-${i}`;
          return (
            <g key={c.name}>
              <motion.path id={id} d={d} fill="none" strokeLinecap="round"
                stroke={on ? '#5f8f22' : '#1a1714'} strokeOpacity={on ? 0.85 : 0.16} strokeWidth={on ? 1.75 : 1.25}
                initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
                style={{ transition: 'stroke 200ms ease, stroke-opacity 200ms ease' }} />
              {/* A lime pulse travels the curve into Frank, one line at a time: each line sends one
                  every CYCLE seconds, taking TRAVEL seconds, its turn STEP seconds after the last. */}
              {!reduce && (
                <circle r={on ? 4.5 : 3.5} fill="#8fc24f" opacity="0">
                  <animateMotion dur={`${CYCLE}s`} begin={`${1.6 + i * STEP}s`} repeatCount="indefinite" calcMode="spline"
                    keyTimes={`0;${TRAVEL / CYCLE};1`} keyPoints="0;1;1" keySplines="0.65 0 0.35 1;0 0 1 1">
                    <mpath href={`#${id}`} />
                  </animateMotion>
                  <animate attributeName="opacity" dur={`${CYCLE}s`} begin={`${1.6 + i * STEP}s`} repeatCount="indefinite"
                    values="0;1;1;0;0" keyTimes={`0;${(TRAVEL * 0.12) / CYCLE};${(TRAVEL * 0.85) / CYCLE};${TRAVEL / CYCLE};1`} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Frank in the centre: his wordmark on a white disc, a soft lime ring breathing slowly behind. */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="relative grid size-[112px] place-items-center sm:size-[148px]">
          {!reduce && (
            <motion.span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#d1f899]"
              animate={{ transform: ['scale(1)', 'scale(1.28)'], opacity: [0.45, 0] }}
              transition={{ duration: 4.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }} />
          )}
          {/* The first version's hub: the wordmark on white with a pale lime ring. */}
          <span className="relative grid size-full place-items-center rounded-full bg-white ring-1 ring-[#1a1714]/[0.08] shadow-[0_18px_40px_-20px_rgba(26,23,20,0.35),0_0_0_10px_#f3fbe6]">
            <img src="/frank-logo.png" alt="Frank" className="block w-[62%]" />
          </span>
        </span>
      </div>

      {/* The assistants, as pills on the oval. */}
      <ul className="m-0 list-none p-0" aria-label="Works with">
        {CLIENTS.map((c, i) => {
          const [x, y] = pos(g, c.a);
          return (
            <li key={c.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / g.w) * 100}%`, top: `${(y / g.h) * 100}%` }}>
              <motion.span onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)}
                initial={reduce ? false : { opacity: 0, transform: 'scale(0.94)' }} whileInView={{ opacity: 1, transform: 'scale(1)' }}
                viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.08 }}
                className={'flex items-center gap-3 whitespace-nowrap rounded-[18px] bg-white py-1.5 pl-1.5 pr-4 text-[14px] text-ink ring-1 transition-[box-shadow] duration-200 ease-out sm:pr-5 sm:text-[15px] '
                  + (hot === i ? 'ring-[#5f8f22]/50 shadow-[0_10px_24px_-12px_rgba(95,143,34,0.55)]' : 'ring-[#1a1714]/[0.09] shadow-[0_8px_22px_-14px_rgba(26,23,20,0.35)]')}>
                <Mark c={c} />
                {c.name}
              </motion.span>
            </li>
          );
        })}
      </ul>
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

        {/* The map straight on the page (no stage behind it), centred, with the supporting line under it. */}
        <ScrubText reduce={reduce} lag={0.1} className="mt-[clamp(28px,4vw,48px)]">
          <ConnectionMap reduce={reduce} />
          <p className="mx-auto mb-0 mt-4 max-w-[44ch] text-center font-sans text-[16px] leading-[1.5] text-ink-2 sm:text-[17px]">
            Same studies. Same insights. Same dashboard. You just never have to switch tabs.
          </p>
        </ScrubText>
      </div>
    </section>
  );
}
