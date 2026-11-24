// DocArticle (V21.04) — one guide from the docs (articles.json), set for reading and finding things:
//   · breadcrumbs (Docs › group › guide), the title, the description, read time, and "Copy page" (the guide as Markdown);
//   · sections as anchored headings (hover for the link, click copies it), sub-steps (the "Step 1…" headings) listed under
//     their section in "On this page" (from 1280px, following what you're reading);
//   · blocks as components: paragraphs at a reading measure, numbered steps on a rail, lists, callouts (note / tip /
//     warning), code in a dark card with the language, syntax colours and a copy button (consecutive samples become
//     tabs: a request and its response), tables, screenshots (click to enlarge), questions that fold open, videos;
//   · at the end: "Was this helpful?", previous and next guide in reading order, and support.
// Inline text marks: **bold**, *italic*, `code`, [link](url).
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { localize } from '../lib/sitePaths';
import { AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, Copy, Info, Lightbulb, Link2, Mail, Play, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { Highlighted } from './docs/highlight';
import { GUIDES, groupOf } from './docs/structure';

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

const slugify = t => String(t).replace(/\*\*|`/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const LANG = { bash: 'Shell', sh: 'Shell', json: 'JSON', js: 'JavaScript', javascript: 'JavaScript', html: 'HTML', text: 'Text' };
const copyText = (t, done) => navigator.clipboard?.writeText(t).then(done).catch(() => {});

// A copy button that says "Copied" for a moment.
function CopyBtn({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={() => copyText(text, () => { setCopied(true); setTimeout(() => setCopied(false), 1600); })}
      className={'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border-0 px-2.5 font-sans text-[12px] transition-colors duration-200 ' + (copied ? 'bg-[#d1f899] text-[#0f2e27]' : 'bg-white/[0.08] text-white/75 hover:bg-white/[0.14]') + ' ' + className}>
      {copied ? <Check className="size-3.5" strokeWidth={2.25} /> : <Copy className="size-3.5" strokeWidth={1.75} />}{copied ? 'Copied' : label}
    </button>
  );
}

// Code: a dark card, language (or tabs when samples sit together), highlighted, with a copy button.
function Code({ items }) {
  const [on, setOn] = useState(0);
  const cur = items[on];
  const seen = {};
  const labels = items.map(b => { const l = LANG[b.lang] || b.lang || 'Code'; seen[l] = (seen[l] || 0) + 1; return seen[l] > 1 ? `${l} ${seen[l]}` : l; });
  return (
    <div className="overflow-hidden rounded-[16px] bg-[#1a1714] shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
      <div className="flex items-center justify-between gap-3 border-0 border-b border-solid border-white/[0.08] pl-2 pr-3">
        <div role="tablist" className="flex min-w-0 gap-0.5 overflow-x-auto py-1.5">
          {items.map((b, i) => (
            items.length > 1 ? (
              <button key={i} type="button" role="tab" aria-selected={i === on} onClick={() => setOn(i)}
                className={'cursor-pointer whitespace-nowrap rounded-[8px] border-0 px-2.5 py-1 font-sans text-[12.5px] transition-colors duration-150 ' + (i === on ? 'bg-white/[0.1] text-white' : 'bg-transparent text-white/50 hover:text-white/80')}>{labels[i]}</button>
            ) : <span key={i} className="px-2.5 py-1 font-sans text-[12.5px] text-white/55">{labels[i]}</span>
          ))}
        </div>
        <CopyBtn text={cur.x} />
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-gmono text-[13px] leading-[1.7] text-[#f3f1ea]"><code><Highlighted code={cur.x} lang={cur.lang} /></code></pre>
    </div>
  );
}

const CALLOUT = {
  note: { icon: Info, box: 'bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)]', ic: 'text-ink-2', label: 'Note' },
  tip: { icon: Lightbulb, box: 'bg-[#f1f9e3] shadow-[inset_0_0_0_1px_rgba(95,143,34,0.18)]', ic: 'text-[#3f6b12]', label: 'Tip' },
  warn: { icon: AlertTriangle, box: 'bg-[#fbf3db] shadow-[inset_0_0_0_1px_rgba(149,100,0,0.18)]', ic: 'text-[#8a6100]', label: 'Important' },
};

const P = 'm-0 font-sans text-[16.5px] leading-[1.75] text-ink-2';

// A heading you can link to: hover shows the link, clicking copies the address.
function Anchored({ as: T = 'h2', id, className, children }) {
  const [copied, setCopied] = useState(false);
  const copy = e => {
    e.preventDefault();
    const url = window.location.origin + window.location.pathname + '#' + id;
    history.replaceState(null, '', '#' + id);
    copyText(url, () => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
  };
  return (
    <T id={id} className={'group scroll-mt-24 ' + className}>
      {children}
      <a href={'#' + id} onClick={copy} aria-label="Copy link to this section"
        className={'ml-2 inline-grid size-6 translate-y-[2px] place-items-center rounded-[6px] align-middle no-underline transition-opacity duration-150 focus-visible:opacity-100 ' + (copied ? 'bg-[#d1f899] text-[#2a321e] opacity-100' : 'text-ink-3 opacity-0 hover:bg-[#1a1714]/[0.06] group-hover:opacity-100')}>
        {copied ? <Check className="size-3.5" strokeWidth={2.25} /> : <Link2 className="size-3.5" strokeWidth={1.75} />}
      </a>
    </T>
  );
}

// A screenshot in its frame; click to see it large.
function Shot({ b }) {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return;
    const k = e => e.key === 'Escape' && setBig(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [big]);
  return (
    <figure className="m-0">
      <button type="button" onClick={() => setBig(true)} aria-label={'Enlarge: ' + (b.alt || 'screenshot')}
        className={'block w-full cursor-zoom-in overflow-hidden rounded-[18px] border-0 bg-[#f6f4ee] p-2 text-left shadow-[0_0_0_1px_rgba(26,23,20,0.06)] ' + FOCUS}>
        <img src={b.src} alt={b.alt || ''} loading="lazy" className="block h-auto w-full rounded-[12px] bg-white" />
      </button>
      {b.cap && <figcaption className="mt-2.5 px-1 font-sans text-[13.5px] leading-snug text-ink-3"><Inline x={b.cap} /></figcaption>}
      {big && (
        <div role="dialog" aria-modal="true" aria-label={b.alt || 'Screenshot'} onClick={() => setBig(false)} className="fixed inset-0 z-[90] grid cursor-zoom-out place-items-center bg-[#1a1714]/70 p-4 sm:p-10">
          <img src={b.src} alt={b.alt || ''} className="max-h-full max-w-full rounded-[14px] bg-white shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6)]" />
          <button type="button" aria-label="Close" onClick={() => setBig(false)} className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink"><X className="size-5" strokeWidth={1.75} /></button>
        </div>
      )}
    </figure>
  );
}

// Blocks of a section: consecutive code samples become one tabbed card; h3s get ids for "On this page".
function group(blocks) {
  const out = [];
  blocks.forEach(b => {
    const last = out[out.length - 1];
    if (b.t === 'code' && last && last.t === 'codegroup') last.items.push(b);
    else if (b.t === 'code') out.push({ t: 'codegroup', items: [b] });
    else out.push(b);
  });
  return out;
}

function Block({ b, sid }) {
  switch (b.t) {
    case 'p': return <p className={P}><Inline x={b.x} /></p>;
    case 'h3': return <Anchored as="h3" id={`${sid}--${slugify(b.x)}`} className="m-0 pt-3 font-['Figtree',sans-serif] text-[19px] font-medium leading-snug tracking-[-0.015em] text-ink" ><Inline x={b.x} /></Anchored>;
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
          <p className="m-0 font-sans text-[15.5px] leading-[1.65] text-ink-2"><span className={'mr-1.5 font-medium ' + c.ic}>{c.label}</span><Inline x={b.x} /></p>
        </div>
      );
    }
    case 'codegroup': return <Code items={b.items} />;
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
    case 'img': return <Shot b={b} />;
    case 'qa': return (
      <div className="divide-y divide-[#1a1714]/[0.07] overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.07)]">
        {b.items.map((it, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-sans text-[16px] font-medium leading-snug text-ink [&::-webkit-details-marker]:hidden">
              <Inline x={it.q} />
              <ChevronDown aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.75} />
            </summary>
            <div className="grid gap-4 px-5 pb-5">{group(it.a || []).map((ab, j) => <Block key={j} b={ab} sid={sid} />)}</div>
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

// The guide as Markdown (for "Copy page").
const strip = t => String(t || '');
function toMarkdown(a) {
  const blk = b => {
    switch (b.t) {
      case 'p': return strip(b.x);
      case 'h3': return '### ' + strip(b.x);
      case 'list': return b.items.map(i => '- ' + i).join('\n');
      case 'steps': return b.items.map((i, n) => `${n + 1}. ${i.title ? '**' + i.title + '** ' : ''}${i.x || ''}`).join('\n');
      case 'callout': return '> **' + (CALLOUT[b.tone]?.label || 'Note') + ':** ' + strip(b.x);
      case 'code': return '```' + (b.lang || '') + '\n' + b.x + '\n```';
      case 'table': return ['| ' + b.head.join(' | ') + ' |', '|' + b.head.map(() => ' --- ').join('|') + '|', ...b.rows.map(r => '| ' + r.join(' | ') + ' |')].join('\n');
      case 'img': return `![${b.alt || ''}](${b.src})`;
      case 'qa': return b.items.map(i => `**${i.q}**\n\n${(i.a || []).map(blk).join('\n\n')}`).join('\n\n');
      case 'video': return `[${b.title || 'Video'}](${b.src})`;
      default: return '';
    }
  };
  return [`# ${a.title}`, a.lead, ...a.sections.map(s => `## ${strip(s.title)}\n\n${s.blocks.map(blk).filter(Boolean).join('\n\n')}`)].filter(Boolean).join('\n\n');
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
  const g = groupOf(slug);
  const desc = a.lead || GUIDES[slug]?.desc;
  // "On this page": the sections, and under each the sub-steps (h3).
  const toc = a.sections.flatMap(s => [{ id: s.id, title: s.title, level: 1 }, ...s.blocks.filter(b => b.t === 'h3').map(b => ({ id: `${s.id}--${slugify(b.x)}`, title: b.x, level: 2 }))]);
  const [current, setCurrent] = useState(toc[0]?.id);
  // The one that is nearest the top of the window.
  useEffect(() => {
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top);
      if (vis[0]) setCurrent(vis[0].target.id);
    }, { rootMargin: '-80px 0px -70% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [slug]);
  // Open at the section in the address (#id), once the page has settled.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 450);
    return () => clearTimeout(t);
  }, [slug]);
  const jump = id => {
    const el = document.getElementById(id); if (!el) return;
    history.replaceState(null, '', '#' + id);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: reduce ? 'auto' : 'smooth' });
  };
  const numbered = a.sections.length > 1;
  const [mdCopied, setMdCopied] = useState(false);

  return (
    <motion.article key={slug} initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.5, ease: EASE }} className="xl:grid xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-14">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 font-sans text-[13.5px] text-ink-3">
          <a href="/docs" className={'rounded-[6px] text-ink-3 no-underline hover:text-ink ' + FOCUS}>Docs</a>
          <ChevronRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          <span>{g?.label}</span>
          <ChevronRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          <span aria-current="page" className="text-ink">{GUIDES[slug]?.nav}</span>
        </nav>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <h1 className="m-0 min-w-0 max-w-[22ch] flex-1 basis-[300px] font-['Figtree',sans-serif] text-[clamp(30px,4vw,44px)] font-medium leading-[1.08] tracking-[-0.03em] text-ink [text-wrap:balance]">{a.title}</h1>
          <button type="button" onClick={() => copyText(toMarkdown(a), () => { setMdCopied(true); setTimeout(() => setMdCopied(false), 1800); })}
            className={'inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-3.5 font-sans text-[13.5px] text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.1)] transition-colors duration-200 hover:bg-[#f6f4ee] ' + FOCUS}>
            {mdCopied ? <Check className="size-4 text-[#3f6b12]" strokeWidth={2.25} /> : <Copy className="size-4" strokeWidth={1.75} />}{mdCopied ? 'Copied as Markdown' : 'Copy page'}
          </button>
        </div>
        {desc && <p className="m-0 mt-4 max-w-[60ch] font-sans text-[18px] leading-[1.6] text-ink-2"><Inline x={desc} /></p>}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[13.5px] text-ink-3">
          <span>{a.readMins} min read</span>
          {numbered && <span>{a.sections.length} sections</span>}
        </div>
        <span aria-hidden="true" className="mt-8 block h-px bg-[#1a1714]/[0.08]" />

        <div className="mt-10 grid gap-14">
          {a.sections.map((s, si) => (
            <section key={s.id} aria-labelledby={s.id}>
              <Anchored id={s.id} className="m-0 flex items-baseline font-['Figtree',sans-serif] text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[26px]">
                {numbered && <span className="mr-3 font-gmono text-[14px] font-normal text-ink-3">{String(si + 1).padStart(2, '0')}</span>}
                <span><Inline x={s.title} /></span>
              </Anchored>
              <div className="mt-5 grid gap-5 [&>p]:max-w-[68ch]">{group(s.blocks).map((b, bi) => <Block key={bi} b={b} sid={s.id} />)}</div>
            </section>
          ))}
        </div>

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

      {numbered && (
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <p className="m-0 mb-3 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">On this page</p>
            <ul className="m-0 max-h-[calc(100vh-160px)] list-none overflow-y-auto border-0 border-l border-solid border-[#1a1714]/[0.08] p-0">
              {toc.map(t => {
                const on = t.id === current;
                return (
                  <li key={t.id}>
                    <button type="button" onClick={() => jump(t.id)}
                      className={'-ml-px block w-full cursor-pointer border-0 border-l-2 border-solid bg-transparent py-1.5 text-left font-sans leading-snug transition-colors duration-200 ' + (t.level === 2 ? 'pl-6 text-[12.5px] ' : 'pl-3 text-[13.5px] ') + (on ? 'border-[#5f8f22] text-ink' : 'border-transparent text-ink-3 hover:text-ink-2')}>
                      {t.title.replace(/\*\*|`/g, '')}
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
