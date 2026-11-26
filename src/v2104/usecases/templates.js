// The use-case pages for the templates in the doc "[Frank] Templates" (Activation barriers, Trial conversion, Feature adoption, Funnel drop-off,
// Declining engagement, Upgrade barriers). The page words are the doc's, in the doc's order, unchanged apart from headings in sentence case and curly quotes: they
// live in ./doc-templates.json (generated from the doc, one entry per template). Drafted here, because the doc has no words for it: each page's
// hero conversation (it acts out the doc's own examples) and the icons. Churn keeps its own page (ChurnPage.jsx) and Discovery calls its own data
// (./discovery.js). Templates the doc doesn't cover (requests, value, checkout, downgrade) have no page yet. Read by ../UseCasePage.jsx.
import { Rocket, Gauge, MousePointerClick, ArrowDownToLine, TrendingDown, ChevronsUp } from 'lucide-react';
import {
  Clock01Icon, ChartBreakoutCircleIcon, Layers01Icon, Megaphone01Icon, UserGroupIcon, Target01Icon, Flag01Icon, Settings02Icon, Search01Icon,
  Notification01Icon, Alert02Icon, Calendar01Icon, FlowIcon, Task01Icon, AnalyticsDownIcon, Exchange01Icon, Tag01Icon, Money01Icon, Idea01Icon,
  CreditCardIcon, Message01Icon, ShieldKeyIcon,
} from '@hugeicons/core-free-icons';
import DOC from './doc-templates.json';

const PALETTE = ['#6e9738', '#ba86fc', '#4e7ff9', '#d9885a', '#7d766e'];

// Per template: its place in the menu, and what the doc doesn't give.
const EXTRA = {
  'Activation Barriers': {
    tpl: 'activation', label: 'Activation barriers', name: 'Activation interview', icon: Rocket,
    whenIcons: [Clock01Icon, ChartBreakoutCircleIcon, Layers01Icon, Megaphone01Icon],
    title: ['Frank finds out why ', 'new sign-ups never get started'],
    turns: [
      ['frank', 'What were you hoping to get done when you signed up?'],
      ['customer', 'Send a launch email for our shop.'],
      ['frank', 'What happened when you tried?'],
      ['customer', 'My contact import threw an error.'],
      ['frank', 'What did you do then?'],
      ['customer', 'Closed the tab. I meant to fix it later.'],
      ['frank', 'What would have helped?'],
      ['customer', 'Help fixing the import right there.'],
    ],
  },
  'Trial Conversion': {
    tpl: 'trial', label: 'Trial conversion', name: 'Trial conversion interview', icon: Gauge,
    whenIcons: [Calendar01Icon, Target01Icon, Settings02Icon, Search01Icon],
    title: ['Frank finds out why ', 'trial users don’t buy'],
    turns: [
      ['frank', 'What were you hoping to find out in the trial?'],
      ['customer', 'Whether it could replace our shared inbox.'],
      ['frank', 'Did you connect your real inbox?'],
      ['customer', 'No, I only clicked around the sample one.'],
      ['frank', 'What happened at the end?'],
      ['customer', 'My manager asked what it costs per agent.'],
      ['frank', 'What would have helped?'],
      ['customer', 'A summary I could send her.'],
    ],
  },
  'Feature Adoption': {
    tpl: 'adoption', label: 'Feature adoption', name: 'Feature adoption interview', icon: MousePointerClick,
    whenIcons: [Notification01Icon, Alert02Icon, Search01Icon, UserGroupIcon],
    title: ['Frank finds out why ', 'customers aren’t using your new feature'],
    turns: [
      ['frank', 'Have you tried resource planning yet?'],
      ['customer', 'I didn’t know it was there.'],
      ['frank', 'How do you plan capacity today?'],
      ['customer', 'In a spreadsheet, every Monday.'],
      ['frank', 'What would make you switch?'],
      ['customer', 'If it knew who’s on holiday.'],
      ['frank', 'Would you try it then?'],
      ['customer', 'Yes, I’d try it this week.'],
    ],
  },
  'Funnel Drop-off': {
    tpl: 'funnel', label: 'Funnel drop-off', name: 'Funnel drop-off interview', icon: ArrowDownToLine,
    whenIcons: [FlowIcon, Task01Icon, Flag01Icon, AnalyticsDownIcon],
    title: ['Frank finds out why people ', 'start a process and don’t finish it'],
    turns: [
      ['frank', 'What stopped you partway through verification?'],
      ['customer', 'It asked for our articles of association.'],
      ['frank', 'Did you have them to hand?'],
      ['customer', 'No idea where they were. I closed it.'],
      ['frank', 'Did you go back?'],
      ['customer', 'Not yet. I meant to.'],
      ['frank', 'What would have helped?'],
      ['customer', 'A list of documents on the first screen.'],
    ],
  },
  'Declining Engagement': {
    tpl: 'engagement', label: 'Declining engagement', name: 'Declining engagement interview', icon: TrendingDown,
    whenIcons: [AnalyticsDownIcon, Exchange01Icon, UserGroupIcon, Message01Icon],
    title: ['Frank finds out why ', 'active customers are using your product less'],
    turns: [
      ['frank', 'You used the knowledge base daily. What changed?'],
      ['customer', 'Half the pages went out of date.'],
      ['frank', 'What do you do instead?'],
      ['customer', 'I just ask in team chat.'],
      ['frank', 'What would bring you back?'],
      ['customer', 'Pages I can trust are current.'],
      ['frank', 'Who owns keeping them current?'],
      ['customer', 'Nobody. That’s the problem.'],
    ],
  },
  'Upgrade Barriers': {
    tpl: 'upgrade', label: 'Upgrade barriers', name: 'Upgrade barriers interview', icon: ChevronsUp,
    whenIcons: [Tag01Icon, Money01Icon, ShieldKeyIcon, Idea01Icon],
    title: ['Frank finds out why ', 'customers don’t upgrade'],
    turns: [
      ['frank', 'Have you thought about upgrading?'],
      ['customer', 'I didn’t know my feature was on Pro.'],
      ['frank', 'Which feature do you mean?'],
      ['customer', 'Sending one contract to 40 people.'],
      ['frank', 'How do you do that today?'],
      ['customer', 'One at a time, every quarter.'],
      ['frank', 'What would help you upgrade?'],
      ['customer', 'Seeing that on my plan page.'],
    ],
  },
};

function build(key) {
  const d = DOC[key], x = EXTRA[key];
  return {
    slug: d._slug, tpl: x.tpl,
    title: key + ' interview — Frank',
    description: d.hero.text,
    icon: x.icon, label: x.label, name: x.name,
    exclude: [x.tpl],
    hero: { clip: 'call-05-card', focus: 0.59, person: 'Jordan', turns: x.turns, title: x.title, text: d.hero.text },
    what: d.what,
    when: d.when.map(([title, text], i) => [x.whenIcons[i], title, text]),
    guide: d.guide,
    vs: { ...d.vs, aria: d.vs.other + ' compared with a Frank ' + d.vs.frank },
    out: d.out,
    where: { title: d.where.title, slices: d.where.slices.map(([label, n], i) => [label, n, PALETTE[i % PALETTE.length]]) },
    actions: d.actions,
    faq: d.faq,
    closing: d.closing,
  };
}

export const ACTIVATION = build('Activation Barriers');
export const TRIAL = build('Trial Conversion');
export const ADOPTION = build('Feature Adoption');
export const FUNNEL = build('Funnel Drop-off');
export const ENGAGEMENT = build('Declining Engagement');
export const UPGRADE = build('Upgrade Barriers');
