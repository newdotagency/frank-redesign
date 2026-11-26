// RoleStack (V21.04): "How Frank works" on the Roles pages: the title centred on top, the steps as centred cards below it, one below the other.
// From 1024px it is one pinned stage (as the Churn page's reasons): a tall track with a sticky stage; scrolling slides each next card up
// from below the screen over the one before, each stopping 18px lower so the earlier ones show above it; after the last the stage holds one
// more step, then the title and the cards scroll away as one block. Below 1024px, and with reduced motion, the cards are a plain list.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const PIN = 112, STEP = 18;

function Card({ step, i }) {
  return (
    <div className="flex h-full flex-col items-center rounded-[24px] bg-[#fffdf3] px-6 py-8 text-center shadow-[0_24px_50px_-26px_rgba(0,0,0,0.6)] sm:px-10 sm:py-9 max-lg:bg-white max-lg:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)]">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-[#d1f899] font-['Figtree',sans-serif] text-[16px] font-medium text-[#2a321e]">{i + 1}</span>
      <p className="m-0 mt-4 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-ink-3">{step.name}</p>
      <h3 className="m-0 mt-1.5 max-w-[26ch] font-['Figtree',sans-serif] text-[21px] font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-[24px]">{step.title}</h3>
      <p className="m-0 mt-3 max-w-[52ch] font-sans text-[15.5px] leading-[1.6] text-ink-2">{step.text}</p>
    </div>
  );
}

function Header({ d, reduce }) {
  return (
    <div className="text-center">
      <ScrubText reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{d.label}</Eyebrow></ScrubText>
      <ScrubTitle reduce={reduce} id="rl-how-title" className={'m-0 leading-[1.06] text-white [text-wrap:balance] ' + TITLE} lines={d.lines} />
      <ScrubText as="p" reduce={reduce} lag={0.05} className="mx-auto mb-0 mt-5 max-w-[50ch] font-sans text-[16.5px] leading-[1.6] text-white/70">{d.sub}</ScrubText>
    </div>
  );
}

function Slide({ i, progress, from, units, children }) {
  const y = useTransform(progress, p => {
    if (i === 0) return 0;
    const t = Math.min(1, Math.max(0, p * units - (i - 1)));
    const e = 1 - Math.pow(1 - t, 3);
    return from * (1 - e) + i * STEP * e;
  });
  return <motion.li className="[grid-area:1/1]" style={{ y, zIndex: i }}>{children}</motion.li>;
}

function Pinned({ d, steps, reduce }) {
  const track = useRef(null), stage = useRef(null);
  const [stageH, setStageH] = useState(600);
  useLayoutEffect(() => {
    const el = stage.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setStageH(Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const units = steps.length; // N-1 arriving cards + 1 hold
  const { scrollYProgress } = useScroll({ target: track, offset: [`start ${PIN}px`, `end ${PIN + stageH}px`] });
  const [from, setFrom] = useState(800);
  useEffect(() => {
    const set = () => setFrom(window.innerHeight);
    set(); window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);
  return (
    <div ref={track} className="relative" style={{ height: `calc(${stageH}px + ${units * 55}svh)` }}>
      <div ref={stage} className="sticky" style={{ top: PIN }}>
        <div className="mx-auto max-w-[760px]">
          <Header d={d} reduce={reduce} />
          <ol aria-label={d.label} className="m-0 mt-10 grid list-none p-0" style={{ paddingBottom: (steps.length - 1) * STEP }}>
            {steps.map((s, i) => <Slide key={s.name} i={i} progress={scrollYProgress} from={from} units={units}><Card step={s} i={i} /></Slide>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function RoleStack({ d, steps, reduce }) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const set = () => setWide(mq.matches);
    set(); mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return (
    <section aria-labelledby="rl-how-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
      <div className="relative rounded-[32px] bg-[#0f2e27] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className="relative">
          {wide && !reduce ? <Pinned d={d} steps={steps} reduce={reduce} /> : (
            <div className="mx-auto max-w-[760px]">
              <Header d={d} reduce={reduce} />
              <ol aria-label={d.label} className="m-0 mt-10 flex list-none flex-col gap-4 p-0">
                {steps.map((s, i) => <li key={s.name}><Card step={s} i={i} /></li>)}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
