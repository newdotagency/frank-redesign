// CaseStudiesPage (V21.04): hifrank.ai/case-study in the V21.04 style. There is one published study (TCF), so the page shows
// that and says more are coming (the live page does too: "Other Case Studies Coming Soon…"). Add a study by adding it to
// case-study/cases.json (and a card here). The page:
//   1. Hero: the forest-green panel with the live page's label, title and line.
//   2. The TCF study as a card (banner beside the use case, title, summary and "Read the full story"), and under it a quiet
//      card: more case studies are on the way.
//   3. The home page's closing panel, then the footer.
// Entrance: the hero rises in once on load; the rest rises in with the scroll. Reduced motion: fades only.
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Banner from './Cover';
import { TITLE, Eyebrow } from './titles';
import { ScrubText } from './reveal';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import CASES from './case-study/cases.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const hrefOf = c => '/case-study/' + c.slug;
const thumb = c => ({ img: c.hero, srcset: `${c.hero.replace('hero.webp', 'thumb.webp')} 640w, ${c.hero} 1600w` });

function StudyCard({ c }) {
  return (
    <a href={hrefOf(c)} className={'group grid overflow-hidden rounded-[28px] bg-[#fffdf3] text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:rounded-[36px] ' + FOCUS}>
      <Banner p={thumb(c)} sizes="(min-width: 768px) 55vw, 100vw" className="min-h-[240px] md:!aspect-auto md:h-full" />
      <span className="flex flex-col p-7 sm:p-10 lg:p-[clamp(36px,3.6vw,56px)]">
        <span className="flex flex-wrap items-center gap-3 font-sans text-[14px] text-ink-3">
          <span className="inline-flex h-7 items-center rounded-full bg-[#d1f899] px-3 text-[12.5px] font-medium text-[#2a321e]">{c.kind}</span>
          <span>Brand <span className="text-ink">{c.brand}</span></span>
        </span>
        <span className={'mt-6 block text-[clamp(26px,2.8vw,38px)] leading-[1.12] text-ink [text-wrap:balance] ' + TITLE}>{c.title}</span>
        <span className="mt-5 block max-w-[46ch] font-sans text-[17px] leading-[1.6] text-ink-2">{c.summary}</span>
        <span className="mt-8 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-[#1a1714] py-1.5 pl-5 pr-1.5 font-sans text-[15.5px] font-medium text-white transition-colors duration-300 group-hover:bg-[#2a2622] md:mt-auto">
          Read the full story
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"><ArrowRight className="size-4" strokeWidth={1.75} /></span>
        </span>
      </span>
    </a>
  );
}

export default function CaseStudiesPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero */}
          <section aria-labelledby="cs-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(80px,7vw,112px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">Case studies</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="cs-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  <span className="block">From customer conversations</span><span className="block">to better decisions</span>
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[52ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">
                  Explore how teams use Frank AI to conduct customer interviews, uncover insights, and make better product decisions.
                </Rise>
              </div>
            </div>
          </section>

          {/* 2 — The study, and what is next */}
          <section aria-label="Case studies" className="px-4 pb-[clamp(72px,8vw,120px)] pt-[clamp(48px,6vw,80px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1200px]">
              {CASES.map(c => <ScrubText key={c.slug} reduce={reduce}><StudyCard c={c} /></ScrubText>)}
              <ScrubText reduce={reduce} lag={0.08} className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] border border-dashed border-[#1a1714]/[0.18] px-6 py-6 sm:px-8">
                  <div className="flex items-center gap-4">
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#1a1714]/[0.05] text-ink-2"><Check className="size-5" strokeWidth={1.75} /></span>
                    <div>
                      <p className="hiw-step-title m-0 text-[20px] leading-tight text-ink">More case studies coming soon</p>
                      <p className="m-0 mt-1 font-sans text-[15px] text-ink-3">We are writing up more teams’ stories. They will appear here.</p>
                    </div>
                  </div>
                  <a href={siteHref('/blog')} className={'inline-flex h-11 items-center rounded-full bg-white px-5 font-sans text-[15px] font-medium text-ink no-underline shadow-[0_0_0_1px_rgba(26,23,20,0.12)] transition-colors duration-200 hover:bg-[#fffdf3] ' + FOCUS}>Read the blog meanwhile</a>
                </div>
              </ScrubText>
            </div>
          </section>

          <ClosingCTA titleId="cs-cta-title" chips={false} compact lines={['Ask your customers', 'anything.']}
            sub="Frank runs hundreds of AI customer interviews overnight and brings back the answers in your customers’ own words."
            primary={{ label: 'Get started', href: SIGNUP }} secondary={{ label: 'Try a live demo', href: siteHref('/try-frank') }} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
