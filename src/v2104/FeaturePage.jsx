// FeaturePage (V21.04): one template for the four Platform > Features pages. It reuses the redesigned pages' own parts:
//   Header and Footer; a forest-green hero (the tag, title and actions);
//   "Trusted by"; HowItWorks (the home page's progress tabs, the original visual in each step's card);
//   What you get (a card per feature, with its visual); UseCases (the home page's wheel, with the original icons);
//   Related features (three static cards, each with its visual); SecuritySection (shared with the AI voice interviewer page);
//   FAQ; ClosingCTA (the home page's closing panel, with this page's words); Footer.
// The words are the live pages' (hifrank.ai/features/<slug>, in features/data.js); the visuals are theirs too
// (features/media.js, public/features/<slug>/), in the original's own cream and olive.
import { useMemo } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import { PL_LOGOS } from './logos/prelaunchBrands';
import HowItWorks from './HowItWorks';
import UseCases from './UseCases';
import SecuritySection from './SecuritySection';
import ClosingCTA from './ClosingCTA';
import FAQ from './FAQ';
import Footer from './Footer';
import { FEATURES, RELATED_CARDS } from './features/data';
import { MEDIA, RELATED_IMG, iconSvg } from './features/media';
import { imageScene } from './features/scenes';

const SIGNUP = 'https://app.hifrank.ai/signup';
const TRY = '/try-frank'; // the Try Frank page on this site
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const BRANDS = [
  ['Bosch', 'bosch', 20], ['Ducati', 'ducati', 17], ['3M', '3m', 26], ['Haier', 'haier', 24], ['Philips', 'philips', 16], ['P&G', 'pg', 26], ['Audi', 'audi', 23],
];
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

function Btn({ href, onClick, tone = 'ink', children, arrow = true, ext = false }) {
  const tones = {
    ink: 'bg-[#1a1714] text-white hover:bg-[#2a2622]',
    lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]',
    white: 'bg-white text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.08)] hover:bg-[#fafaf7]',
    ghost: 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:bg-white/[0.14]',
  };
  return (
    <a href={href} onClick={onClick} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={'group inline-flex h-12 items-center gap-3 rounded-full font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ' + (arrow ? 'py-1.5 pl-5 pr-1.5 ' : 'px-6 ') + tones[tone] + ' ' + FOCUS}>
      {children}
      {arrow && (
        <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5 ' + (tone === 'ink' || tone === 'ghost' ? 'bg-white/[0.12]' : 'bg-[#1a1714]/[0.07]')}>
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </a>
  );
}

const Note = () => (
  <p className="m-0 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[13.5px] text-white/60">
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />Claim 225 signup credits</span>
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />No credit card required</span>
  </p>
);

function toHow(e) {
  const el = document.getElementById('ft-how-title');
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: reduce ? 'auto' : 'smooth' });
}

// The how-it-works steps for a page (scenes built once, so a step's visual keeps its identity between renders).
const STEPS = {};
const stepsOf = slug => STEPS[slug] || (STEPS[slug] = FEATURES[slug].how.map(([title, text], i) => ({
  name: MEDIA[slug].names[i], title, body: [text], scene: imageScene(MEDIA[slug].how[i], title),
})));

// The use cases, in the home page's wheel: each with its original icon, drawn in the page's greens.
const kitOf = slug => ({
  cases: FEATURES[slug].uses.map(([name, problem], i) => ({ id: 'u' + i, name, problem, svg: iconSvg(MEDIA[slug].icons[i]) })),
  color: () => '#5f8f22',
  labels: { a: null, b: null, cta: 'Try it now' },
  icon: (c, size, on) => (
    <span aria-hidden="true" className="grid shrink-0 place-items-center transition-[background-color,color] duration-300"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: on ? '#d1f899' : 'rgba(26,23,20,0.05)', color: on ? '#2a321e' : 'rgba(26,23,20,0.45)' }}>
      <span className="block [&>svg]:size-full" style={{ width: size * 0.55, height: size * 0.55 }} dangerouslySetInnerHTML={{ __html: c.svg }} />
    </span>
  ),
});

// What you get: each feature with its visual, in a card.
function GetCard({ title, text, src, i, reduce }) {
  return (
    <ScrubText as="li" reduce={reduce} lag={i * 0.06} className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">
      <div className="grid aspect-[4/3] place-items-center bg-[#f4f2ec] p-5 sm:p-6">
        <img src={src} alt="" loading="lazy" draggable={false} className="max-h-full max-w-full rounded-[14px] object-contain" />
      </div>
      <div className="p-7 sm:p-8">
        <h3 className="m-0 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{title}</h3>
        <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{text}</p>
      </div>
    </ScrubText>
  );
}

