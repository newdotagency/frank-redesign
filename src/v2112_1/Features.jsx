// Features (V21.12.1) — "A full research team, running on agents." Nineteen features, told as the job
// they add up to: four steps in order (design the study, run the interviews, understand the why,
// take it anywhere). No cards: each step is one band, in three columns — its number,
// name and count; its features as a list, one a row on a faint hairline, each title with its icon in a
// small tile beside it; and the active feature's one-liner beside the list. One row per step is active
// (dark title, lime icon tile, a small arrow pointing to its one-liner); hovering (where there is hover),
// focusing or tapping another row makes it the active one.
// The one-liners share one grid cell, so nothing moves when the active row changes. Below 1024px the
// one-liner column goes and the active row opens its one-liner under it instead, like an accordion.
// Entrance (reveal.jsx): the heading as in the other sections, then each step rises in with the scroll.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Braces, ChartColumn, Database, Languages, Layers, LayoutTemplate, MessageCircleQuestion, MousePointer2,
  MousePointerClick, Palette, Plug, Quote, Share2, ShieldCheck, TextSearch, UserRound, UsersRound, Video, WandSparkles,
} from 'lucide-react';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const GROUPS = [
  { label: 'Design the study', items: [
    { icon: WandSparkles, title: 'Study design agent', text: 'Give it a goal. Get a ready study, questions and interview guide.' },
    { icon: LayoutTemplate, title: '11 interview templates', text: 'Proven starting points for churn, discovery, abandoned cart, post-purchase, feature launches and more. More released every week.' },
    { icon: Database, title: 'Personalized by your data', text: 'Pull context from your CRM, analytics, store or email tool so every question fits the person answering.' },
  ] },
  { label: 'Run the interviews', items: [
    { icon: Video, title: 'Voice and video interviews', text: 'Real, moderated conversations, hundreds running at the same time.' },
    { icon: UserRound, title: 'Interviewer avatars', text: 'Choose the face and voice your customers will talk to, from a custom library.' },
    { icon: ShieldCheck, title: 'Dual-agent moderation', text: 'One agent asks the questions. A second watches every exchange and keeps it sharp.' },
    { icon: MessageCircleQuestion, title: 'Adaptive probing', text: 'Every answer gets a follow-up, until Frank reaches the why a form never will.' },
    { icon: Languages, title: '30+ languages', text: 'Customers speak their language. You read the results in yours.' },
    { icon: MousePointerClick, title: 'Flexible triggers', text: 'Share a link, or embed inline, as a pop-up or as a floating bubble.' },
    { icon: Palette, title: 'Your brand, not ours', text: 'Style the widget so it looks like it was always part of your site.' },
    { icon: UsersRound, title: 'Managed panel', text: 'No customers yet? Interview your target market from our panel.' },
  ] },
  { label: 'Understand the why', items: [
    { icon: ChartColumn, title: 'Open answers, hard numbers', text: 'People talk freely. You still get data you can chart and compare.' },
    { icon: Layers, title: 'Automatic theme analysis', text: 'Themes, patterns and sentiment, clustered across every response.' },
    { icon: Quote, title: 'Quote-level traceability', text: 'Every theme links to the exact words behind it. No black box.' },
    { icon: MousePointer2, title: 'Click-through insights', text: 'Go from a headline theme to the moment a customer said it, in one click.' },
    { icon: TextSearch, title: 'Ask across studies', text: 'Question every study you’ve ever run in plain language, with quality-scored answers.' },
  ] },
  { label: 'Take it anywhere', items: [
    { icon: Share2, title: 'Interview sharing', text: 'Send a private link to one moment or a whole analysis.' },
    { icon: Braces, title: 'Export and API', text: 'CSV, transcripts and reports, plus a full REST API.' },
    { icon: Plug, title: 'Works with any AI, via MCP', text: 'Run studies from Claude, ChatGPT, Cursor, Dot, Instinct or any MCP client, in plain words.' },
  ] },
];

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';
const hoverable = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

