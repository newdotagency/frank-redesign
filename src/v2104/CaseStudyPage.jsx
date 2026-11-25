// CaseStudyPage (V21.04): one study of hifrank.ai/case-study/<slug> in the V21.04 style. The words, quotes, screenshots and
// banner are the live study's (case-study/cases.json; the pictures are in public/case-study/<slug>/). The page:
//   1. Head: "← Case studies", the use case and the brand, the title, the read time and the banner.
//   2. The article, with "On this page" (the study's sections, following what you read, from 1280px), then a card saying
//      more case studies are on the way.
//   3. The home page's closing panel, then the footer.
// Entrance: the head rises in once on load. Reduced motion: fades only.
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Link2 } from 'lucide-react';
import Header from '../components/Header';
import { TITLE } from './titles';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import CASES from './case-study/cases.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';
import { Block, slugify, words } from './ArticleBlocks';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };

export default function CaseStudyPage({ slug }) {
  const c = CASES.find(x => x.slug === slug);
  const reduce = !!useReducedMotion();
  const mins = Math.max(1, Math.round(words(c.blocks) / 215));
  const { ids, toc } = useMemo(() => {
    const ids = new Map(), seen = {}, toc = [];
    c.blocks.forEach(b => {
      if (b.t === 'h' && b.l <= 2) {
        let id = slugify(b.x) || 'section'; seen[id] = (seen[id] || 0) + 1; if (seen[id] > 1) id += '-' + seen[id];
        ids.set(b, id); toc.push({ id, title: b.x });
      }
    });
    return { ids, toc };
  }, [c]);
  const [cur, setCur] = useState(toc[0]?.id);
  useEffect(() => {
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(es => {
      const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (v[0]) setCur(v[0].target.id);
    }, { rootMargin: '-110px 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [c]);
  const jump = id => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: reduce ? 'auto' : 'smooth' }); };
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(window.location.href.split('#')[0]).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Head */}
          <header className="px-4 pt-[196px] sm:px-[clamp(16px,4vw,48px)] sm:pt-[160px]">
            <div className="mx-auto max-w-[1100px]">
              <Rise reduce={reduce}>
                <a href="/case-study" className={'inline-flex items-center gap-2 rounded-[6px] font-sans text-[14.5px] text-ink-3 no-underline transition-colors duration-200 hover:text-ink ' + FOCUS}>
                  <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />Case studies
                </a>
              </Rise>
              <Rise reduce={reduce} delay={0.04} className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[14px] text-ink-3">
                <span className="inline-flex h-7 items-center rounded-full bg-[#d1f899] px-3 text-[12.5px] font-medium text-[#2a321e]">{c.kind}</span>
                <span>Brand <span className="text-ink">{c.brand}</span></span><span aria-hidden="true">·</span><span>{mins} min read</span>
              </Rise>
              <Rise as="h1" reduce={reduce} delay={0.08} id="cst-title" className={'m-0 mt-5 max-w-[20em] text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}>{c.title}</Rise>
              <Rise reduce={reduce} delay={0.16} className="mt-8 flex justify-end">
                <button type="button" onClick={copy} className={'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-3.5 font-sans text-[13.5px] text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.1)] transition-colors duration-200 hover:bg-[#fffdf3] ' + FOCUS}>
                  {copied ? <Check className="size-4 text-[#3f6b12]" strokeWidth={2.25} /> : <Link2 className="size-4" strokeWidth={1.75} />}{copied ? 'Link copied' : 'Copy link'}
                </button>
              </Rise>
              <Rise reduce={reduce} delay={0.22} className="mt-6">
                <img src={c.hero} alt="" draggable={false} className="block aspect-video w-full rounded-[24px] bg-[#fffdf3] object-cover sm:rounded-[32px]" />
              </Rise>
            </div>
          </header>

          {/* 2 — The study */}
          <section className="px-4 pb-[clamp(56px,7vw,96px)] pt-[clamp(40px,5vw,72px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto grid max-w-[1100px] gap-12 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-16">
              <aside className="hidden xl:block">
                <div className="sticky top-28">
                  <p className="m-0 mb-3 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">On this page</p>
                  <ul className="m-0 max-h-[calc(100vh-200px)] list-none overflow-y-auto border-0 border-l border-solid border-[#1a1714]/[0.08] p-0">
                    {toc.map(t => (
                      <li key={t.id}>
                        <button type="button" onClick={() => jump(t.id)}
                          className={'-ml-px block w-full cursor-pointer border-0 border-l-2 border-solid bg-transparent py-1.5 pl-3 text-left font-sans text-[13.5px] leading-snug transition-colors duration-200 ' + (t.id === cur ? 'border-[#5f8f22] text-ink' : 'border-transparent text-ink-3 hover:text-ink-2')}>
                          {t.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
              <article className="min-w-0 max-w-[740px]">
                <div className="grid gap-5 [&>p]:max-w-[68ch]">{c.blocks.map((b, i) => <Block key={i} b={b} ids={ids} />)}</div>
                <div className="mt-16 flex flex-wrap items-center justify-between gap-5 rounded-[24px] bg-[#fffdf3] p-6 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-8">
                  <div>
                    <p className="hiw-step-title m-0 text-[22px] leading-tight text-ink">More case studies are on the way</p>
                    <p className="m-0 mt-1.5 font-sans text-[15.5px] text-ink-2">Meanwhile, see everything we have published so far.</p>
                  </div>
                  <a href="/case-study" className={'group inline-flex h-12 items-center gap-3 rounded-full bg-[#1a1714] py-1.5 pl-5 pr-1.5 font-sans text-[15.5px] font-medium text-white no-underline transition-colors duration-200 hover:bg-[#2a2622] ' + FOCUS}>
                    All case studies
                    <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12]"><ArrowRight className="size-4" strokeWidth={1.75} /></span>
                  </a>
                </div>
              </article>
            </div>
          </section>

          <ClosingCTA titleId="cst-cta-title" chips={false} compact lines={['Ask your customers', 'anything.']}
            sub="Frank runs hundreds of AI customer interviews overnight and brings back the answers in your customers’ own words."
            primary={{ label: 'Get started', href: SIGNUP }} secondary={{ label: 'Try a live demo', href: siteHref('/try-frank') }} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
