// Frank vs Listen Labs: the words of hifrank.ai/competitors/listen-labs, read on 2026-11-20, unchanged except
// that headings are in sentence case (as everywhere in V21.04). Two table cells are not the live page's: there,
// Frank's "Setup & deployment" and "Best fit" repeat Listen Labs' values word for word ("Workflow setup",
// "Research & insights teams"), which contradicts the rest of the page; here they use the page's own words
// for Frank ("Setup takes minutes"; "designed for founders, marketers, PMs, and lean teams").
import logo from '../logos/compare/listenlabs.svg';

export default {
  slug: 'listen-labs',
  name: 'Listen Labs',
  logo, logoH: 20,
  hero: {
    title: ['The AI customer interview alternative to Listen Labs', 'for growing teams.'],
    body: 'Frank and Listen Labs are both great AI-powered interview tools. But if you’re a founder, marketer, PM, or operator who needs customer clarity without building a research department — Frank was built for you.',
  },
  whatIs: [
    'Frank runs AI voice, video, and WhatsApp interviews automatically, uncovering honest feedback from around the world in 30+ languages.',
    'Run customer discovery, validate ideas, understand churn, and surface actionable insights directly from your real customers — all without scheduling, agencies, or research bottlenecks.',
  ],
  // [capability, Frank, Listen Labs]: true is a tick, a string is the cell's words.
  table: [
    ['AI-moderated interview', true, true],
    ['Voice interview', true, true],
    ['Video interviews', true, true],
    ['AI follow-up probing', true, true],
    ['Automated summaries', true, true],
    ['Thematic analysis', true, true],
    ['Referenced customer quotes', true, true],
    ['Action items & next steps', true, 'Limited'],
    ['Follow-up interviews over time', true, 'Limited'],
    ['Long-term customer understanding', true, 'Study-focused'],
    ['Customer Brain / searchable history', true, 'Research workspace'],
    ['Always-on interviewing', true, 'Study-oriented'],
    ['Multi-language interviewing', true, true],
    ['Setup & deployment', 'Minutes', 'Workflow setup'],
    ['Best fit', 'Founders, marketers, PMs and lean teams', 'Research & insights teams'],
  ],
  why: {
    title: ['Not all AI interview tools are', 'built for the same job.'],
    intro: [
      'Listen Labs is primarily designed to help research teams run and analyze studies.',
      'Frank is designed to help everyday teams continuously understand customers and make faster, more confident decisions — without dedicated researchers or complex research workflows.',
    ],
    points: [
      ['users', 'Ask your users, not panels', 'Frank embeds into your existing flows — sign-ups, churn, exit, onboarding — to capture real insights instantly. Most tools rely on panels of paid participants who may fit a vague criteria but don’t actually use your product.'],
      ['moments', 'Real-world moments', 'Reach customers through voice or video — embedding interviews directly into sign-ups, purchases, onboarding, and churn flows, in the most natural way for them to respond.'],
      ['actions', 'Actionable outputs — not just findings', 'Frank doesn’t stop at themes and summaries. It extracts action items, suggested next steps, and references every recommendation back to the original conversation.'],
      ['compounds', 'Understanding that compounds', 'Instead of isolated studies, Frank builds a growing understanding of your customers over time — making future interviews smarter and past learnings instantly searchable.'],
      ['fast', 'Built for teams that need answers fast', 'Frank is designed for founders, marketers, PMs, and lean teams who need clarity quickly — not lengthy research cycles or specialist workflows. Setup takes minutes, insights arrive overnight.'],
    ],
  },
  choose: {
    frank: { lead: 'You need customer clarity tied to action.', items: [
      'You don’t have a dedicated research team',
      'You need insights from your own real customers',
      'You want insight tied directly to decisions',
      'You need interviews embedded in customer journeys',
      'You want voice and video interviewing',
      'You value affordability and quick deployment',
      'You need answers fast — without becoming a researcher',
    ] },
    them: { lead: 'You run a structured research function.', items: [
      'You already run structured qualitative research programs',
      'You have dedicated researchers or insights teams',
      'Your workflow revolves around formal research studies',
      'You prioritize researcher-specific workflows and study management',
      'You’re OK with insights from professional respondents and panels',
    ] },
  },
  // Other comparisons, as the live page lists them.
  others: ['strella', 'outset', 'conveo'],
  faq: [
    { q: 'Is Frank a Listen Labs alternative for B2C customer interviews?', a: ['For many growing teams without internal research teams, yes. If your goal is to continuously understand customers and make faster decisions without building a research function, Frank offers a simpler and more action-oriented approach.'] },
    { q: 'What’s the biggest difference between Frank and Listen Labs?', a: ['Listen Labs focuses heavily on helping enterprise teams run and manage research studies. Frank focuses on turning customer conversations into ongoing customer intelligence and actionable decision support for SaaS, ecommerce and service providers.'] },
    { q: 'Does Frank support the same interview types?', a: ['Frank supports AI interviews through voice and video, with dynamic follow-up questions and automated analysis.'] },
    { q: 'Can Frank run research at scale too?', a: ['Yes. While enterprise research tools rely on panels to quickly scale interviews by paying professional respondents, Frank conducts hundreds of simultaneous interviews with your own user base, globally, across languages and time zones, without adding operational overhead.'] },
    { q: 'Is Frank only for researchers?', a: ['No. Frank is specifically designed so founders, marketers, PMs, and operators can run sophisticated customer interviews without needing research training.'] },
    { q: 'Can I verify the insights Frank delivers?', a: ['Yes. Every insight, quote, and recommendation is referenced back to the original conversation so findings remain transparent and verifiable.'] },
  ],
};
