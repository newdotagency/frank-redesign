// IndustryPage (V21.04): the two "Industries" pages of hifrank.ai (/industries/saas, /industries/ecommerce) in the V21.04 style. One layout:
// hero (the site's general hero panel, no picture) → "Key Customer Moments" (the home page's progress tabs, the picture on the right) →
// "How Frank Works" (three steps) → "Built for Teams Shape the Customer Experience" (role cards) → FAQ → closing.
// The words and pictures are the live pages' (industries/industries.json, public/industries/<slug>/, public/industries/roles/).
import { useMemo } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import { Lightbulb, MessageCircle, MousePointerClick } from 'lucide-react';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import INDUSTRIES from './industries/industries.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const EASE = [0.23, 1, 0.32, 1];
const HOW_ICONS = [MousePointerClick, MessageCircle, Lightbulb];

// A moment's picture, filling the step card (the live page's photo or screen).
const photoScene = (src, alt) => function PhotoScene({ active, reduce }) {
  return (
    <div className="absolute inset-0 p-[6%]">
      <motion.img src={src} alt={alt} loading="lazy" draggable={false}
        className="size-full rounded-[18px] object-cover shadow-[0_26px_60px_-24px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.06]"
        initial={false}
        animate={active || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: active && !reduce ? 0.12 : 0 }} />
    </div>
  );
};
// Built once per page, so a step's picture keeps its identity between renders.
const STEPS = {};
const stepsOf = slug => STEPS[slug] || (STEPS[slug] = INDUSTRIES[slug].moments.map(([name, title, text, img]) => ({
  name, title, body: [text], scene: photoScene(`/industries/${slug}/${img}.webp`, name),
})));

function Btn({ href, children }) {
  return <a href={href} className={'inline-flex h-12 items-center rounded-full bg-[#d1f899] px-6 font-sans text-[15.5px] font-medium text-ink no-underline transition-[background-color] duration-300 hover:bg-[#c4ef84] ' + FOCUS}>{children}</a>;
}

export default function IndustryPage({ slug }) {
  const d = INDUSTRIES[slug];
  const reduce = !!useReducedMotion();
  const steps = useMemo(() => stepsOf(slug), [slug]);
  const faqs = d.faqs.map(([q, a]) => ({ q, a }));
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: the site's general hero panel (no picture) */}
          <section aria-labelledby="in-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(88px,8vw,128px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{d.label}</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="in-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  {d.hero.map(l => <span key={l} className="block">{l}</span>)}
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[54ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">{d.heroP}</Rise>
                <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3"><Btn href={SIGNUP}>Run 10 Interviews Free</Btn></Rise>
              </div>
            </div>
          </section>

          {/* 2 — Key Customer Moments: progress tabs, the picture on the right */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label={d.momentsLabel} lines={d.momentsLines} subtitle={d.momentsSub} id="in-moments-title" slider />
          </div>

          {/* 3 — How Frank Works: as on the live page, the title on the left, the three steps one below the other on the right */}
          <section aria-labelledby="in-how-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-20">
                <div className="text-center lg:text-left">
                  <ScrubText reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8 lg:!justify-start">{d.howLabel}</Eyebrow></ScrubText>
                  <ScrubTitle reduce={reduce} id="in-how-title" className={'m-0 leading-[1.06] text-white [text-wrap:balance] ' + TITLE} lines={d.howLines} />
                  <ScrubText as="p" reduce={reduce} lag={0.05} className="mx-auto mb-0 mt-5 max-w-[46ch] font-sans text-[16.5px] leading-[1.6] text-white/70 lg:mx-0">{d.howSub}</ScrubText>
                </div>
                <ol className="m-0 flex list-none flex-col gap-4 p-0">
                  {d.how.map(([t, text], i) => {
                    const Icon = HOW_ICONS[i];
                    return (
                      <motion.li key={t} className="flex items-start gap-5 rounded-[24px] bg-white/[0.06] p-6 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:p-7"
                        initial={reduce ? false : { opacity: 0, y: 48, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.05 }}>
                        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.7} /></span>
                        <div>
                          <h3 className="m-0 font-['Figtree',sans-serif] text-[20px] font-medium leading-tight tracking-[-0.02em] text-white sm:text-[22px]">{i + 1}. {t}</h3>
                          <p className="m-0 mt-2.5 font-sans text-[15.5px] leading-[1.6] text-white/70">{text}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </section>

          {/* 4 — Roles */}
          <section aria-labelledby="in-roles-title" className="px-4 pb-[clamp(88px,10vw,150px)] pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="in-roles-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={d.rolesLines} />
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
                {d.roles.map(([name, key], i) => (
                  <ScrubText as="li" key={key} reduce={reduce} lag={i * 0.06}>
                    <a href={siteHref('/roles/' + key)} className={'group flex h-full flex-col overflow-hidden rounded-[24px] bg-[#fffdf3] text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] ' + FOCUS}>
                      <div className="grid aspect-[4/3] place-items-center overflow-hidden p-6"><img src={`/industries/roles/${key}.webp`} alt="" loading="lazy" draggable={false} className="max-h-full max-w-full object-contain" /></div>
                      <div className="flex items-center justify-between gap-4 px-7 pb-7 sm:px-8 sm:pb-8">
                        <h3 className="m-0 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em]">{name}</h3>
                        <span className="font-sans text-[14.5px] text-ink-2 underline-offset-4 group-hover:underline">Read More</span>
                      </div>
                    </a>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>

          {/* 5 — FAQ */}
          <FAQ items={faqs} label="FAQ" lines={['Have questions?', 'We have answers']} id="in-faq-title" />

          {/* 6 — Closing */}
          <div className="pt-[clamp(40px,5vw,80px)]">
            <ClosingCTA titleId="in-cta-title" chips={false} compact lines={d.cta.lines} sub={d.cta.sub} primary={{ label: d.cta.button, href: SIGNUP }} secondary={false} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
