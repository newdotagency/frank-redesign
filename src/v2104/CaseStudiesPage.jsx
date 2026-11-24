// CaseStudiesPage (V21.04): hifrank.ai/case-study brought into the V21.04 style, laid out for many case
// studies, not just one. Everything about TCF (title, summary, quote, banner) is taken word for word from the
// live study, read on 2026-11-20, and links there. Lumera and 10Web are the two stories on the home page
// (CustomerStory), with the same words; their cards open that section. 10Web keeps the home page's
// [brackets] where the real details are still to come, and the last three cards are template slots in
// [brackets] under real Frank use cases, so no company, headline or number is made up. Add a study by adding
// an entry to CASES. The live hero reused the blog's title and line, so the masthead uses the home page's
// customer-proof line instead.
// Layout (its own, so it doesn't read as a second blog), on the home page's container where it holds
// content (CLAUDE.md, "Frank landing pages: page container"):
//   1. Hero: the forest-green panel of the pricing and voice pages as an editorial split: title, line,
//      "Browse all stories" and the companies on the left; a TCF quote card and Lumera's story card
//      stacked on the right.
//   2. All case studies: an index, not a grid: a sticky column with the title and the use cases as a
//      vertical filter list, beside one wide row per story.
//   3. Closing: the lime panel (the site-wide closing), then the footer.
// Entrance: the hero rises in on load; the rest rises in with the scroll.
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import Banner from './Cover';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import Footer from './Footer';

const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';

const TCF = {
  href: 'https://www.hifrank.ai/case-study/tcf-win-loss-analysis',
  brand: 'TCF',
  kind: 'Win-loss analysis',
  title: 'Win-Loss Analysis at TCF: What We Learned by Looking Beyond the CRM',
  img: 'https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/6a96e151cd5d873af1933d51_Win-Loss%20Analysis%20at%20TCF.jpg',
  srcset: 'https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/6a96e151cd5d873af1933d51_Win-Loss%20Analysis%20at%20TCF-p-500.jpg 500w, https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/6a96e151cd5d873af1933d51_Win-Loss%20Analysis%20at%20TCF-p-800.jpg 800w, https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/6a96e151cd5d873af1933d51_Win-Loss%20Analysis%20at%20TCF-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/6a96e151cd5d873af1933d51_Win-Loss%20Analysis%20at%20TCF.jpg 1600w',
  summary: 'A pilot win-loss study with former prospects, to find out why promising sales conversations ended.',
  format: 'Written study',
};

// The home page's customer stories open there (its "They stopped guessing" section). `href` and `hash` stay
// separate so the build can rewrite the page address for each output.
const HOME = { href: '/', hash: '#cs-title' };
// Every case study, newest first. Slots in [brackets] are templates.
const CASES = [
  { ...TCF, useCase: 'Win-loss analysis' },
  { brand: 'Lumera', useCase: 'Customer interviews', format: 'Video story', ...HOME,
    title: 'How Lumera stopped building on assumptions',
    summary: 'David, co-founder of Lumera, on letting Frank run customer interviews 24/7, in any language or time zone.' },
  { brand: '10Web', useCase: 'Customer interviews', format: 'Video story', ...HOME,
    title: 'How 10Web hears from [number] customers a [week/month] without running a single call',
    summary: '[Name, role at 10Web] on what changed when Frank took over their customer interviews.' },
  { brand: '[Company]', useCase: 'Churn', format: '[Written study]', slot: true,
    title: '[Case study headline]', summary: '[One line on what the team learned by interviewing customers who cancelled.]' },
  { brand: '[Company]', useCase: 'Product discovery', format: '[Written study]', slot: true,
    title: '[Case study headline]', summary: '[One line on what the team decided to build after talking to customers.]' },
  { brand: '[Company]', useCase: 'Market discovery', format: '[Video story]', slot: true,
    title: '[Case study headline]', summary: '[One line on what the team learned about a new market.]' },
];
const USE_CASES = ['All', ...new Set(CASES.map(c => c.useCase))];
const hrefOf = c => (c.slot ? undefined : c.href + (c.hash || ''));

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

