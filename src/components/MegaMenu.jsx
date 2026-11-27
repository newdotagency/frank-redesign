// MegaMenu (opt-in, V21.04): the header's Platform / Solutions / Resources dropdowns, with the same items,
// groups and links as the live site (hifrank.ai). Header renders it only when given `mega`, so other
// versions keep their plain links.
//
// Item descriptions are short summaries of the live site's lines (V21.04 asked for shorter ones).
// After the reference the client sent: a panel only as wide as its content, opening under the trigger
// that was hovered (kept inside the header's width), in a double frame: a faint warm outer rim with a
// hairline, then the white panel inside it, corners concentric. Each group has a small capitals
// label; each item a thin line icon on the left, a dark title and one grey line under it. Hovering an item
// darkens its icon and tints it softly. Beside the white panel, on the warm rim, a side zone: the 'New'
// announcement (Platform), a customer quote (Solutions), a few plain links (Resources). Groups sit side by side as columns:
//   Platform: Product, Features, Benefits, Industries.  Solutions: Use cases (the home page's 11 interview templates, 2026-11-23), Roles.  Resources: one list.
// Motion: the panel fades in, 6px down and from 98.5% scale, anchored at its top, 200ms strong ease-out
// (the same in reverse to close); moving to another trigger glides it sideways (250ms) and crossfades
// the content (140ms). Reduced motion: fades only, no glide.
import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Glasses from '../v3/Glasses';
import PlaybookIcon from './PlaybookIcon';
import {
  BadgeCheck, BookOpen, Boxes, Clock3, FileText, Globe, LayoutGrid, Megaphone,
  Mic, Plug, Quote, Rocket, Scale, Search, ShieldCheck, ShoppingBag, Sparkles, Tag, TrendingUp,
  Video, Zap, ArrowRight, PhoneCall,
} from 'lucide-react';

import { siteHref, TEMPLATE_PATHS } from '../lib/sitePaths';
const SITE = 'https://www.hifrank.ai';
const it = (icon, title, desc, path) => ({ icon, title, desc, href: siteHref(path) });
// A use case: one of the interview templates from the home page's use-case wheel (v2104/UseCases.jsx), with its Figma icon. Churn reasons opens the
// template's page (TEMPLATE_PATHS); a template without a page opens the home page with that template chosen (Header maps '#template-<id>' to the home page).
const tp = (tpl, title, desc) => ({ tpl, title, desc, href: TEMPLATE_PATHS[tpl] ? siteHref(TEMPLATE_PATHS[tpl]) : '#template-' + tpl });

