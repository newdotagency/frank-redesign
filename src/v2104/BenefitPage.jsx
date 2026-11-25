// BenefitPage (V21.04): one of the four "Benefits" pages of hifrank.ai (/benefits/price, /quality, /scale, /speed) in the V21.04 style. They
// share one layout on the live site, kept here: hero → "Trusted by" → "What Frank delivers" (tabs, each with its picture) → "When X
// matters most" (four cards with icons) → "Traditional research vs Frank AI Interviewer" (three columns) → the home page's Testimonials
// section → closing. The words and pictures are the live pages' (benefits/benefits.json, public/benefits/<slug>/); the hero has no picture,
// only the site's general hero panel. The pictures are the originals, to be re-coloured later.
//   · "What Frank delivers" is the home page's progress tabs (HowItWorks), each step showing its original picture;
//   · the comparison is one grid: the row names, Traditional research, and Frank (dark) side by side; on phones each row is a card.
import BrandMarquee from './BrandMarquee';
import { useMemo } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import { PL_LOGOS } from './logos/prelaunchBrands';
import HowItWorks from './HowItWorks';
import ClosingCTA from './ClosingCTA';
import Testimonials from './Testimonials';
import Footer from './Footer';
import BENEFITS from './benefits/benefits.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';
import { imageScene } from './features/scenes';
import { PRICE_SCENES } from './features/PriceScenes';
import { QUALITY_SCENES } from './features/QualityScenes';
import { SPEED_SCENES } from './features/SpeedScenes';
import { SCALE_SCENES } from './features/ScaleScenes';

const CUSTOM = { price: PRICE_SCENES, quality: QUALITY_SCENES, speed: SPEED_SCENES, scale: SCALE_SCENES };

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const BRANDS = [
  ['Bosch', 'bosch', 20], ['Ducati', 'ducati', 17], ['3M', '3m', 26], ['Haier', 'haier', 24], ['Philips', 'philips', 16], ['P&G', 'pg', 26], ['Audi', 'audi', 23],
];

function Btn({ href, tone = 'lime', children, onClick }) {
  const tones = {
    lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]',
    ghost: 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:bg-white/[0.14]',
  };
  return (
    <a href={href} onClick={onClick} className={'inline-flex h-12 items-center rounded-full px-6 font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ' + tones[tone] + ' ' + FOCUS}>{children}</a>
  );
}

function toHow(e) {
  const el = document.getElementById('bn-how-title');
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: reduce ? 'auto' : 'smooth' });
}

// The scenes are built once per page, so a step's picture keeps its identity between renders.
const STEPS = {};
const stepsOf = slug => STEPS[slug] || (STEPS[slug] = BENEFITS[slug].delivery.items.map((it, i) => ({
  name: it.name, title: it.title, body: [it.text], scene: CUSTOM[slug]?.[i] || imageScene(it.img, it.title),
})));

