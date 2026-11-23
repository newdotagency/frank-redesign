// DocsPage (V21.04) — hifrank.ai/docs ("Docs & Guides"), with the live page's structure kept as it is and
// only the design brought into V21.04:
//   · a left sidebar: the Frank logo (home), "Docs & guides", the "Documentation" label and the eleven
//     guides (the live sidebar's names, in sentence case); below 1024px it folds into a "Browse docs" menu
//     at the top;
//   · "Contact support" at the top right;
//   · the main column: the label, "How can we help you?", the line under it, the search (it filters the
//     articles as you type; "/" focuses it), the intro video ("Set up your first customer interview with
//     Frank", opens on YouTube), and "Recent articles" in the live order; then the site footer.
// The guides themselves open on this page in the new design (DocArticle, from docs/articles.json; nothing
// links out to the old articles, which are going away): the address becomes #/<guide>, the sidebar marks
// it, and the main column shows the article; "Docs & guides" (#) goes back.
// Entrance: the main column rises in once on load.
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Play, Search, X } from 'lucide-react';
import Glasses from '../v3/Glasses';
import DocArticle from './DocArticle';
import ARTICLES from './docs/articles.json';
import { TITLE, Eyebrow } from './titles';
import Footer from './Footer';

const VIDEO = 'https://www.youtube.com/watch?v=8dDSAhljECg';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

