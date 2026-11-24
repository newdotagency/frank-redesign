// ComparisonPage (V21.04): a comparison hub, after the shape of conveo.ai/comparison (a centred hero, then
// "X vs Y" cards that open each comparison), in Frank's V21.04 style and with Frank's own content. hifrank.ai
// has no "Frank vs" pages, so the six cards are the six research tools the blog already compares, and
// each card opens that article on hifrank.ai; its line is the article's own excerpt (from blog/posts.json,
// read from hifrank.ai/blog on 2026-11-20). Nothing about the other tools is written here. Each card shows the
// tool's real logo, bundled from logos/compare/ (outside images don't load on the artifact).
// Layout, on the home page's container (CLAUDE.md, "Frank landing pages: page container"):
//   1. Hero: centred (the blog and case studies open differently): label, "Frank, side by side." with the
//      lime highlight on its last words, and one line.
//   2. Six cards, three to a row (two on tablets, one on phones): a warm-grey frame with "Frank vs X" on
//      top (Frank's wordmark in a lime pill, an italic "vs", the tool's name in a white pill; they drift
//      apart on hover) and the text on an inset white panel: date, title, the excerpt, and "Read the
//      comparison" with its arrow in a circle. Below them, a link to all of the blog's comparison articles.
//   3. Closing: the lime panel (the site-wide closing), then the footer.
// Entrance: the hero rises in on load; the cards rise in with the scroll.
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import HighlightMarker from '../components/HighlightMarker';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import Footer from './Footer';
import POSTS from './blog/posts.json';
// The tools' own logos, taken from each tool's website on 2026-11-20 (header logos; Listen Labs' without the small line under it; its and Outset's
// colour variables replaced by their own fallback colours). Bundled, so they load on the artifact too.
import listenLabsLogo from './logos/compare/listenlabs.svg';
import outsetLogo from './logos/compare/outset.svg';
import strellaLogo from './logos/compare/strella.avif';
import conveoLogo from './logos/compare/conveo.svg';
import marvinLogo from './logos/compare/marvin.svg';
import getwhyLogo from './logos/compare/getwhy.svg';

const SITE = 'https://www.hifrank.ai';
const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';

// The four comparisons: the tool, and the blog article that compares it.
// The tool, its blog article (the card's line and date), its logo, the logo's height in the pill (evens out the
// marks' visual weight), and where the card opens: this version's own "Frank vs" page where there is one, else the
// live hifrank.ai/competitors page, else the blog article (Marvin and GetWhy have no comparison page).
const COMPARE = [
  ['Listen Labs', 'listen-labs-alternatives', listenLabsLogo, 16, '/competitors/listen-labs'],
  ['Outset', 'outset-alternatives', outsetLogo, 18, `${SITE}/competitors/outset`],
  ['Strella', 'strella-alternatives', strellaLogo, 18, `${SITE}/competitors/strella`],
  ['Conveo', 'best-conveo-alternatives', conveoLogo, 18, `${SITE}/competitors/conveo`],
  ['Marvin', 'marvin-alternatives', marvinLogo, 24],
  ['GetWhy', 'getwhy-alternatives', getwhyLogo, 19],
].map(([tool, slug, logo, h, page]) => {
  const p = POSTS.find(x => x.slug === slug);
  return { tool, logo, h, title: p.title, excerpt: p.excerpt, date: p.date.replace(/^(\w{3})\w*/, '$1'), href: page || `${SITE}/blog/${slug}` };
});
const MORE = POSTS.filter(p => p.topics.includes('comparisons')).length;
// The blog's Comparisons topic. The page address and the topic stay apart so the build can rewrite the address.
const BLOG = { href: '/blog', hash: '#comparisons' };

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

// ——— 1. Hero.
function Hero({ reduce }) {
  return (
    <section aria-labelledby="cmp-title" className={'pb-[clamp(56px,7vw,96px)] pt-[196px] text-center sm:pt-[160px] ' + PAD}>
      <div className="mx-auto max-w-[860px]">
        <Rise reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">Comparison</Eyebrow></Rise>
        <Rise as="h1" reduce={reduce} delay={0.06} id="cmp-title" className={'m-0 pb-1 text-[clamp(36px,5vw,64px)] leading-[1.05] text-ink [text-wrap:balance] ' + TITLE}>
          Frank,{' '}
          <span className="whitespace-nowrap">
            <HighlightMarker reduced={reduce} delay={0.75}><span className="italic">side by side.</span></HighlightMarker>
          </span>
        </Rise>
        <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-5 max-w-[44ch] font-sans text-[17px] leading-[1.55] text-ink-2 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
          How Frank compares with the AI interview tools teams look at most, so you can decide with the full picture.
        </Rise>
      </div>
    </section>
  );
}

