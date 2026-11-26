// LiveUseCasePage (V21.04): the four use-case pages that are not on the doc's template (Product discovery, Feature discovery, Market discovery,
// Win/loss analysis), copied from the live hifrank.ai pages in the live pages' own order: hero → "Trusted by" → "What you're dealing with" (the
// pains, in quotes) → "The Frank Solution" → "How Frank Runs" (three steps with the live pictures) → "What You'll Learn" → FAQ → closing →
// the other use cases. The words and pictures are the live pages' (usecases/live.json, public/use-case/<slug>/); the hero has no picture, only
// the site's general hero panel. The live Feature discovery FAQ has six answers with no question: they are left out.
import { useMemo } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import BrandMarquee from './BrandMarquee';
import { PL_LOGOS } from './logos/prelaunchBrands';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import { imageScene } from './features/scenes';
import LIVE from './usecases/live.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const BRANDS = [['Bosch', 'bosch', 20], ['Ducati', 'ducati', 17], ['3M', '3m', 26], ['Haier', 'haier', 24], ['Philips', 'philips', 16], ['P&G', 'pg', 26], ['Audi', 'audi', 23]];

function Btn({ href, tone = 'lime', children }) {
  const tones = { lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]', ghost: 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:bg-white/[0.14]' };
  return <a href={href} className={'inline-flex h-12 items-center rounded-full px-6 font-sans text-[15.5px] font-medium no-underline transition-[background-color] duration-300 ' + tones[tone] + ' ' + FOCUS}>{children}</a>;
}

// Built once per page, so a step's picture keeps its identity between renders.
const STEPS = {};
const stepsOf = slug => STEPS[slug] || (STEPS[slug] = LIVE[slug].how.steps.map((s, i) => ({
  name: 'Step ' + (i + 1), title: s.title.replace(/^\d+\.\s*/, ''), body: [s.text], scene: imageScene(s.img, s.title),
})));