export const MENUS = {
  Platform: {
    col: 204,
    // Side zone: the header bar's announcement.
    aside: { kind: 'feature', label: 'New', title: 'Frank now works inside your AI', text: 'Run research and uncover insights without leaving the chat.', cta: 'Learn more', href: siteHref('/mcp') },
    groups: [
      { label: 'Product', items: [
        it(Mic, 'AI Voice Interviews', 'Natural voice conversations', '/ai-voice-interviewer'),
        it(Video, 'AI Video Interviews (Coming soon)', 'Face-to-face video conversations', '/ai-video-interviewer'),
        it(Plug, 'MCP', 'Frank inside your AI tools', '/mcp'),
      ] },
      { label: 'Features', items: [
        it(Globe, 'Global Scalability', '1,000s of calls overnight', '/features/global-scalability'),
        it(Clock3, 'Always-on Availability', 'Customers speak anytime', '/features/always-on-availability'),
        it(ShieldCheck, 'Transparency & Security', 'Every insight, traceable', '/features/transparency-security'),
        it(FileText, 'Automated Summaries', 'Every call at a glance', '/features/automated-summaries'),
      ] },
      { label: 'Benefits', items: [
        it(Tag, 'Price', 'Enterprise research, fair price', '/benefits/price'),
        it(BadgeCheck, 'Quality', 'Deep insights at any scale', '/benefits/quality'),
        it(Zap, 'Speed', 'Insights in days, not weeks', '/benefits/speed'),
        it(TrendingUp, 'Scale', 'Research without limits', '/benefits/scale'),
      ] },
      { label: 'Industries', items: [
        it(LayoutGrid, 'SaaS', 'Feedback into decisions', '/industries/saas'),
        it(ShoppingBag, 'Ecommerce', 'Why shoppers buy, or don’t', '/industries/ecommerce'),
      ] },
    ],
  },
  Solutions: {
    // No side zone (2026-11-23): the sample customer quote that sat here (made-up name) was dropped.
    groups: [
      // Two columns (user, 2026-11-23), each use case with a short line under its name. The lines for churn, trial and
      // activation are the Figma template cards' own; the others are drafted from the home page's problem lines.
      { label: 'Use cases', cols: 2, items: [
        tp('churn', 'Churn reasons', 'Cancellation causes, ranked'),
        it(PhoneCall, 'Discovery calls', 'Why new customers chose you', '/use-case/ai-discovery-calls'),
        tp('activation', 'Activation barriers', 'Why new users don’t start'),
        tp('trial', 'Trial conversion', 'Why trial users don’t pay'),
        tp('adoption', 'Feature adoption', 'Why a feature goes unused'),
        tp('funnel', 'Funnel drop-off', 'Where people stop and why'),
        tp('engagement', 'Declining engagement', 'Why active users slow down'),
        tp('upgrade', 'Upgrade barriers', 'What holds back an upgrade'),
        tp('requests', 'Feature request discovery', 'Which requests deserve investment'),
        tp('value', 'Customer value drivers', 'Why customers keep coming back'),
        tp('checkout', 'Checkout abandonment', 'Why payment isn’t completed'),
        tp('downgrade', 'Downgrade reasons', 'Why customers pay for less'),
      ] },
      { label: 'Roles', items: [
        it(Boxes, 'Product Managers', 'Decisions backed by customers', '/roles/product-managers'),
        it(TrendingUp, 'Growth Teams', 'Messaging that converts', '/roles/growth-teams'),
        it(Rocket, 'Founders', 'Know what customers think', '/roles/founders'),
        it(Search, 'UX Researchers', 'More studies, deeper answers', '/roles/ux-researchers'),
        it(Megaphone, 'Brand Managers', 'Hear how customers see you', '/roles/brand-managers'),
      ] },
    ],
  },
  Resources: {
    // Side zone: plain links, all from the live site.
    aside: { kind: 'links', label: 'Get started', links: [
      { title: 'Pricing', href: siteHref('/pricing') },
      { title: 'Log in', href: 'https://app.hifrank.ai/login' },
      { title: 'Sign up', href: 'https://app.hifrank.ai/signup' },
      { title: 'Contact support', href: 'mailto:support@hifrank.ai' },
    ] },
    groups: [
      { label: 'Resources', items: [
        it(BookOpen, 'Blog', null, '/blog'),
        it(FileText, 'Docs & Guides', null, '/docs'),
        it(Quote, 'Case Studies', null, '/case-study'),
        it(Scale, 'Comparison', null, '/comparison'),
        it(Sparkles, 'Product Updates', null, '/product-updates'),
      ] },
    ],
  },
};

const EASE = [0.23, 1, 0.32, 1];

