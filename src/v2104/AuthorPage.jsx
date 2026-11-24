// AuthorPage (V21.04): one writer of hifrank.ai/author/<slug> (Danniel, Heghine, Van) in the V21.04 style. The photo, name, role,
// bio and expertise are the live page's (blog/authors.json); the articles are every post by them from the blog (the live page
// lists only the first three). The page:
//   1. Masthead: the photo, the name, the role, the bio, the expertise as tags, and the count and latest date.
//   2. "Articles by …": the posts as cards, nine at a time ("Show more articles").
//   3. The home page's closing panel, then the footer.
// Entrance: the masthead rises in once on load; the rest rises in with the scroll. Reduced motion: fades only.
import { useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Banner from './Cover';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import POSTS from './blog/posts.json';
import AUTHORS from './blog/authors.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const TOPIC = { interviews: 'Customer interviews', comparisons: 'Comparisons', playbooks: 'AI playbooks', churn: 'Churn', research: 'Research & insights' };
const PAGE = 9;
const shortDate = d => d.replace(/^(\w{3})\w*/, '$1');

export default function AuthorPage({ slug }) {
  const a = AUTHORS[slug];
  const reduce = !!useReducedMotion();
  const posts = useMemo(() => POSTS.filter(p => p.author === a.name), [a]);
  const [shown, setShown] = useState(PAGE);
  const latest = posts.map(p => p.date).sort((x, y) => new Date(y) - new Date(x))[0];
  const first = a.name.split(' ')[0];
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Masthead */}
          <section aria-labelledby="au-title" className="px-4 pt-[196px] sm:px-[clamp(16px,4vw,48px)] sm:pt-[160px]">
            <div className="mx-auto max-w-[1200px]">
              <Rise reduce={reduce}>
                <a href="/blog" className={'inline-flex items-center gap-2 rounded-[6px] font-sans text-[14.5px] text-ink-3 no-underline transition-colors duration-200 hover:text-ink ' + FOCUS}>
                  <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />Blog
                </a>
              </Rise>
              <div className="mt-8 grid gap-10 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-14 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-14 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20 lg:pb-20">
                <Rise reduce={reduce} delay={0.06}>
                  <div className="aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[28px] bg-[#efede8] shadow-[0_0_0_1px_rgba(26,23,20,0.06)] sm:rounded-[32px]">
                    <img src={a.photo} alt={a.name} draggable={false} className="size-full object-cover" />
                  </div>
                </Rise>
                <div className="min-w-0 self-center">
                  <Rise reduce={reduce} delay={0.1}><Eyebrow align="start" className="mb-6">Author</Eyebrow></Rise>
                  <Rise as="h1" reduce={reduce} delay={0.14} id="au-title" className={'m-0 leading-[1.05] text-ink [text-wrap:balance] ' + TITLE}>{a.name}</Rise>
                  <Rise as="p" reduce={reduce} delay={0.2} className="m-0 mt-4 font-sans text-[20px] leading-[1.4] text-ink-2">{a.role}</Rise>
                  {a.bio.map((t, i) => (
                    <Rise key={i} as="p" reduce={reduce} delay={0.26 + i * 0.04} className="m-0 mt-6 max-w-[62ch] font-sans text-[17px] leading-[1.7] text-ink-2 sm:text-[18px]">{t}</Rise>
                  ))}
                  {a.expertise.length > 0 && (
                    <Rise reduce={reduce} delay={0.32} className="mt-8">
                      <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">Expertise</p>
                      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                        {a.expertise.map(x => <li key={x} className="rounded-full bg-[#1a1714]/[0.05] px-3.5 py-1.5 font-sans text-[14px] text-ink">{x}</li>)}
                      </ul>
                    </Rise>
                  )}
                  <Rise reduce={reduce} delay={0.38} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[14.5px] text-ink-3">
                    <span><span className="text-ink">{posts.length}</span> {posts.length === 1 ? 'article' : 'articles'}</span>
                    {latest && <span>Latest <time className="text-ink">{latest}</time></span>}
                  </Rise>
                </div>
              </div>
            </div>
          </section>

          {/* 2 — Articles by */}
          <section aria-labelledby="au-posts-title" className="px-4 pb-[clamp(72px,8vw,120px)] pt-[clamp(56px,7vw,96px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="au-posts-title" className={'m-0 leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Articles by ' + first]} />
              <ScrubText as="p" reduce={reduce} lag={0.1} className="m-0 mt-4 max-w-[52ch] font-sans text-[17px] leading-[1.6] text-ink-2">{a.postsSub}</ScrubText>
              <ul className="m-0 mt-10 grid list-none gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, shown).map(p => (
                  <li key={p.slug}>
                    <a href={'/blog/' + p.slug} className={'group block rounded-[22px] text-ink no-underline ' + FOCUS}>
                      <Banner p={p} className="rounded-[18px]" />
                      <span className="mt-4 flex items-center gap-2 font-sans text-[13px] text-ink-3"><span className="text-[#43681a]">{TOPIC[p.topics[0]]}</span><span aria-hidden="true">·</span><time>{shortDate(p.date)}</time></span>
                      <span className="hiw-step-title mt-2 block text-[21px] leading-[1.2] text-ink [text-wrap:balance]">{p.title}</span>
                      <span className="mt-2 block line-clamp-2 font-sans text-[15px] leading-[1.55] text-ink-2">{p.excerpt}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {shown < posts.length && (
                <div className="mt-14 flex justify-center">
                  <button type="button" onClick={() => setShown(n => n + PAGE)}
                    className={'inline-flex h-12 cursor-pointer items-center rounded-full border-0 bg-white px-7 font-sans text-[15.5px] font-medium text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.12)] transition-colors duration-200 hover:bg-[#f6f4ee] ' + FOCUS}>
                    Show more articles
                  </button>
                </div>
              )}
            </div>
          </section>

          <ClosingCTA titleId="au-cta-title" chips={false} compact lines={['Ask your customers', 'anything.']}
            sub="Frank runs hundreds of AI customer interviews overnight and brings back the answers in your customers’ own words."
            primary={{ label: 'Get started', href: SIGNUP }} secondary={{ label: 'Try a live demo', href: siteHref('/try-frank') }} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
