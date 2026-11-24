// DocsPage (V21.04) — hifrank.ai/docs ("Docs & Guides") and its guides, set up like a modern docs site (after Resend's):
//   · a top bar: the Frank logo, a search box that opens the command palette (⌘K, Ctrl K or "/"; it searches every
//     section of every guide and opens the guide at that section), Contact support and Get started;
//   · a left sidebar with the guides in three groups (Get started · Use Frank · Connect & automate), the open guide
//     marked; below 1024px it is a drawer behind the menu button;
//   · the home page: "How can we help you?", the big search, the popular guides, the intro video, each group as cards
//     (what the guide is for, how long it takes), quick answers from the FAQ, and support;
//   · a guide (DocArticle): breadcrumbs, "Copy page", anchored sections, "On this page", highlighted code.
// Routes: /docs and /docs/<guide>. Colours and type are the site's own (cream page, white sidebar, lime accents).
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock3, Command, Home, Mail, Menu, Play, Search, X } from 'lucide-react';
import Glasses from '../v3/Glasses';
import DocArticle from './DocArticle';
import DocsSearch from './docs/DocsSearch';
import ARTICLES from './docs/articles.json';
import { GROUPS, GUIDES, ORDER, POPULAR, groupOf } from './docs/structure';
import { TITLE, Eyebrow } from './titles';
import Footer from './Footer';

const VIDEO = 'https://www.youtube.com/watch?v=8dDSAhljECg';
const SIGNUP = 'https://app.hifrank.ai/signup';
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const TOP = 64; // the top bar's height, px

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