// The guides: the sidebar's short name, the article's title (sentence case), its path.
const GUIDES = [
  { nav: 'Overview', title: 'Overview', path: 'overview' },
  { nav: 'Research setup', title: 'How to set it up', path: 'how-to-set-it-up' },
  { nav: 'Dashboard guide', title: 'Navigating your AI interviewer dashboard', path: 'navigating-your-ai-interviewer-dashboard' },
  { nav: 'Best practices', title: 'Best practices', path: 'best-practices' },
  { nav: 'Product setup', title: 'How to create a new product', path: 'how-to-create-a-new-product' },
  { nav: 'FAQ', title: 'FAQ', path: 'faq' },
  { nav: 'Tag manager', title: 'Widget installing via Google Tag Manager (GTM)', path: 'widget-installing-via-google-tag-manager-gtm' },
  { nav: 'MCP connector', title: 'MCP connector', path: 'frank-mcp-connector' },
  { nav: 'Embed', title: 'Website widget: embedding Frank on your site', path: 'website-widget-embedding-frank-on-your-site' },
  { nav: 'Webhook', title: 'Set up the Frank webhook', path: 'set-up-the-frank-webhook' },
  { nav: 'API', title: 'Frank public API: developer guide', path: 'frank-public-api-developer-guide' },
];
// "Recent articles", in the live page's order (newest first).
const RECENT = ['frank-mcp-connector', 'set-up-the-frank-webhook', 'widget-installing-via-google-tag-manager-gtm', 'frank-public-api-developer-guide',
  'website-widget-embedding-frank-on-your-site', 'how-to-create-a-new-product', 'faq', 'best-practices',
  'navigating-your-ai-interviewer-dashboard', 'how-to-set-it-up', 'overview'].map(p => GUIDES.find(g => g.path === p));

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(14px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.65, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

const Logo = () => (
  <a href="/" className={'inline-flex items-center rounded-[6px] no-underline ' + FOCUS} aria-label="Frank home">
    <img src="/frank-logo.png" alt="Frank" className="h-[22px] w-auto" />
  </a>
);

// A guide's address on this page (every guide lives here now; the old pages are going away).
const hrefOf = g => '/docs/' + g.path;
const ext = () => ({});
// The route: '' for Docs & guides, or a guide's path (from #/<path>).
function useRoute() {
  const read = () => (decodeURIComponent((window.location.pathname.match(/^\/docs\/([^/.]+)/) || [])[1] || ''));
  const [r, setR] = useState(read);
  useEffect(() => {
    const on = () => { setR(read()); window.scrollTo({ top: 0 }); };
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return r;
}

// The sidebar's guide list (also used by the phone menu); the open guide is marked.
const NavList = ({ active, onPick }) => (
  <ul className="m-0 list-none p-0">
    {GUIDES.map(g => {
      const on = g.path === active;
      return (
        <li key={g.path}>
          <a href={hrefOf(g)} {...ext(g)} onClick={onPick} aria-current={on ? 'page' : undefined}
            className={'relative flex items-center rounded-[10px] px-3 py-[7px] font-sans text-[14.5px] no-underline transition-colors duration-200 ' + (on ? 'bg-[#1a1714]/[0.05] font-medium text-ink' : 'text-ink-2 hover:bg-[#1a1714]/[0.04] hover:text-ink') + ' ' + FOCUS}>
            {on && <span aria-hidden="true" className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#5f8f22]" />}
            {g.nav}
          </a>
        </li>
      );
    })}
  </ul>
);

export default function DocsPage() {
  const reduce = !!useReducedMotion();
  const route = useRoute();
  const article = route && ARTICLES[route];
  const idx = GUIDES.findIndex(g => g.path === route);
  const menu = useRef(null);
  const [q, setQ] = useState('');
  const input = useRef(null);
  // "/" focuses the search (unless you're already typing somewhere).
  useEffect(() => {
    const onKey = e => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      e.preventDefault(); input.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const query = q.trim().toLowerCase();
  const list = useMemo(() => !query ? RECENT : RECENT.filter(g => (g.title + ' ' + g.nav).toLowerCase().includes(query)), [query]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative min-h-screen" id="top" style={{ background: '#fbfaf6' }}>
        <div className="lg:flex">
          {/* The sidebar (from 1024px): logo, "Docs & guides", "Documentation" and the guides. */}
          <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col overflow-y-auto border-0 border-r border-solid border-[#1a1714]/[0.06] bg-white px-5 pb-8 pt-6 lg:flex">
            <Logo />
            <a href="/docs" aria-current={article ? undefined : 'page'} className={'mt-8 flex items-center rounded-[10px] px-3 py-[7px] font-sans text-[14.5px] no-underline ' + (article ? 'text-ink-2 hover:bg-[#1a1714]/[0.04] hover:text-ink' : 'bg-[#1a1714]/[0.05] font-medium text-ink') + ' ' + FOCUS}>Docs &amp; guides</a>
            <p className="m-0 mb-2 mt-7 px-3 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Documentation</p>
            <nav aria-label="Documentation"><NavList active={route} /></nav>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Top bar: on phones the logo and the "Browse docs" menu; "Contact support" on the right. */}
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:justify-end">
              <span className="lg:hidden"><Logo /></span>
              <a href="mailto:support@hifrank.ai"
                className={'inline-flex h-10 items-center gap-2 rounded-full bg-[#1a1714] px-4 font-sans text-[14px] font-medium text-white no-underline transition-colors duration-200 hover:bg-[#2a2622] ' + FOCUS}>
                <Mail className="size-4" strokeWidth={1.75} />Contact support
              </a>
            </div>
            <details ref={menu} className="group mx-4 rounded-[16px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:mx-8 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-sans text-[15px] text-ink [&::-webkit-details-marker]:hidden">
                {article ? GUIDES[idx]?.nav : 'Browse docs'}
                <ChevronDown aria-hidden="true" className="size-4 text-ink-3 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.75} />
              </summary>
              <nav aria-label="Documentation" className="px-1 pb-2">
                <a href="/docs" onClick={() => menu.current?.removeAttribute('open')} className={'flex rounded-[10px] px-3 py-[7px] font-sans text-[14.5px] text-ink-2 no-underline ' + FOCUS}>Docs &amp; guides</a>
                <NavList active={route} onPick={() => menu.current?.removeAttribute('open')} />
              </nav>
            </details>

            {article ? (
              <main id="main" className="mx-auto max-w-[1080px] px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(32px,5vw,64px)] sm:px-8">
                <DocArticle slug={route} a={article}
                  prev={idx > 0 ? { path: GUIDES[idx - 1].path, title: ARTICLES[GUIDES[idx - 1].path]?.title || GUIDES[idx - 1].title } : null}
                  next={idx >= 0 && idx < GUIDES.length - 1 ? { path: GUIDES[idx + 1].path, title: ARTICLES[GUIDES[idx + 1].path]?.title || GUIDES[idx + 1].title } : null} />
              </main>
            ) : (
            <main id="main" className="mx-auto max-w-[820px] px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(40px,6vw,80px)] sm:px-8">
              {/* The heading and the search. */}
              <Rise reduce={reduce}><Eyebrow align="start" className="mb-6">Docs and guides</Eyebrow></Rise>
              <Rise as="h1" reduce={reduce} delay={0.05} id="dc-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}>
                How can we <span className="italic">help you?</span>
              </Rise>
              <Rise as="p" reduce={reduce} delay={0.1} className="m-0 mt-4 font-sans text-[17px] leading-[1.55] text-ink-2">
                Search our knowledge base or browse by category below
              </Rise>
              <Rise reduce={reduce} delay={0.16} className="mt-8">
                <form role="search" onSubmit={e => e.preventDefault()} className="rounded-[20px] bg-[#1a1714]/[0.04] p-1.5">
                  <label className="flex h-14 items-center gap-3 rounded-[15px] bg-white pl-5 pr-1.5 shadow-[0_1px_2px_rgba(26,23,20,0.05)] focus-within:ring-2 focus-within:ring-[#a0d05f]">
                    <Search aria-hidden="true" className="size-[18px] shrink-0 text-ink-3" strokeWidth={1.5} />
                    <span className="sr-only">Search articles, guides and FAQs</span>
                    <input ref={input} type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles, guides, FAQs…"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent font-sans text-[16px] text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden" />
                    {q && (
                      <button type="button" onClick={() => { setQ(''); input.current?.focus(); }} aria-label="Clear search"
                        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#1a1714]/[0.05] text-ink-2"><X className="size-3.5" strokeWidth={2} /></button>
                    )}
                    {!q && <kbd aria-hidden="true" className="hidden h-6 min-w-6 shrink-0 place-items-center rounded-[6px] bg-[#1a1714]/[0.05] px-1.5 font-gmono text-[12px] text-ink-3 sm:grid">/</kbd>}
                    <button type="submit" className={'h-11 shrink-0 cursor-pointer rounded-[11px] border-0 bg-[#1a1714] px-5 font-sans text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-[#2a2622] ' + FOCUS}>Search</button>
                  </label>
                </form>
              </Rise>

              <AnimatePresence initial={false}>
                {!query && (
                  // The intro video: a poster in Frank's green; it opens on YouTube.
                  <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>
                    <Rise reduce={reduce} delay={0.24} className="mt-10">
                      <a href={VIDEO} target="_blank" rel="noopener noreferrer"
                        className={'group relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-[24px] bg-[#0f2e27] p-6 no-underline sm:p-8 ' + FOCUS}>
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 85% 10%, rgba(209,248,153,0.22), rgba(209,248,153,0) 70%)' }} />
                        <span className="relative flex items-center gap-3">
                          <span className="grid size-11 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[64%]"><Glasses pose="Ready" reduced={reduce} /></span></span>
                          <span className="font-sans text-[13.5px] text-white/70">Video guide</span>
                        </span>
                        <span className="relative flex items-end justify-between gap-6">
                          <span className="max-w-[24ch] font-['Figtree',sans-serif] text-[clamp(22px,3vw,32px)] font-medium leading-[1.12] tracking-[-0.02em] text-white">Set up your first customer interview with Frank</span>
                          <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#0f2e27] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 sm:size-16">
                            <Play className="ml-0.5 size-6" fill="currentColor" strokeWidth={0} />
                          </span>
                        </span>
                      </a>
                    </Rise>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent articles (while searching: the matches). */}
              <Rise reduce={reduce} delay={0.3} className="mt-12">
                <p className="m-0 mb-3 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-ink-3" aria-live="polite">
                  {query ? (list.length ? `${list.length} ${list.length === 1 ? 'result' : 'results'} for “${q.trim()}”` : `No results for “${q.trim()}”`) : 'Recent articles'}
                </p>
                {list.length ? (
                  <ul className="m-0 list-none divide-y divide-[#1a1714]/[0.06] overflow-hidden rounded-[20px] bg-white p-0 shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">
                    {list.map(g => (
                      <li key={g.path}>
                        <a href={hrefOf(g)} {...ext(g)}
                          className={'group flex items-center justify-between gap-4 px-5 py-4 font-sans text-[15.5px] text-ink no-underline transition-colors duration-200 hover:bg-[#1a1714]/[0.025] ' + FOCUS}>
                          {g.title}
                          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-ink-3 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:text-ink" strokeWidth={1.5} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">
                    <p className="m-0 font-sans text-[16px] text-ink">Try another word, or ask us.</p>
                    <a href="mailto:support@hifrank.ai" className={'mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[#1a1714] px-5 font-sans text-[15px] font-medium text-white no-underline ' + FOCUS}>
                      <Mail className="size-4" strokeWidth={1.75} />Contact support
                    </a>
                  </div>
                )}
              </Rise>
            </main>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </MotionConfig>
  );
}
