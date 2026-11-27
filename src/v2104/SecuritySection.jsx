// SecuritySection (V21.04): "Enterprise-grade security & compliance", the three badges (SOC 2, the ESOMAR award,
// GDPR). One component for the AI voice interviewer page and the four feature pages.
import { Award } from 'lucide-react';
import { TITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import soc2 from './logos/soc2.png';
import gdpr from './logos/gdpr.png';

const SECURITY = [
  { name: 'SOC 2', text: 'SOC 2 and GDPR compliant.', img: soc2 },
  { name: 'Award winning methodology', text: 'Prelaunch.com is the Silver Winner of the global ESOMAR Award for Breakthrough Research Methodology', icon: Award },
  { name: 'GDPR', text: 'Privacy built to meet EU regulations.', img: gdpr },
];

export default function SecuritySection({ reduce, id = 'sec-title', className = 'relative px-4 pb-[clamp(112px,13vw,200px)] sm:px-[clamp(16px,4vw,48px)]' }) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="mx-auto max-w-[1312px]">
        <ScrubTitle reduce={reduce} id={id} className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Enterprise-grade security', '& compliance']} />
        <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
          {SECURITY.map((s, i) => (
            <ScrubText as="li" key={s.name} reduce={reduce} lag={i * 0.06}
              className="rounded-[24px] bg-[#fffdf3] p-7 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] sm:p-8">
              <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">
                {s.img ? <img src={s.img} alt="" className="size-11 object-contain" /> : <s.icon className="size-7 text-[#5f8f22]" strokeWidth={1.5} />}
              </span>
              <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{s.name}</h3>
              <p {...(s.name === 'SOC 2' ? { 'data-agent-change': '' } : {})} className="m-0 mt-2 font-sans text-[15.5px] leading-[1.55] text-ink-2">{s.text}</p>
            </ScrubText>
          ))}
        </ul>
      </div>
    </section>
  );
}