function Step({ g, n }) {
  const [active, setActive] = useState(0);
  const pick = i => () => setActive(i);
  // From 1024px the one-liner glides down to sit level with its row (kept inside the list's height).
  const list = useRef(null), side = useRef(null);
  const [y, setY] = useState(0);
  const place = () => {
    const ul = list.current, d = side.current;
    if (!ul || !d || !d.offsetHeight) { setY(0); return; }
    setY(Math.max(0, Math.min(ul.children[active].offsetTop, ul.offsetHeight - d.offsetHeight)));
  };
  useLayoutEffect(place, [active]);
  useEffect(() => { window.addEventListener('resize', place); return () => window.removeEventListener('resize', place); });
  return (
    <div className="grid gap-6 py-10 sm:py-12 lg:grid-cols-[220px_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
      <div>
        <p className="m-0 font-gmono text-[12px] tabular-nums text-ink-3">0{n}</p>
        <h3 className="m-0 mt-2 font-sans text-[16px] font-medium text-ink">{g.label}</h3>
        <p className="m-0 mt-1 font-sans text-[14px] text-ink-3">{g.items.length} features</p>
      </div>

      {/* The titles, one a row. Below 1024px the active row opens its one-liner under it. */}
      <ul ref={list} aria-label={g.label} className="relative m-0 list-none p-0">
        {g.items.map((f, i) => {
          const on = i === active;
          return (
            <li key={f.title} className="border-0 border-b border-solid border-[#1a1714]/[0.06]">
              <button type="button" aria-expanded={on} aria-controls={`ftx-${n}-${i}`}
                onMouseEnter={() => hoverable() && setActive(i)} onFocus={pick(i)} onClick={pick(i)}
                className="group flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714] sm:py-4">
                {/* The feature's icon, beside its title: a quiet tile that turns lime on the active row. */}
                <span aria-hidden="true" className={'grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors duration-300 sm:size-10 ' + EASE + ' '
                  + (on ? 'bg-[#d1f899] text-ink' : 'bg-[#1a1714]/[0.04] text-[#1a1714]/40 group-hover:text-[#1a1714]/70')}>
                  <f.icon className="size-[18px]" strokeWidth={1.5} />
                </span>
                <span className={'hiw-step-title min-w-0 flex-1 text-[21px] leading-[1.2] transition-colors duration-300 sm:text-[26px] ' + EASE + ' '
                  + (on ? 'text-ink' : 'text-[#1a1714]/[0.32] group-hover:text-[#1a1714]/60')}>{f.title}</span>
                <span aria-hidden="true" className={'hidden shrink-0 text-ink-3 transition-[opacity,transform] duration-300 lg:block ' + EASE + ' '
                  + (on ? 'opacity-100 [transform:none]' : 'opacity-0 [transform:translateX(-6px)]')}>
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </span>
              </button>
              <div id={`ftx-${n}-${i}`} className={'grid transition-[grid-template-rows,opacity] duration-500 lg:hidden ' + EASE + ' ' + (on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <p className="m-0 min-h-0 overflow-hidden">
                  <span className="block max-w-[52ch] pb-4 pl-[52px] font-sans text-[16px] leading-[1.55] text-ink-2 sm:pl-14">{f.text}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* From 1024px: the active feature's one-liner beside the list, level with its row. All of them
          share one cell, so the column keeps its height. */}
      <div ref={side} aria-live="polite" className={'hidden self-start transition-transform duration-500 motion-reduce:transition-none lg:grid lg:pt-[22px] ' + EASE}
        style={{ transform: `translateY(${y}px)` }}>
        {g.items.map((f, i) => (
          <div key={f.title} aria-hidden={i !== active}
            className={'transition-[opacity,transform] duration-500 [grid-area:1/1] ' + EASE + ' '
              + (i === active ? 'opacity-100 [transform:none]' : 'pointer-events-none opacity-0 [transform:translateY(8px)]')}>
            <p className="m-0 max-w-[40ch] font-sans text-[18px] leading-[1.55] text-ink-2">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="ft-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[860px] text-center">
          <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">Features</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ft-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['A full research team,', 'running on agents.']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className="mx-auto mb-0 mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink-2 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
            Every job a researcher would do, from writing the guide to presenting the findings, handled end to end. Steer it from Frank or straight from your AI agent.
          </ScrubText>
        </div>

        <div className="mt-[clamp(40px,6vw,80px)]">
          {GROUPS.map((g, i) => (
            <ScrubText key={g.label} reduce={reduce} as="div"><Step g={g} n={i + 1} /></ScrubText>
          ))}
        </div>
      </div>
    </section>
  );
}
