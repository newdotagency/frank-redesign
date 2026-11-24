// FeaturePage (V21.04): one template for the four Platform > Features pages (global scalability, always on
// availability, transparency & security, automated summaries). Same frame as the voice and pricing pages:
//   the shared Header and Footer, a forest-green hero, "Trusted by", how it works (three steps), what you get
//   (three cards), best use cases, the other features, security, the FAQ and a lime closing panel.
// The words are the live pages' (hifrank.ai/features/<slug>); they live in features/data.js.
import { useRef } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Award, Check, Clock3, FileText, Globe, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import { PL_LOGOS } from './logos/prelaunchBrands';
import FAQ from './FAQ';
import Footer from './Footer';
import soc2 from './logos/soc2.png';
import gdpr from './logos/gdpr.png';
import { FEATURES, RELATED_CARDS } from './features/data';

const SIGNUP = 'https://app.hifrank.ai/signup';
const TRY = 'https://www.hifrank.ai/try-frank';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const ICONS = { Globe, Clock3, ShieldCheck, FileText };
const BRANDS = [
  ['Bosch', 'bosch', 20], ['Ducati', 'ducati', 17], ['3M', '3m', 26], ['Haier', 'haier', 24], ['Philips', 'philips', 16], ['P&G', 'pg', 26], ['Audi', 'audi', 23],
];
const SECURITY = [
  { name: 'SOC 2', text: 'Independently audited for top-tier security and privacy.', img: soc2 },
  { name: 'Award winning methodology', text: 'Prelaunch.com is the Silver Winner of the global ESOMAR Award for Breakthrough Research Methodology', icon: Award },
  { name: 'GDPR', text: 'Privacy built to meet EU regulations.', img: gdpr },
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

const Note = ({ dark = false }) => (
  <p className={'m-0 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[13.5px] ' + (dark ? 'text-ink/70' : 'text-white/60')}>
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />Claim 225 signup credits</span>
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />No credit card required</span>
  </p>
);

function toHow(e) {
  const el = document.getElementById('ft-how');
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
}

export default function FeaturePage({ slug }) {
  const f = FEATURES[slug];
  const reduce = !!useReducedMotion();
  const Icon = ICONS[f.icon];
  const faqs = f.faqs.map(([q, a]) => ({ q, a: [a] }));
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Hero */}
          <section aria-labelledby="ft-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-16 text-center sm:px-10 md:rounded-[44px] xl:py-[clamp(88px,8vw,128px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 55% at 50% 60%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">{f.label}</Eyebrow></Rise>
                <Rise reduce={reduce} delay={0.04}>
                  <span aria-hidden="true" className="mx-auto mb-7 grid size-16 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-7" strokeWidth={1.5} /></span>
                </Rise>
                <Rise as="h1" reduce={reduce} delay={0.08} id="ft-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                  {f.heroLines.map(l => <span key={l} className="block">{l}</span>)}
                  {f.heroItalic && <span className="block italic">{f.heroItalic}</span>}
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.16} className="mx-auto mb-0 mt-6 max-w-[52ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">{f.sub}</Rise>
                <Rise reduce={reduce} delay={0.24} className="mt-9 flex flex-wrap justify-center gap-3">
                  <Btn href={SIGNUP} tone="lime">{f.cta}</Btn>
                  <Btn href="#ft-how" onClick={toHow} tone="ghost" arrow={false}>See how it works</Btn>
                </Rise>
                <Rise reduce={reduce} delay={0.3}><Note /></Rise>
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

          {/* 3 — How it works */}
          <section id="ft-how" aria-labelledby="ft-how-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="ft-how-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['How it works']} />
              <ol className="m-0 mt-14 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-0 sm:mt-16">
                {f.how.map(([t, d], i) => (
                  <ScrubText as="li" key={t} reduce={reduce} lag={i * 0.06}
                    className={'md:px-10 ' + (i ? 'border-0 border-t border-solid border-[#1a1714]/[0.07] pt-10 md:border-l md:border-t-0 md:pt-0' : 'md:pl-0')}>
                    <p className="m-0 font-['Figtree',sans-serif] text-[56px] font-medium leading-none tracking-[-0.04em] text-[#5f8f22] sm:text-[64px]">{i + 1}</p>
                    <h3 className="m-0 mt-5 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{t}</h3>
                    <p className="m-0 mt-3 font-sans text-[16px] leading-[1.6] text-ink-2">{d}</p>
                  </ScrubText>
                ))}
              </ol>
            </div>
          </section>

          {/* 4 — What you get */}
          <section aria-labelledby="ft-get-title" className="px-4 pt-[clamp(88px,10vw,150px)] md:px-10">
            <div className="rounded-[32px] bg-[#fffdf3] px-5 py-[clamp(56px,7vw,112px)] sm:px-10 md:rounded-[44px]">
              <div className="mx-auto max-w-[1200px]">
                  <ScrubTitle reduce={reduce} id="ft-get-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['What you get']} />
                <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
                  {f.get.map(([t, d], i) => (
                    <ScrubText as="li" key={t} reduce={reduce} lag={i * 0.06}
                      className="rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:p-8">
                      <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Check className="size-5" strokeWidth={2} /></span>
                      <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{t}</h3>
                      <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{d}</p>
                    </ScrubText>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5 — Best use cases */}
          <section aria-labelledby="ft-use-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="ft-use-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Best use cases']} />
              <ScrubText reduce={reduce} lag={0.1} className="mt-8 flex justify-center"><Btn href={TRY} ext tone="white">Try it now</Btn></ScrubText>
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-14 sm:grid-cols-2">
                {f.uses.map(([t, d], i) => (
                  <ScrubText as="li" key={t} reduce={reduce} lag={(i % 2) * 0.06}
                    className="rounded-[24px] p-7 shadow-[0_0_0_1px_rgba(26,23,20,0.08)] sm:p-8">
                    <h3 className="m-0 font-['Figtree',sans-serif] text-[21px] font-medium leading-tight tracking-[-0.02em] text-ink">{t}</h3>
                    <p className="m-0 mt-2.5 font-sans text-[15.5px] leading-[1.6] text-ink-2">{d}</p>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>

          {/* 6 — Related features */}
          <section aria-labelledby="ft-rel-title" className="px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="ft-rel-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Related features']} />
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
                {f.related.map((s, i) => (
                  <ScrubText as="li" key={s} reduce={reduce} lag={i * 0.06}>
                    <a href={'/features/' + s} className={'group flex h-full flex-col rounded-[24px] bg-[#fffdf3] p-7 no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] transition-[background-color] duration-300 hover:bg-[#fbf8e8] sm:p-8 ' + FOCUS}>
                      <h3 className="m-0 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{RELATED_CARDS[s].title}</h3>
                      <p className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{RELATED_CARDS[s].text}</p>
                      <span className="mt-6 inline-flex items-center gap-2 pt-1 font-sans text-[15px] font-medium text-ink">Learn more
                        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" strokeWidth={1.75} />
                      </span>
                    </a>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>

          {/* 7 — Security */}
          <section aria-labelledby="ft-sec-title" className="relative px-4 pt-[clamp(88px,10vw,150px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="ft-sec-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Enterprise-grade security', '& compliance']} />
              <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-16 md:grid-cols-3">
                {SECURITY.map((s, i) => (
                  <ScrubText as="li" key={s.name} reduce={reduce} lag={i * 0.06}
                    className="rounded-[24px] bg-[#fffdf3] p-7 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] sm:p-8">
                    <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">
                      {s.img ? <img src={s.img} alt="" className="size-11 object-contain" /> : <s.icon className="size-7 text-[#5f8f22]" strokeWidth={1.5} />}
                    </span>
                    <h3 className="m-0 mt-6 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{s.name}</h3>
                    <p className="m-0 mt-2 font-sans text-[15.5px] leading-[1.55] text-ink-2">{s.text}</p>
                  </ScrubText>
                ))}
              </ul>
            </div>
          </section>

          <div className="pt-[clamp(56px,7vw,112px)]">
            <FAQ items={faqs} label="FAQ" lines={['Have questions?', 'We have answers']} id="ft-faq-title" />
          </div>

          {/* Closing, in Frank's lime */}
          <section aria-labelledby="ft-cta-title" className="relative px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(88px,10vw,160px)] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(72px,9vw,128px)] text-center md:rounded-[44px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 100%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <div aria-hidden="true" className="mx-auto w-[84px] sm:w-[100px]"><Glasses pose="Ready" reduced={reduce} /></div>
                <ScrubTitle reduce={reduce} id="ft-cta-title" className={'m-0 mt-8 leading-[1.06] text-ink [text-wrap:balance] sm:mt-10 ' + TITLE} lines={f.closeLines} />
                <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 mt-6 max-w-[46ch] [text-wrap:balance] ' + SUBTITLE}>{f.closeSub}</ScrubText>
                <ScrubText reduce={reduce} lag={0.25}>
                  <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9"><Btn href={SIGNUP}>{f.closeCta}</Btn></div>
                  <Note dark />
                </ScrubText>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
