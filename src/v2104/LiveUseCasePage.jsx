// LiveUseCasePage (V21.04): the four use-case pages that are not on the doc's template (Product discovery, Feature discovery, Market discovery,
// Win/loss analysis), copied from the live hifrank.ai pages in the live pages' own order: hero → "Trusted by" → "What you're dealing with" (the
// pains, in quotes) → (side by side, as the live page) "The Frank Solution" → "How Frank Runs" (three steps with the live pictures) → "What You'll Learn" (the Roles pages' stacked cards) → the site's template wheel → FAQ → closing. The words and pictures are the live pages' (usecases/live.json, public/use-case/<slug>/); the hero has no picture, only
// the site's general hero panel. The live Feature discovery FAQ has six answers with no question: they are left out.
import { useMemo } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import TrustStrip from './TrustStrip';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import RoleStack from './RoleStack';
import UseCases from './UseCases';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import { imageScene } from './features/scenes';
import LIVE from './usecases/live.json';
import { FOCUS, Rise } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };

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
  // Row against row; the live pages list as many solutions as problems.
  const rows = d.problem.quotes.map((q, i) => [q, d.solution[i]]);
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
          <TrustStrip />

          {/* 3 — What you're dealing with vs The Frank Solution: the live page's comparison. Two columns from 768px, the problems on the
                left with a cross and the Frank solution on the right (dark) with a tick, row against row; on phones, one card each. */}
          <section aria-labelledby="lu-problem-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1200px]">
              <ScrubTitle reduce={reduce} id="lu-problem-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={d.problem.title} />
              <ScrubText reduce={reduce} lag={0.1} className="mt-12 hidden sm:mt-16 md:block">
                <div role="table" aria-label="What you’re dealing with, and the Frank solution" className="grid grid-cols-2">
                  <div role="row" className="contents">
                    <div role="columnheader" className="rounded-tl-[24px] bg-[#fffdf3] px-7 py-6 font-sans text-[13.5px] font-medium uppercase tracking-[0.08em] text-ink">What you’re dealing with</div>
                    <div role="columnheader" className="rounded-tr-[24px] bg-[#0f2e27] px-7 py-6 font-sans text-[13.5px] font-medium uppercase tracking-[0.08em] text-white">The Frank Solution</div>
                  </div>
                  {rows.map(([q, sol], i) => {
                    const last = i === rows.length - 1;
                    return (
                      <div role="row" key={i} className="contents">
                        <div role="cell" className={'flex items-start gap-4 border-0 border-t border-solid border-[#1a1714]/[0.08] bg-[#fffdf3] px-7 py-6 ' + (last ? 'rounded-bl-[24px]' : '')}>
                          <X aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink/70" strokeWidth={1.6} />
                          <p className="m-0 font-sans text-[16px] leading-[1.55] text-ink">{q}</p>
                        </div>
                        <div role="cell" className={'flex items-start gap-4 border-0 border-t border-solid border-white/[0.12] bg-[#0f2e27] px-7 py-6 ' + (last ? 'rounded-br-[24px]' : '')}>
                          <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#d1f899]" strokeWidth={1.8} />
                          <p className="m-0 font-sans text-[16px] leading-[1.55] text-white">{sol}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrubText>
              <div className="mt-12 grid gap-4 md:hidden">
                <ScrubText reduce={reduce} className="rounded-[24px] bg-white p-6 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)]">
                  <p className="m-0 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-ink">What you’re dealing with</p>
                  <ul className="m-0 mt-4 list-none p-0">
                    {d.problem.quotes.map(q => (
                      <li key={q} className="flex items-start gap-3 border-0 border-t border-solid border-[#1a1714]/[0.08] py-4 first:border-t-0 first:pt-0">
                        <X aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink/70" strokeWidth={1.6} />
                        <p className="m-0 font-sans text-[15.5px] leading-[1.55] text-ink">{q}</p>
                      </li>
                    ))}
                  </ul>
                </ScrubText>
                <ScrubText reduce={reduce} lag={0.05} className="rounded-[24px] bg-[#0f2e27] p-6">
                  <p className="m-0 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white">The Frank Solution</p>
                  <ul className="m-0 mt-4 list-none p-0">
                    {d.solution.map(t => (
                      <li key={t} className="flex items-start gap-3 border-0 border-t border-solid border-white/[0.12] py-4 first:border-t-0 first:pt-0">
                        <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#d1f899]" strokeWidth={1.8} />
                        <p className="m-0 font-sans text-[15.5px] leading-[1.55] text-white">{t}</p>
                      </li>
                    ))}
                  </ul>
                </ScrubText>
              </div>
            </div>
          </section>

          {/* 5 — How Frank Runs: the home page's progress tabs, each with the live picture */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label={d.label} lines={[d.how.title]} subtitle={null} id="lu-how-title" slider />
          </div>

          {/* 6 — What You'll Learn: the Roles pages' stacked cards, one below the other, fading up */}
          <RoleStack id="lu-learn-title" reduce={reduce} d={{ label: d.label, lines: [d.learn.title], sub: d.learn.intro }}
            steps={d.learn.items.map(it => ({ title: it.title, text: it.text }))} />

          {/* 7 — More templates: the home page's use-case wheel, as on the other use-case pages */}
          <UseCases href={SIGNUP} sectionClass="pt-[clamp(112px,13vw,200px)] px-4 sm:px-[clamp(16px,4vw,48px)]"
            head={{ eyebrow: 'Build your study on the right foundation', lines: ['Discover more Frank', 'interview templates'], sub: null, titleId: 'lu-tpl-title', titleClass: 'm-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE }} />

          {/* 8 — FAQ */}
          <div className="pt-[clamp(112px,13vw,200px)]">
            <FAQ items={d.faq} label="FAQ" lines={['Have questions?', 'We have answers']} id="lu-faq-title" />
          </div>

          {/* 9 — Closing */}
          <div className="pt-[clamp(40px,5vw,80px)]">
            <ClosingCTA titleId="lu-cta-title" chips={false} compact lines={[d.cta.title]} sub={d.cta.sub}
              primary={{ label: d.cta.button, href: SIGNUP }} secondary={false} />
          </div>

        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
