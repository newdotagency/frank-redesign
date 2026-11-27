// Plain-text facts for AI agents and for people who want the numbers in full sentences. They are the wording of the
// readiness doc (website-agent-readiness-nov27, items M1 and M2) and are used twice: as a visible section on the page
// and as a server-rendered copy in the page's HTML (the pages are React islands, so their own text is not in the HTML).
// Keep both pages' JSON-LD (src/lib/jsonld.js) and llms files (public/llms*.txt) in step with this file.

export const MCP_URL = 'https://api.hifrank.ai/mcp';
export const MCP_DOCS = 'https://www.hifrank.ai/docs/frank-mcp-connector';
export const CHATGPT_APP = 'https://chatgpt.com/plugins/plugin_asdk_app_6ad8ab4844a881919c79bb0864ffe168';
export const CLIENT_LINE = 'Works with ChatGPT, Claude, Grok and Muse, plus other MCP clients that support remote servers with OAuth.';

// Each block: h = heading, p = paragraphs (a string, or [label, text] shown as "label: text"), code = a code line.
export const PRICING_FACTS = [
  { h: 'Pricing and plans', p: [
    ['Free', '225 signup credits plus 60 voice minutes a month (10-minute max per interview). No credit card required.'],
    ['Included in Free', '60 voice minutes / month; 10-minute max interview length; Sentiment & thematic analysis; Video reels compilation (highlight clips of completed interviews, not a video-interview format); Unlimited anonymous viewers.'],
    ['Starter', '$49/mo billed as $590/year, or $59/mo billed monthly. Included: 120 voice minutes / month; 20-minute max interview length; Full analytics suite; Average at $0.50/min.'],
    ['Growth (Most popular)', '$166/mo billed as $1,990/year, or $199/mo billed monthly. Included: 450 voice minutes / month; ~30 interviews (15 min each); 20-minute max interview length; Credit rollovers (30 days); Average at $0.45/min.'],
    ['Business', '$312/mo billed as $3,750/year, or $375/mo billed monthly. Included: 950 voice minutes / month; ~63 interviews (15 min each); 30-minute max interview length; Everything in Growth; Average at $0.40/min.'],
    ['Yearly billing', 'Save 2 months.'],
    ['Enterprise', 'custom minute pools, SSO, API integration, and dedicated support. Book a demo.'],
    ['Students', '50% off after student status is verified.'],
    ['Credits', '10 credits equals roughly 1 minute of voice interview.'],
    ['Unused credits', 'On Growth and above, unused credits roll over for 30 days. Free and Starter plans reset monthly.'],
    ['If minutes are exceeded', 'You can keep interviewing at the overage rate for your plan. There are no hard caps.'],
    'MCP is included on every plan, including Free.',
    ['Setup', 'Connect Frank through MCP at ' + MCP_URL + '. Approve access once in the browser. There is no API key to paste.'],
    ['Docs', MCP_DOCS],
  ] },
  { h: 'Billing, cancellation and refunds', p: [
    ['Trial', 'There is no free trial on paid plans. The Free plan is the way to try Frank.'],
    ['Cancel', 'Cancel anytime. Your plan stays active until the end of the period you’ve paid for, and there’s no refund for the unused time.'],
    ['Plan changes', 'You can upgrade or downgrade at any time. When upgrading, you get immediate access to new plan features. Downgrades take effect at the next billing cycle.'],
    ['Refund', 'Fees are non-refundable except as stated in the Terms of Service.'],
  ] },
];

export const MCP_FACTS = [
  { h: 'Connect Frank in 2 minutes', p: [
    'Frank AI Researcher runs short AI voice interviews with your own customers. Connect it once, then draft studies, read transcripts and, only when you approve, publish a study, without leaving your chat. MCP is included on every plan, including Free. You approve access once in the browser. There is no API key to paste.',
    CLIENT_LINE,
    ['Server URL', MCP_URL],
    ['In Claude (claude.ai or Claude Desktop)', '1. Open Customize > Connectors. Click + Add, then Add custom connector. 2. Name it Frank AI Researcher, paste ' + MCP_URL + ' and click Continue. 3. Sign in to your Frank account in the browser and allow access. Then, in a chat, ask: “List my Frank studies.”'],
    ['In Claude Code', 'claude mcp add --transport http frank ' + MCP_URL],
    ['In ChatGPT', 'Frank is available as an app in ChatGPT: ' + CHATGPT_APP],
    ['Full setup guide', MCP_DOCS],
  ] },
];

// Project-cost calculator, as plain text (readiness doc addendum, item 2). The worked examples come from calc.js.
import { CALC_STATIC } from './calc.js';
export const CALC_FACTS = [
  { h: 'What will my project cost?', p: [
    'Interviews × average interview length = voice minutes needed. Compare that with the minutes each plan includes: Free 60, Starter 120, Growth 450, Business 950. Beyond Business, use an Enterprise plan.',
    ...CALC_STATIC.map((t, i) => ['Example ' + (i + 1), t]),
    'Yearly plans are paid upfront for the year; the monthly figure is that total divided by 12. Taxes and optional participant incentives are not included. Customer recruitment is not included.',
  ] },
];
