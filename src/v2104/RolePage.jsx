// RolePage (V21.04): the five "Roles" pages of hifrank.ai (/roles/<slug>) in the V21.04 style. One layout:
// hero (copy left, person right) → "Trusted by" → the problem (progress tabs with pictures) → "How Frank works" (stacking cards) →
// use cases → closing. The words and the pictures are the live pages' (roles/roles.json, public/roles/<slug>/).
import { useMemo } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Phone, TrendingDown, Search, Compass, Check } from 'lucide-react';
import Header from '../components/Header';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import HowItWorks from './HowItWorks';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import RoleHero from './RoleHero';
import ROLES from './roles/roles.json';
import BrandMarquee from './BrandMarquee';
import RoleStack from './RoleStack';
import { PL_LOGOS } from './logos/prelaunchBrands';
import { siteHref } from '../lib/sitePaths';
import { FOCUS } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const EASE = [0.23, 1, 0.32, 1];
const FIG = "font-['Figtree',sans-serif]";
const ICONS = { Phone, TrendingDown, Search, Compass };
const BRANDS = [['Bosch', 'bosch', 20], ['Ducati', 'ducati', 17], ['3M', '3m', 26], ['Haier', 'haier', 24], ['Philips', 'philips', 16], ['P&G', 'pg', 26], ['Audi', 'audi', 23]];

// A tab's picture, filling the step card (the live page's picture).
const photoScene = (src, alt) => function PhotoScene({ active, reduce }) {
  return (
    <div className="absolute inset-0 p-[6%]">
      <motion.img src={src} alt={alt} loading="lazy" draggable={false}
        className="size-full rounded-[18px] bg-white object-contain shadow-[0_26px_60px_-24px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.06]"
        initial={false}
        animate={active || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: active && !reduce ? 0.12 : 0 }} />
    </div>
  );
};

