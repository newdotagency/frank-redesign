// BlogPostPage (V21.04): one post of hifrank.ai/blog/<slug>, in the V21.04 style. The words, tables, FAQ, author, date
// and banner are the live post's (blog/articles.json; the pictures are in public/blog/<slug>/). The page:
//   1. Head: "← Blog", the topic and date, the title, the summary, the byline (photo, "Written by", read time) and the banner.
//   2. The article, with "On this page" (the post's sections, following what you read, from 1280px): headings you can
//      link to, paragraphs at a reading measure, lists, screenshots in frames, comparison tables (Frank's row tinted),
//      quotes; then the FAQ as folding answers, and the author.
//   3. Keep reading (three more posts, the same topic first), the home page's closing panel, the footer.
// Entrance: the head rises in once on load. Reduced motion: fades only.
import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Link2 } from 'lucide-react';
import Header from '../components/Header';
import Banner from './Cover';
import { TITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import POSTS from './blog/posts.json';
import { siteHref } from '../lib/sitePaths';
import { FOCUS, Rise } from './product-updates/parts';
import { Block, slugify, words } from './ArticleBlocks';

const SIGNUP = 'https://app.hifrank.ai/signup';
const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const TOPIC = { interviews: 'Customer interviews', comparisons: 'Comparisons', playbooks: 'AI playbooks', churn: 'Churn', research: 'Research & insights' };
const shortDate = d => d.replace(/^(\w{3})\w*/, '$1');

const Avatar = ({ author, size = 44 }) => (
  author.avatar
    ? <img src={author.avatar} alt="" width={size} height={size} loading="lazy" className="shrink-0 rounded-full object-cover ring-1 ring-[#1a1714]/10" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="grid shrink-0 place-items-center rounded-full bg-[#d1f899] font-sans text-[14px] font-medium text-[#2a321e]" style={{ width: size, height: size }}>{author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
);

// A link on the page: other posts and pages hosted here stay in the tab; the rest open in a new one.
const authorHref = a => siteHref('/author/' + a.slug);

function Faq({ items }) {
  return (
    <section aria-labelledby="post-faq" className="mt-16 sm:mt-20">
      <h2 id="post-faq" className="hiw-step-title m-0 text-[clamp(26px,2.9vw,36px)] leading-[1.15] text-ink">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-[#1a1714]/[0.07] overflow-hidden rounded-[20px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
        {items.map((q, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-sans text-[16.5px] font-medium leading-snug text-ink [&::-webkit-details-marker]:hidden">
              <span>{q.q}</span>
              <ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.75} />
            </summary>
            <div className="grid gap-3 px-5 pb-5">{q.a.map((b, j) => <Block key={j} b={b} ids={new Map()} />)}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

function More({ post, reduce }) {
  const topic = POSTS.find(p => p.slug === post.slug)?.topics?.[0];
  const pool = POSTS.filter(p => p.slug !== post.slug);
  const same = pool.filter(p => p.topics?.includes(topic));
  const list = [...same, ...pool.filter(p => !same.includes(p))].slice(0, 3);
  return (
    <section aria-labelledby="post-more" className="px-4 pt-[clamp(72px,8vw,120px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <ScrubTitle reduce={reduce} id="post-more" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['Keep reading']} />
        <ScrubText reduce={reduce} lag={0.1}>
          <ul className="m-0 mt-12 grid list-none gap-6 p-0 sm:mt-14 md:grid-cols-3">
            {list.map(p => (
              <li key={p.slug}>
                <a href={'/blog/' + p.slug} className={'group block rounded-[22px] text-ink no-underline ' + FOCUS}>
                  <Banner p={p} className="rounded-[18px]" />
                  <span className="mt-4 flex items-center gap-2 font-sans text-[13px] text-ink-3"><span className="text-[#43681a]">{TOPIC[p.topics[0]]}</span><span aria-hidden="true">·</span><time>{shortDate(p.date)}</time></span>
                  <span className="hiw-step-title mt-2 block text-[21px] leading-[1.2] text-ink [text-wrap:balance]">{p.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </ScrubText>
      </div>
    </section>
  );
}

export default function BlogPostPage({ post }) {
  const reduce = !!useReducedMotion();
  const topic = POSTS.find(p => p.slug === post.slug)?.topics?.[0];
  const mins = Math.max(1, Math.round(words(post.blocks) / 215));
  // Section ids for "On this page" (the h2s), unique within the post.
  const { ids, toc } = useMemo(() => {
    const ids = new Map(), seen = {}, toc = [];
    post.blocks.forEach(b => {
      if (b.t === 'h' && b.l <= 2) {
        let id = slugify(b.x) || 'section'; seen[id] = (seen[id] || 0) + 1; if (seen[id] > 1) id += '-' + seen[id];
        ids.set(b, id); toc.push({ id, title: b.x });
      }
    });
    if (post.faq.length) toc.push({ id: 'post-faq', title: 'Frequently asked questions' });
    return { ids, toc };
  }, [post]);
  const [cur, setCur] = useState(toc[0]?.id);
  useEffect(() => {
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(es => {
      const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (v[0]) setCur(v[0].target.id);
    }, { rootMargin: '-110px 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [post]);
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
                <a href="/blog" className={'inline-flex items-center gap-2 rounded-[6px] font-sans text-[14.5px] text-ink-3 no-underline transition-colors duration-200 hover:text-ink ' + FOCUS}>
                  <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />Blog
                </a>
              </Rise>
              <Rise reduce={reduce} delay={0.04} className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[14px] text-ink-3">
                {topic && <span className="inline-flex h-7 items-center rounded-full bg-[#d1f899] px-3 text-[12.5px] font-medium text-[#2a321e]">{TOPIC[topic]}</span>}
                <time>{post.date}</time><span aria-hidden="true">·</span><span>{mins} min read</span>
              </Rise>
              <Rise as="h1" reduce={reduce} delay={0.08} id="post-title" className={'m-0 mt-5 max-w-[20em] text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}>{post.title}</Rise>
              {post.summary && <Rise as="p" reduce={reduce} delay={0.16} className="m-0 mt-6 max-w-[62ch] font-sans text-[18px] leading-[1.6] text-ink-2 sm:text-[20px]">{post.summary}</Rise>}
              <Rise reduce={reduce} delay={0.22} className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <a href={authorHref(post.author)} className={'group flex items-center gap-3 rounded-[12px] text-ink no-underline ' + FOCUS}>
                  <Avatar author={post.author} />
                  <span className="flex flex-col font-sans leading-[1.35]"><span className="text-[13px] text-ink-3">Written by</span><span className="text-[15.5px] text-ink">{post.author.name}</span></span>
                </a>
                <button type="button" onClick={copy} className={'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-3.5 font-sans text-[13.5px] text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.1)] transition-colors duration-200 hover:bg-[#f6f4ee] ' + FOCUS}>
                  {copied ? <Check className="size-4 text-[#3f6b12]" strokeWidth={2.25} /> : <Link2 className="size-4" strokeWidth={1.75} />}{copied ? 'Link copied' : 'Copy link'}
                </button>
              </Rise>
              {post.hero && (
                <Rise reduce={reduce} delay={0.3} className="mt-10">
                  <img src={post.hero} alt="" draggable={false} className="block aspect-video w-full rounded-[24px] bg-[#efede8] object-cover sm:rounded-[32px]" />
                </Rise>
              )}
            </div>
          </header>

          {/* 2 — The article */}
          <section className="px-4 pb-[clamp(56px,7vw,96px)] pt-[clamp(40px,5vw,72px)] sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto grid max-w-[1100px] gap-12 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-16">
              {toc.length > 2 && (
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
              )}
              <article className={'min-w-0 max-w-[740px] ' + (toc.length > 2 ? '' : 'xl:col-span-2 xl:mx-auto')}>
                <div className="grid gap-5 [&>p]:max-w-[68ch]">{post.blocks.map((b, i) => <Block key={i} b={b} ids={ids} />)}</div>
                {post.faq.length > 0 && <Faq items={post.faq} />}
                <a href={authorHref(post.author)} className={'mt-16 flex items-center gap-4 rounded-[22px] bg-[#fffdf3] p-6 text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] sm:p-7 ' + FOCUS}>
                  <Avatar author={post.author} size={56} />
                  <span className="flex min-w-0 flex-1 flex-col font-sans leading-[1.4]"><span className="text-[13px] text-ink-3">Written by</span><span className="text-[17px] text-ink">{post.author.name}</span></span>
                  <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-ink-3" strokeWidth={1.5} />
                </a>
              </article>
            </div>
          </section>

          {/* 3 — Keep reading, closing */}
          <More post={post} reduce={reduce} />
          <div className="pt-[clamp(72px,8vw,120px)]">
            <ClosingCTA titleId="post-cta-title" chips={false} compact lines={['Ask your customers', 'anything.']}
              sub="Frank runs hundreds of AI customer interviews overnight and brings back the answers in your customers’ own words."
              primary={{ label: 'Get started', href: SIGNUP }} secondary={{ label: 'Try a live demo', href: siteHref('/try-frank') }} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