function Item({ i, onPick, link }) {
  const Icon = i.icon;
  if (i.tpl) {
    // A use case (one of the home page's interview templates): its Figma glyph as a plain icon, sized and
    // coloured like the Lucide icons in the other menus (grey, ink on hover; user, 2026-11-24), the name and a short line under it.
    return (
      <a href={link(i.href)} onClick={onPick}
        className="group/i -mx-3 flex gap-3 rounded-[14px] px-3 py-2.5 text-ink no-underline outline-none transition-colors duration-200 ease-out hover:bg-[#1a1714]/[0.035] focus-visible:bg-[#1a1714]/[0.035] focus-visible:ring-2 focus-visible:ring-ink/15">
        <PlaybookIcon p={{ id: i.tpl }} box={17} scale={1.15} className="mt-[2px] text-ink-3 transition-colors duration-200 group-hover/i:text-ink" />
        <span className="min-w-0">
          <span className="block font-sans text-[15.5px] leading-[1.3] text-ink">{i.title}</span>
          {i.desc && <span className="mt-0.5 block font-sans text-[12.5px] leading-[1.4] text-ink-3">{i.desc}</span>}
        </span>
      </a>
    );
  }
  return (
    <a href={link(i.href)} onClick={onPick}
      className="group/i -mx-3 flex gap-3 rounded-[14px] px-3 py-2.5 text-ink no-underline outline-none transition-colors duration-200 ease-out hover:bg-[#1a1714]/[0.035] focus-visible:bg-[#1a1714]/[0.035] focus-visible:ring-2 focus-visible:ring-ink/15">
      <Icon aria-hidden="true" strokeWidth={1.5}
        className={'size-[17px] shrink-0 text-ink-3 transition-colors duration-200 group-hover/i:text-ink ' + (i.desc ? 'mt-[2px]' : '')} />
      <span className="min-w-0">
        <span className="block font-sans text-[15.5px] leading-[1.3] text-ink">{i.title}</span>
        {i.desc && <span className="mt-0.5 block font-sans text-[12.5px] leading-[1.4] text-ink-3">{i.desc}</span>}
      </span>
    </a>
  );
}

