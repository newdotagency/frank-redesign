// A plain, visible section of facts in full sentences (see src/lib/facts.js): one heading per block, a line per fact.
import { MCP_URL } from '../lib/facts';

const URL_RE = /(https?:\/\/[^\s]+?)(?=[.,]?(?:\s|$))/g;
function Linked({ text }) {
  const out = []; let last = 0; let m;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const u = m[1];
    out.push(u === MCP_URL ? <code key={m.index} className="rounded bg-[#1a1714]/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-ink">{u}</code>
      : <a key={m.index} href={u} className="text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-ink">{u}</a>);
    last = m.index + u.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function FactsBlock({ blocks, id, className = '' }) {
  return (
    <section aria-labelledby={id} className={'px-4 sm:px-[clamp(16px,4vw,48px)] ' + className}>
      <div className="mx-auto max-w-[880px] rounded-[28px] bg-[#fffdf3] p-6 ring-1 ring-inset ring-[#1a1714]/[0.08] sm:p-10">
        {blocks.map((b, bi) => (
          <div key={b.h} className={bi ? 'mt-10' : ''}>
            <h2 id={bi ? undefined : id} className="m-0 mb-4 font-['Figtree',sans-serif] text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">{b.h}</h2>
            {b.p.map((l, i) => (
              <p key={i} className="m-0 mt-3 font-sans text-[15.5px] leading-[1.6] text-ink/80 [text-wrap:pretty]">
                {Array.isArray(l) ? <><strong className="font-medium text-ink">{l[0]}:</strong> <Linked text={l[1]} /></> : <Linked text={l} />}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