// The small pictures in the "How Frank works" cards: the live page's picture where it has one, else a plain card drawn here.
const VISUALS = {
  interview: (
    <div className="flex w-full max-w-[320px] flex-col gap-2.5 font-sans text-[14px] leading-[1.4]">
      <p className="m-0 max-w-[85%] self-end rounded-[14px] rounded-br-[4px] bg-[#f3f1e6] px-3.5 py-2.5 text-ink">It was fine, I guess.</p>
      <p className="m-0 max-w-[90%] self-start rounded-[14px] rounded-bl-[4px] bg-[#0f2e27] px-3.5 py-2.5 text-white">Fine how? What did you expect to happen?</p>
      <p className="m-0 max-w-[85%] self-end rounded-[14px] rounded-br-[4px] bg-[#f3f1e6] px-3.5 py-2.5 text-ink">I expected the import to just work.</p>
    </div>),
  progress: (
    <div className="w-full max-w-[320px]">
      <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Overnight</p>
      <p className={FIG + ' m-0 mt-1 text-[36px] font-medium leading-none tracking-[-0.03em] text-ink'}>112 / 100+</p>
      <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[#eef6df]"><div className="h-full w-[92%] rounded-full bg-[#9bc653]" /></div>
      <p className="m-0 mt-3 flex items-center gap-1.5 font-sans text-[13px] text-ink-2"><Check className="size-4 text-[#5f8f22]" strokeWidth={2.2} />Results ready by morning</p>
    </div>),
  drivers: (
    <div className="w-full max-w-[320px]">
      <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">What moved them</p>
      {[['Clear pricing page', 82], ['A friend’s referral', 64], ['Free trial', 51]].map(([t, v]) => (
        <div key={t} className="mt-3">
          <div className="flex justify-between font-sans text-[13.5px] text-ink"><span>{t}</span><span className="text-ink-2">{v}%</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef6df]"><div className="h-full rounded-full bg-[#9bc653]" style={{ width: v + '%' }} /></div>
        </div>
      ))}
    </div>),
  leaks: (
    <div className="w-full max-w-[320px]">
      <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Landing page leak</p>
      <p className={FIG + ' m-0 mt-2 text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-ink'}>“I couldn’t tell what the plans included.”</p>
      <div className="mt-3.5 flex items-center gap-2 rounded-[12px] bg-[#d1f899] px-3.5 py-2.5 font-sans text-[13.5px] font-medium text-[#2a321e]"><Check className="size-4" strokeWidth={2.4} />Fix: add a plan comparison table</div>
      <p className="m-0 mt-3 font-sans text-[13px] text-ink-2">Mentioned by 41 of 112 customers</p>
    </div>),
};
const visualOf = (slug, img) => VISUALS[img] || <img src={`/roles/${slug}/${img}.webp`} alt="" loading="lazy" draggable={false} className="h-auto max-h-[200px] w-auto max-w-full rounded-[10px] object-contain" />;

// Built once per page, so a tab's picture keeps its identity between renders.
const TABS = {}, STACK = {};
const tabsOf = slug => TABS[slug] || (TABS[slug] = ROLES[slug].features.map(([title, text, img, alt, name]) => ({
  name, title, body: [text], scene: photoScene(`/roles/${slug}/${img}.webp`, alt),
})));
const stackOf = slug => STACK[slug] || (STACK[slug] = ROLES[slug].how.steps.map(([name, title, text, img]) => ({ name, title, text, visual: visualOf(slug, img) })));

export default function RolePage({ slug }) {
  const d = ROLES[slug];
  const reduce = !!useReducedMotion();
  const tabs = useMemo(() => tabsOf(slug), [slug]);
  const stack = useMemo(() => stackOf(slug), [slug]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: a person standing on white, cards floating around them */}
          <RoleHero d={d} person={`/roles/${slug}/person.webp`} />

          {/* 2 — Credibility: the "Trusted by" logo row */}
          <section aria-label="Trusted by 1,000+ brands" className="px-4 pt-[clamp(56px,6vw,88px)] sm:px-[clamp(16px,4vw,48px)]">
            <ScrubText reduce={reduce} className="mx-auto max-w-[1312px] text-center">
              <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">{d.trust}</p>
              <BrandMarquee brands={BRANDS} logos={PL_LOGOS} />
            </ScrubText>
          </section>

          {/* 3 — The problem: the home page's progress tabs, each with the live page's picture */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={tabs} label={d.problem.label} lines={d.problem.lines} subtitle={d.problem.sub} id="rl-problem-title" slider />
          </div>

          {/* 4 — How Frank works: the steps stacking one below the other */}
          <RoleStack d={d.how} steps={stack} reduce={reduce} />

          {/* 5 — Use cases */}
          <section aria-labelledby="rl-uc-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1200px]">
              <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">{d.useCases.label}</Eyebrow></ScrubText>
              <ScrubTitle reduce={reduce} id="rl-uc-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={d.useCases.lines} />
              <ScrubText as="p" reduce={reduce} lag={0.05} className={SUBTITLE + ' mx-auto mb-0 mt-6 max-w-[44ch] text-center'}>{d.useCases.sub}</ScrubText>
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
                {d.useCases.cards.map(([title, text, href, icon], i) => {
                  const Icon = ICONS[icon];
                  return (
                    <ScrubText as="li" key={title} reduce={reduce} lag={(i % 4) * 0.05} className="flex flex-col rounded-[24px] bg-[#fffdf3] p-7 text-left shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] max-md:bg-white max-md:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] sm:p-8">
                      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.7} /></span>
                      <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[20px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">{title}</h3>
                      <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{text}</p>
                      <a href={siteHref(href)} className={'mt-6 inline-flex h-11 w-fit items-center rounded-full bg-[#d1f899] px-5 font-sans text-[14.5px] font-medium text-ink no-underline transition-[background-color] duration-300 hover:bg-[#c4ef84] sm:mt-auto sm:pt-0 ' + FOCUS}>Start Free Trial</a>
                    </ScrubText>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* 6 — Closing */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <ClosingCTA titleId="rl-cta-title" chips={false} compact lines={d.cta.lines} sub={d.cta.sub} primary={{ label: d.cta.button, href: SIGNUP }} secondary={false} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
