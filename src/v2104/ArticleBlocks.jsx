// ArticleBlocks (V21.04): the reading components shared by the blog posts and the case studies: headings you can link to,
// paragraphs at a reading measure, lists, screenshots in frames, comparison tables (a row starting with "Frank" is tinted),
// quotes, embeds. A post is an array of blocks ({ t: 'h' | 'p' | 'ul' | 'ol' | 'img' | 'table' | 'quote' | 'hr' | 'embed', ... }).
import { Inline } from './product-updates/parts';

export const slugify = t => String(t).replace(/\*+|`/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const P = 'm-0 font-sans text-[17px] leading-[1.75] text-ink-2 sm:text-[18px]';
export const words = bl => bl.reduce((n, b) => n + String(b.x || (b.items || []).join(' ') || '').split(/\s+/).length, 0);

function Table({ b }) {
  return (
    <div className="my-2 overflow-x-auto rounded-[16px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.08)]">
      <table className="w-full border-collapse font-sans text-[14.5px]" style={{ minWidth: Math.max(640, (b.head.length || (b.rows[0] || []).length) * 150) }}>
        {b.head.length > 0 && (
          <thead>
            <tr className="bg-[#f6f4ee]">{b.head.map((h, i) => <th key={i} className="px-4 py-3 text-left align-bottom text-[12.5px] font-medium uppercase tracking-[0.04em] text-ink-3"><Inline x={h} /></th>)}</tr>
          </thead>
        )}
        <tbody>
          {b.rows.map((r, ri) => {
            const frank = /^\W*(\*\*)?Frank/i.test(r[0] || '');
            return (
              <tr key={ri} className={'border-0 border-t border-solid border-[#1a1714]/[0.06] align-top ' + (frank ? 'bg-[#f1f9e3]' : '')}>
                {r.map((c, ci) => <td key={ci} className={'px-4 py-3 leading-[1.55] ' + (ci === 0 ? 'font-medium text-ink' : 'text-ink-2')}><Inline x={c} /></td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Block({ b, ids }) {
  switch (b.t) {
    case 'h': {
      if (b.l <= 2) {
        const id = ids.get(b);
        return (
          <h2 id={id} className="hiw-step-title m-0 mt-14 scroll-mt-28 text-[clamp(26px,2.9vw,36px)] leading-[1.15] text-ink [text-wrap:balance] first:mt-0 sm:mt-16">{b.x}</h2>
        );
      }
      return <h3 className={'hiw-step-title m-0 mt-9 text-ink [text-wrap:balance] ' + (b.l === 3 ? 'text-[clamp(21px,2.2vw,26px)] leading-[1.2]' : 'text-[19px] leading-[1.25]')}>{b.x}</h3>;
    }
    case 'p': return <p className={P}><Inline x={b.x} /></p>;
    case 'ul': return (
      <ul className="m-0 grid list-none gap-2.5 p-0">
        {b.items.map((t, i) => {
          const sub = t.startsWith('— ');
          return (
            <li key={i} className={'relative ' + P + (sub ? ' pl-12' : ' pl-7')}>
              <span aria-hidden="true" className={'absolute top-[0.7em] rounded-full ' + (sub ? 'left-6 size-[5px] bg-[#1a1714]/30' : 'left-1.5 size-[7px] bg-[#a0d05f]')} />
              <Inline x={sub ? t.slice(2) : t} />
            </li>
          );
        })}
      </ul>
    );
    case 'ol': return (
      <ol className="m-0 grid list-none gap-3.5 p-0">
        {b.items.map((t, i) => (
          <li key={i} className={'relative pl-11 ' + P}>
            <span aria-hidden="true" className="absolute left-0 top-[0.2em] grid size-7 place-items-center rounded-full bg-[#d1f899] font-sans text-[13px] font-medium tabular-nums text-[#2a321e]">{i + 1}</span>
            <Inline x={t.replace(/^— /, '')} />
          </li>
        ))}
      </ol>
    );
    case 'img': return (
      <figure className="m-0 my-2">
        <div className="overflow-hidden rounded-[20px] bg-[#f4f2ec] p-2.5 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)] sm:p-3">
          <img src={b.src} alt={b.alt || ''} loading="lazy" draggable={false} className="block h-auto w-full rounded-[13px] bg-white" />
        </div>
        {b.cap && <figcaption className="mt-2.5 px-1 font-sans text-[13.5px] leading-snug text-ink-3"><Inline x={b.cap} /></figcaption>}
      </figure>
    );
    case 'table': return <Table b={b} />;
    case 'quote': return <blockquote className="m-0 border-0 border-l-2 border-solid border-[#a0d05f] pl-5 font-serif text-[20px] italic leading-[1.55] text-ink"><Inline x={b.x} /></blockquote>;
    case 'hr': return <hr className="m-0 h-px border-0 bg-[#1a1714]/[0.1]" />;
    case 'embed': return <div className="aspect-video overflow-hidden rounded-[18px] bg-[#f4f2ec]"><iframe src={b.src} title="Embedded content" loading="lazy" className="size-full border-0" allowFullScreen /></div>;
    default: return null;
  }
}