// Related features: three static cards side by side, each with its visual (as on the original page).
function Related({ slugs, reduce }) {
  return (
    <section aria-labelledby="ft-rel-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <ScrubTitle reduce={reduce} id="ft-rel-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Related features']} />
        <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
          {slugs.map((s, i) => (
            <ScrubText as="li" key={s} reduce={reduce} lag={i * 0.06}>
              <a href={'/features/' + s} className={'group flex h-full flex-col overflow-hidden rounded-[24px] bg-[#fffdf3] text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] ' + FOCUS}>
                <span className="grid aspect-[4/3] place-items-center overflow-hidden bg-[#d1f899]">
                  <img src={RELATED_IMG[s]} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
                </span>
                <span className="flex flex-1 flex-col p-7 sm:p-8">
                  <span className="hiw-step-title block text-[22px] leading-tight text-ink">{RELATED_CARDS[s].title}</span>
                  <span className="mt-3 block font-sans text-[15.5px] leading-[1.6] text-ink-2">{RELATED_CARDS[s].text}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-sans text-[15px] font-medium text-ink">Learn more
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" strokeWidth={1.75} />
                  </span>
                </span>
              </a>
            </ScrubText>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function FeaturePage({ slug }) {
  const f = FEATURES[slug];
  const m = MEDIA[slug];
  const reduce = !!useReducedMotion();
  const faqs = f.faqs.map(([q, a]) => ({ q, a: [a] }));
  const steps = useMemo(() => stepsOf(slug), [slug]);
  const kit = useMemo(() => kitOf(slug), [slug]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero: the tag, title, line and actions, then the original page's product visual. */}
          <section aria-labelledby="ft-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(88px,8vw,128px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{f.label}</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="ft-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  {f.heroLines.map(l => <span key={l} className="block">{l}</span>)}
                  {f.heroItalic && <span className="block italic">{f.heroItalic}</span>}
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-6 max-w-[52ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">{f.sub}</Rise>
                <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3">
                  <Btn href={SIGNUP} tone="lime">{f.cta}</Btn>
                  <Btn href="#ft-how-title" onClick={toHow} tone="ghost" arrow={false}>See how it works</Btn>
                </Rise>
                <Rise reduce={reduce} delay={0.28}><Note /></Rise>
              </div>
            </div>
          </section>

          {/* 2 — Trusted by */}
          <section aria-label="Trusted by 1,000+ brands" className="px-4 pt-[clamp(56px,6vw,88px)] sm:px-[clamp(16px,4vw,48px)]">
            <ScrubText reduce={reduce} className="mx-auto max-w-[1312px] text-center">
              <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">Trusted by 1,000+ brands</p>
              <ul className="m-0 mt-8 flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6 p-0 text-[#a39d93] sm:gap-x-14">
                {BRANDS.map(([name, key, h]) => (
                  <li key={key} className="flex items-center">
                    <span className="sr-only">{name}</span>
                    <span aria-hidden="true" className="flex items-center [&>svg]:h-full [&>svg]:w-auto" style={{ height: h }} dangerouslySetInnerHTML={{ __html: PL_LOGOS[key] }} />
                  </li>
                ))}
              </ul>
            </ScrubText>
          </section>

          {/* 3 — How it works: the home page's progress tabs, with the original page's visual in each step. */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <HowItWorks steps={steps} label="How it works" lines={m.howLines} subtitle={null} id="ft-how-title" />
          </div>

          {/* 4 — What you get */}
          <section aria-labelledby="ft-get-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                <ScrubTitle reduce={reduce} id="ft-get-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['What you get']} />
                <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
                  {f.get.map(([t, d], i) => <GetCard key={t} title={t} text={d} src={m.get[i]} i={i} reduce={reduce} />)}
                </ul>
              </div>
            </div>
          </section>

          {/* 5 — Best use cases: the home page's use-case wheel */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <UseCases kit={kit} href={TRY} sectionClass="relative px-4 sm:px-[clamp(16px,4vw,48px)]"
              head={{ eyebrow: 'Use cases', lines: ['Best use cases'], sub: null, titleId: 'ft-use-title' }} />
          </div>

          {/* 6 — Related features */}
          <Related slugs={f.related} reduce={reduce} />

          {/* 7 — Security: the same section as on the AI voice interviewer page */}
          <div className="pt-[clamp(88px,10vw,150px)]">
            <SecuritySection reduce={reduce} id="ft-sec-title" />
          </div>

          <FAQ items={faqs} label="FAQ" lines={['Have questions?', 'We have answers']} id="ft-faq-title" />

          {/* Closing: the home page's closing panel with this page's words */}
          <div className="pt-[clamp(88px,10vw,160px)]">
            <ClosingCTA titleId="ft-cta-title" chips={false} compact lines={f.closeLines} sub={f.closeSub}
              primary={{ label: f.closeCta, href: SIGNUP }} secondary={{ label: 'Try a live demo', href: TRY }} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