const InkButton = ({ href, children, ...rest }) => (
  <a href={href} {...rest}
    className={'group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-[#1a1714] py-1 pl-5 pr-1 font-sans text-[14.5px] font-medium text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2a2622] active:scale-[0.98] ' + FOCUS}>
    {children}
    <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
      <ArrowRight className="size-4" strokeWidth={1.75} />
    </span>
  </a>
);

// ——— 1. Hero: the forest-green panel of the pricing and voice pages (panel tier: 16/40px from the window
// edges), as an editorial split. Left: the label, the title, the line, "Browse all stories" (a white pill
// with its arrow in its own circle, down to the index) and the companies the stories come from. Right: two
// cards stacked like physical objects, each a card set in a thin frame (outer shell + inner core): in
// front, a TCF prospect's words from the study on cream; behind it, tilted and offset, Lumera's video story.
// The cards rise in and settle into their tilt on a spring and lift a little on hover; reduced motion: they
// simply appear. Below 1024px: one column, no tilt or overlap, and only the quote card.
const QUOTE = 'I cannot accurately measure how much those benefits are going to contribute.';
const LUMERA = CASES.find(c => c.brand === 'Lumera');
const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 };

// The thin frame around a hero card: a translucent outer shell, then the card itself with a concentric radius.
const Shell = ({ className = '', children }) => (
  <div className={'rounded-[30px] bg-white/[0.07] p-1.5 ring-1 ring-inset ring-white/[0.12] ' + className}>{children}</div>
);