function Comparison({ b, reduce }) {
  const rows = b.comparison.rows;
  return (
    <section aria-labelledby="bn-cmp-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1200px]">
        <ScrubTitle reduce={reduce} id="bn-cmp-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Traditional research vs', 'Frank AI Interviewer']} />
        {/* From 768px: one grid, so the rows line up across the three columns. */}
        <ScrubText reduce={reduce} lag={0.1} className="mt-12 hidden sm:mt-16 md:block">
          <div role="table" aria-label="Traditional research and Frank compared" className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3">
            <div role="row" className="contents">
              <div role="columnheader" aria-label="Row" />
              <div role="columnheader" className="rounded-t-[24px] bg-[#fffdf3] px-7 py-6 font-['Figtree',sans-serif] text-[20px] font-medium tracking-[-0.02em] text-ink">{b.comparison.tradTitle}</div>
              <div role="columnheader" className="flex items-center rounded-t-[24px] bg-[#0f2e27] px-7 py-6"><img src="/frank-logo.png" alt="Frank" className="block h-[22px] w-auto brightness-0 invert" /></div>
            </div>
            {rows.map(([label, trad, frank], i) => {
              const last = i === rows.length - 1;
              return (
                <div role="row" key={label} className="contents">
                  <div role="rowheader" className="flex items-center border-0 border-t border-solid border-[#1a1714]/[0.07] py-5 pr-4 font-sans text-[15.5px] font-medium text-ink first:border-t-0">{label}</div>
                  <div role="cell" className={'flex items-center border-0 border-t border-solid border-[#1a1714]/[0.08] bg-[#fffdf3] px-7 py-5 font-sans text-[15.5px] leading-[1.45] text-ink-2 ' + (last ? 'rounded-b-[24px]' : '')}>{trad}</div>
                  <div role="cell" className={'flex items-center border-0 border-t border-solid border-white/[0.1] bg-[#0f2e27] px-7 py-5 font-sans text-[15.5px] leading-[1.45] text-white ' + (last ? 'rounded-b-[24px]' : '')}>{frank}</div>
                </div>
              );
            })}
          </div>
        </ScrubText>
        {/* On phones: each row is a card. */}
        <ul className="m-0 mt-12 grid list-none gap-3 p-0 md:hidden">
          {rows.map(([label, trad, frank], i) => (
            <ScrubText as="li" key={label} reduce={reduce} lag={0.04}>
              <div className="rounded-[20px] bg-[#fffdf3] p-5 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)]">
                <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">{label}</p>
                <p className="m-0 mt-3 font-sans text-[15px] leading-[1.45] text-ink-2"><span className="mr-2 text-ink-3">Traditional</span>{trad}</p>
                <p className="m-0 mt-2 rounded-[12px] bg-[#0f2e27] px-3.5 py-2.5 font-sans text-[15px] leading-[1.45] text-white"><span className="mr-2 text-[#d1f899]">Frank</span>{frank}</p>
              </div>
            </ScrubText>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function BenefitPage({ slug }) {
  const b = BENEFITS[slug];
  const reduce = !!useReducedMotion();
  const steps = useMemo(() => stepsOf(slug), [slug]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: the site's general hero panel (no picture) */}
          <section aria-labelledby="bn-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(88px,8vw,128px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{b.hero.label}</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="bn-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  {b.hero.lines.map(l => <span key={l} className="block">{l}</span>)}
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[54ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">{b.hero.p}</Rise>
                <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3">
                  <Btn href={b.hero.primary.href}>{b.hero.primary.label}</Btn>
                  <Btn href="#bn-how-title" onClick={toHow} tone="ghost">{b.hero.secondary.label}</Btn>
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

          {/* 3 — What Frank delivers: the home page's progress tabs, each with its original picture */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label={b.delivery.label} lines={b.delivery.lines} subtitle={null} id="bn-how-title" />
          </div>

          {/* 4 — When X matters most */}
          <section aria-labelledby="bn-ben-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">{b.benefit.label}</Eyebrow></ScrubText>
                <ScrubTitle reduce={reduce} id="bn-ben-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={[b.benefit.title]} />
                <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
                  {b.benefit.cards.map((c, i) => (
                    <ScrubText as="li" key={c.title} reduce={reduce} lag={(i % 4) * 0.05} className="flex flex-col rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:p-8">
                      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#d1f899]">{c.icon && <img src={c.icon} alt="" draggable={false} className="size-6" />}</span>
                      <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">{c.title}</h3>
                      <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{c.text}</p>
                    </ScrubText>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5 — Traditional research vs Frank */}
          <Comparison b={b} reduce={reduce} />

          {/* 6 — Testimonials: the home page's section */}
          <div className="pt-[clamp(88px,10vw,150px)]"><Testimonials /></div>

          {/* 7 — Closing: the home page's closing panel with this page's words */}
          <div className="pt-[clamp(88px,10vw,160px)]">
            <ClosingCTA titleId="bn-cta-title" chips={false} compact lines={b.cta.lines} sub={b.cta.sub}
              primary={{ label: b.cta.button, href: SIGNUP }} secondary={false} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
