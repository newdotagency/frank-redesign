// The 11 playbooks from Homepage V5 (CONTENT.playbooks). Icon paths are drawn on a
// 64×64 grid. `prompt` is the study goal a pill types into the input.
const C2 = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
const RR = (x, y, w, h, r) => `M${x + r},${y}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${w - 2 * r}a${r},${r} 0 0 1 -${r},-${r}v-${h - 2 * r}a${r},${r} 0 0 1 ${r},-${r}Z`;

// Order = rail order: the most common research questions first.
export const PLAYBOOKS = [
  { id: 'churn', nm: 'Churn reasons', pr: 'Cancellation causes, ranked', n: 9, len: 30,
    prompt: 'Why are customers cancelling, and what would have made them stay?',
    d: 'M16 16h12a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H16ZM39 32h8.6M43.8 27.8 48 32l-4.2 4.2', dot: C2(26.5, 32, 1.6) },
  { id: 'trial', nm: 'Trial conversion', pr: 'Conversion blockers, ranked', n: 8, len: 30,
    prompt: 'What stops trial users from converting to a paid plan?',
    d: C2(32, 32, 16) + 'M32 21v11.5l8 4.8' },
  { id: 'activation', nm: 'Activation barriers', pr: 'First-run blockers + the missing step', n: 8, len: 30,
    prompt: 'What blocks new users before they reach their first win?',
    d: 'M18.5 41.5 32 32l13.5-9.5', dot: C2(18.5, 41.5, 4.2), hole: C2(32, 32, 4.2) + C2(45.5, 22.5, 4.2) },
  { id: 'adoption', nm: 'Feature adoption', pr: 'Adoption gap: awareness, need or usability', n: 9, len: 30,
    prompt: 'Why aren’t customers using our newest feature?',
    d: RR(15, 22, 34, 20, 10), dot: C2(25, 32, 5) },
  { id: 'upgrade', nm: 'Upgrade barriers', pr: 'Upgrade triggers and the objection behind each', n: 8, len: 30,
    prompt: 'What would make customers upgrade to a higher plan?',
    d: 'M16 17h32M32 47V26.5M23 35.5 32 26.5l9 9' },
  { id: 'checkout', nm: 'Checkout abandonment', pr: 'Checkout friction, by cause', n: 7, len: 20,
    prompt: 'Why do shoppers abandon checkout before paying?',
    d: 'M17 26h30v17a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5ZM25.5 26v-3.5a6.5 6.5 0 0 1 13 0V26M28 33.5v8M36 33.5v8' },
  { id: 'funnel', nm: 'Funnel drop-off', pr: 'The step that loses people, and why', n: 8, len: 25,
    prompt: 'Which step of our signup funnel loses people, and why?',
    d: 'M16 16.5h32L35.5 31.5V44l-7 3.5V31.5Z' },
  { id: 'requests', nm: 'Feature request discovery', pr: 'The problem under each request, sized', n: 9, len: 35,
    prompt: 'What problems sit underneath our most common feature requests?',
    d: 'M20 16h24a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5H29.5L21 48v-9h-1a5 5 0 0 1-5-5V21a5 5 0 0 1 5-5ZM32 22v10M27 27h10' },
  { id: 'value', nm: 'Customer value drivers', pr: 'The workflows worth protecting', n: 8, len: 35,
    prompt: 'Which workflows do our best customers rely on most?',
    d: 'M48 32a16 16 0 1 1-4.7-11.3M48 16v9h-9' },
  { id: 'engagement', nm: 'Declining engagement', pr: 'What changed, and what replaced it', n: 8, len: 25,
    prompt: 'Why are active users coming back less often?',
    d: 'M16 19 26.5 29.5l9-6 9.1 12.4', dot: C2(44.6, 35.9, 3.4), faint: 'M16 45h32' },
  { id: 'downgrade', nm: 'Downgrade reasons', pr: 'Downgrade drivers: need, budget or value', n: 7, len: 25,
    prompt: 'Why are customers moving to a cheaper plan?',
    d: 'M16 18.5h10.5v9H37v9h11v9H16Z' },
];

export const PLACEHOLDER_PROMPTS = [
  'Why are users cancelling after the first month?',
  'What stops trial users from upgrading?',
  'How do new users feel about onboarding?',
  'Which features do power users rely on most?',
];