// True from 1024px, where the cards stack and tilt; below that they sit straight.
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function Hero({ reduce }) {
  const wide = useWide();
  const card = (delay, rotate) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28, rotate: 0 },
    animate: { opacity: 1, y: 0, rotate: wide ? rotate : 0 },
    transition: reduce ? { duration: 0.4, delay } : { ...SPRING, delay },
  });
  return (
    <section aria-labelledby="cs-page-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 pb-[clamp(48px,6vw,88px)] pt-[clamp(48px,5vw,80px)] sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className="relative mx-auto grid max-w-[1232px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 !text-white/85 sm:mb-8">Case studies</Eyebrow></Rise>
            <Rise as="h1" reduce={reduce} delay={0.06} id="cs-page-title" className={'m-0 pb-1 text-[clamp(34px,4.4vw,56px)] leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
              <span className="block">They stopped guessing.</span><span className="block"><span className="italic">Everything changed.</span></span>
            </Rise>
            <Rise as="p" reduce={reduce} delay={0.14} className="m-0 mt-5 max-w-[42ch] font-sans text-[17px] leading-[1.55] text-white/70 sm:mt-6 sm:text-[18px]">
              How real teams use Frank to hear from their customers and prospects, and what they learned.
            </Rise>
            <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-6">
              <a href="#cs-all-title"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#d1f899] py-1.5 pl-5 pr-1.5 font-sans text-[15.5px] font-medium text-ink no-underline transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#c4ef84] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d1f899]">
                Browse all stories
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#1a1714]/[0.07] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:group-hover:translate-y-0.5 motion-safe:group-hover:scale-105">
                  <ArrowRight className="size-4 rotate-90" strokeWidth={1.5} />
                </span>
              </a>
              <p className="m-0 flex flex-wrap items-center gap-2 font-sans text-[13px] text-white/55">
                <span className="mr-1">Stories from</span>
                {['TCF', 'Lumera', '10Web'].map(b => (
                  <span key={b} className="inline-flex h-7 items-center rounded-full bg-white/[0.08] px-3 text-[13px] font-semibold tracking-[-0.01em] text-white/90 ring-1 ring-inset ring-white/[0.12]">{b}</span>
                ))}
              </p>
            </Rise>
          </div>

          {/* The stack: Lumera behind (desktop only), the TCF quote in front. */}
          <div className="relative mx-auto w-full max-w-[520px] lg:mr-0 lg:pb-10 lg:pt-6">
            <motion.a href={LUMERA.href + LUMERA.hash} {...card(0.42, 4)}
              className="group absolute -right-2 top-0 hidden w-[78%] rounded-[30px] no-underline outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:block"
              style={{ transformOrigin: '70% 100%' }}>
              <Shell className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5">
                <div className="flex h-[200px] flex-col gap-4 rounded-[24px] bg-[#13382f] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <span className="flex items-center justify-between gap-3 font-sans text-[13px] text-white/60">
                    <span className="inline-flex items-center gap-2"><span className="font-semibold text-white/90">Lumera</span><span aria-hidden="true">·</span>Video story</span>
                    <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-[#d1f899] text-ink transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                      <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                    </span>
                  </span>
                  <span className={FIG + ' max-w-[22ch] text-[18px] leading-[1.3] tracking-[-0.02em] text-white'}>{LUMERA.title}</span>
                </div>
              </Shell>
            </motion.a>

            <motion.figure {...card(0.32, -2)} className="relative m-0 lg:mt-[120px] lg:w-[88%]" style={{ transformOrigin: '30% 0%' }}>
              <Shell className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5">
                <div className="rounded-[24px] bg-[#fffdf3] px-7 pb-7 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:px-8 sm:pb-8 sm:pt-7">
                  <p className="m-0 flex items-center gap-2 font-sans text-[13px] text-ink-3">
                    <span className="inline-flex h-7 items-center rounded-full bg-white px-3 font-semibold tracking-[-0.01em] text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.08)]">TCF</span>
                    <span className="text-[#43681a]">Win-loss analysis</span>
                  </p>
                  <blockquote className="m-0 mt-5 font-serif text-[clamp(21px,2vw,26px)] italic leading-[1.35] tracking-[-0.01em] text-ink [text-wrap:pretty]">“{QUOTE}”</blockquote>
                  <figcaption className="mt-5 font-sans text-[13.5px] text-ink-3">A former prospect, in TCF’s win-loss interviews</figcaption>
                </div>
              </Shell>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— 2. All case studies, as an index: on the left a sticky column with the title and the use cases as a
// vertical list with counts (the filter); on the right one wide row per story: thumbnail, company, use case
// and format, the headline and one line, and an arrow that slides in on hover. Template slots are muted and
// not links. Below 1024px the use cases turn into a row that scrolls sideways and the rows stack tighter.
const Brand = ({ children, slot }) => (
  <span className={'inline-flex h-7 items-center rounded-full bg-white px-3 text-[13px] font-semibold tracking-[-0.01em] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.1)] ' + (slot ? 'text-ink-3' : 'text-ink')}>{children}</span>
);

function Row({ c, i, reduce }) {
  const href = hrefOf(c);
  const Tag = href ? 'a' : 'div';
  return (
    <motion.li className="border-0 border-t border-solid border-[#1a1714]/[0.08] first:border-t-0"
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(10px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}>
      <Tag {...(href ? { href } : {})}
        className={'group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 rounded-[18px] py-5 text-ink no-underline transition-colors duration-200 sm:grid-cols-[176px_minmax(0,1fr)_auto] sm:gap-7 sm:px-3 sm:py-6 sm:-mx-3 '
          + (href ? 'hover:bg-[#f6f5f1] ' + FOCUS : '')}>
        <span className="block overflow-hidden rounded-[12px] shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:rounded-[14px]">
          <Banner p={c} sizes="176px" imgClass="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:scale-[1.04]" />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-sans text-[13px] text-ink-3">
            <Brand slot={c.slot}>{c.brand}</Brand>
            <span className="text-[#43681a]">{c.useCase}</span>
            <span aria-hidden="true">·</span>
            <span>{c.format}</span>
          </span>
          <span className={FIG + ' mt-2.5 block text-[clamp(17px,1.6vw,21px)] leading-[1.3] tracking-[-0.02em] [text-wrap:pretty] ' + (c.slot ? 'text-ink-3' : 'text-ink')}>{c.title}</span>
          <span className="mt-1.5 line-clamp-2 hidden font-sans text-[14.5px] leading-[1.55] text-ink-2 sm:block">{c.summary}</span>
        </span>
        {href ? (
          <span aria-hidden="true" className="hidden size-10 place-items-center rounded-full bg-[#1a1714] text-white opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-2 motion-safe:group-hover:translate-x-0 sm:grid">
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </span>
        ) : <span className="hidden sm:block" />}
      </Tag>
    </motion.li>
  );
}

function AllCases({ reduce }) {
  const [useCase, setUseCase] = useState('All');
  const list = useMemo(() => (useCase === 'All' ? CASES : CASES.filter(c => c.useCase === useCase)), [useCase]);
  const count = u => (u === 'All' ? CASES.length : CASES.filter(c => c.useCase === u).length);
  return (
    <section aria-labelledby="cs-all-title" className={'pt-[clamp(112px,13vw,200px)] ' + PAD}>
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] lg:gap-16">
        <div className="lg:sticky lg:top-[140px] lg:self-start">
          <ScrubTitle reduce={reduce} id="cs-all-title" className={'m-0 scroll-mt-[150px] text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Case', <MarkedPhrase key="s" reduce={reduce}>studies.</MarkedPhrase>]} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'m-0 max-w-[32ch] mt-6 ' + SUBTITLE}>
            Written studies and video stories from teams that run their customer research with Frank.
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.2} className="mt-8">
            <div role="group" aria-label="Filter by use case"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {USE_CASES.map(u => {
                const on = useCase === u;
                return (
                  <button key={u} type="button" aria-pressed={on} onClick={() => setUseCase(u)}
                    className={'relative inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-0 bg-transparent px-3 font-sans text-[13px] transition-colors duration-200 ease-out lg:h-10 lg:w-full lg:justify-between lg:rounded-[12px] lg:px-3.5 lg:text-[14.5px] ' + FOCUS + ' '
                      + (on ? 'text-ink' : 'text-ink-2 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.1)] hover:bg-[#1a1714]/[0.03] hover:text-ink lg:shadow-none')}>
                    {on && <motion.span layoutId="cs-usecase" aria-hidden="true" className="absolute inset-0 rounded-[inherit] bg-[#f1fae3] shadow-[inset_0_0_0_1px_rgba(160,208,95,0.6)]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.12 }} />}
                    <span className="relative">{u === 'All' ? 'All case studies' : u}</span>
                    <span className={'relative font-gmono text-[11px] tabular-nums lg:text-[12px] ' + (on ? 'text-[#43681a]' : 'text-ink-3')}>{count(u)}</span>
                  </button>
                );
              })}
            </div>
          </ScrubText>
        </div>

        <div>
          <p className="sr-only" aria-live="polite">{list.length} {list.length === 1 ? 'case study' : 'case studies'}</p>
          <ul key={useCase} className="m-0 list-none border-0 border-b border-solid border-[#1a1714]/[0.08] p-0 lg:border-t">
            {list.map((c, i) => <Row key={c.brand + c.useCase + i} c={c} i={i} reduce={reduce} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ——— 3. Closing: the blog's lime panel.
function Closing({ reduce }) {
  return (
    <section aria-labelledby="cs-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="cs-cta-title" className={'m-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
          lines={['Ask your customers', 'anything.']} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[42ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
          Just type what you want to learn, and Frank will build an AI Interview in minutes.
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9"><InkButton href={SIGNUP}>Get started</InkButton></ScrubText>
      </div>
    </section>
  );
}

export default function CaseStudiesPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Resources"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero reduce={reduce} />
          <AllCases reduce={reduce} />
          <Closing reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