// The route: '' for the docs home, or a guide's slug (from /docs/<guide>).
function useRoute() {
  const read = () => decodeURIComponent((window.location.pathname.match(/^\/docs\/([^/.]+)/) || [])[1] || '');
  const [r, setR] = useState(read);
  useEffect(() => {
    const on = () => { setR(read()); window.scrollTo({ top: 0 }); };
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return r;
}

// The sidebar's guides, in their three groups; the open guide is marked.
function Nav({ active, onPick }) {
  return (
    <nav aria-label="Documentation" className="grid gap-7">
      <a href="/docs" onClick={onPick} aria-current={active ? undefined : 'page'}
        className={'flex items-center gap-2.5 rounded-[10px] px-3 py-[7px] font-sans text-[14.5px] no-underline transition-colors duration-200 ' + (active ? 'text-ink-2 hover:bg-[#1a1714]/[0.04] hover:text-ink' : 'bg-[#1a1714]/[0.05] font-medium text-ink') + ' ' + FOCUS}>
        <Home aria-hidden="true" className="size-4" strokeWidth={1.75} />Docs home
      </a>
      {GROUPS.map(g => (
        <div key={g.id}>
          <p className="m-0 mb-2 px-3 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">{g.label}</p>
          <ul className="m-0 list-none p-0">
            {g.items.map(slug => {
              const on = slug === active;
              return (
                <li key={slug}>
                  <a href={'/docs/' + slug} onClick={onPick} aria-current={on ? 'page' : undefined}
                    className={'relative flex items-center rounded-[10px] px-3 py-[7px] font-sans text-[14.5px] no-underline transition-colors duration-200 ' + (on ? 'bg-[#1a1714]/[0.05] font-medium text-ink' : 'text-ink-2 hover:bg-[#1a1714]/[0.04] hover:text-ink') + ' ' + FOCUS}>
                    {on && <span aria-hidden="true" className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#5f8f22]" />}
                    {GUIDES[slug].nav}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// The key hint: ⌘K on a Mac, Ctrl K elsewhere.
const useMac = () => { const [m, setM] = useState(false); useEffect(() => setM(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []); return m; };
const Kbd = ({ children }) => <kbd className="inline-grid h-5 min-w-5 place-items-center rounded-[5px] bg-white px-1 font-gmono text-[11px] text-ink-3 ring-1 ring-[#1a1714]/[0.1]">{children}</kbd>;

function TopBar({ onSearch, onMenu }) {
  return (
    <header className="sticky top-0 z-40 border-0 border-b border-solid border-[#1a1714]/[0.07] bg-white/90 backdrop-blur-md" style={{ height: TOP }}>
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        <button type="button" onClick={onMenu} aria-label="Browse the guides" className={'grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border-0 bg-transparent text-ink hover:bg-[#1a1714]/[0.05] lg:hidden ' + FOCUS}><Menu className="size-5" strokeWidth={1.75} /></button>
        <div className="flex shrink-0 items-center gap-3 lg:w-[calc(272px-24px)]">
          <Logo />
          <span aria-hidden="true" className="hidden h-5 w-px bg-[#1a1714]/[0.12] sm:block" />
          <a href="/docs" className={'hidden rounded-[6px] font-sans text-[14.5px] text-ink-2 no-underline hover:text-ink sm:block ' + FOCUS}>Docs</a>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={onSearch} aria-label="Search the docs" className={'grid size-10 cursor-pointer place-items-center rounded-[10px] border-0 bg-transparent text-ink hover:bg-[#1a1714]/[0.05] lg:hidden ' + FOCUS}><Search className="size-5" strokeWidth={1.75} /></button>
          <a href="mailto:support@hifrank.ai" className={'hidden h-10 items-center gap-2 rounded-full px-4 font-sans text-[14px] text-ink no-underline transition-colors duration-200 hover:bg-[#1a1714]/[0.05] md:inline-flex ' + FOCUS}><Mail className="size-4" strokeWidth={1.75} />Contact support</a>
          <a href={SIGNUP} className={'inline-flex h-10 items-center rounded-full bg-[#1a1714] px-5 font-sans text-[14px] font-medium text-white no-underline transition-colors duration-200 hover:bg-[#2a2622] ' + FOCUS}>Get started</a>
        </div>
      </div>
    </header>
  );
}

// The sidebar's search box (opens the palette).
function SideSearch({ onSearch }) {
  const mac = useMac();
  return (
    <button type="button" onClick={onSearch} aria-label="Search the docs"
      className={'mb-6 flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-[12px] border-0 bg-[#1a1714]/[0.04] px-3.5 text-left font-sans text-[14.5px] text-ink-3 transition-colors duration-200 hover:bg-[#1a1714]/[0.07] ' + FOCUS}>
      <Search aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
      <span className="min-w-0 flex-1 truncate">Search…</span>
      <span aria-hidden="true" className="flex items-center gap-1">{mac ? <Kbd><Command className="size-3" /></Kbd> : <Kbd>Ctrl</Kbd>}<Kbd>K</Kbd></span>
    </button>
  );
}

// A guide as a card on the home page.
function Card({ slug }) {
  const g = GUIDES[slug], a = ARTICLES[slug], Icon = g.icon;
  return (
    <a href={'/docs/' + slug} className={'group flex h-full flex-col rounded-[20px] bg-white p-5 text-ink no-underline shadow-[0_0_0_1px_rgba(26,23,20,0.07)] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(26,23,20,0.14),0_14px_30px_-18px_rgba(26,23,20,0.25)] sm:p-6 ' + FOCUS}>
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-[11px] bg-[#1a1714]/[0.05] text-ink-2 transition-colors duration-300 group-hover:bg-[#d1f899] group-hover:text-[#2a321e]"><Icon className="size-5" strokeWidth={1.6} /></span>
      <h3 className="m-0 mt-5 font-['Figtree',sans-serif] text-[19px] font-medium leading-snug tracking-[-0.015em] text-ink">{a.title}</h3>
      <p className="m-0 mt-2 font-sans text-[15px] leading-[1.55] text-ink-2">{g.desc}</p>
      <span className="mt-auto flex items-center justify-between pt-5 font-sans text-[13px] text-ink-3">
        <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="size-3.5" strokeWidth={1.75} />{a.readMins} min read</span>
        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:text-ink" strokeWidth={1.5} />
      </span>
    </a>
  );
}

// The questions of the FAQ, one per section, straight to their answer.
const QUICK = ARTICLES.faq.sections.flatMap(s => s.blocks.filter(b => b.t === 'qa').flatMap(b => b.items.slice(0, 1).map(it => ({ id: s.id, q: it.q.replace(/\*\*|`/g, '') })))).slice(0, 6);

function DocsHome({ reduce, onSearch }) {
  const mac = useMac();
  return (
    <main id="main" className="mx-auto w-full max-w-[1080px] px-4 pb-[clamp(72px,9vw,128px)] pt-[clamp(36px,5vw,72px)] sm:px-8 lg:px-10">
      <Rise reduce={reduce}><Eyebrow align="start" className="mb-6">Docs and guides</Eyebrow></Rise>
      <Rise as="h1" reduce={reduce} delay={0.05} id="dc-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}>
        How can we <span className="italic">help you?</span>
      </Rise>
      <Rise as="p" reduce={reduce} delay={0.1} className="m-0 mt-4 font-sans text-[17px] leading-[1.55] text-ink-2">Search every guide, or start with what most people need.</Rise>
      <Rise reduce={reduce} delay={0.16} className="mt-8">
        <button type="button" onClick={onSearch} className={'flex h-[60px] w-full cursor-pointer items-center gap-3 rounded-[18px] border-0 bg-white pl-5 pr-3 text-left font-sans text-[16.5px] text-ink-3 shadow-[0_0_0_1px_rgba(26,23,20,0.1),0_1px_2px_rgba(26,23,20,0.05)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(26,23,20,0.2),0_8px_24px_-14px_rgba(26,23,20,0.3)] ' + FOCUS}>
          <Search aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
          <span className="flex-1 truncate">Search guides, steps, endpoints…</span>
          <span aria-hidden="true" className="hidden items-center gap-1 sm:flex">{mac ? <Kbd><Command className="size-3" /></Kbd> : <Kbd>Ctrl</Kbd>}<Kbd>K</Kbd></span>
        </button>
        <p className="m-0 mt-4 flex flex-wrap items-center gap-2 font-sans text-[14px] text-ink-3">
          <span className="mr-1">Popular:</span>
          {POPULAR.map(([slug, label]) => (
            <a key={slug} href={'/docs/' + slug} className={'rounded-full bg-[#1a1714]/[0.05] px-3 py-1.5 text-[13.5px] text-ink-2 no-underline transition-colors duration-200 hover:bg-[#d1f899] hover:text-ink ' + FOCUS}>{label}</a>
          ))}
        </p>
      </Rise>

      <Rise reduce={reduce} delay={0.24} className="mt-12">
        <a href={VIDEO} target="_blank" rel="noopener noreferrer"
          className={'group relative flex aspect-[16/7] min-h-[200px] w-full flex-col justify-between overflow-hidden rounded-[24px] bg-[#0f2e27] p-6 no-underline sm:p-8 ' + FOCUS}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 85% 10%, rgba(209,248,153,0.22), rgba(209,248,153,0) 70%)' }} />
          <span className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[64%]"><Glasses pose="Ready" reduced={reduce} /></span></span>
            <span className="font-sans text-[13.5px] text-white/70">Video guide</span>
          </span>
          <span className="relative flex items-end justify-between gap-6">
            <span className="max-w-[24ch] font-['Figtree',sans-serif] text-[clamp(22px,3vw,32px)] font-medium leading-[1.12] tracking-[-0.02em] text-white">Set up your first customer interview with Frank</span>
            <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#0f2e27] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
              <Play className="ml-0.5 size-6" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        </a>
      </Rise>

      {GROUPS.map((g, gi) => (
        <Rise key={g.id} reduce={reduce} delay={0.3 + gi * 0.04} className="mt-14">
          <h2 className="m-0 font-['Figtree',sans-serif] text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink">{g.label}</h2>
          <p className="m-0 mt-1.5 font-sans text-[15.5px] text-ink-3">{g.blurb}</p>
          <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
            {g.items.map(slug => <li key={slug}><Card slug={slug} /></li>)}
          </ul>
        </Rise>
      ))}

      <Rise reduce={reduce} delay={0.4} className="mt-14">
        <h2 className="m-0 font-['Figtree',sans-serif] text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink">Quick answers</h2>
        <p className="m-0 mt-1.5 font-sans text-[15.5px] text-ink-3">Straight to the answer, from the FAQ.</p>
        <ul className="m-0 mt-5 list-none divide-y divide-[#1a1714]/[0.06] overflow-hidden rounded-[20px] bg-white p-0 shadow-[0_0_0_1px_rgba(26,23,20,0.07)]">
          {QUICK.map(it => (
            <li key={it.id}>
              <a href={'/docs/faq#' + it.id} className={'group flex items-center justify-between gap-4 px-5 py-4 font-sans text-[15.5px] text-ink no-underline transition-colors duration-200 hover:bg-[#1a1714]/[0.025] ' + FOCUS}>
                {it.q}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-ink-3 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:text-ink" strokeWidth={1.5} />
              </a>
            </li>
          ))}
        </ul>
      </Rise>

      <Rise reduce={reduce} delay={0.44} className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-[24px] bg-[#fffdf3] p-6 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-8">
        <div>
          <p className="m-0 font-['Figtree',sans-serif] text-[21px] font-medium tracking-[-0.015em] text-ink">Can’t find what you need?</p>
          <p className="m-0 mt-1.5 font-sans text-[15.5px] text-ink-2">Tell us what you’re trying to do. We read every message.</p>
        </div>
        <a href="mailto:support@hifrank.ai" className={'inline-flex h-12 items-center gap-2 rounded-full bg-[#1a1714] px-6 font-sans text-[15.5px] font-medium text-white no-underline transition-colors duration-200 hover:bg-[#2a2622] ' + FOCUS}><Mail className="size-4" strokeWidth={1.75} />Contact support</a>
      </Rise>
    </main>
  );
}

export default function DocsPage() {
  const reduce = !!useReducedMotion();
  const route = useRoute();
  const article = route && ARTICLES[route];
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // ⌘K / Ctrl K toggles the search from anywhere; "/" opens it (unless you're typing somewhere).
  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(o => !o); return; }
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      e.preventDefault(); setSearchOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  const idx = ORDER.indexOf(route);
  const link = slug => (slug ? { path: slug, title: ARTICLES[slug]?.title || GUIDES[slug].nav } : null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative min-h-screen" id="top" style={{ background: '#ffffff' }}>
        <TopBar onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} />
        <div className="flex">
          <aside className="sticky hidden w-[272px] shrink-0 self-start overflow-y-auto bg-white px-4 pb-10 pt-6 lg:block" style={{ top: TOP, height: `calc(100vh - ${TOP}px)` }}>
            <SideSearch onSearch={() => setSearchOpen(true)} />
            <Nav active={route} />
          </aside>
          {/* The content panel: from the sidebar to the right edge, its top-left corner rounded (as in Resend's docs);
              the article (and "On this page") or the home page sit centred inside it. */}
          <div className="min-w-0 flex-1 bg-[#fbfaf6] lg:rounded-tl-[24px] lg:shadow-[inset_1px_1px_0_rgba(26,23,20,0.07)]" style={{ minHeight: `calc(100vh - ${TOP}px)` }}>
            {article ? (
              <main id="main" className="mx-auto w-full max-w-[1080px] px-4 pb-[clamp(72px,9vw,128px)] pt-[clamp(28px,4vw,56px)] sm:px-8 lg:px-10">
                <DocArticle slug={route} a={article} prev={link(ORDER[idx - 1])} next={link(ORDER[idx + 1])} />
              </main>
            ) : <DocsHome reduce={reduce} onSearch={() => setSearchOpen(true)} />}
          </div>
        </div>
        <Footer />

        {/* The guides, as a drawer on phones and tablets. */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Guides">
            <div className="absolute inset-0 bg-[#1a1714]/40" onClick={() => setMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[min(320px,86vw)] overflow-y-auto bg-white px-4 pb-10 pt-4 shadow-[20px_0_60px_-20px_rgba(26,23,20,0.4)]">
              <div className="mb-5 flex items-center justify-between px-1"><Logo /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close" className="grid size-10 cursor-pointer place-items-center rounded-[10px] border-0 bg-transparent text-ink hover:bg-[#1a1714]/[0.05]"><X className="size-5" strokeWidth={1.75} /></button></div>
              <Nav active={route} onPick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
        <DocsSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </MotionConfig>
  );
}