function Body({ menu, onPick, link }) {
  const m = MENUS[menu];
  return (
    <div className="flex h-full">
      {m.groups.map((g, k) => (
        // A faint hairline divider between columns (not before the first), the space on both sides of it.
        // Columns fill the white panel's height, so each line sits the same distance from its top and bottom.
        <div key={g.label} className={'shrink-0 ' + (k ? (m.col ? 'ml-6 border-0 border-l border-solid border-[#1a1714]/[0.045] pl-6' : 'ml-8 border-0 border-l border-solid border-[#1a1714]/[0.045] pl-8') : '')}
          style={{ width: (m.col || 236) * (g.cols || 1) + 24 * ((g.cols || 1) - 1) + (k ? (m.col ? 24 : 32) : 0) }}>
          <p className="m-0 mb-3 font-sans text-[12px] font-light uppercase leading-none tracking-[0.08em] text-ink-3">{g.label}</p>
          <div className={g.cols ? 'grid grid-flow-col gap-x-6 gap-y-0.5' : 'flex flex-col gap-0.5'}
            style={g.cols ? { gridTemplateColumns: `repeat(${g.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${Math.ceil(g.items.length / g.cols)}, auto)` } : undefined}>
            {g.items.map(i => <Item key={i.title} i={i} onPick={onPick} link={link} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// The side zone, on the warm rim beside the white panel (after the reference): a feature, a quote or a
// short list of links.
function Aside({ menu, onPick, link }) {
  const x = MENUS[menu].aside;
  if (!x) return null;
  if (x.kind === 'feature') return (
    <a href={link(x.href)} onClick={onPick} className="group/a flex h-full flex-col text-ink no-underline outline-none focus-visible:ring-2 focus-visible:ring-ink/15 rounded-[16px]">
      <span aria-hidden="true" className="grid aspect-[16/10] w-full place-items-center rounded-[16px] bg-[#d1f899] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
        <span className="block w-[38%]"><Glasses pose="Ready" reduced /></span>
      </span>
      <span className="mt-4 inline-flex w-max items-center rounded-full bg-[#1a1714] px-2 py-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#d1f899]">{x.label}</span>
      <span className="mt-2.5 font-sans text-[15.5px] leading-[1.3] text-ink">{x.title}</span>
      <span className="mt-1 font-sans text-[13.5px] leading-[1.4] text-ink-3">{x.text}</span>
      <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-[13.5px] text-ink">
        {x.cta}<ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 ease-out group-hover/a:translate-x-0.5" strokeWidth={1.75} />
      </span>
    </a>
  );
  if (x.kind === 'quote') return (
    <figure className="m-0 flex h-full flex-col justify-center">
      <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-white font-sans text-[15px] font-medium text-ink-2 shadow-[0_0_0_1px_rgba(26,23,20,0.06)]">{x.initials}</span>
      <blockquote className="m-0 mt-5 font-sans text-[16.5px] leading-[1.4] text-ink">“{x.quote}”</blockquote>
      <figcaption className="mt-4 font-sans">
        <span className="block text-[14.5px] text-ink">{x.name}</span>
        <span className="mt-0.5 block text-[13px] text-ink-3">{x.role}</span>
      </figcaption>
    </figure>
  );
  return (
    <div>
      <p className="m-0 mb-3 font-sans text-[12px] font-light uppercase leading-none tracking-[0.08em] text-ink-3">{x.label}</p>
      <div className="flex flex-col">
        {x.links.map(l => (
          <a key={l.title} href={link(l.href)} onClick={onPick}
            className="-mx-2 rounded-[10px] px-2 py-2 font-sans text-[15.5px] text-ink no-underline outline-none transition-colors duration-200 hover:bg-[#1a1714]/[0.04] focus-visible:bg-[#1a1714]/[0.04]">{l.title}</a>
        ))}
      </div>
    </div>
  );
}

// open: the menu's name or null. anchor: the open trigger's left and the header pill's left and right
// edges (minX, maxX), in header coordinates; the panel lines up with the trigger's left (minus 16px) and
// never pokes out past the pill. Hover/focus wiring lives in Header; this is only the panel.
// link (V21.04, opt-in): maps a live hifrank.ai link to this version's own page where there is one.
export function MegaPanel({ open, reduce, anchor, onPick, onEnter, onLeave, link = h => h }) {
  const shell = useRef(null);
  const [x, setX] = useState(0);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!open || !shell.current) return;
    const measure = () => setW(shell.current ? shell.current.offsetWidth : 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(shell.current);
    return () => ro.disconnect();
  }, [open]);
  useLayoutEffect(() => {
    if (!open || !anchor) return;
    const max = Math.max(anchor.minX, anchor.maxX - w);
    setX(Math.min(Math.max(anchor.minX, anchor.left - 16), max));
  }, [open, anchor, w]);
  return (
    <AnimatePresence>
      {open && (
        <div key="pos" className="absolute left-0 top-full z-10 hidden pt-2 lg:block"
          style={{ transform: `translateX(${x}px)`, transition: reduce ? 'none' : 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          onPointerEnter={onEnter} onPointerLeave={onLeave}>
          <motion.div id="mega-panel" role="region" aria-label={open + ' menu'} ref={shell}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.985)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)', transition: { duration: 0.2, ease: EASE } }}
            exit={reduce ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, transform: 'translateY(-6px) scale(0.985)', transition: { duration: 0.15, ease: EASE } }}
            style={{ transformOrigin: 'top left' }}
            className="w-max rounded-[28px] bg-[#f6f3ec] p-1.5 shadow-[0_0_0_1px_rgba(26,23,20,0.06),0_24px_60px_-30px_rgba(42,50,30,0.28)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={open} className="flex items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}>
                <div className="flex flex-col rounded-[22px] bg-white px-8 pb-6 pt-6 shadow-[0_0_0_1px_rgba(26,23,20,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
                  <div className="flex-1"><Body menu={open} onPick={onPick} link={link} /></div>
                </div>
                {MENUS[open].aside && <div className="w-[264px] shrink-0 px-7 py-6"><Aside menu={open} onPick={onPick} link={link} /></div>}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
