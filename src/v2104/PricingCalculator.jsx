// Project-cost calculator under the plans (readiness doc addendum, item 2): interviews × average length = voice
// minutes, then each plan's included minutes, shortfall and cash due. Its example is also plain text for readers
// without JavaScript (src/lib/facts.js CALC_FACTS). The overage rate is not published, so it never calls a short plan cheaper.
import { useState } from 'react';
import { calc, summary, CALC_STATIC } from '../lib/calc';

const FIELD = 'h-11 w-full rounded-[12px] border-0 bg-white px-3.5 font-sans text-[16px] text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink';
const usd = v => '$' + v.toLocaleString('en-US');

export default function PricingCalculator() {
  const [n, setN] = useState('100');
  const [len, setLen] = useState('5');
  const [yearly, setYearly] = useState(false);
  const r = calc(n, len, yearly);
  return (
    <section aria-labelledby="pr-calc-title" className="pt-[clamp(48px,6vw,88px)]">
      <div data-agent-change="" className="mx-auto max-w-[1312px] rounded-[28px] bg-[#fffdf3] p-6 ring-1 ring-inset ring-[#1a1714]/[0.08] sm:p-10">
        <h2 id="pr-calc-title" className="m-0 font-['Figtree',sans-serif] text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">What will my project cost?</h2>
        <p className="m-0 mt-2 font-sans text-[15.5px] leading-[1.6] text-ink/75">Interviews × average length = the voice minutes you need. Customer recruitment is not included.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5 font-sans text-[14px] text-ink">Interviews
            <input type="number" min="0" inputMode="numeric" value={n} onChange={e => setN(e.target.value)} className={FIELD} /></label>
          <label className="grid gap-1.5 font-sans text-[14px] text-ink">Average length (minutes)
            <input type="number" min="0" step="0.5" inputMode="decimal" value={len} onChange={e => setLen(e.target.value)} className={FIELD} /></label>
          <div className="grid gap-1.5 font-sans text-[14px] text-ink">Billing
            <div role="radiogroup" aria-label="Billing period" className="inline-flex h-11 gap-1 rounded-[12px] bg-white p-1 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)]">
              {[['Monthly', false], ['Yearly (upfront)', true]].map(([l, v]) => (
                <button key={l} type="button" role="radio" aria-checked={yearly === v} onClick={() => setYearly(v)}
                  className={'flex-1 cursor-pointer rounded-[9px] border-0 font-sans text-[14px] ' + (yearly === v ? 'bg-ink text-white' : 'bg-transparent text-ink')}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <p aria-live="polite" className="m-0 mt-6 max-w-[80ch] font-sans text-[16px] leading-[1.6] text-ink">{summary(r, yearly)}</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left font-sans text-[14.5px] text-ink">
            <thead><tr className="border-0 border-b border-solid border-[#1a1714]/[0.12] text-ink/60">
              <th className="py-2 pr-3 font-normal">Plan</th><th className="py-2 pr-3 font-normal">Included minutes</th>
              <th className="py-2 pr-3 font-normal">Short by</th><th className="py-2 pr-3 font-normal">Cash due ({yearly ? 'per year' : 'per month'})</th>
              <th className="py-2 font-normal">{yearly ? 'Monthly equivalent' : 'Per month'}</th></tr></thead>
            <tbody>
              {r.rows.map(p => (
                <tr key={p.id} className="border-0 border-b border-solid border-[#1a1714]/[0.07]">
                  <td className="py-2.5 pr-3 font-medium">{p.name}{r.rec && r.rec.id === p.id ? ' (smallest that covers it)' : ''}</td>
                  <td className="py-2.5 pr-3">{p.minutes}</td>
                  <td className="py-2.5 pr-3">{!p.lengthOk ? 'interview too long (max ' + p.maxLen + ' min)' : p.short ? p.short + ' minutes' : 'none'}</td>
                  <td className="py-2.5 pr-3">{p.due ? usd(p.due) : '$0'}</td>
                  <td className="py-2.5">{p.eff ? usd(p.eff) : '$0'}</td>
                </tr>
              ))}
              <tr><td className="py-2.5 pr-3 font-medium">Enterprise</td><td className="py-2.5 pr-3">custom</td><td className="py-2.5 pr-3">—</td><td className="py-2.5 pr-3" colSpan={2}>Custom, book a demo</td></tr>
            </tbody>
          </table>
        </div>
        <p className="m-0 mt-4 font-sans text-[13.5px] leading-[1.55] text-ink/65">Minutes beyond a plan’s included minutes are billed at the plan’s overage rate, which is not shown here. Taxes and optional participant incentives are not included. A yearly plan is paid upfront for the year.</p>
        <details className="mt-4 font-sans text-[14.5px] text-ink">
          <summary className="cursor-pointer">Worked examples</summary>
          {CALC_STATIC.map((t, i) => <p key={i} className="m-0 mt-2 leading-[1.55] text-ink/80">{t}</p>)}
        </details>
      </div>
    </section>
  );
}