export default function LiveUseCasePage({ slug }) {
  const d = LIVE[slug];
  const reduce = !!useReducedMotion();
  const steps = useMemo(() => stepsOf(slug), [slug]);
  const intro = slug === 'win-loss-analysis' ? null : d.solution[0];
  const points = intro ? d.solution.slice(1) : d.solution;
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative [text-wrap:pretty]" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: the site's general hero panel (no picture) */}
          <section aria-labelledby="lu-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(88px,8vw,128px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{d.label}</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="lu-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  {d.hero.title.map(l => <span key={l} className="block">{l}</span>)}
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[56ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">{d.hero.text}</Rise>
                <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3">
                  {d.hero.ctas.map(([label, href], i) => <Btn key={label} href={href} tone={i ? 'ghost' : 'lime'}>{label}</Btn>)}
                </Rise>
              </div>
            </div>
          </section>

          {/* 2 — Trusted by */}
          <section aria-label="Trusted by 1,000+ brands" className="px-4 pt-[clamp(56px,6vw,88px)] sm:px-[clamp(16px,4vw,48px)]">
            <ScrubText reduce={reduce} className="mx-auto max-w-[1312px] text-center">
              <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">Trusted by 1,000+ industry-leading brands</p>
              <BrandMarquee brands={BRANDS} logos={PL_LOGOS} />
            </ScrubText>
          </section>

          {/* 3 — What you're dealing with */}
          <section aria-labelledby="lu-problem-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">What you’re dealing with</Eyebrow></ScrubText>
                <ScrubTitle reduce={reduce} id="lu-problem-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={d.problem.title} />
                <ul className="m-0 mt-12 flex list-none flex-wrap justify-center gap-4 p-0 sm:mt-16">
                  {d.problem.quotes.map((q, i) => (
                    <ScrubText as="li" key={q} reduce={reduce} lag={(i % 3) * 0.05} className="w-full rounded-[24px] bg-white p-7 text-left shadow-[0_0_0_1px_rgba(26,23,20,0.06)] max-md:shadow-[0_0_0_1px_rgba(26,23,20,0.14)] sm:p-8 md:w-[calc((100%-2rem)/3)]">
                      <p className="m-0 font-serif text-[clamp(19px,1.6vw,22px)] italic leading-[1.45] text-ink">{q}</p>
                    </ScrubText>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4 — The Frank Solution */}
          <section aria-labelledby="lu-sol-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1200px]">
              <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">The Frank solution</Eyebrow></ScrubText>
              <ScrubTitle reduce={reduce} id="lu-sol-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['The Frank Solution']} />
              {intro && <ScrubText as="p" reduce={reduce} lag={0.05} className={SUBTITLE + ' mx-auto mb-0 mt-6 max-w-[52ch] text-center'}>{intro}</ScrubText>}
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-2 xl:grid-cols-3">
                {points.map((p, i) => (
                  <ScrubText as="li" key={p} reduce={reduce} lag={(i % 3) * 0.05} className="flex gap-4 rounded-[24px] bg-[#fffdf3] p-7 text-left shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] max-md:bg-white max-md:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)]">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Check className="size-5" strokeWidth={2} /></span>
                    <p className="m-0 font-sans text-[16px] leading-[1.55] text-ink">{p}</p>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>

          {/* 5 — How Frank Runs: the home page's progress tabs, each with the live picture */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label={d.label} lines={[d.how.title]} subtitle={null} id="lu-how-title" slider />
          </div>

          {/* 6 — What You'll Learn */}
          <section aria-labelledby="lu-learn-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                <ScrubTitle reduce={reduce} id="lu-learn-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={[d.learn.title]} />
                <ScrubText as="p" reduce={reduce} lag={0.05} className={SUBTITLE + ' mx-auto mb-0 mt-6 max-w-[56ch] text-center'}>{d.learn.intro}</ScrubText>
                <ul className={'m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 sm:grid-cols-2 ' + (d.learn.items.length > 4 ? 'xl:grid-cols-3' : 'xl:grid-cols-4')}>
                  {d.learn.items.map((it, i) => (
                    <ScrubText as="li" key={it.title} reduce={reduce} lag={(i % 4) * 0.05} className="flex flex-col rounded-[24px] bg-white p-7 text-left shadow-[0_0_0_1px_rgba(26,23,20,0.06)] max-md:shadow-[0_0_0_1px_rgba(26,23,20,0.14)] sm:p-8">
                      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#d1f899]"><img src={it.icon} alt="" draggable={false} className="size-6" /></span>
                      <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">{it.title}</h3>
                      <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{it.text}</p>
                    </ScrubText>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 7 — FAQ */}
          <FAQ items={d.faq} label="FAQ" lines={['Have questions?', 'We have answers']} id="lu-faq-title" />

          {/* 8 — Closing */}
          <div className="pt-[clamp(40px,5vw,80px)]">
            <ClosingCTA titleId="lu-cta-title" chips={false} compact lines={[d.cta.title]} sub={d.cta.sub}
              primary={{ label: d.cta.button, href: SIGNUP }} secondary={false} />
          </div>

          {/* 9 — Other use cases */}
          <section aria-labelledby="lu-more-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1200px]">
              <ScrubTitle reduce={reduce} id="lu-more-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Other Use Cases']} />
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
                {d.others.map(([path, name, text], i) => (
                  <ScrubText as="li" key={path} reduce={reduce} lag={(i % 4) * 0.05}>
                    <a href={siteHref(path)} className={'flex h-full flex-col rounded-[24px] bg-[#fffdf3] p-7 text-left text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] max-md:bg-white max-md:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] ' + FOCUS}>
                      <h3 className="m-0 font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.25] tracking-[-0.02em]">{name}</h3>
                      <p className="m-0 mt-3 font-sans text-[15px] leading-[1.55] text-ink-2">{text}</p>
                    </a>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>
          <div className="pb-[clamp(56px,7vw,112px)]" />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
