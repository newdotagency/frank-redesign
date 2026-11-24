// ProductUpdatePage (V21.04): one update of hifrank.ai/product-updates/<slug>, in the V21.04 style. The words, the
// screenshots and the order are the live page's (product-updates/updates.json). The page:
//   1. Head: "← Product updates", the date, the title, the line under it, and what else shipped in this release.
//   2. The article: headings, paragraphs (bold lead-ins), lists, numbered steps and the screenshots in framed cards;
//      the closing lines ("Frank runs your customer interviews…") in a lime card.
//   3. More updates (three cards), the home page's closing panel, the footer.
// Entrance: the head rises in once on load. Reduced motion: fades only.
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Header from '../components/Header';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';
import { siteHref } from '../lib/sitePaths';
import { Date_, FOCUS, Inline, Rise, SIGNUP, UPDATES, hrefOf } from './product-updates/parts';

const HREFS = { home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' };
const P = 'm-0 mt-5 font-sans text-[17px] leading-[1.7] text-ink-2 sm:text-[18px]';
const OUTRO = /^Frank runs your customer interviews/;

// The closing lines of an update: the sign-off and the paragraph after it (or the sign-off alone).
function splitOutro(blocks) {
  const i = blocks.findIndex(b => b.t === 'p' && OUTRO.test(b.x));
  return i < 0 ? { body: blocks, outro: [] } : { body: blocks.slice(0, i), outro: blocks.slice(i) };
}

function Block({ b }) {
  switch (b.t) {
    case 'h':
      return <h2 className="hiw-step-title m-0 mt-14 text-[clamp(26px,2.8vw,34px)] leading-[1.15] text-ink [text-wrap:balance] sm:mt-16">{b.x.replace(/\*+/g, '')}</h2>;
    case 'p':
      return <p className={P}><Inline x={b.x} /></p>;
    case 'blockquote':
      return <blockquote className="m-0 mt-6 border-0 border-l-2 border-solid border-[#a0d05f] pl-5 font-serif text-[19px] italic leading-[1.5] text-ink"><Inline x={b.x} /></blockquote>;
    case 'ul':
      return (
        <ul className="m-0 mt-5 list-none p-0">
          {b.items.map(t => (
            <li key={t} className="relative mt-3 pl-7 font-sans text-[17px] leading-[1.65] text-ink-2 sm:text-[18px]">
              <span aria-hidden="true" className="absolute left-0 top-[0.62em] size-2 rounded-full bg-[#a0d05f]" />
              <Inline x={t} />
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="m-0 mt-5 list-none p-0">
          {b.items.map((t, i) => (
            <li key={t} className="relative mt-4 pl-11 font-sans text-[17px] leading-[1.65] text-ink-2 sm:text-[18px]">
              <span aria-hidden="true" className="absolute left-0 top-[0.1em] grid size-7 place-items-center rounded-full bg-[#d1f899] font-sans text-[13px] font-medium tabular-nums text-[#2a321e]">{i + 1}</span>
              <Inline x={t} />
            </li>
          ))}
        </ol>
      );
    case 'img':
      return (
        <figure className="m-0 mt-7 overflow-hidden rounded-[22px] bg-[#f4f2ec] p-3 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-4">
          <img src={b.src} alt={b.alt || ''} loading="lazy" draggable={false} className="block w-full rounded-[14px] bg-white ring-1 ring-[#1a1714]/[0.06]" />
        </figure>
      );
    default:
      return null;
  }
}

// A card for another update.
function Card({ u }) {
  return (
    <li>
      <a href={hrefOf(u)} className={'group flex h-full flex-col rounded-[24px] bg-[#fffdf3] p-7 text-ink no-underline shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] transition-colors duration-300 hover:bg-[#fbf8e8] sm:p-8 ' + FOCUS}>
        <Date_>{u.date}</Date_>
        <h3 className="hiw-step-title m-0 mt-4 text-[22px] leading-[1.2] text-ink [text-wrap:balance]">{u.title}</h3>
        <p className="m-0 mt-3 line-clamp-3 font-sans text-[15.5px] leading-[1.6] text-ink-2">{u.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-sans text-[15px] font-medium text-ink">Read more
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" strokeWidth={1.75} />
        </span>
      </a>
    </li>
  );
}

export default function ProductUpdatePage({ slug }) {
  const u = UPDATES.find(x => x.slug === slug);
  const reduce = !!useReducedMotion();
  const { body, outro } = splitOutro(u.blocks);
  const more = UPDATES.filter(x => x.slug !== slug);
  const next = [...more.slice(UPDATES.indexOf(u)), ...more].slice(0, 3);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={HREFS} />
        <main id="main">
          {/* 1 — Head */}
          <header className="px-4 pt-[196px] sm:px-[clamp(16px,4vw,48px)] sm:pt-[160px]">
            <div className="mx-auto max-w-[820px]">
              <Rise reduce={reduce}>
                <a href="/product-updates" className={'inline-flex items-center gap-2 rounded-[6px] font-sans text-[14.5px] text-ink-3 no-underline transition-colors duration-200 hover:text-ink ' + FOCUS}>
                  <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />Product updates
                </a>
              </Rise>
              <Rise reduce={reduce} delay={0.04} className="mt-8"><Date_ className="!text-[15px]">{u.date}</Date_></Rise>
              <Rise as="h1" reduce={reduce} delay={0.08} id="pu-art-title" className={'m-0 mt-4 text-[clamp(32px,4.2vw,54px)] leading-[1.08] text-ink [text-wrap:balance] ' + TITLE}>{u.title}</Rise>
              {u.lead && <Rise as="p" reduce={reduce} delay={0.16} className="m-0 mt-6 font-sans text-[19px] leading-[1.55] text-ink-2 sm:text-[21px]"><Inline x={u.lead} /></Rise>}
              {u.also.length > 0 && (
                <Rise reduce={reduce} delay={0.24} className="mt-9 rounded-[22px] bg-[#fffdf3] p-6 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-7">
                  <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">Also in this release</p>
                  <ul className="m-0 mt-4 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                    {u.also.map(a => (
                      <li key={a} className="flex items-start gap-3 font-sans text-[15.5px] leading-[1.5] text-ink">
                        <span aria-hidden="true" className="mt-[1px] grid size-5 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Check className="size-3" strokeWidth={2.4} /></span>
                        <span><Inline x={a} /></span>
                      </li>
                    ))}
                  </ul>
                </Rise>
              )}
            </div>
          </header>

          {/* 2 — The article */}
          <article className="px-4 pb-[clamp(72px,8vw,120px)] pt-6 sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[820px] border-0 border-t border-solid border-[#1a1714]/[0.08] pt-2 sm:mt-10">
              {body.map((b, i) => <Block key={i} b={b} />)}
              {outro.length > 0 && (
                <aside className="mt-16 rounded-[28px] bg-[#d1f899] p-8 sm:p-10">
                  {outro.map((b, i) => (
                    <p key={i} className={i === 0 ? 'hiw-step-title m-0 text-[clamp(22px,2.4vw,28px)] leading-[1.25] text-ink [text-wrap:balance]' : 'm-0 mt-4 font-sans text-[17px] leading-[1.6] text-[#1a1714]/80'}>
                      <Inline x={b.x} />
                    </p>
                  ))}
                </aside>
              )}
            </div>
          </article>

          {/* 3 — More updates */}
          <section aria-labelledby="pu-more-title" className="px-4 sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-[1312px]">
              <ScrubTitle reduce={reduce} id="pu-more-title" className={'m-0 text-center leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={['More product updates']} />
              <ScrubText reduce={reduce} lag={0.1}>
                <ul className="m-0 mt-12 grid list-none gap-4 p-0 sm:mt-14 md:grid-cols-3">{next.map(x => <Card key={x.slug} u={x} />)}</ul>
              </ScrubText>
            </div>
          </section>

          <div className="pt-[clamp(88px,10vw,150px)]">
            <ClosingCTA titleId="pu-cta-title" chips={false} compact
              lines={['Try Frank AI Researcher', 'Yourself']}
              sub="Watch it ask questions, adapt, and go deep with real customer insights. Try it now. It’s a lot of fun!"
              primary={{ label: 'Sign up for free', href: SIGNUP }} secondary={{ label: 'Try a Live Demo', href: siteHref('/try-frank') }} />
          </div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
