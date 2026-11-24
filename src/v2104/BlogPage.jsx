// BlogPage (V21.04): hifrank.ai/blog brought into the V21.04 style. The posts (titles, excerpts, dates,
// authors, banners, order) are the live page's, read on 2026-11-20 into blog/posts.json; the banners are
// shown untouched (all 1600×900, so a 16:9 frame never crops them). The articles stay on hifrank.ai, so
// every post links to its live page. The page:
//   1. Masthead: the live label, title and line on the featured block's two-column grid, "real impact."
//      highlighted in lime, and a byline of the writers (faces, article count, latest date).
//   2. Featured, in the live page's layout: the lead story as a card on the left, the next three posts
//      as a list with square thumbnails on the right.
//   3. All articles: the live section title and line, then topic filters, and the posts as a
//      three-column grid, 12 at a time ("Show more articles").
//      The topics are new: each post sits under one or more of five, tagged by hand in posts.json.
//   4. Closing: a short lime panel with the homepage's ask ("Ask your customers anything.") and Get
//      started, then the site footer.
// Entrance: the hero and the featured block rise in once on load; the rest rises in with the scroll. Reduced
// motion: fades only.
import { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Banner from './Cover';
import Header from '../components/Header';
import Glasses from '../v3/Glasses';
import HighlightMarker from '../components/HighlightMarker';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import Footer from './Footer';
import POSTS from './blog/posts.json';

const SITE = 'https://www.hifrank.ai';
const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAGE = 12;

const TOPICS = [
  { id: 'all', label: 'All articles' },
  { id: 'interviews', label: 'Customer interviews' },
  { id: 'comparisons', label: 'Comparisons' },
  { id: 'playbooks', label: 'AI playbooks' },
  { id: 'churn', label: 'Churn' },
  { id: 'research', label: 'Research & insights' },
];
const TOPIC_LABEL = Object.fromEntries(TOPICS.map(t => [t.id, t.label]));
// Only Heghine has a photo on the live blog; the others get their initials.
const PHOTOS = { 'Heghine Hambardzumyan': 'https://cdn.prod.website-files.com/69b3e3fe09ea7f89fea39479/69ccdc822e2d3e826961c8b0_Photo%201%20-%20Heghine%20Hambardzumyan.jpeg' };

const hrefOf = p => `/blog/${p.slug}`;
const shortDate = d => d.replace(/^(\w{3})\w*/, '$1');
const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);

const LEAD = POSTS[0];
const ALSO = POSTS.slice(1, 4);
const REST = POSTS.slice(4);

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// The photo is hotlinked from the live blog; where it can't load (the claude.ai artifact blocks outside
// images), the initials show instead, never a broken image.
function Avatar({ name, size = 'sm', dark }) {
  const box = size === 'lg' ? 'size-11 text-[13px]' : size === 'md' ? 'size-9 text-[12px]' : 'size-6 text-[10px]';
  const [failed, setFailed] = useState(false);
  if (PHOTOS[name] && !failed) return <img src={PHOTOS[name]} alt="" width="88" height="88" loading="lazy" onError={() => setFailed(true)} className={box + ' shrink-0 rounded-full object-cover ' + (dark ? 'ring-2 ring-white/15' : 'ring-1 ring-[#1a1714]/10')} />;
  return (
    <span aria-hidden="true" className={box + ' grid shrink-0 place-items-center rounded-full font-sans font-medium ' + (dark ? 'bg-white/10 text-white/85' : 'bg-[#f4fde6] text-[#3f6414] ring-1 ring-inset ring-[#a0d05f]/40')}>
      {initials(name)}
    </span>
  );
}

// ——— 1. The masthead: on the same 1312px (the home page's content width), two-column grid as the featured block below, so the two read
// as one composition. Left: the label and the live title, its last line "real impact." on its own with the
// homepage's hand-drawn lime highlight (drawn once the title has landed, again on hover). Right, on the
// title's baseline: the live line, then a byline built from the posts themselves (the writers' faces, how
// many articles, the latest date). A hairline closes it off from the featured block.
const AUTHORS = [...new Set(POSTS.map(p => p.author))];
const LATEST = POSTS.map(p => p.date).sort((a, b) => new Date(b) - new Date(a))[0];
const firstNames = AUTHORS.map(a => a.split(' ')[0]);
const BYLINE = firstNames.slice(0, -1).join(', ') + ' and ' + firstNames[firstNames.length - 1];

