// RoleHero (V21.04): the hero of the Roles pages. Centred copy, then a person (cut out, standing on white) with a few plain HTML cards
// floating around them, in the site's colours. The cards drift slowly and hold still with reduced motion. `cards` are named blocks:
//   count (interviews overnight), quote (a user's answer with Frank's follow-up), ring (a rate), theme (an insight).
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow } from './titles';
import { FOCUS, Rise } from './product-updates/parts';

const FIG = "font-['Figtree',sans-serif]";
const CARD = 'rounded-[18px] bg-white text-left shadow-[0_18px_40px_-18px_rgba(26,23,20,0.4)] ring-1 ring-[#1a1714]/[0.07]';

function Drift({ reduce, dy = 6, dur = 5, delay = 0, className = '', children }) {
  return (
    <div className={'absolute ' + className}>
      <motion.div animate={reduce ? undefined : { y: [0, -dy, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}>{children}</motion.div>
    </div>
  );
}

const Count = ({ d }) => (
  <div className={CARD + ' w-[196px] p-4'}>
    <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">{d.label}</p>
    <p className={FIG + ' m-0 mt-1 text-[30px] font-medium leading-none tracking-[-0.03em] text-ink'}>{d.value}</p>
    <div className="mt-3 flex items-center">
      {['#d1f899', '#0f2e27', '#f1ead2', '#9bc653'].map((c, i) => <span key={i} className="-ml-1.5 size-6 rounded-full ring-2 ring-white first:ml-0" style={{ background: c }} />)}
      <span className="ml-2 font-sans text-[12px] text-ink-2">{d.note}</span>
    </div>
  </div>
);
const Quote = ({ d }) => (
  <div className={CARD + ' w-[236px] p-4'}>
    <p className="m-0 font-sans text-[14px] leading-[1.4] text-ink">“{d.answer}”</p>
    <div className="mt-3 flex items-start gap-2.5 rounded-[12px] bg-[#0f2e27] p-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d1f899] p-1"><Glasses pose="Curious" className="block h-auto w-full" /></span>
      <p className="m-0 font-sans text-[12.5px] leading-[1.35] text-white">{d.followUp}</p>
    </div>
  </div>
);
const Ring = ({ d }) => (
  <div className={CARD + ' flex w-[168px] items-center gap-3 p-3.5'}>
    <svg aria-hidden="true" viewBox="0 0 44 44" className="size-11 shrink-0 -rotate-90"><circle cx="22" cy="22" r="18" fill="none" stroke="#eef6df" strokeWidth="5" /><circle cx="22" cy="22" r="18" fill="none" stroke="#5f8f22" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${d.pct * 1.131} 113.1`} /></svg>
    <div><p className={FIG + ' m-0 text-[20px] font-medium leading-none tracking-[-0.02em] text-ink'}>{d.value}</p><p className="m-0 mt-1 font-sans text-[12px] leading-[1.25] text-ink-2">{d.label}</p></div>
  </div>
);
const Theme = ({ d }) => (
  <div className={CARD + ' w-[214px] p-4'}>
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d1f899] px-2.5 py-1 font-sans text-[11.5px] font-medium text-[#2a321e]"><Check className="size-3.5" strokeWidth={2.4} />{d.tag}</span>
    <p className={FIG + ' m-0 mt-2.5 text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-ink'}>{d.title}</p>
    <p className="m-0 mt-1 font-sans text-[12.5px] text-ink-2">{d.note}</p>
  </div>
);
const KIND = { count: Count, quote: Quote, ring: Ring, theme: Theme };

// Where each card sits, around a 360px-wide person in a 760px stage (desktop); on phones only the first two show, smaller and low at the edges so the face stays clear.
const SPOTS = [
  'left-0 top-[46%] max-sm:origin-top-left max-sm:scale-[0.66] sm:left-[2%] sm:top-[10%]',
  'right-0 top-[68%] max-sm:origin-top-right max-sm:scale-[0.66] sm:right-0 sm:top-[8%]',
  'hidden sm:block sm:left-[8%] sm:top-[62%]',
  'hidden sm:block sm:right-[4%] sm:top-[58%]',
];

export default function RoleHero({ d, person }) {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="rl-title" className="relative overflow-hidden px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className="mx-auto max-w-[1200px] pt-[clamp(40px,5vw,72px)] text-center">
        <Rise reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">{d.label}</Eyebrow></Rise>
        <Rise as="h1" reduce={reduce} delay={0.06} id="rl-title" className={'m-0 pb-1 leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}>
          {d.hero.map(l => <span key={l} className="block">{l}</span>)}
        </Rise>
        <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[52ch] font-sans text-[16.5px] leading-[1.6] text-ink-2 sm:text-[17px]">{d.heroP}</Rise>
        <Rise reduce={reduce} delay={0.22} className="mt-9 flex justify-center">
          <a href="https://app.hifrank.ai/signup" className={'inline-flex h-12 items-center rounded-full bg-[#d1f899] px-6 font-sans text-[15.5px] font-medium text-ink no-underline transition-[background-color] duration-300 hover:bg-[#c4ef84] ' + FOCUS}>Run 10 Free Interviews</a>
        </Rise>
        <Rise reduce={reduce} delay={0.3} className="relative mx-auto mt-[clamp(32px,4vw,56px)] h-[460px] max-w-[760px] sm:h-[520px]">
          {/* a soft lime disc behind, and a shadow where they stand */}
          <div aria-hidden="true" className="absolute left-1/2 top-[14%] size-[300px] -translate-x-1/2 rounded-full sm:size-[360px]" style={{ background: 'radial-gradient(closest-side, rgba(209,248,153,0.7), rgba(209,248,153,0.25) 70%, rgba(209,248,153,0) 100%)' }} />
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-5 w-[200px] -translate-x-1/2 rounded-[50%] bg-[#1a1714]/[0.12] blur-[10px]" />
          <img src={person} alt="" width="900" height="1350" draggable={false} className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain" />
          {d.heroCards.map((c, i) => {
            const C = KIND[c.kind];
            return <Drift key={c.kind} reduce={reduce} dy={5 + (i % 2) * 2} dur={4.4 + i * 0.6} delay={i * 0.35} className={SPOTS[i]}><C d={c} /></Drift>;
          })}
        </Rise>
      </div>
    </section>
  );
}
