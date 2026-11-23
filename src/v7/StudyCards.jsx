// StudyCards — the band below the hero (Delphi's "Ask people who've lived it", made Frank's):
// three studies Frank ran last night. One is still live (a slow progress line), two are done.
// Each card is three things only: a tag + status, a serif "Ask … about …" title with the key
// phrase marked in lime, and a row of three small facts. Frank style: violet eyebrow, V1 frosted
// surfaces and soft shadow. Cards rise in once, as they scroll in.
import { motion } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';

const CARDS = [
  { tag: 'Churn', live: true, ask: 'Ask churned users about', key: 'why they left', facts: ['24 interviews', '6h of audio', 'Running'] },
  { tag: 'Conversion', ask: 'Ask trial users about', key: 'what stopped them', facts: ['31 interviews', '7h of audio', '5 themes'] },
  { tag: 'Onboarding', ask: 'Ask new signups about', key: 'their first week', facts: ['18 interviews', '4h of audio', '3 themes'] },
];

export default function StudyCards({ reduced }) {
  return (
    <section aria-labelledby="studies-title" className="relative mx-auto max-w-[1200px] px-5 pb-32 pt-24 sm:px-8 md:pt-28">
      <p className="flex justify-center">
        <span className="rounded-full bg-[#d1b2ff] px-2.5 py-1 text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#37234f]">Last night</span>
      </p>
      <h2 id="studies-title" className="mt-4 text-center font-serif text-[clamp(32px,4vw,46px)] font-normal leading-[1.1] tracking-[-0.025em] text-ink">
        Studies Frank ran <span className="italic text-ink-2">while you slept</span>
      </h2>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <motion.li key={c.tag}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay: i * 0.1 }}
            className="flex flex-col rounded-[20px] border border-[rgba(26,23,20,0.10)] bg-white/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(26,23,20,0.04),0_6px_16px_-4px_rgba(26,23,20,0.06),0_28px_56px_-20px_rgba(64,44,24,0.16)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#f4f4f0] px-2.5 py-0.5 text-[12px] text-ink-2">{c.tag}</span>
              <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
                <span className={'size-1.5 rounded-full ' + (c.live ? 'bg-brand-strong ' + (reduced ? '' : 'breathe') : 'bg-[#cec9c1]')} />
                {c.live ? 'Live' : 'Done'}
              </span>
            </div>
            <p className="sc-title mt-8 font-serif text-[23px] leading-[1.3] tracking-[-0.012em] text-ink">
              {c.ask} <span className="sc-key rounded-[4px] bg-[#d1f899] px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{c.key}</span>
            </p>
            {c.live && (
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-[#ece9e2]" aria-hidden="true">
                <motion.div className="h-full origin-left rounded-full bg-ink"
                  initial={{ scaleX: reduced ? 0.7 : 0.15 }}
                  animate={reduced ? undefined : { scaleX: [0.15, 0.85] }}
                  transition={{ duration: 14, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }} />
              </div>
            )}
            <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-8 text-[12.5px] text-ink-3">
              {c.facts.map(f => <li key={f}>{f}</li>)}
            </ul>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