function Hero({ reduce }) {
  return (
    <section aria-labelledby="bl-title" className="px-4 pt-[196px] sm:pt-[160px] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-12 sm:pb-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-16">
        <div>
          <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Frank’s blog</Eyebrow></Rise>
          <Rise as="h1" reduce={reduce} delay={0.06} id="bl-title" className={'m-0 max-w-[13em] pb-1 text-[clamp(34px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}>
            Build better products with insights that drive{' '}
            <span className="block whitespace-nowrap pt-1">
              <HighlightMarker reduced={reduce} delay={0.75}><span className="italic">real impact.</span></HighlightMarker>
            </span>
          </Rise>
        </div>
        <div className="lg:pb-2">
          <Rise as="p" reduce={reduce} delay={0.14} className="m-0 max-w-[42ch] font-sans text-[17px] leading-[1.6] text-ink-2 sm:text-[18px]">
            Learn how to design, develop, launch, and grow digital products through practical knowledge and proven frameworks.
          </Rise>
          <Rise reduce={reduce} delay={0.22} className="mt-7 flex items-center gap-4">
            <span className="flex shrink-0">
              {AUTHORS.map((a, i) => (
                <span key={a} className={'rounded-full bg-white ring-[3px] ring-white ' + (i ? '-ml-1.5' : '')}><Avatar name={a} size="md" /></span>
              ))}
            </span>
            <span className="flex flex-col font-sans leading-[1.4]">
              <span className="text-[14.5px] text-ink">{POSTS.length} articles from {BYLINE}</span>
              <span className="text-[13.5px] text-ink-3">Latest <time>{LATEST}</time></span>
            </span>
          </Rise>
        </div>
      </div>
    </section>
  );
}

// ——— 2. Featured, in the live blog's layout (the user preferred it to a green panel), refined: the lead
// story as a card on the left (its banner on top; a lime "Featured" tag with the topic and date; the title
// and excerpt; then, under a hairline, the author beside an ink "Read the full story" button). The whole card
// lifts a little on hover and its banner eases in. On the right, "Latest" with a "View all articles" link down
// to the grid, and the next three posts, stretched to the card's height so the two columns end together;
// each has its topic and date, the title, the author, and the banner as a square thumbnail (as live) that
// eases in on hover. Below 1024px the list follows the card.
const leadTopic = TOPIC_LABEL[LEAD.topics[0]];

function Featured({ reduce }) {
  return (
    <section aria-label="Featured" className="relative px-4 pt-10 sm:pt-12 sm:px-[clamp(16px,4vw,48px)] lg:pt-14">
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-16">
        <Rise as="article" reduce={reduce} delay={0.22}
          className="group/lead flex flex-col overflow-hidden rounded-[24px] bg-[#f6f5f1] shadow-[0_0_0_1px_rgba(26,23,20,0.05)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_0_0_1px_rgba(26,23,20,0.07),0_30px_60px_-36px_rgba(42,50,30,0.45)] motion-safe:hover:-translate-y-1">
          <a href={hrefOf(LEAD)} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
            <Banner p={LEAD} eager sizes="(min-width: 1024px) 640px, 100vw" imgClass="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover/lead:scale-[1.02]" />
          </a>
          <div className="flex flex-1 flex-col px-6 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-8">
            <p className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-sans text-[13.5px] text-ink-3">
              <span className="inline-flex h-7 items-center rounded-full bg-[#d1f899] px-3 text-[12px] font-medium uppercase tracking-[0.06em] text-ink">Featured</span>
              <span className="text-[#43681a]">{leadTopic}</span>
              <span aria-hidden="true">·</span>
              <time>{LEAD.date}</time>
            </p>
            <h2 id="bl-lead-title" className={FIG + ' m-0 mt-4 text-[clamp(26px,2.6vw,34px)] leading-[1.12] text-ink [text-wrap:balance]'}>
              <a href={hrefOf(LEAD)} tabIndex={-1} className="text-ink no-underline">{LEAD.title}</a>
            </h2>
            <p className="m-0 mt-3.5 max-w-[52ch] font-sans text-[16px] leading-[1.6] text-ink-2">{LEAD.excerpt}</p>
            <span aria-hidden="true" className="block min-h-7 flex-1" />
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-6">
              <p className="m-0 flex items-center gap-3 font-sans">
                <Avatar name={LEAD.author} size="lg" />
                <span className="flex flex-col">
                  <span className="text-[15px] text-ink">{LEAD.author}</span>
                  <span className="text-[13.5px] text-ink-3">Content Writer</span>
                </span>
              </p>
              <a href={hrefOf(LEAD)} aria-describedby="bl-lead-title"
                className={'group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-[#1a1714] py-1 pl-5 pr-1 font-sans text-[14.5px] font-medium text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2a2622] active:scale-[0.98] ' + FOCUS}>
                Read the full story
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </div>
        </Rise>

        <div className="flex flex-col">
          <Rise reduce={reduce} delay={0.26} className="flex items-baseline justify-between gap-4 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-4">
            <h2 className={FIG + ' m-0 text-[20px] tracking-[-0.02em] text-ink'} style={{ fontSize: 20 }}>Latest</h2>
            <a href="#bl-all-title" className={'group inline-flex items-center gap-1.5 rounded-[6px] font-sans text-[14px] font-medium text-ink no-underline ' + FOCUS}>
              <span className="decoration-ink/30 underline-offset-[5px] group-hover:underline">View all articles</span>
              <ArrowRight aria-hidden="true" className="size-[15px] rotate-90 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-y-0.5" strokeWidth={1.75} />
            </a>
          </Rise>
          <ul className="m-0 flex flex-1 list-none flex-col p-0">
            {ALSO.map((p, i) => (
              <Rise as="li" key={p.slug} reduce={reduce} delay={0.3 + i * 0.06}
                className={'flex flex-1 ' + (i ? 'border-0 border-t border-solid border-[#1a1714]/[0.08]' : '')}>
                <a href={hrefOf(p)} className={'group flex w-full items-center justify-between gap-5 rounded-[12px] py-6 text-ink no-underline sm:gap-8 lg:py-5 ' + FOCUS}>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 font-sans text-[13.5px] text-ink-3">
                      <span className="text-[#43681a]">{TOPIC_LABEL[p.topics[0]]}</span><span aria-hidden="true">·</span><time>{shortDate(p.date)}</time>
                    </span>
                    <span className={FIG + ' mt-2 block text-[clamp(18px,1.6vw,21px)] leading-[1.3] tracking-[-0.02em] text-ink decoration-ink/30 decoration-1 underline-offset-[5px] [text-wrap:pretty] group-hover:underline'}>{p.title}</span>
                    <span className="mt-3 flex items-center gap-2 font-sans text-[13px] text-ink-2"><Avatar name={p.author} />{p.author}</span>
                  </span>
                  <span className="block size-[88px] shrink-0 overflow-hidden rounded-[14px] bg-[#f6f5f1] shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:size-[120px] sm:rounded-[16px]">
                    <Banner p={p} square sizes="120px" imgClass="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:scale-[1.05]" />
                  </span>
                </a>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ——— 3. The grid's post.
// A post fades up as it appears (on load, on a new filter or search, on "Show more"); the grid is keyed by
// the filter and search, so a change swaps the whole list at once instead of animating posts out.
function Post({ p, i, reduce, topic }) {
  const tag = topic !== 'all' && p.topics.includes(topic) ? topic : p.topics[0];
  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(14px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.45, ease: EASE, delay: (i % 3) * 0.04 }}>
      <a href={hrefOf(p)} className={'group block rounded-[22px] text-ink no-underline ' + FOCUS}>
        <span className="block overflow-hidden rounded-[20px] bg-[#f6f5f1] shadow-[0_0_0_1px_rgba(26,23,20,0.06)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:-translate-y-1 group-hover:shadow-[0_0_0_1px_rgba(26,23,20,0.08),0_24px_40px_-26px_rgba(42,50,30,0.4)]">
          <Banner p={p} />
        </span>
        <span className="mt-5 flex items-center gap-2 font-sans text-[13px] text-ink-3">
          <span className="text-[#43681a]">{TOPIC_LABEL[tag]}</span>
          <span aria-hidden="true">·</span>
          <time>{shortDate(p.date)}</time>
        </span>
        <h3 className={FIG + ' m-0 mt-2.5 text-[20px] leading-[1.25] tracking-[-0.02em] text-ink decoration-ink/30 decoration-1 underline-offset-[5px] [text-wrap:pretty] group-hover:underline'}>{p.title}</h3>
        <p className="m-0 mt-2.5 line-clamp-2 font-sans text-[14.5px] leading-[1.55] text-ink-2">{p.excerpt}</p>
        <span className="mt-4 flex items-center gap-2 font-sans text-[13px] text-ink-2">
          <Avatar name={p.author} />{p.author}
        </span>
      </a>
    </motion.li>
  );
}

function AllArticles({ reduce }) {
  const [topic, setTopic] = useState('all');
  const [shown, setShown] = useState(PAGE);

  // With "All articles", the grid leaves out the four posts already in the featured block; a topic looks
  // through all of them.
  const list = useMemo(() => (topic === 'all' ? REST : POSTS.filter(p => p.topics.includes(topic))), [topic]);
  const count = t => POSTS.filter(p => t === 'all' || p.topics.includes(t)).length;
  const visible = list.slice(0, shown);

  const pick = t => { setTopic(t); setShown(PAGE); };

  // A topic in the address (#comparisons, as the menu's "Comparison" links) opens the grid on that topic and
  // scrolls to it, on arrival and when the address changes while you're already here.
  useEffect(() => {
    const read = () => {
      const t = window.location.hash.slice(1);
      if (!TOPICS.some(x => x.id === t && t !== 'all')) return;
      pick(t);
      // Jump to the grid after the next layout, and again once the page has finished loading (on a fresh
      // arrival images are still arriving and the page keeps growing, which would leave the grid short).
      const go = () => document.getElementById('bl-all-title')?.scrollIntoView({ block: 'start' });
      setTimeout(go, 60);
      if (document.readyState !== 'complete') window.addEventListener('load', () => setTimeout(go, 60), { once: true });
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  return (
    <section aria-labelledby="bl-all-title" className="px-4 pt-[clamp(112px,13vw,200px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrubTitle reduce={reduce} id="bl-all-title" className={'m-0 scroll-mt-[150px] text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Build better products with', <>insights &amp; <MarkedPhrase reduce={reduce}>inspiration.</MarkedPhrase></>]} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[44ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
            Practical insights and real stories to guide your product from vision to reality.
          </ScrubText>
        </div>

        {/* The topics, centred under the title; on phones they scroll sideways. */}
        <ScrubText reduce={reduce} lag={0.2} className="mt-12 sm:mt-14">
          <div role="group" aria-label="Filter by topic"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {TOPICS.map(t => {
              const on = topic === t.id;
              return (
                <button key={t.id} type="button" aria-pressed={on} onClick={() => pick(t.id)}
                  className={'relative inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-0 bg-transparent px-3 font-sans text-[13px] transition-colors duration-200 ease-out ' + FOCUS + ' '
                    + (on ? 'text-ink' : 'text-ink-2 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.1)] hover:bg-[#1a1714]/[0.03] hover:text-ink')}>
                  {/* Selected: a soft lime tint with a thin lime outline that glides between topics. */}
                  {on && <motion.span layoutId="bl-topic" aria-hidden="true" className="absolute inset-0 rounded-full bg-[#f1fae3] shadow-[inset_0_0_0_1px_rgba(160,208,95,0.6)]"
                    transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.12 }} />}
                  <span className="relative">{t.label}</span>
                  <span className={'relative font-gmono text-[11px] tabular-nums ' + (on ? 'text-[#43681a]' : 'text-ink-3')}>{count(t.id)}</span>
                </button>
              );
            })}
          </div>
        </ScrubText>

        <p className="sr-only" aria-live="polite">{list.length} {list.length === 1 ? 'article' : 'articles'}</p>

        <ul key={topic} className="m-0 mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-14 p-0 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {visible.map((p, i) => <Post key={p.slug} p={p} i={i} reduce={reduce} topic={topic} />)}
        </ul>

        {list.length > shown && (
          <div className="mt-16 flex flex-col items-center gap-3">
            <button type="button" onClick={() => setShown(s => s + PAGE)}
              className={'inline-flex h-12 cursor-pointer items-center rounded-full border-0 bg-white px-6 font-sans text-[15px] font-medium text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] transition-[background-color,transform] duration-200 ease-out hover:bg-[#f6f5f1] active:scale-[0.98] ' + FOCUS}>
              Show more articles
            </button>
            <p className="m-0 font-sans text-[13px] text-ink-3">{Math.min(shown, list.length)} of {list.length}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ——— 4. Closing: lime, flat, Frank's glasses above the ask.
function Closing({ reduce }) {
  return (
    <section aria-labelledby="bl-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="bl-cta-title" className={'m-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
          lines={['Ask your customers', 'anything.']} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[42ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
          Just type what you want to learn, and Frank will build an AI Interview in minutes.
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9">
          <a href={SIGNUP}
            className={'group inline-flex h-12 items-center gap-3 rounded-full bg-[#1a1714] py-1.5 pl-6 pr-1.5 font-sans text-[15px] font-medium text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2a2622] active:scale-[0.98] ' + FOCUS}>
            Get started
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </span>
          </a>
        </ScrubText>
      </div>
    </section>
  );
}

export default function BlogPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Resources"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero reduce={reduce} />
          <Featured reduce={reduce} />
          <AllArticles reduce={reduce} />
          <Closing reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