// ——— 2. The cards.
function Versus({ tool, logo, h }) {
  const MOVE = 'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]';
  return (
    <span aria-hidden="true" className="grid aspect-[16/8] place-items-center px-3 [--s:0.82] md:[--s:1] lg:[--s:0.8] xl:[--s:1]">
      <span className="flex items-center gap-2 xl:gap-3">
        <span className={'inline-flex h-[calc(48px*var(--s))] items-center rounded-full bg-[#d1f899] px-[calc(20px*var(--s))] motion-safe:group-hover:-translate-x-1 ' + MOVE}>
          <img src="/frank-logo.png" alt="" className="block h-[calc(21px*var(--s))] w-auto" />
        </span>
        <span className="font-serif text-[calc(19px*var(--s))] italic text-ink-3">vs</span>
        <span className={'inline-flex h-[calc(48px*var(--s))] items-center rounded-full bg-white px-[calc(20px*var(--s))] shadow-[0_0_0_1px_rgba(26,23,20,0.06)] motion-safe:group-hover:translate-x-1 ' + MOVE}>
          <img src={logo} alt="" className="block w-auto max-w-[calc(120px*var(--s))] object-contain" style={{ height: `calc(${h}px * var(--s))` }} />
        </span>
      </span>
    </span>
  );
}

function Cards({ reduce }) {
  return (
    <section aria-label="Comparisons" className={PAD}>
      <ul className="mx-auto m-0 grid max-w-[1312px] list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {COMPARE.map((c, i) => (
          <ScrubText as="li" key={c.tool} reduce={reduce} lag={(i % 3) * 0.05}>
            <a href={c.href}
              className={'group flex h-full flex-col rounded-[28px] bg-[#f7f5f0] p-1.5 text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05),0_28px_48px_-32px_rgba(42,50,30,0.45)] ' + FOCUS}>
              <Versus tool={c.tool} logo={c.logo} h={c.h} />
              <span className="flex flex-1 flex-col rounded-[22px] bg-white px-6 pb-5 pt-6 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_10px_24px_-18px_rgba(42,50,30,0.3)] sm:px-7">
                <span className="font-sans text-[13px] text-ink-3"><time>{c.date}</time></span>
                <h2 className={FIG + ' m-0 mt-2 text-[22px] leading-[1.2] tracking-[-0.02em] text-ink'} style={{ fontSize: 22 }}>Frank vs {c.tool}</h2>
                <p className="m-0 mt-2.5 line-clamp-3 font-sans text-[15px] leading-[1.6] text-ink-2">{c.excerpt}</p>
                <span aria-hidden="true" className="block min-h-6 flex-1" />
                <span className="flex items-center justify-between gap-3 border-0 border-t border-solid border-[#1a1714]/[0.07] pt-4">
                  <span className="font-sans text-[14.5px] font-medium text-ink">Read the comparison</span>
                  <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#1a1714]/[0.05] text-ink transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-[#d1f899] motion-safe:group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </span>
                </span>
              </span>
            </a>
          </ScrubText>
        ))}
      </ul>

      <ScrubText reduce={reduce}
        className="mx-auto mt-16 flex max-w-[1312px] flex-col items-start justify-between gap-5 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-8 sm:flex-row sm:items-center">
        <p className="m-0 font-sans text-[16px] text-ink-2">
          Looking at another tool? The blog has <span className="text-ink">{MORE} comparison articles</span>.
        </p>
        <a href={BLOG.href + BLOG.hash}
          className={'group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 font-sans text-[14.5px] font-medium text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] transition-[background-color,transform] duration-200 ease-out hover:bg-[#f6f5f1] active:scale-[0.98] ' + FOCUS}>
          See all comparisons
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" strokeWidth={1.75} />
        </a>
      </ScrubText>
    </section>
  );
}

// ——— 3. Closing: the lime panel.
function Closing({ reduce }) {
  return (
    <section aria-labelledby="cmp-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="cmp-cta-title" className={'m-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
          lines={['Ask your customers', <MarkedPhrase key="a" reduce={reduce}>anything.</MarkedPhrase>]} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[42ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
          Just type what you want to learn, and Frank will build an AI Interview in minutes.
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9"><InkButton href={SIGNUP}>Get started</InkButton></ScrubText>
      </div>
    </section>
  );
}

export default function ComparisonPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Resources"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero reduce={reduce} />
          <Cards reduce={reduce} />
          <Closing reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
