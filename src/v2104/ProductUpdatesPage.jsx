// ProductUpdatesPage (V21.04): hifrank.ai/product-updates ("What's New") in the V21.04 style. The six updates (titles,
// dates, words) are the live pages', in product-updates/updates.json, newest first. The page:
//   1. Masthead: the label, "What's new" and a line (how many releases, the latest date).
//   2. The latest update as a card (its screenshot beside the title, line and button), then the others as rows
//      (date · title and line · what else shipped · arrow); every one opens its own page.
//   3. The home page's closing panel with the live page's ask ("Try Frank AI Researcher Yourself"), then the footer.
// Entrance: the masthead rises in once on load; the rest rises in with the scroll. Reduced motion: fades only.
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { TITLE, Eyebrow } from './titles';
import { ScrubText } from './reveal';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import { siteHref } from '../lib/sitePaths';
import { Btn, Date_, FOCUS, Rise, SIGNUP, UPDATES, hrefOf } from './product-updates/parts';

const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const [LATEST, ...OTHERS] = UPDATES;
const shot = u => u.blocks.find(b => b.t === 'img')?.src;

function Masthead({ reduce }) {
  return (
    <section aria-labelledby="pu-title" className="px-4 pt-[196px] sm:px-[clamp(16px,4vw,48px)] sm:pt-[160px]">
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-12 sm:pb-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-16">
        <div>
          <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Product updates</Eyebrow></Rise>
          <Rise as="h1" reduce={reduce} delay={0.06} id="pu-title" className={'m-0 pb-1 leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}>What’s new</Rise>
        </div>
        <Rise as="p" reduce={reduce} delay={0.14} className="m-0 font-sans text-[17px] leading-[1.6] text-ink-2 sm:text-[18px] lg:pb-2">
          {UPDATES.length} releases, newest first. <span className="text-ink-3">Latest <time>{LATEST.date}</time>.</span>
        </Rise>
      </div>
    </section>
  );
}

// The newest update: its screenshot beside the words.
function Latest({ u, reduce }) {
  const img = shot(u);
  return (
    <Rise as="article" reduce={reduce} delay={0.2} className="grid overflow-hidden rounded-[32px] bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:rounded-[40px]">
      <div className="flex flex-col p-7 sm:p-10 lg:p-[clamp(36px,3.6vw,56px)]">
        <p className="m-0 flex items-center gap-3">
          <span className="inline-flex h-7 items-center rounded-full bg-[#d1f899] px-3 font-sans text-[12.5px] font-medium text-[#2a321e]">Latest</span>
          <Date_>{u.date}</Date_>
        </p>
        <h2 className={'m-0 mt-6 text-[clamp(28px,3.2vw,42px)] leading-[1.1] text-ink [text-wrap:balance] ' + TITLE}>
          <a href={hrefOf(u)} className={'text-ink no-underline ' + FOCUS}>{u.title}</a>
        </h2>
        <p className="m-0 mt-5 max-w-[46ch] font-sans text-[17px] leading-[1.6] text-ink-2">{u.excerpt}</p>
        <div className="mt-8 lg:mt-auto lg:pt-10"><Btn href={hrefOf(u)}>Read the update</Btn></div>
      </div>
      <a href={hrefOf(u)} tabIndex={-1} aria-hidden="true" className="relative grid min-h-[280px] place-items-center bg-[#d1f899] p-[8%]">
        {img && <img src={img} alt="" loading="lazy" draggable={false} className="max-h-full max-w-full rounded-[16px] bg-white object-contain shadow-[0_26px_60px_-24px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.06]" />}
      </a>
    </Rise>
  );
}

// An earlier update: one row.
function Row({ u }) {
  return (
    <li className="border-0 border-b border-solid border-[#1a1714]/[0.08]">
      <a href={hrefOf(u)} className={'group grid gap-x-10 gap-y-3 py-8 text-ink no-underline sm:py-10 md:grid-cols-[170px_minmax(0,1fr)_auto] md:items-start ' + FOCUS}>
        <Date_ className="md:pt-2">{u.date}</Date_>
        <div>
          <h3 className={'hiw-step-title m-0 text-[clamp(22px,2.4vw,30px)] leading-[1.15] text-ink [text-wrap:balance] transition-colors duration-300'}>{u.title}</h3>
          <p className="m-0 mt-3 max-w-[60ch] font-sans text-[16px] leading-[1.6] text-ink-2">{u.excerpt}</p>
          {u.also.length > 0 && (
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
              {u.also.slice(0, 3).map(a => (
                <li key={a} className="rounded-full bg-[#1a1714]/[0.04] px-3 py-1.5 font-sans text-[13px] leading-[1.3] text-ink-2">{a.replace(/\*+/g, '')}</li>
              ))}
            </ul>
          )}
        </div>
        <span aria-hidden="true" className="hidden size-11 place-items-center justify-self-end rounded-full bg-[#1a1714]/[0.05] text-ink transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-[#d1f899] md:grid motion-safe:group-hover:translate-x-0.5">
          <ArrowRight className="size-[18px]" strokeWidth={1.75} />
        </span>
      </a>
    </li>
  );
}

export default function ProductUpdatesPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          <Masthead reduce={reduce} />
          <section aria-label="Updates" className="px-4 pb-[clamp(88px,10vw,150px)] pt-10 sm:px-[clamp(16px,4vw,48px)] sm:pt-12 lg:pt-14">
            <div className="mx-auto max-w-[1312px]">
              <Latest u={LATEST} reduce={reduce} />
              <ScrubText reduce={reduce} className="mt-6 sm:mt-10">
                <ul className="m-0 list-none border-0 border-t border-solid border-[#1a1714]/[0.08] p-0">
                  {OTHERS.map(u => <Row key={u.slug} u={u} />)}
                </ul>
              </ScrubText>
            </div>
          </section>
          <ClosingCTA titleId="pu-cta-title" chips={false} compact
            lines={['Try Frank AI Researcher', 'Yourself']}
            sub="Watch it ask questions, adapt, and go deep with real customer insights. Try it now. It’s a lot of fun!"
            primary={{ label: 'Sign up for free', href: SIGNUP }} secondary={{ label: 'Try a Live Demo', href: siteHref('/try-frank') }} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
