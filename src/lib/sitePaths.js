// Pages this site hosts, at hifrank.ai's original paths (from https://www.hifrank.ai/sitemap.xml).
// A link to one of them is root-relative; a link to any other hifrank.ai page keeps pointing at the live site.
const SITE = 'https://www.hifrank.ai';
const HOSTED = [
  /^\/$/,
  /^\/(pricing|docs|mcp|comparison|ai-voice-interviewer|ai-video-interviewer|try-frank|privacy-policy|terms-of-service|cookies-settings)$/,
  /^\/case-study(\/[\w-]+)?$/,
  /^\/blog(\/[\w-]+)?$/,
  /^\/author\/[\w-]+$/,
  /^\/docs\/[\w-]+$/,
  /^\/features\/[\w-]+$/,
  /^\/product-updates(\/[\w-]+)?$/,
  /^\/benefits\/(price|quality|scale|speed)$/,
  /^\/industries\/(saas|ecommerce)$/,
  /^\/roles\/(product-managers|growth-teams|founders|ux-researchers|brand-managers)$/,
  /^\/use-case\/(ai-churn-interviews|ai-discovery-calls|ai-product-discovery|ai-feature-discovery|market-discovery|win-loss-analysis|activation-barriers|trial-conversion|feature-adoption|funnel-drop-off|declining-engagement|upgrade-barriers)$/,
  /^\/competitors\/(conveo|listen-labs|outset|strella)$/,
];
// Old paths that now live somewhere else on the sitemap.
const MOVED = [[/^\/help\//, '/docs/'], [/^\/churn$/, '/use-case/ai-churn-interviews']];

// The interview templates (the home page's use-case wheel, the menu's Use cases list) that have a page of their own: template id → path.
// A template not listed here has no page yet (the doc "[Frank] Templates" has no words for it); its menu link stays an anchor on the home
// page's wheel and shows a red dot (see Base.astro).
export const TEMPLATE_PATHS = {
  churn: '/use-case/ai-churn-interviews',
  activation: '/use-case/activation-barriers',
  trial: '/use-case/trial-conversion',
  adoption: '/use-case/feature-adoption',
  funnel: '/use-case/funnel-drop-off',
  engagement: '/use-case/declining-engagement',
  upgrade: '/use-case/upgrade-barriers',
};

export const isHosted = path => HOSTED.some(r => r.test(path));

// A site path ('/pricing', '/blog/some-post') → relative if hosted here, else the live URL.
export function siteHref(path) {
  const p = MOVED.reduce((acc, [from, to]) => acc.replace(from, to), path);
  return isHosted(p) ? p : SITE + p;
}

// Any URL → relative when it is a hifrank.ai page hosted here (keeps ?query and #hash); otherwise unchanged.
export function localize(url) {
  const m = typeof url === 'string' && url.match(/^https?:\/\/(?:www\.)?hifrank\.ai(\/[^?#]*)?([?#].*)?$/);
  if (!m) return url;
  const p = siteHref((m[1] || '/').replace(/\/$/, '') || '/');
  return p.startsWith('/') ? p + (m[2] || '') : url;
}
