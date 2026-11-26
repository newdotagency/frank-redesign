// RolePage (V21.04): the five "Roles" pages of hifrank.ai (/roles/<slug>) in the V21.04 style. One layout:
// hero (person + floating cards) → credibility strip → the problem and four picture cards → "How Frank works" (progress tabs) →
// use cases → closing. The words and the pictures are the live pages' (roles/roles.json, public/roles/<slug>/).
import { useMemo } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Zap, Users, Search, ShieldCheck, MessageCircle, AlertTriangle, Quote, CalendarCheck, Phone, TrendingDown, Compass, Check } from 'lucide-react';
import Header from '../components/Header';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import HowItWorks from './HowItWorks';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import RoleHero from './RoleHero';
import ROLES from './roles/roles.json';
import soc2 from './logos/soc2.png';
import gdpr from './logos/gdpr.png';
import esomar from './logos/esomar.png';
import { siteHref } from '../lib/sitePaths';
import { FOCUS } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const EASE = [0.23, 1, 0.32, 1];
const FIG = "font-['Figtree',sans-serif]";
const ICONS = { Zap, Users, Search, ShieldCheck, MessageCircle, AlertTriangle, Quote, CalendarCheck, Phone, TrendingDown, Compass };
const SEALS = [soc2, esomar, gdpr];

// A step's picture, filling the step card (the live page's picture).
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
// The two steps with no picture on the live page: a small plain card each, on the same white panel.
const cardScene = children => function CardScene({ active, reduce }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-[6%]">
      <motion.div className="w-full max-w-[340px] rounded-[18px] bg-white p-6 shadow-[0_26px_60px_-24px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.06]"
        initial={false}
        animate={active || reduce ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : { opacity: 0, transform: 'translateY(14px) scale(0.98)' }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: active && !reduce ? 0.12 : 0 }}>{children}</motion.div>
    </div>
  );
};
const InterviewScene = cardScene(
  <div className="flex flex-col gap-2.5 font-sans text-[14px] leading-[1.4]">
    <p className="m-0 max-w-[85%] self-end rounded-[14px] rounded-br-[4px] bg-[#f3f1e6] px-3.5 py-2.5 text-ink">It was fine, I guess.</p>
    <p className="m-0 max-w-[90%] self-start rounded-[14px] rounded-bl-[4px] bg-[#0f2e27] px-3.5 py-2.5 text-white">Fine how? What did you expect to happen?</p>
    <p className="m-0 max-w-[85%] self-end rounded-[14px] rounded-br-[4px] bg-[#f3f1e6] px-3.5 py-2.5 text-ink">I expected the import to just work.</p>
  </div>);
const ProgressScene = cardScene(
  <div>
    <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Overnight</p>
    <p className={FIG + ' m-0 mt-1 text-[40px] font-medium leading-none tracking-[-0.03em] text-ink'}>112 / 100+</p>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eef6df]"><div className="h-full w-[92%] rounded-full bg-[#9bc653]" /></div>
    <p className="m-0 mt-3 flex items-center gap-1.5 font-sans text-[13px] text-ink-2"><Check className="size-4 text-[#5f8f22]" strokeWidth={2.2} />Results ready by morning</p>
  </div>);
const DriversScene = cardScene(
  <div>
    <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">What moved them</p>
    {[['Clear pricing page', 82], ['A friend’s referral', 64], ['Free trial', 51]].map(([t, v]) => (
      <div key={t} className="mt-3.5">
        <div className="flex justify-between font-sans text-[13.5px] text-ink"><span>{t}</span><span className="text-ink-2">{v}%</span></div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef6df]"><div className="h-full rounded-full bg-[#9bc653]" style={{ width: v + '%' }} /></div>
      </div>
    ))}
  </div>);
