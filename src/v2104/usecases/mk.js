// Builder for the template-based use-case pages (the Churn page's other ten templates: activation, trial, adoption, funnel, engagement, upgrade,
// requests, value, checkout, downgrade). Each page is one short spec in templates-a.js / templates-b.js; this fills in everything the doc's Discovery
// Call page shares across templates (the section headings, the research-guide intro, the "What you get" intro, the Action Items note, the closing)
// and the FAQ answers that read the same for every template (how many interviews, how to launch, changing the questions, languages, what happens
// after). The page's words per template are drafted here from the home page's template text (UseCases.jsx CASES); the study numbers and quotes are
// invented examples, labelled as such on the page. Read by ../UseCasePage.jsx (same shape as discovery.js).
import { UserAdd01Icon } from '@hugeicons/core-free-icons';

const PALETTE = ['#6e9738', '#ba86fc', '#4e7ff9', '#d9885a', '#7d766e'];

const AFTER = [
  ['Analysis', 'You read open-text comments one by one', 'Themes ranked by how many customers raised them'],
  ['What you can act on', 'A chart of numbers with no reasons behind it', 'Action Items, each linked to the moment in the recording'],
  ['Evidence for your team', 'A row in a spreadsheet', 'The customer’s own voice, ready to play in a meeting'],
];

// The FAQ answers that read the same for every template. `where`: where the interview is shown (the "How do I launch it?" answer).
const common = where => [
  { q: 'How many interviews do I need?',
    a: ['In most studies, the main reasons start repeating within the first 15 to 20 interviews. Frank shows how many customers raised each theme, so you can see when patterns settle. By running the interview consistently with an automatic trigger, you can see how perception changes as you make changes in real-time.'] },
  { q: 'How do I launch it?',
    a: ['Start from this template, and the AI Researcher helps you adapt the Research Guide to your product. Then add the interview ' + where + ' as a floating button, an inline card, or a pop-up from your own button. You can also connect it through the API or easily add it to your site using your favorite AI Agent, LLM, or MCP server.'] },
  { q: 'Can I change the questions?',
    a: ['Yes. Every question in the template is editable. Add questions about a specific plan, feature, campaign or competitor.'] },
  { q: 'What languages does Frank support?',
    a: ['Frank supports interviewing in over 30 languages, including English, Spanish, French, Chinese, Russian, Hindi, Arabic and many more.'] },
  { q: 'What happens after the interviews?',
    a: ['You get the recordings, transcripts, themes ranked by frequency in the Performance tab, and Action Items linked to the source quotes. Need a different view? Ask Analytics Chat for a chart or table.',
      'Connect it via MCP to your other tools, and you can even update your CRM records or segment your users based on their responses automatically!'] },
];

// s: the spec (see templates-a.js). Returns the page data.
export function mk(s) {
  const unit = s.out.unit || 'customers';
  return {
    slug: s.slug, tpl: s.tpl,
    title: s.name + ' interviews — Frank',
    description: s.description,
    icon: s.icon, label: s.label, name: s.name,
    exclude: [s.tpl],
    hero: { clip: 'call-05-card', focus: 0.59, person: 'Jordan', turns: s.hero.turns, title: s.hero.title, text: s.hero.text },
    what: { eyebrow: s.label + ' with Frank', lead: 'What is', phrase: s.what.phrase, sub: s.what.sub, para: s.what.para, quote: s.what.quote },
    when: s.when.map(([title, text], i) => [s.whenIcons?.[i] || UserAdd01Icon, title, text]),
    guide: {
      eyebrow: 'Typical interview structure',
      title: s.guide.title,
      sub: 'These interviews generally follow a six-part guideline built to gather the verifiable insights you need. Every question is editable, and the AI Researcher helps you adapt the Research Guide to your product.',
      steps: s.guide.steps,
      note: s.guide.note || 'Frank doesn’t stop at the first answer. It follows up when a reply is vague and comes back to topics later in the conversation, so a general complaint becomes a specific moment you can fix.',
    },
    vs: {
      eyebrow: 'Comparison: Frank vs ' + s.vs.other.toLowerCase() + 's',
      title: s.vs.title,
      aria: s.vs.other + ' compared with a Frank interview',
      other: s.vs.other, shortOther: s.vs.shortOther || s.vs.other, frank: s.vs.frank || 'interview',
      groups: [['In the interview', s.vs.rows], ['After the interview', AFTER.map(([a, b, c], i) => [a, s.vs.after?.[i] || b, c])]],
      close: s.vs.close,
    },
    out: {
      eyebrow: 'Frank interview outcomes',
      title: ['What you get'],
      intro: 'Every interview is recorded, transcribed and coded. Frank groups the answers into themes, counts how many customers raised each one, and turns the biggest into Action Items.',
      caption: s.out.caption, aria: s.out.aria, total: s.out.total, unit,
      rows: s.out.rows,
    },
    where: { title: s.where.title, slices: s.where.slices.map(([label, n], i) => [label, n, PALETTE[i % PALETTE.length]]) },
    actions: {
      title: 'Action Items',
      items: s.actions,
      note: 'Every insight links to the exact moment in the recording. Click through and hear it from the customer.',
    },
    faq: [...s.faq.map(([q, ...a]) => ({ q, a })), ...common(s.launch)],
    closing: s.closing,
  };
}
