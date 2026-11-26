// RoleStack (V21.04): "How Frank works" on the Roles pages (and "What You’ll Learn" on the live-copied use-case pages; a card's `name` is optional): the title centred on top, the steps as compact centred cards below it, one below
// the other. The cards fade up from below one after another (staggered) as the list comes into view (once); with reduced motion they simply show.
import { motion } from 'framer-motion';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const EASE = [0.23, 1, 0.32, 1];

const LIST = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } } };
const ITEM = { hidden: { opacity: 0, y: 64 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } };

function Card({ step }) {
  return (
    <motion.li variants={ITEM} className="flex flex-col items-center rounded-[22px] bg-[#fffdf3] px-4 py-6 text-center shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)] max-lg:bg-white max-lg:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] sm:px-6">
      {step.name && <p className="m-0 mb-1.5 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-ink-3">{step.name}</p>}
      <h3 className="m-0 max-w-[30ch] font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-[22px]">{step.title}</h3>
      <p className="m-0 mt-2 max-w-[54ch] font-sans text-[15px] leading-[1.55] text-ink-2">{step.text}</p>
    </motion.li>
  );
}

export default function RoleStack({ d, steps, reduce, id = 'rl-how-title' }) {
  return (
    <section aria-labelledby={id} className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className="relative mx-auto max-w-[760px]">
          <div className="text-center">
            <ScrubText reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{d.label}</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id={id} className={'m-0 leading-[1.06] text-white [text-wrap:balance] ' + TITLE} lines={d.lines} />
            <ScrubText as="p" reduce={reduce} lag={0.05} className="mx-auto mb-0 mt-5 max-w-[50ch] font-sans text-[16.5px] leading-[1.6] text-white/70">{d.sub}</ScrubText>
          </div>
          <motion.ol aria-label={d.label} className="m-0 mt-10 flex list-none flex-col gap-3 p-0" variants={LIST} initial={reduce ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {steps.map(s => <Card key={s.title} step={s} />)}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
