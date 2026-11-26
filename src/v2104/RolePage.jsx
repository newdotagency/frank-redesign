// RolePage (V21.04): the five "Roles" pages of hifrank.ai (/roles/<slug>) in the V21.04 style. One layout:
// hero (copy left, person right) → "Trusted by" → the problem (progress tabs with pictures) → "How Frank works" (stacking cards) →
// use cases → closing. The words and the pictures are the live pages' (roles/roles.json, public/roles/<slug>/).
import { useMemo } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import UseCases from './UseCases';
import { iconSvg } from './features/media';
import { SPEED_SCENES } from './features/SpeedScenes';
import { SCALE_SCENES } from './features/ScaleScenes';
import { PRICE_SCENES } from './features/PriceScenes';
import { QUALITY_SCENES } from './features/QualityScenes';
import { SUMMARIES_SCENES } from './features/SummariesScenes';
import { TRANSPARENCY_SCENES } from './features/TransparencyScenes';
import Header from '../components/Header';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import HowItWorks from './HowItWorks';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import RoleHero from './RoleHero';
import ROLES from './roles/roles.json';
import TrustStrip from './TrustStrip';
import RoleStack from './RoleStack';
import { siteHref } from '../lib/sitePaths';
import { FOCUS } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const EASE = [0.23, 1, 0.32, 1];
const FIG = "font-['Figtree',sans-serif]";
// The use cases, in the home page's wheel: each with its icon, drawn in the page's greens (as the feature pages do).
const kitOf = slug => ({
  cases: ROLES[slug].useCases.cards.map(([name, problem, path, icon], i) => ({ id: 'u' + i, name, problem, href: siteHref(path), svg: iconSvg(icon) })),
  color: () => '#5f8f22',
  labels: { a: null, b: null, cta: 'See this use case' },
  icon: (c, size, on) => (
    <span aria-hidden="true" className="grid shrink-0 place-items-center transition-[background-color,color] duration-300"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: on ? '#d1f899' : 'rgba(26,23,20,0.05)', color: on ? '#2a321e' : 'rgba(26,23,20,0.45)' }}>
      <span className="block [&>svg]:size-full" style={{ width: size * 0.55, height: size * 0.55 }} dangerouslySetInnerHTML={{ __html: c.svg }} />
    </span>
  ),
});

// The tabs' pictures: the feature and benefit pages' own scenes (drawn in the page's colours), picked per tab in roles.json as "set.index".
const SCENE_SETS = { speed: SPEED_SCENES, scale: SCALE_SCENES, price: PRICE_SCENES, quality: QUALITY_SCENES, summaries: SUMMARIES_SCENES, transparency: TRANSPARENCY_SCENES };
const sceneOf = key => { const [set, i] = (key || '').split('.'); return SCENE_SETS[set]?.[+i]; };

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

// Built once per page, so a tab's picture keeps its identity between renders.
const TABS = {}, STACK = {};
const tabsOf = slug => TABS[slug] || (TABS[slug] = ROLES[slug].features.map(([title, text, img, alt, name, scene]) => ({
  name, title, body: [text], scene: sceneOf(scene) || photoScene(`/roles/${slug}/${img}.webp`, alt),
})));
const stackOf = slug => STACK[slug] || (STACK[slug] = ROLES[slug].how.steps.map(([name, title, text]) => ({ name, title, text })));

export default function RolePage({ slug }) {
  const d = ROLES[slug];
  const reduce = !!useReducedMotion();
  const tabs = useMemo(() => tabsOf(slug), [slug]);
  const stack = useMemo(() => stackOf(slug), [slug]);
  const kit = useMemo(() => kitOf(slug), [slug]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative [text-wrap:pretty]" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: a person standing on white, cards floating around them */}
          <RoleHero d={d} person={`/roles/${slug}/person.webp`} />

          {/* 2 — Credibility: the "Trusted by" logo row */}
          <TrustStrip />

          {/* 3 — The problem: the home page's progress tabs, each with the live page's picture */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={tabs} label={d.problem.label} lines={d.problem.lines} subtitle={d.problem.sub} id="rl-problem-title" slider />
          </div>

          {/* 4 — How Frank works: the steps stacking one below the other */}
          <RoleStack d={d.how} steps={stack} reduce={reduce} />

          {/* 5 — Use cases: the home page's use-case wheel (as on the feature pages) */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <UseCases kit={kit} href="/try-frank" sectionClass="relative px-4 sm:px-[clamp(16px,4vw,48px)]"
              head={{ eyebrow: d.useCases.label, lines: d.useCases.lines, sub: d.useCases.sub, titleId: 'rl-uc-title' }} />
          </div>

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
