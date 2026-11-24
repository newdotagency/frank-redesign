// The docs' map: three groups (the sidebar and the home page's sections), each guide's short name, one-line
// description and icon. The guides' own content is in articles.json.
import { BookOpen, Braces, CircleHelp, Code, LayoutDashboard, PackagePlus, Plug, Rocket, Sparkles, Tags, Webhook } from 'lucide-react';

export const GUIDES = {
  'overview': { nav: 'Overview', desc: 'What the AI interviewer is, who it is for and how an interview runs.', icon: BookOpen },
  'how-to-set-it-up': { nav: 'Research setup', desc: 'Create your first research project and send your first interview link.', icon: Rocket },
  'how-to-create-a-new-product': { nav: 'Product setup', desc: 'Add the product your research is about, so Frank knows the context.', icon: PackagePlus },
  'best-practices': { nav: 'Best practices', desc: 'Write better goals and get deeper answers from every interview.', icon: Sparkles },
  'navigating-your-ai-interviewer-dashboard': { nav: 'Dashboard guide', desc: 'Find interviews, themes, quotes and action items in your dashboard.', icon: LayoutDashboard },
  'faq': { nav: 'FAQ', desc: 'Short answers to the questions we hear most.', icon: CircleHelp },
  'website-widget-embedding-frank-on-your-site': { nav: 'Embed on your site', desc: 'Add Frank to your website as a floating button, an inline card or a pop-up.', icon: Code },
  'widget-installing-via-google-tag-manager-gtm': { nav: 'Google Tag Manager', desc: 'Install the Frank widget through Google Tag Manager, no code deploy.', icon: Tags },
  'frank-mcp-connector': { nav: 'MCP connector', desc: 'Run studies and read results from Claude, ChatGPT, Cursor and other MCP clients.', icon: Plug },
  'set-up-the-frank-webhook': { nav: 'Webhook', desc: 'Get a call to your server the moment an interview completes.', icon: Webhook },
  'frank-public-api-developer-guide': { nav: 'Public API', desc: 'Create API keys, then create studies and read interviews over REST.', icon: Braces },
};

export const GROUPS = [
  { id: 'start', label: 'Get started', blurb: 'From your first project to your first interview.', items: ['overview', 'how-to-set-it-up', 'how-to-create-a-new-product', 'best-practices'] },
  { id: 'use', label: 'Use Frank', blurb: 'Find your way around and get answers fast.', items: ['navigating-your-ai-interviewer-dashboard', 'faq'] },
  { id: 'connect', label: 'Connect & automate', blurb: 'Put Frank on your site and connect it to your tools.', items: ['website-widget-embedding-frank-on-your-site', 'widget-installing-via-google-tag-manager-gtm', 'frank-mcp-connector', 'set-up-the-frank-webhook', 'frank-public-api-developer-guide'] },
];

// Reading order (previous / next) and each guide's group.
export const ORDER = GROUPS.flatMap(g => g.items);
export const groupOf = slug => GROUPS.find(g => g.items.includes(slug));

// What most people come for: shown on the home page and in the empty search.
export const POPULAR = [
  ['how-to-set-it-up', 'Set up my first interview'],
  ['website-widget-embedding-frank-on-your-site', 'Embed Frank on my site'],
  ['frank-mcp-connector', 'Connect Frank to Claude'],
  ['frank-public-api-developer-guide', 'Use the API'],
];
