// TrustStrip (V19) — the social proof under the hero: a two-line title set like the section leads
// (Geist, 20px, warm grey — as "Set up an interview in seconds."), beside it
// the security seals (SOC 2, GDPR) in greyscale, in colour on hover; under a hairline, the customer logos slide by
// slowly (the V11 marquee: pauses on hover or focus, edges fade).
// Entrance: title, seals, then the logos rise in once, ahead of the next section (reveal.js).
// Reduced motion: the logos sit still in a wrapped row.
import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { enter, useEntrance } from './reveal';
import tenweb from './logos/10web.svg';
import narwal from './logos/narwal.png';
import soc2 from './logos/soc2.png';
import gdpr from './logos/gdpr.png';
import ducati from '../v9/logos/ducati.webp';
import bosch from '../v9/logos/bosch.webp';
import haier from '../v9/logos/haier.webp';
import philips from '../v9/logos/philips.webp';
import audi from '../v9/logos/audi.webp';
import pandg from '../v9/logos/pandg.webp';

const LOGOS = [
  { src: tenweb, alt: '10Web' }, { src: narwal, alt: 'Narwal' },
  { src: ducati, alt: 'Ducati' }, { src: bosch, alt: 'Bosch' }, { src: haier, alt: 'Haier' },
  { src: philips, alt: 'Philips' }, { src: audi, alt: 'Audi' }, { src: pandg, alt: 'P&G' },
];
const SEALS = [{ src: soc2, name: 'SOC 2' }, { src: gdpr, name: 'GDPR' }];

const List = ({ copy }) => (
  <ul className={'lg-list' + (copy ? ' lg-copy' : '')} aria-hidden={copy || undefined}>
    {LOGOS.map(l => (
      <li key={l.alt} className="lg-slot"><img className="lg" src={l.src} alt={copy ? '' : l.alt} loading="lazy" /></li>
    ))}
  </ul>
);

export default function TrustStrip() {
  const reduce = !!useReducedMotion();
  const root = useRef(null);
  const go = useEntrance(root);
  return (
    <section aria-labelledby="lg-title" className="relative px-4 pb-6 pt-[clamp(56px,7vw,96px)] sm:px-[clamp(16px,4vw,48px)]">
      <div ref={root} className="mx-auto max-w-[1312px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-12">
          <motion.h2 {...enter(reduce, go, 0)} id="lg-title" className="m-0 !font-sans text-[18px] !font-normal leading-[1.45] !tracking-normal text-ink-2 sm:text-[20px]">
            Trusted by teams who’d rather build<br />
            than schedule calls
          </motion.h2>
          <motion.ul {...enter(reduce, go, 0.08)} className="m-0 flex shrink-0 list-none items-center gap-5 p-0" aria-label="Security and privacy">
            {SEALS.map(s => (
              <li key={s.name} className="group flex items-center gap-3 font-sans text-[15px] text-ink-2">
                {/* Greyscale at rest like the logos; the seal's own colours on hover. */}
                <img src={s.src} alt="" className="size-14 rounded-full opacity-80 grayscale transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0" />
                {s.name}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...enter(reduce, go, 0.16)} className="mt-6 border-0 border-t border-solid border-[#1a1714]/10 pt-6">
          <div className="lg-strip" tabIndex={0} role="region" aria-label="Customer logos, paused on hover or focus">
            <div className="lg-track">
              <List />
              <List copy />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
