// CompetitorPage (V21.04): a "Frank vs X" page, the template for hifrank.ai/competitors/<x>, drawn from one data
// file per competitor (competitors/<x>.js holds the live page's words). Layout, on the home page's container
// (CLAUDE.md, "Frank landing pages: page container"):
//   1. Hero: the forest-green panel of the product pages, split: label, title (its last words in the Lora
//      italic), the intro and "Try Frank free" (lime) on the left; on the right two tilted cards, the other tool's
//      behind in dark green and Frank's in front in cream, with "vs" where they overlap.
//   2. What is Frank?: title left, the two paragraphs right.
//   3. Feature comparison: a table with Frank's column tinted lime; ticks in circles, words where the live
//      page has words.
//   4. Why the differences matter: the title and intro centred, then the points as cards (three, then two).
//   5. Traditional research vs Frank: "Choose Frank if…" as a forest-green card beside "Choose X if…".
//   6. Other comparisons: logo-pair cards opening the other live "Frank vs" pages.
//   7. FAQ (the site's FAQ), then the closing lime panel with the live page's closing words.
// Entrance: the hero rises in on load; the rest rises in with the scroll.
import { useEffect, useState } from 'react';
import { ArrowRight, Check, Layers, ListChecks, MessageCircle, Users, Zap } from 'lucide-react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import FAQ from './FAQ';
import Footer from './Footer';
import OTHERS from './competitors/others';

const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';
const H2 = 'm-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE;
const ICONS = { users: Users, moments: MessageCircle, actions: ListChecks, compounds: Layers, fast: Zap };

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// A pill button with its arrow in its own circle. tone: 'ink' | 'white' | 'lime' (Frank's green, for dark panels; its
// arrow circle a soft shade of the pill, as on the AI voice page: CLAUDE.md, "buttons on dark green").
const PillButton = ({ href, tone = 'ink', children }) => (
  <a href={href}
    className={'group inline-flex h-12 items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 font-sans text-[15px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 '
      + (tone === 'lime' ? 'bg-[#d1f899] text-ink hover:bg-[#c4ef84] focus-visible:outline-[#d1f899]' : tone === 'white' ? 'bg-white text-ink hover:bg-[#f6f5f1] focus-visible:outline-white' : 'bg-[#1a1714] text-white hover:bg-[#2a2622] focus-visible:outline-ink')}>
    {children}
    <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:group-hover:translate-x-0.5 ' + (tone === 'lime' ? 'bg-[#1a1714]/[0.07]' : tone === 'white' ? 'bg-[#1a1714]/[0.06]' : 'bg-white/[0.12]')}>
      <ArrowRight className="size-4" strokeWidth={1.75} />
    </span>
  </a>
);

// Frank's wordmark and the other tool's logo, each in a pill, "vs" between. size: 'lg' (hero) | 'sm' (cards).
function Pair({ logo, logoH, size = 'sm' }) {
  const lg = size === 'lg';
  const pill = 'inline-flex items-center rounded-full ' + (lg ? 'h-[clamp(56px,6vw,76px)] px-[clamp(20px,2.4vw,32px)]' : 'h-12 px-5');
  return (
    <span aria-hidden="true" className={'flex items-center ' + (lg ? 'gap-4' : 'gap-3')}>
      <span className={pill + ' bg-[#d1f899]'}><img src="/frank-logo.png" alt="" className={'block w-auto ' + (lg ? 'h-[clamp(22px,2.4vw,30px)]' : 'h-[20px]')} /></span>
      <span className={'font-serif italic text-ink-3 ' + (lg ? 'text-[clamp(22px,2.4vw,30px)]' : 'text-[19px]')}>vs</span>
      <span className={pill + ' bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)]'}>
        <img src={logo} alt="" className="block w-auto object-contain" style={{ height: lg ? `clamp(${Math.round(logoH * 0.9)}px, 2.2vw, ${Math.round(logoH * 1.35)}px)` : logoH }} />
      </span>
    </span>
  );
}

// The hero's card stack (the case studies hero's language, with a gentler tilt and a tighter overlap): behind,
// tilted right, the other tool's card in dark green (its logo on a white pill, then its line from "Choose X if…";
// no best fit for the other brand); in front, tilted
// left, Frank's card in cream (the lime logo pill, Frank's line in the large Lora italic, Frank's best fit); a round
// "vs" badge where they overlap. Each card is a thin translucent frame around the card itself. They rise in and
// settle into their tilt on a spring, and lift a little on hover; reduced motion: they simply appear. Below
// 1024px: no tilt or overlap, the two cards stacked with "vs" between.
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 };
const LIFT = 'transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5';
const Shell = ({ className = '', children }) => (
  <div className={'rounded-[30px] bg-white/[0.07] p-1.5 ring-1 ring-inset ring-white/[0.12] ' + className}>{children}</div>
);
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function Stack({ c, reduce }) {
  const wide = useWide();
  const fit = c.table.find(r => r[0] === 'Best fit') || [null, '', ''];
  const card = (delay, rotate) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28, rotate: 0 },
    animate: { opacity: 1, y: 0, rotate: wide ? rotate : 0 },
    transition: reduce ? { duration: 0.4, delay } : { ...SPRING, delay },
  });
  return (
    <div className="relative mx-auto flex w-full max-w-[540px] flex-col items-center gap-3 lg:mr-0 lg:block lg:pb-8 lg:pt-4">
      {/* Behind: the other tool. */}
      <motion.div {...card(0.42, 2)} className="w-full lg:absolute lg:-right-2 lg:top-0 lg:w-[80%]" style={{ transformOrigin: '70% 100%' }}>
        <Shell className={LIFT}>
          <div className="flex flex-col gap-3.5 rounded-[24px] bg-[#13382f] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:h-[196px]">
            <span className="inline-flex h-11 items-center self-start rounded-full bg-white px-4">
              <span className="sr-only">{c.name}</span>
              <img src={c.logo} alt="" className="block w-auto object-contain" style={{ height: Math.round(c.logoH * 0.85) }} />
            </span>
            <span className={FIG + ' max-w-[26ch] text-[19px] leading-[1.3] tracking-[-0.02em] text-white'}>{c.choose.them.lead}</span>
          </div>
        </Shell>
      </motion.div>

      {/* Where they overlap: vs. */}
      <motion.span {...card(0.5, 0)} aria-hidden="true"
        className="z-[2] grid size-12 place-items-center rounded-full bg-white font-serif text-[19px] italic text-ink-3 shadow-[0_0_0_1px_rgba(26,23,20,0.08),0_10px_24px_-12px_rgba(0,0,0,0.45)] lg:absolute lg:left-[58%] lg:top-[132px]">
        vs
      </motion.span>

      {/* In front: Frank. */}
      <motion.figure {...card(0.32, -1)} className="relative z-[1] m-0 w-full lg:mt-[140px] lg:w-[88%]" style={{ transformOrigin: '30% 0%' }}>
        <Shell className={LIFT}>
          <div className="rounded-[24px] bg-[#fffdf3] px-7 pb-7 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:px-8 sm:pb-8 sm:pt-7">
            <span className="inline-flex h-11 items-center rounded-full bg-[#d1f899] px-5">
              <span className="sr-only">Frank</span>
              <img src="/frank-logo.png" alt="" className="block h-[21px] w-auto" />
            </span>
            <p className="m-0 mt-5 font-serif text-[clamp(22px,2.1vw,28px)] italic leading-[1.3] tracking-[-0.01em] text-ink [text-wrap:pretty]">{c.choose.frank.lead}</p>
            <p className="m-0 mt-5 font-sans text-[13.5px] text-ink-3">Best fit: {fit[1]}</p>
          </div>
        </Shell>
      </motion.figure>
    </div>
  );
}

