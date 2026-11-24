// DocsSearch: the docs' command palette. ⌘K / Ctrl K (or "/") opens it from anywhere in the docs. It searches every
// section of every guide (titles, section headings, and the words inside them), shows where each hit is, and
// opens the guide at that section. ↑ ↓ move, ↵ opens, esc closes. With nothing typed it suggests the popular guides.
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CornerDownLeft, FileText, Hash, Search } from 'lucide-react';
import ARTICLES from './articles.json';
import { GUIDES, POPULAR, groupOf } from './structure';

const plain = s => String(s || '').replace(/\*\*|`|\*|\[([^\]]+)\]\([^)]+\)/g, '$1');
const flat = b => {
  if (!b) return '';
  if (b.items) return b.items.map(it => (typeof it === 'string' ? it : [it.title, it.x, it.q, ...(it.a || []).map(flat)].filter(Boolean).join(' '))).join(' ');
  if (b.rows) return [...(b.head || []), ...b.rows.flat()].join(' ');
  return b.x || b.alt || '';
};

// One entry per section: where it is and every word in it.
export const INDEX = Object.entries(ARTICLES).flatMap(([slug, a]) => a.sections.map(s => ({
  slug, id: s.id, article: a.title, section: plain(s.title), nav: GUIDES[slug]?.nav, group: groupOf(slug)?.label,
  text: plain(s.blocks.map(flat).join(' ')),
  hay: plain([a.title, a.lead, s.title, ...s.blocks.map(flat)].join(' ')).toLowerCase(),
})));

export function search(q) {
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!toks.length) return [];
  return INDEX.map(e => {
    if (!toks.every(t => e.hay.includes(t))) return null;
    const a = e.article.toLowerCase(), s = e.section.toLowerCase();
    let score = 0;
    toks.forEach(t => { if (a.includes(t)) score += a.startsWith(t) ? 12 : 8; if (s.includes(t)) score += s.startsWith(t) ? 9 : 6; score += Math.min(4, (e.text.toLowerCase().split(t).length - 1)) * 1.2; });
    return { ...e, score };
  }).filter(Boolean).sort((x, y) => y.score - x.score).slice(0, 12);
}

// A snippet around the first match, the match marked.
function Snippet({ text, q }) {
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  const low = text.toLowerCase();
  const at = Math.min(...toks.map(t => { const i = low.indexOf(t); return i < 0 ? 1e9 : i; }));
  if (at === 1e9 || !text) return <>{text.slice(0, 110)}</>;
  const from = Math.max(0, at - 40);
  const part = text.slice(from, from + 130);
  const re = new RegExp('(' + toks.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig');
  return <>{from > 0 && '…'}{part.split(re).map((p, i) => (i % 2 ? <mark key={i} className="rounded-[3px] bg-[#d1f899] px-[1px] text-ink">{p}</mark> : p))}…</>;
}

export default function DocsSearch({ open, onClose }) {
  const [q, setQ] = useState('');
  const [at, setAt] = useState(0);
  const input = useRef(null);
  const list = useRef(null);
  const results = useMemo(() => search(q), [q]);
  const suggestions = useMemo(() => POPULAR.map(([slug, label]) => ({ slug, id: null, article: ARTICLES[slug].title, section: label, nav: GUIDES[slug].nav, group: groupOf(slug)?.label, text: GUIDES[slug].desc, suggestion: true })), []);
  const rows = q.trim() ? results : suggestions;
  useEffect(() => { setAt(0); }, [q]);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [at]);
  const go = r => { if (r) window.location.href = '/docs/' + r.slug + (r.id ? '#' + r.id : ''); };
  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setAt(i => Math.min(rows.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAt(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(rows[at]); }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#1a1714]/40 px-4 pt-[10vh] backdrop-blur-[2px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div role="dialog" aria-modal="true" aria-label="Search the docs" onKeyDown={onKey}
            className="w-full max-w-[660px] overflow-hidden rounded-[20px] bg-white shadow-[0_30px_90px_-20px_rgba(26,23,20,0.55)] ring-1 ring-[#1a1714]/[0.08]"
            initial={{ opacity: 0, transform: 'translateY(-8px) scale(0.985)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={{ opacity: 0, transform: 'translateY(-6px) scale(0.99)' }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-3 border-0 border-b border-solid border-[#1a1714]/[0.08] px-5">
              <Search aria-hidden="true" className="size-[18px] shrink-0 text-ink-3" strokeWidth={1.75} />
              <input ref={input} value={q} onChange={e => setQ(e.target.value)} placeholder="Search guides, steps, endpoints…" aria-label="Search the docs"
                role="combobox" aria-expanded="true" aria-controls="docs-search-list" autoComplete="off" spellCheck="false" style={{ outline: 'none', boxShadow: 'none' }}
                className="h-14 min-w-0 flex-1 border-0 bg-transparent font-sans text-[16.5px] text-ink outline-none placeholder:text-ink-3" />
              <kbd className="hidden rounded-[6px] bg-[#1a1714]/[0.05] px-1.5 py-0.5 font-gmono text-[11px] text-ink-3 sm:block">esc</kbd>
            </div>
            <div ref={list} id="docs-search-list" role="listbox" className="max-h-[min(58vh,480px)] overflow-y-auto p-2">
              {!q.trim() && <p className="m-0 px-3 pb-1.5 pt-2 font-sans text-[11.5px] font-light uppercase tracking-[0.08em] text-ink-3">Popular</p>}
              {q.trim() && rows.length === 0 && (
                <div className="px-4 py-10 text-center font-sans">
                  <p className="m-0 text-[15.5px] text-ink">No results for “{q.trim()}”</p>
                  <p className="m-0 mt-1.5 text-[14px] text-ink-3">Try a shorter word, or <a href="mailto:support@hifrank.ai" className="text-ink underline decoration-[#a0d05f] decoration-2 underline-offset-[3px]">ask support</a>.</p>
                </div>
              )}
              {rows.map((r, i) => {
                const on = i === at;
                const Icon = r.id && r.section !== r.article ? Hash : FileText;
                return (
                  <a key={r.slug + (r.id || '') + i} role="option" aria-selected={on} href={'/docs/' + r.slug + (r.id ? '#' + r.id : '')}
                    onMouseMove={() => setAt(i)}
                    className={'flex items-start gap-3 rounded-[12px] px-3 py-2.5 text-ink no-underline ' + (on ? 'bg-[#f1f9e3]' : '')}>
                    <span aria-hidden="true" className={'mt-0.5 grid size-8 shrink-0 place-items-center rounded-[9px] ' + (on ? 'bg-[#d1f899] text-[#2a321e]' : 'bg-[#1a1714]/[0.05] text-ink-2')}><Icon className="size-4" strokeWidth={1.75} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2 font-sans text-[15px] font-medium leading-snug">
                        <span className="truncate">{r.suggestion ? r.section : r.section === r.article ? r.article : r.section}</span>
                        <span className="shrink-0 text-[12.5px] font-normal text-ink-3">{r.group}{r.suggestion ? '' : ' · ' + r.nav}</span>
                      </span>
                      {!r.suggestion && r.section !== r.article && <span className="mt-0.5 block truncate font-sans text-[13px] text-ink-3">{r.article}</span>}
                      <span className="mt-1 line-clamp-2 block font-sans text-[13.5px] leading-[1.5] text-ink-2">{r.suggestion ? r.text : <Snippet text={r.text} q={q} />}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className={'mt-2 size-4 shrink-0 text-ink-3 transition-opacity ' + (on ? 'opacity-100' : 'opacity-0')} strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-4 border-0 border-t border-solid border-[#1a1714]/[0.08] bg-[#faf9f5] px-5 py-2.5 font-sans text-[12.5px] text-ink-3">
              <span className="flex items-center gap-1.5"><kbd className="rounded-[5px] bg-white px-1.5 py-0.5 font-gmono text-[11px] ring-1 ring-[#1a1714]/[0.1]">↑</kbd><kbd className="rounded-[5px] bg-white px-1.5 py-0.5 font-gmono text-[11px] ring-1 ring-[#1a1714]/[0.1]">↓</kbd>to move</span>
              <span className="flex items-center gap-1.5"><kbd className="rounded-[5px] bg-white px-1.5 py-0.5 ring-1 ring-[#1a1714]/[0.1]"><CornerDownLeft className="size-3" /></kbd>to open</span>
              <span className="ml-auto hidden sm:block">{INDEX.length} sections in {Object.keys(ARTICLES).length} guides</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
