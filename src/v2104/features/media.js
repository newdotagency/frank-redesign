// The original hifrank.ai feature pages' visuals, per page (copied to public/features/<slug>/), the short step names,
// the how-it-works title, and which icon each use case gets (src/v2104/features/icons, drawn in currentColor).
const f = (slug, name) => `/features/${slug}/${name}`;
const icons = import.meta.glob('./icons/*.svg', { query: '?raw', import: 'default', eager: true });
export const iconSvg = name => icons[`./icons/${name}.svg`] || '';

export const MEDIA = {
  'global-scalability': {
    hero: f('global-scalability', 'global-scalability.jpg'),
    names: ['Set up', 'Run', 'Roll up'],
    howLines: ['One setup. Every market.', 'All at once.'],
    how: ['one-setup-global-reach.jpg', 'conversations-run-in-parallel.jpg', 'global-insights-roll-up-automatically.jpg'].map(n => f('global-scalability', n)),
    get: ['built-in-language-support.png', 'global-patterns-local-nuance.png', 'scale-without-scaling-cost.png'].map(n => f('global-scalability', n)),
    icons: ['globe', 'start-up-02', 'sale-tag-01', 'user-multiple'],
  },
  'always-on-availability': {
    hero: f('always-on-availability', 'always-on-availability.jpg'),
    names: ['Trigger', 'Talk', 'Insights'],
    howLines: ['Interviews that run', 'while you sleep'],
    how: ['interviews-trigger-automatically.jpg', 'conversations-run-24.jpg', 'insights-appear-instantly.jpg'].map(n => f('always-on-availability', n)),
    get: ['continuous-customer-signals.jpg', 'behavior-based-triggers.jpg', 'zero-research-downtime.png'].map(n => f('always-on-availability', n)),
    icons: ['puzzle', 'radar-01', 'light', 'search-02', 'analytics-down', 'cardiogram-01', 'auto-conversations', 'globe'],
  },
  'transparency-security': {
    hero: f('transparency-security', 'feature-transparency.png'),
    names: ['Sourced', 'Compliance', 'Yours'],
    howLines: ['Every insight,', 'traced to its source'],
    how: ['insights-are-always-sourced.jpg', 'insights-are-secure-by-default.jpg', 'insights-are-under-your-control.jpg'].map(n => f('transparency-security', n)),
    get: ['fully-traceable-insights.jpg', 'enterprise-grade-data-security.jpg', 'clear-auditability.jpg'].map(n => f('transparency-security', n)),
    icons: ['user-story', 'search-list-01', 'hierarchy', 'security', 'bubble-chat'],
  },
  'automated-summaries': {
    hero: f('automated-summaries', 'chat.png'),
    names: ['Interview', 'Moments', 'Summary'],
    howLines: ['From conversation to', 'summary, instantly'],
    how: ['interviews-run-automatically.png', 'key-moments.png', 'structured-summaries.png'].map(n => f('automated-summaries', n)),
    get: ['individual-summaries.png', 'chat-with-your-insights.png', 'referenced-customer-quotes.png'].map(n => f('automated-summaries', n)),
    icons: ['idea', 'start-up-02', 'dashboard-speed-02', 'route-01', 'ai-brain-01', 'bubble-chat'],
  },
};

// The visual of each feature when it is shown as a "related feature".
export const RELATED_IMG = {
  'automated-summaries': '/features/related/automated-summaries.jpg',
  'transparency-security': '/features/related/transparency-security.jpg',
  'global-scalability': '/features/related/global-scalability.jpg',
  'always-on-availability': '/features/related/always-on-availability.jpg',
};
