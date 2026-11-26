// RoleHero (V21.04): the hero of the Roles pages, in the features/benefits hero panel (forest green, grain and glow). The copy sits on the
// left; on the right a person (cut out, cropped at the waist and faded into the panel) with a few dark glass cards floating around them.
// From 1024px two columns, below it the copy then the person, centred. The cards drift slowly and hold still with reduced motion.
// `heroCards` kinds: count (a number), quote (an answer and Frank's follow-up), ring (a rate), theme (an insight), phrases (customer words).
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import Glasses from '../v3/Glasses';
import daniel from './portraits/daniel.jpg';
import maya from './portraits/maya.jpg';
import priya from './portraits/priya.jpg';
import tomas from './portraits/tomas.jpg';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { FOCUS, Rise } from './product-updates/parts';

const FIG = "font-['Figtree',sans-serif]";
const CARD = 'rounded-[18px] bg-[#143a32]/80 text-left text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.14] backdrop-blur-md';
const CAP = 'm-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-white/55';

function Drift({ reduce, dy = 6, dur = 5, delay = 0, className = '', children }) {
  return (
    <div className={'absolute ' + className}>
      <motion.div animate={reduce ? undefined : { y: [0, -dy, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}>{children}</motion.div>
    </div>
  );
}

// People who have answered, fading out to the right, then a "+" for the rest.
const FACES = [[daniel, 'Daniel', 1], [maya, 'Maya', 0.8], [priya, 'Priya', 0.55], [tomas, 'Tomas', 0.3]];
const Count = ({ d }) => (
  <div className={CARD + ' w-[184px] p-3.5'}>
    <p className={CAP}>{d.label}</p>
    <p className={FIG + ' m-0 mt-1 text-[28px] font-medium leading-none tracking-[-0.03em]'}>{d.value}</p>
    <div className="mt-3 flex items-center" aria-hidden="true">
      {FACES.map(([src, name, o]) => <img key={name} src={src.src || src} alt="" draggable={false} className="-ml-2 size-7 rounded-full object-cover ring-2 ring-[#143a32] first:ml-0" style={{ opacity: o }} />)}
      <span className="-ml-2 grid size-7 place-items-center rounded-full bg-white/10 font-sans text-[14px] leading-none text-white/60 ring-2 ring-[#143a32]" style={{ opacity: 0.45 }}>+</span>
    </div>
  </div>
);
const Quote = ({ d }) => (
  <div className={CARD + ' w-[216px] p-3.5'}>
    <p className="m-0 font-sans text-[13.5px] leading-[1.4] text-white">“{d.answer}”</p>
    <div className="mt-2.5 flex items-start gap-2.5 rounded-[12px] bg-white/[0.08] p-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d1f899] p-1"><Glasses pose="Curious" className="block h-auto w-full" /></span>
      <p className="m-0 font-sans text-[12.5px] leading-[1.35] text-white/85">{d.followUp}</p>
    </div>
  </div>
);
const Ring = ({ d }) => (
  <div className={CARD + ' flex w-[164px] items-center gap-3 p-3.5'}>
    <svg aria-hidden="true" viewBox="0 0 44 44" className="size-11 shrink-0 -rotate-90"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="5" /><circle cx="22" cy="22" r="18" fill="none" stroke="#d1f899" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${d.pct * 1.131} 113.1`} /></svg>
    <div><p className={FIG + ' m-0 text-[20px] font-medium leading-none tracking-[-0.02em]'}>{d.value}</p><p className="m-0 mt-1 font-sans text-[12px] leading-[1.25] text-white/65">{d.label}</p></div>
  </div>
);
const Theme = ({ d }) => (
  <div className={CARD + ' w-[200px] p-3.5'}>
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d1f899] px-2.5 py-1 font-sans text-[11.5px] font-medium text-[#2a321e]"><Check className="size-3.5" strokeWidth={2.4} />{d.tag}</span>
    <p className={FIG + ' m-0 mt-2.5 text-[15.5px] font-medium leading-[1.25] tracking-[-0.01em]'}>{d.title}</p>
    <p className="m-0 mt-1 font-sans text-[12.5px] text-white/65">{d.note}</p>
  </div>
);
const Phrases = ({ d }) => (
  <div className={CARD + ' w-[196px] p-3.5'}>
    <p className={CAP}>{d.label}</p>
    <div className="mt-2.5 flex flex-wrap gap-1.5">{d.items.map(t => <span key={t} className="rounded-full bg-[#d1f899]/15 px-2.5 py-1 font-sans text-[12.5px] text-[#d1f899]">{t}</span>)}</div>
  </div>
);
const KIND = { phrases: Phrases, count: Count, quote: Quote, ring: Ring, theme: Theme };

// Where each card sits around the person (the stage is 440px wide on phones, up to 520px from 1024px). The first three show on
// desktop, the first two on phones, smaller and at the edges so the face stays clear.
const SPOTS = [
  'left-0 top-[34%] max-sm:origin-top-left max-sm:scale-[0.7] sm:top-[44%] lg:left-0',
  'right-0 top-[58%] max-sm:origin-top-right max-sm:scale-[0.7] sm:top-[16%] lg:-right-12',
  'hidden lg:block lg:right-0 lg:top-[62%]',
];

export default function RoleHero({ d, person }) {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="rl-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 pt-14 sm:px-10 md:rounded-[44px] lg:pt-0">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(40% 60% at 74% 50%, rgba(209,248,153,0.16), rgba(209,248,153,0) 70%)' }} />
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          <div className="relative text-center lg:py-[clamp(72px,7vw,112px)] lg:text-left">
            <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8 lg:!justify-start">{d.label}</Eyebrow></Rise>
            <Rise as="h1" reduce={reduce} delay={0.06} id="rl-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
              {d.hero.map(l => <span key={l} className="block">{l}</span>)}
            </Rise>
            <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[50ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px] lg:mx-0">{d.heroP}</Rise>
            <Rise reduce={reduce} delay={0.22} className="mt-9 flex justify-center lg:justify-start">
              <a href="https://app.hifrank.ai/signup" className={'inline-flex h-12 items-center rounded-full bg-[#d1f899] px-6 font-sans text-[15.5px] font-medium text-ink no-underline transition-[background-color] duration-300 hover:bg-[#c4ef84] ' + FOCUS}>Run 10 Free Interviews</a>
            </Rise>
          </div>
          {/* The person, cut at the waist and faded into the panel; cards float around them */}
          <Rise reduce={reduce} delay={0.2} className="relative mx-auto h-[330px] w-full max-w-[440px] sm:h-[430px] lg:h-[610px] lg:max-w-[560px] lg:self-end">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_66%,transparent)]">
              <img src={person} alt="" draggable={false} className={'absolute left-1/2 top-[2%] h-auto max-w-none -translate-x-1/2 select-none ' + (d.heroFlip ? '-scale-x-100 w-[130%] sm:w-[118%] lg:w-[150%]' : 'w-[108%] sm:w-[100%] lg:w-full')} />
            </div>
            {d.heroCards.map((c, i) => {
              const C = KIND[c.kind];
              return SPOTS[i] ? <Drift key={c.kind + i} reduce={reduce} dy={5 + (i % 2) * 2} dur={4.4 + i * 0.6} delay={i * 0.35} className={SPOTS[i]}><C d={c} /></Drift> : null;
            })}
          </Rise>
        </div>
      </div>
    </section>
  );
}
