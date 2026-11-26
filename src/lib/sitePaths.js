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
  /^\/roles\/(product-managers|growth-teams|founders|ux-researchers)$/,
  /^\/use-case\/ai-churn-interviews$/,
  /^\/competitors\/(conveo|listen-labs|outset|strella)$/,
];
// Old paths that now live somewhere else on the sitemap.
const MOVED = [[/^\/help\//, '/docs/'], [/^\/churn$/, '/use-case/ai-churn-interviews']];

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