// ——— 1. Hero.
function Hero({ c, reduce }) {
  return (
    <section aria-labelledby="vs-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-[clamp(48px,6vw,88px)] sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className="relative mx-auto grid max-w-[1232px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 !text-white/85 sm:mb-8">How Frank compares</Eyebrow></Rise>
            <Rise as="h1" reduce={reduce} delay={0.06} id="vs-title" className={'m-0 pb-1 text-[clamp(32px,4vw,52px)] leading-[1.08] text-white [text-wrap:balance] ' + TITLE}>
              {c.hero.title[0]} <span className="italic">{c.hero.title[1]}</span>
            </Rise>
            <Rise as="p" reduce={reduce} delay={0.14} className="m-0 mt-5 max-w-[50ch] font-sans text-[17px] leading-[1.6] text-white/70 sm:mt-6">
              {c.hero.body}
            </Rise>
            <Rise reduce={reduce} delay={0.22} className="mt-9"><PillButton href={SIGNUP} tone="lime">Try Frank free</PillButton></Rise>
          </div>
          <Stack c={c} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}

// ——— 2. What is Frank?
function WhatIs({ c, reduce }) {
  return (
    <section aria-labelledby="vs-what-title" className={'pt-[clamp(96px,11vw,160px)] ' + PAD}>
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
        <ScrubTitle reduce={reduce} id="vs-what-title" className={H2} lines={['What is', <MarkedPhrase key="f" reduce={reduce}>Frank?</MarkedPhrase>]} />
        <div className="flex flex-col gap-5 lg:pt-3">
          {c.whatIs.map((t, i) => (
            <ScrubText as="p" key={t} reduce={reduce} lag={i * 0.08} className="m-0 max-w-[60ch] font-sans text-[18px] leading-[1.6] text-ink-2 sm:text-[19px]">{t}</ScrubText>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 3. Feature comparison.
const Tick = ({ frank }) => (
  <span className={'grid size-7 place-items-center rounded-full ' + (frank ? 'bg-[#d1f899] text-ink' : 'bg-[#1a1714]/[0.06] text-ink-2')}>
    <Check className="size-[15px]" strokeWidth={2.25} />
  </span>
);
const Cell = ({ v, frank }) => (v === true
  ? <><span className="sr-only">Yes</span><Tick frank={frank} /></>
  : <span className={'font-sans text-[14px] leading-snug ' + (frank ? 'font-medium text-ink' : 'text-ink-2')}>{v}</span>);

function Table({ c, reduce }) {
  const GRID = 'grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]';
  return (
    <section aria-labelledby="vs-table-title" className={'pt-[clamp(112px,13vw,200px)] ' + PAD}>
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">Feature comparison</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="vs-table-title" className={H2 + ' scroll-mt-[150px]'} lines={['How Frank compares', `to ${c.name}.`]} />
        </div>
        <ScrubText reduce={reduce} lag={0.1} className="mx-auto mt-12 max-w-[1000px] sm:mt-14">
          <div role="table" aria-label={'Frank and ' + c.name + ' compared'} className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
            {/* Frank's column, tinted the full height of the table. */}
            <div aria-hidden="true" className={GRID + ' pointer-events-none absolute inset-0'}>
              <span /><span className="bg-[#f4fde6]" /><span />
            </div>
            <div role="row" className={GRID + ' relative items-center border-0 border-b border-solid border-[#1a1714]/[0.08]'}>
              <span role="columnheader" className="px-4 py-5 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-ink-3 sm:px-7">Capability</span>
              <span role="columnheader" className="flex justify-center px-2 py-5">
                <span className="sr-only">Frank</span>
                <img src="/frank-logo.png" alt="" className="block h-[18px] w-auto sm:h-[22px]" />
              </span>
              <span role="columnheader" className="flex min-w-0 justify-center px-2 py-5">
                <span className="sr-only">{c.name}</span>
                <img src={c.logo} alt="" className="block w-auto max-w-[min(110px,100%)] object-contain" style={{ height: c.logoH * 0.85 }} />
              </span>
            </div>
            {c.table.map(([cap, frank, them], i) => (
              <div role="row" key={cap} className={GRID + ' relative items-center ' + (i ? 'border-0 border-t border-solid border-[#1a1714]/[0.06]' : '')}>
                <span role="rowheader" className="px-4 py-4 font-sans text-[14.5px] leading-snug text-ink sm:px-7 sm:text-[15px]">{cap}</span>
                <span role="cell" className="flex justify-center px-2 py-4 text-center"><Cell v={frank} frank /></span>
                <span role="cell" className="flex justify-center px-2 py-4 text-center"><Cell v={them} /></span>
              </div>
            ))}
          </div>
        </ScrubText>
      </div>
    </section>
  );
}

// ——— 4. Why the differences matter.
function Why({ c, reduce }) {
  return (
    <section aria-labelledby="vs-why-title" className={'pt-[clamp(112px,13vw,200px)] ' + PAD}>
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[820px] text-center">
          <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">Why the differences matter</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="vs-why-title" className={H2} lines={c.why.title} />
          {c.why.intro.map((t, i) => (
            <ScrubText as="p" key={t} reduce={reduce} lag={0.1 + i * 0.06} className={'mx-auto mb-0 max-w-[60ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>{t}</ScrubText>
          ))}
        </div>
        <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:mt-14 md:grid-cols-6 lg:gap-5">
          {c.why.points.map(([icon, title, text], i) => {
            const Icon = ICONS[icon];
            return (
              <ScrubText as="li" key={title} reduce={reduce} lag={(i % 3) * 0.05}
                className={'flex flex-col rounded-[24px] bg-[#fffdf3] p-7 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-8 ' + (c.why.points.length === 5 && i < 3 || c.why.points.length === 3 ? 'md:col-span-2' : 'md:col-span-3')}>
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]">
                  <Icon className="size-[19px]" strokeWidth={1.5} />
                </span>
                <h3 className={FIG + ' m-0 mt-6 text-[20px] leading-[1.25] tracking-[-0.02em] text-ink'}>{title}</h3>
                <p className="m-0 mt-2.5 font-sans text-[15px] leading-[1.6] text-ink-2">{text}</p>
              </ScrubText>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ——— 5. Traditional research vs Frank.
function Choose({ c, reduce }) {
  const List = ({ items, frank }) => (
    <ul className="m-0 mt-7 flex list-none flex-col gap-3.5 p-0">
      {items.map(t => (
        <li key={t} className="flex items-start gap-3 font-sans text-[15.5px] leading-[1.5]">
          <span aria-hidden="true" className={'mt-[1px] grid size-6 shrink-0 place-items-center rounded-full ' + (frank ? 'bg-[#d1f899] text-ink' : 'bg-[#1a1714]/[0.06] text-ink-2')}>
            <Check className="size-[13px]" strokeWidth={2.25} />
          </span>
          <span className={frank ? 'text-white/85' : 'text-ink-2'}>{t}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-labelledby="vs-choose-title" className={'pt-[clamp(112px,13vw,200px)] ' + PAD}>
      <div className="mx-auto max-w-[1312px]">
        <ScrubTitle reduce={reduce} id="vs-choose-title" className={H2 + ' mx-auto max-w-[760px] text-center'}
          lines={['Traditional research vs', 'Frank AI Interviewer.']} />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-5">
          <ScrubText reduce={reduce} className="relative overflow-hidden rounded-[28px] bg-[#0f2e27] p-8 text-white sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
            <div className="relative">
              <h3 className={FIG + ' m-0 text-[26px] leading-[1.2] tracking-[-0.02em] text-white'}>Choose Frank if…</h3>
              <p className="m-0 mt-2 font-sans text-[16px] text-[#d1f899]">{c.choose.frank.lead}</p>
              <List items={c.choose.frank.items} frank />
            </div>
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.08} className="rounded-[28px] bg-[#fffdf3] p-8 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-10">
            <h3 className={FIG + ' m-0 text-[26px] leading-[1.2] tracking-[-0.02em] text-ink'}>Choose {c.name} if…</h3>
            <p className="m-0 mt-2 font-sans text-[16px] text-ink-3">{c.choose.them.lead}</p>
            <List items={c.choose.them.items} />
          </ScrubText>
        </div>
      </div>
    </section>
  );
}

// ——— 6. Other comparisons.
function Others({ c, reduce }) {
  return (
    <section aria-labelledby="vs-others-title" className={'pt-[clamp(112px,13vw,200px)] ' + PAD}>
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">Exploring alternatives?</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="vs-others-title" className={H2} lines={['See how Frank compares', 'to other tools.']} />
        </div>
        <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:mt-14 md:grid-cols-3 lg:gap-6">
          {c.others.map((k, i) => {
            const o = OTHERS[k];
            return (
              <ScrubText as="li" key={k} reduce={reduce} lag={i * 0.05}>
                <a href={o.href}
                  className={'group flex h-full flex-col rounded-[28px] bg-[#fffdf3] p-1.5 text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05),0_28px_48px_-32px_rgba(42,50,30,0.45)] ' + FOCUS}>
                  <span className="grid aspect-[16/7] place-items-center"><Pair logo={o.logo} logoH={o.h} /></span>
                  <span className="flex flex-1 items-end justify-between gap-4 rounded-[22px] bg-white px-6 pb-5 pt-5 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_10px_24px_-18px_rgba(42,50,30,0.3)]">
                    <span>
                      <span className={FIG + ' block text-[20px] leading-[1.2] tracking-[-0.02em] text-ink'}>Frank vs {o.name}</span>
                      <span className="mt-2 block font-sans text-[14.5px] leading-[1.5] text-ink-2">{o.line}</span>
                    </span>
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1a1714]/[0.05] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-[#d1f899] motion-safe:group-hover:translate-x-0.5">
                      <ArrowRight className="size-4" strokeWidth={1.75} />
                    </span>
                  </span>
                </a>
              </ScrubText>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ——— 7. Closing: the live page's closing words on the lime panel.
function Closing({ c, reduce }) {
  return (
    <section aria-labelledby="vs-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="vs-cta-title" className={H2} lines={c.close.title} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[42ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
          {c.close.sub}
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9 flex flex-col items-center gap-3">
          <PillButton href={SIGNUP}>{c.close.cta}</PillButton>
          <span className="font-sans text-[13.5px] text-ink/65">Claim 225 signup credits. No credit card required.</span>
        </ScrubText>
      </div>
    </section>
  );
}

export default function CompetitorPage({ c }) {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Resources"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero c={c} reduce={reduce} />
          <WhatIs c={c} reduce={reduce} />
          <Table c={c} reduce={reduce} />
          <Why c={c} reduce={reduce} />
          <Choose c={c} reduce={reduce} />
          <Others c={c} reduce={reduce} />
          <div className="pt-[clamp(112px,13vw,200px)]">
            <FAQ items={c.faq} label="FAQ" lines={['Have questions?', 'We have answers.']} id="vs-faq-title" />
          </div>
          <Closing c={c} reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
