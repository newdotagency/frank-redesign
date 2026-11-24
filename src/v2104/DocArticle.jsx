// DocArticle (V21.04) — one guide from the docs (articles.json), laid out to be read and scanned:
//   · a breadcrumb back to Docs & guides, the title, the lead, and "N min read" with a link to the original;
//   · the guide's sections, each a numbered heading so long guides show their shape, and its blocks as
//     proper components: paragraphs at a reading measure, sub-headings, numbered steps on a rail, bullet
//     lists, callouts (note / tip / warning), code with a copy button, tables, screenshots in frames with
//     captions, FAQ answers that fold open, video links;
//   · from 1280px, "On this page" on the right, following the section you're reading (click to jump);
//   · at the end: "Was this helpful?", the previous and next guide, and support.
// Inline text marks: **bold**, *italic*, `code`, [link](url).
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { localize } from '../lib/sitePaths';
import { AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Info, Lightbulb, Mail, Play, ThumbsDown, ThumbsUp } from 'lucide-react';

const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

// Inline marks → React.
function Inline({ x }) {
  const parts = String(x || '').split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-medium text-ink">{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="rounded-[5px] bg-[#1a1714]/[0.06] px-[5px] py-[1px] font-gmono text-[0.86em] text-ink">{p.slice(1, -1)}</code>;
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    // Links to other docs articles open their new version on this page (the old pages are going away).
    const doc = m && m[2].match(/hifrank\.ai\/(?:docs|help)\/([\w-]+)/);
    const local = m && localize(m[2]);
    if (m && doc) return <a key={i} href={'/docs/' + doc[1]} className="text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px] hover:decoration-ink">{m[1]}</a>;
    if (m && local !== m[2]) return <a key={i} href={local} className="text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px] hover:decoration-ink">{m[1]}</a>;
    if (m) return <a key={i} href={m[2]} target={m[2].startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer" className="text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px] hover:decoration-ink">{m[1]}</a>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function CodeBlock({ b }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(b.x).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
  };
  return (
    <div className="overflow-hidden rounded-[16px] bg-[#1a1714] shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
      <div className="flex items-center justify-between border-0 border-b border-solid border-white/[0.08] px-4 py-2">
        <span className="font-gmono text-[12px] uppercase tracking-[0.06em] text-white/50">{b.lang || 'code'}</span>
        <button type="button" onClick={copy}
          className={'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border-0 px-2.5 font-sans text-[12px] transition-colors duration-200 ' + (copied ? 'bg-[#d1f899] text-[#0f2e27]' : 'bg-white/[0.08] text-white/75 hover:bg-white/[0.14]') + ' ' + FOCUS}>
          {copied ? <Check className="size-3.5" strokeWidth={2.25} /> : <Copy className="size-3.5" strokeWidth={1.75} />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-gmono text-[13px] leading-[1.65] text-[#f3f1ea]"><code>{b.x}</code></pre>
    </div>
  );
}

const CALLOUT = {
  note: { icon: Info, box: 'bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)]', ic: 'text-ink-2', label: 'Note' },
  tip: { icon: Lightbulb, box: 'bg-[#f1f9e3] shadow-[inset_0_0_0_1px_rgba(95,143,34,0.18)]', ic: 'text-[#3f6b12]', label: 'Tip' },
  warn: { icon: AlertTriangle, box: 'bg-[#fbf3db] shadow-[inset_0_0_0_1px_rgba(149,100,0,0.18)]', ic: 'text-[#8a6100]', label: 'Important' },
};

const P = 'm-0 font-sans text-[16.5px] leading-[1.75] text-ink-2';

function Block({ b }) {
  switch (b.t) {
    case 'p': return <p className={P}><Inline x={b.x} /></p>;
    case 'h3': return <h3 className="m-0 pt-2 font-['Figtree',sans-serif] text-[19px] font-medium leading-snug tracking-[-0.015em] text-ink"><Inline x={b.x} /></h3>;
    case 'list': return (
      <ul className="m-0 grid list-none gap-2.5 p-0">
        {b.items.map((it, i) => (
          <li key={i} className={'relative pl-6 ' + P}>
            <span aria-hidden="true" className="absolute left-1 top-[0.72em] size-[7px] rounded-full bg-[#a0d05f]" />
            <Inline x={it} />
          </li>
        ))}
      </ul>
    );
    case 'steps': return (
      <ol className="m-0 list-none p-0">
        {b.items.map((it, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {i < b.items.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[15px] top-9 w-px bg-[#1a1714]/[0.1]" />}
            <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-[#d1f899] font-gmono text-[13px] text-[#0f2e27]">{i + 1}</span>
            <div className="min-w-0 pt-[3px]">
              {it.title && <p className="m-0 font-sans text-[16.5px] font-medium leading-snug text-ink"><Inline x={it.title} /></p>}
              {it.x && <p className={P + (it.title ? ' mt-1' : '')}><Inline x={it.x} /></p>}
            </div>
          </li>
        ))}
      </ol>
    );
    case 'callout': {
      const c = CALLOUT[b.tone] || CALLOUT.note;
      return (
        <div className={'flex gap-3 rounded-[16px] p-4 ' + c.box}>
          <c.icon aria-hidden="true" className={'mt-[3px] size-[18px] shrink-0 ' + c.ic} strokeWidth={1.75} />
          <p className="m-0 font-sans text-[15.5px] leading-[1.65] text-ink-2"><span className="sr-only">{c.label}: </span><Inline x={b.x} /></p>
        </div>
      );
    }
    case 'code': return <CodeBlock b={b} />;
    case 'table': return (
      <div className="overflow-x-auto rounded-[16px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
        <table className="w-full min-w-[560px] border-collapse font-sans text-[14.5px]">
          <thead>
            <tr className="bg-[#f6f4ee]">
              {b.head.map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-2.5 text-left text-[12.5px] font-medium uppercase tracking-[0.04em] text-ink-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, ri) => (
              <tr key={ri} className="border-0 border-t border-solid border-[#1a1714]/[0.06] align-top">
                {r.map((c, ci) => <td key={ci} className={'px-4 py-3 leading-[1.5] ' + (ci === 0 ? 'font-gmono text-[13px] text-ink' : 'text-ink-2')}><Inline x={c} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    case 'img': return (
      <figure className="m-0">
        <a href={b.src} target="_blank" rel="noopener noreferrer" className={'block overflow-hidden rounded-[18px] bg-[#f6f4ee] p-2 shadow-[0_0_0_1px_rgba(26,23,20,0.06)] ' + FOCUS}>
          <img src={b.src} alt={b.alt || ''} loading="lazy" className="block h-auto w-full rounded-[12px] bg-white" />
        </a>
        {b.cap && <figcaption className="mt-2.5 px-1 font-sans text-[13.5px] leading-snug text-ink-3"><Inline x={b.cap} /></figcaption>}
      </figure>
    );
    case 'qa': return (
      <div className="divide-y divide-[#1a1714]/[0.07] overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.07)]">
        {b.items.map((it, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-sans text-[16px] font-medium leading-snug text-ink [&::-webkit-details-marker]:hidden">
              <Inline x={it.q} />
              <ChevronDown aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.75} />
            </summary>
            <div className="grid gap-4 px-5 pb-5">{(it.a || []).map((ab, j) => <Block key={j} b={ab} />)}</div>
          </details>
        ))}
      </div>
    );
    case 'video': return (
      <a href={b.src} target="_blank" rel="noopener noreferrer" className={'group flex items-center gap-4 rounded-[18px] bg-[#0f2e27] p-4 no-underline ' + FOCUS}>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#0f2e27]"><Play className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} /></span>
        <span className="font-sans text-[15.5px] text-white">{b.title || 'Watch the video'}</span>
        <ArrowUpRight aria-hidden="true" className="ml-auto size-4 text-white/60" strokeWidth={1.5} />
      </a>
    );
    default: return null;
  }
}

// "Was this helpful?": a thank-you once answered (kept on the page only).
function Helpful() {
  const [v, setV] = useState(null);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-white px-5 py-4 shadow-[0_0_0_1px_rgba(26,23,20,0.07)]">
      <p className="m-0 font-sans text-[15px] text-ink">{v ? 'Thanks for letting us know.' : 'Was this helpful?'}</p>
      {!v && (
        <span className="flex gap-2">
          {[['yes', ThumbsUp, 'Yes'], ['no', ThumbsDown, 'No']].map(([k, Icon, label]) => (
            <button key={k} type="button" onClick={() => setV(k)}
              className={'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-[#1a1714]/[0.05] px-3.5 font-sans text-[14px] text-ink-2 transition-colors duration-200 hover:bg-[#1a1714]/[0.09] hover:text-ink ' + FOCUS}>
              <Icon className="size-4" strokeWidth={1.75} />{label}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}

export default function DocArticle({ slug, a, prev, next }) {
  const reduce = !!useReducedMotion();
  const [current, setCurrent] = useState(a.sections[0]?.id);
  const refs = useRef({});
  // "On this page" follows the section nearest the top of the window.
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top);
      if (vis[0]) setCurrent(vis[0].target.dataset.id);
    }, { rootMargin: '-15% 0px -70% 0px' });
    Object.values(refs.current).forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [slug]);
  const jump = id => {
    const el = refs.current[id]; if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
  };
  const numbered = a.sections.length > 1;

  return (
    <motion.article key={slug} initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.5, ease: EASE }} className="xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-14">
      <div className="min-w-0">
        {/* Header. */}
        <nav aria-label="Breadcrumb" className="font-sans text-[13.5px] text-ink-3">
          <a href="/docs" className={'inline-flex items-center gap-1.5 rounded-[6px] text-ink-3 no-underline hover:text-ink ' + FOCUS}><ArrowLeft className="size-3.5" strokeWidth={1.75} />Docs and guides</a>
        </nav>
        <h1 className="m-0 mt-5 font-['Figtree',sans-serif] text-[clamp(30px,4vw,44px)] font-medium leading-[1.08] tracking-[-0.03em] text-ink [text-wrap:balance]">{a.title}</h1>
        {a.lead && <p className="m-0 mt-4 max-w-[60ch] font-sans text-[18px] leading-[1.6] text-ink-2"><Inline x={a.lead} /></p>}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[13.5px] text-ink-3">
          <span>{a.readMins} min read</span>
          {numbered && <span>{a.sections.length} sections</span>}
        </div>
        <span aria-hidden="true" className="mt-8 block h-px bg-[#1a1714]/[0.08]" />

        {/* Sections. */}
        <div className="mt-10 grid gap-14">
          {a.sections.map((s, si) => (
            <section key={s.id} ref={el => { refs.current[s.id] = el; }} data-id={s.id} aria-labelledby={`${slug}-${s.id}`} className="scroll-mt-6">
              <h2 id={`${slug}-${s.id}`} className="m-0 flex items-baseline gap-3 font-['Figtree',sans-serif] text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
                {numbered && <span className="font-gmono text-[14px] font-normal text-ink-3">{String(si + 1).padStart(2, '0')}</span>}
                <span><Inline x={s.title} /></span>
              </h2>
              <div className="mt-5 grid gap-5 [&>p]:max-w-[68ch]">{s.blocks.map((b, bi) => <Block key={bi} b={b} />)}</div>
            </section>
          ))}
        </div>

        {/* End of guide: helpful, previous / next, support. */}
        <div className="mt-16 grid gap-4">
          <Helpful />
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <a href={'/docs/' + prev.path} className={'group rounded-[18px] bg-white p-5 no-underline shadow-[0_0_0_1px_rgba(26,23,20,0.07)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(26,23,20,0.14)] ' + FOCUS}>
                <span className="flex items-center gap-1.5 font-sans text-[13px] text-ink-3"><ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={1.75} />Previous</span>
                <span className="mt-1.5 block font-sans text-[16px] text-ink">{prev.title}</span>
              </a>
            ) : <span />}
            {next && (
              <a href={'/docs/' + next.path} className={'group rounded-[18px] bg-white p-5 text-right no-underline shadow-[0_0_0_1px_rgba(26,23,20,0.07)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(26,23,20,0.14)] ' + FOCUS}>
                <span className="flex items-center justify-end gap-1.5 font-sans text-[13px] text-ink-3">Next<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.75} /></span>
                <span className="mt-1.5 block font-sans text-[16px] text-ink">{next.title}</span>
              </a>
            )}
          </div>
          <p className="m-0 mt-2 flex flex-wrap items-center gap-2 font-sans text-[14.5px] text-ink-3">
            Still need help?
            <a href="mailto:support@hifrank.ai" className={'inline-flex items-center gap-1.5 rounded-[6px] text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px] ' + FOCUS}><Mail className="size-3.5" strokeWidth={1.75} />support@hifrank.ai</a>
          </p>
        </div>
      </div>

      {/* On this page (from 1280px). */}
      {numbered && (
        <aside className="hidden xl:block">
          <div className="sticky top-8">
            <p className="m-0 mb-3 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">On this page</p>
            <ul className="m-0 list-none border-0 border-l border-solid border-[#1a1714]/[0.08] p-0">
              {a.sections.map(s => {
                const on = s.id === current;
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => jump(s.id)}
                      className={'-ml-px block w-full cursor-pointer border-0 border-l-2 border-solid bg-transparent py-1.5 pl-3 text-left font-sans text-[13.5px] leading-snug transition-colors duration-200 ' + (on ? 'border-[#5f8f22] text-ink' : 'border-transparent text-ink-3 hover:text-ink-2') + ' ' + FOCUS}>
                      {s.title.replace(/\*\*|`/g, '')}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      )}
    </motion.article>
  );
}