const LeaksScene = cardScene(
  <div>
    <p className="m-0 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Landing page leak</p>
    <p className={FIG + ' m-0 mt-2 text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-ink'}>“I couldn’t tell what the plans included.”</p>
    <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#d1f899] px-3.5 py-2.5 font-sans text-[13.5px] font-medium text-[#2a321e]"><Check className="size-4" strokeWidth={2.4} />Fix: add a plan comparison table</div>
    <p className="m-0 mt-3 font-sans text-[13px] text-ink-2">Mentioned by 41 of 112 customers</p>
  </div>);
const SCENES = { interview: InterviewScene, progress: ProgressScene, drivers: DriversScene, leaks: LeaksScene };

const STEPS = {};
const stepsOf = slug => STEPS[slug] || (STEPS[slug] = ROLES[slug].how.steps.map(([name, title, text, img]) => ({
  name, title, body: [text], scene: SCENES[img] || photoScene(`/roles/${slug}/${img}.webp`, title),
})));

export default function RolePage({ slug }) {
  const d = ROLES[slug];
  const reduce = !!useReducedMotion();
  const steps = useMemo(() => stepsOf(slug), [slug]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: a person standing on white, cards floating around them */}
          <RoleHero d={d} person={`/roles/${slug}/person.webp`} />

          {/* 2 — Credibility */}
          <section aria-label="Credibility" className="px-4 pt-[clamp(56px,6vw,88px)] sm:px-[clamp(16px,4vw,48px)]">
            <ScrubText reduce={reduce} className="mx-auto max-w-[1000px] text-center">
              <p className={FIG + ' m-0 text-[20px] font-medium tracking-[-0.02em] text-ink'}>{d.trust.title}</p>
              <p className="m-0 mt-1.5 font-sans text-[15px] text-ink-2">{d.trust.sub}</p>
              <ul className="m-0 mt-8 grid list-none gap-3 p-0 text-left sm:grid-cols-3">
                {d.trust.badges.map(([name, text], i) => (
                  <li key={name} className="flex items-center gap-4 rounded-[20px] bg-[#fffdf3] p-5 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)]">
                    <img src={SEALS[i]} alt="" loading="lazy" draggable={false} className="size-12 shrink-0 object-contain" />
                    <div><p className="m-0 font-sans text-[15px] font-medium text-ink">{name}</p><p className="m-0 mt-0.5 font-sans text-[13px] leading-[1.4] text-ink-2">{text}</p></div>
                  </li>
                ))}
              </ul>
            </ScrubText>
          </section>

          {/* 3 — The problem, and four cards with their pictures */}
          <section aria-labelledby="rl-problem-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">{d.problem.label}</Eyebrow></ScrubText>
                <ScrubTitle reduce={reduce} id="rl-problem-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={d.problem.lines} />
                <ScrubText as="p" reduce={reduce} lag={0.05} className={SUBTITLE + ' mx-auto mb-0 mt-6 max-w-[44ch] text-center'}>{d.problem.sub}</ScrubText>
                <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-2">
                  {d.features.map(([title, text, img, alt], i) => {
                    const Icon = ICONS[d.featureIcons[i]];
                    return (
                      <ScrubText as="li" key={title} reduce={reduce} lag={(i % 2) * 0.05} className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)] max-md:shadow-[0_0_0_1px_rgba(26,23,20,0.14)]">
                        <div className="p-7 sm:p-8">
                          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.7} /></span>
                          <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[21px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">{title}</h3>
                          <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{text}</p>
                        </div>
                        <div className="mt-auto grid place-items-center bg-[#f7f5ea] p-6"><img src={`/roles/${slug}/${img}.webp`} alt={alt} loading="lazy" draggable={false} className="h-auto max-h-[300px] w-auto max-w-full object-contain" /></div>
                      </ScrubText>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>

          {/* 4 — How Frank works: the home page's progress tabs */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label={d.how.label} lines={d.how.lines} subtitle={d.how.sub} id="rl-how-title" slider />
          </div>

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
