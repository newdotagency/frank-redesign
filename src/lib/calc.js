// Project-cost calculator logic (readiness doc addendum, item 2). Figures are the pricing page's (M1). The overage
// rate is not published, so a plan that is short of minutes is never called "cheaper": it is shown as short.
export const CALC_PLANS = [
  { id: 'free', name: 'Free', minutes: 60, maxLen: 10, monthly: 0, yearly: 0, effYearly: 0 },
  { id: 'starter', name: 'Starter', minutes: 120, maxLen: 20, monthly: 59, yearly: 590, effYearly: 49 },
  { id: 'growth', name: 'Growth', minutes: 450, maxLen: 20, monthly: 199, yearly: 1990, effYearly: 166 },
  { id: 'business', name: 'Business', minutes: 950, maxLen: 30, monthly: 375, yearly: 3750, effYearly: 312 },
];
export const BUSINESS_MINUTES = 950;

export function calc(interviews, length, yearly) {
  const n = Math.max(0, Math.floor(+interviews || 0)), len = Math.max(0, +length || 0);
  const minutes = Math.round(n * len * 100) / 100;
  const rows = CALC_PLANS.map(p => {
    const lengthOk = len <= p.maxLen;
    const short = Math.max(0, Math.round((minutes - p.minutes) * 100) / 100);
    return {
      ...p, lengthOk, short, covers: lengthOk && short === 0,
      due: yearly ? p.yearly : p.monthly, dueLabel: yearly ? 'per year, paid upfront' : 'per month',
      eff: yearly ? p.effYearly : p.monthly,
    };
  });
  const rec = rows.find(r => r.covers) || null;
  const beyond = minutes > BUSINESS_MINUTES || len > 30;
  return { n, len, minutes, rows, rec, enterprise: !rec && (beyond || !rows.some(r => r.lengthOk)) };
}
const usd = v => '$' + v.toLocaleString('en-US');
export function summary(r, yearly) {
  const head = `${r.n} interviews × ${r.len} minutes = ${r.minutes} voice minutes.`;
  if (r.rec) {
    const x = r.rec;
    const short = r.rows.filter(p => p.lengthOk && p.short > 0 && p.minutes < x.minutes && p.id !== 'free');
    const tail = short.length ? ' ' + short.map(p => `${p.name} includes ${p.minutes}, so it is ${p.short} minutes short.`).join(' ') + ' The overage rate is not published here, so we cannot say whether staying on a smaller plan and paying overage would cost less.' : '';
    return `${head} The smallest plan that includes all of them is ${x.name} (${x.minutes} minutes included): ${usd(x.due)} ${x.dueLabel}${yearly && x.eff ? `, about ${usd(x.eff)} a month` : ''}.${tail}`;
  }
  return `${head} This is beyond what the self-serve plans include (Business: ${BUSINESS_MINUTES} minutes, 30-minute max interview), so it needs an Enterprise plan with a custom minute pool. Book a demo.`;
}
// The worked examples shown as plain text (kept in step with the function above by scripts/check, see PricingCalculator).
export const CALC_EXAMPLES = [[20, 5], [100, 5], [200, 10]];
export const CALC_STATIC = CALC_EXAMPLES.map(([a, b]) => summary(calc(a, b, false), false));
