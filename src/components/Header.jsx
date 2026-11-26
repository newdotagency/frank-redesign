// Header — announcement bar + floating pill nav, reused as-is from Homepage V5.
// Markup, class names and scroll behaviour match the original; styles live in index.css.
import { localize } from '../lib/sitePaths';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { enter, spring } from '../lib/motion';
import { MENUS, MegaPanel } from './MegaMenu';

const NAV = {
  announce: { pill: 'NEW', text: 'Frank now works inside your AI. Run research and uncover insights without leaving the chat.', cta: 'Learn more', href: 'https://www.hifrank.ai/mcp' },
  links: [
    { label: 'Platform', href: '#' }, { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '#' }, { label: 'Pricing', href: 'https://www.hifrank.ai/pricing' },
  ],
  login: { label: 'Login', href: 'https://app.hifrank.ai/login' },
  cta: { label: 'Get started', href: 'https://app.hifrank.ai/signup' },
};
const LOGO = '/frank-logo.png';

// `fixed` (V3): the whole header (announcement + nav) is pinned over the hero and hides
// as one piece on scroll-down, instead of the nav sticking on its own.
// `mode` (V14), for the fixed header: 'auto' (default: hides on scroll-down), 'hidden' (kept out of
// view), or 'bare' (kept in view as the nav row only — no background, no announcement bar).
// `mega` (V21.04, opt-in): Platform / Solutions / Resources open the mega menu (MegaMenu.jsx) instead of
// being plain links, on desktop by hover or click (keyboard: Enter/Space, Escape closes); in the phone
// menu they become expandable groups. Without it the header is unchanged.
// `adaptive` (V21.04, opt-in): in 'auto' mode the header stays on screen the whole time (sticky, never
// hidden on scroll) as a compact 52px pill. Past the top, the announcement bar folds away so only the pill
// remains. On 1024px and up the pill is wide (the page's 1312px content width), links centred. Styles:
// `.nav.adapt` in index.css.
// `hrefs` (V21.04, opt-in): { home, pricing } to link the logo and Pricing to this version's own pages;
// `current`: the label of the page you're on (its link gets a soft pill and aria-current).
// `hrefs.voice` / `hrefs.docs` (opt-in): the menu's "AI Voice Interviews" and "Docs & Guides" (and any Pricing link in it) open this version's pages.
// `hrefs.blog` / `hrefs.cases` (opt-in, V21.04's pages pass them): the menu's "Blog" and "Case Studies" open the V21.04 pages.
// "Comparison" (hifrank.ai has no such page) opens `hrefs.comparison` (V21.04's comparison page); without it, the blog's
// Comparisons topic (`hrefs.blog` + '#comparisons', joined here at runtime so the build's page-link rewrite still applies),
// or the live blog.
export default function Header({ fixed = false, mode = 'auto', mega = false, adaptive = false, hrefs = null, current = null }) {
  // '#template-<id>' (Solutions › Templates) opens the home page's use-case wheel on that template; joined at run time
  // so the build's rewrite of the home link still applies.
  const link0 = h => /hifrank\.ai\/features\/[a-z-]+$/.test(h) ? h.replace(/^https?:\/\/[^/]+/, '') : /^#template-/.test(h) ? (hrefs?.home ? hrefs.home : 'https://www.hifrank.ai/') + h : (hrefs?.mcp && /hifrank\.ai\/mcp$/.test(h)) ? hrefs.mcp : (hrefs?.voice && /\/ai-voice-interviewer$/.test(h)) ? hrefs.voice : (hrefs?.pricing && /hifrank\.ai\/pricing$/.test(h)) ? hrefs.pricing : (hrefs?.docs && /hifrank\.ai\/docs$/.test(h)) ? hrefs.docs : (hrefs?.blog && /hifrank\.ai\/blog$/.test(h)) ? hrefs.blog : (hrefs?.cases && /hifrank\.ai\/case-study$/.test(h)) ? hrefs.cases : (hrefs?.churn && /hifrank\.ai\/(churn|use-case\/ai-churn-interviews)$/.test(h)) ? hrefs.churn : /hifrank\.ai\/comparison$/.test(h) ? (hrefs?.comparison || (hrefs?.blog ? hrefs.blog + '#comparisons' : 'https://www.hifrank.ai/blog')) : h;
  const link = h => localize(link0(h));
  const [annOpen, setAnnOpen] = useState(true);
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prog = useRef(null);
  const closeBtn = useRef(null);
  const burger = useRef(null);
  const menuRef = useRef(menuOpen);
  menuRef.current = menuOpen;
  // Mega menu: which one is open (or null). Hover opens after a short intent delay (instantly when
  // another is already open, so moving across the triggers swaps the content); leaving closes after a
  // grace period, so the pointer can cross the gap to the panel.
  const reduce = !!useReducedMotion();
  const [mOpen, setMOpen] = useState(null);
  const mRef = useRef(null);
  mRef.current = mOpen;
  const mTimer = useRef(0);
  const headerEl = useRef(null);
  const triggers = useRef({});
  const clearT = () => { clearTimeout(mTimer.current); };
  const hoverOpen = name => { clearT(); if (mRef.current) setMOpen(name); else mTimer.current = setTimeout(() => setMOpen(name), 90); };
  const hoverLeave = () => { clearT(); mTimer.current = setTimeout(() => setMOpen(null), 160); };
  useEffect(() => {
    if (!mOpen) return;
    const onKey = e => { if (e.key === 'Escape') { triggers.current[mRef.current]?.focus(); setMOpen(null); } };
    const onDown = e => { if (!headerEl.current?.contains(e.target)) setMOpen(null); };
    const y0 = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - y0) > 40) setMOpen(null); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); window.removeEventListener('scroll', onScroll); };
  }, [mOpen]);
  useEffect(() => () => clearT(), []);
  // Where the open menu's trigger sits in the header, so its panel can open under it.
  const [anchor, setAnchor] = useState(null);
  useEffect(() => {
    if (!mOpen) return;
    const t = triggers.current[mOpen], h = headerEl.current;
    if (!t || !h) return;
    const tr = t.getBoundingClientRect(), hr = h.getBoundingClientRect();
    const pr = h.querySelector('.wrap')?.getBoundingClientRect() || hr;
    setAnchor({ left: tr.left - hr.left, width: tr.width, minX: pr.left - hr.left, maxX: pr.right - hr.left });
  }, [mOpen]);

  // Same rules as V5: solid after 24px; hide on scroll-down past 120px, show on scroll-up.
  useEffect(() => {
    let lastY = window.scrollY, raf = 0;
    const onScroll = () => {
      const y = window.scrollY, dy = y - lastY; lastY = y;
      setSolid(y > 24);
      if (!adaptive) {
        setHide(h => (menuRef.current || y < 120) ? false : dy > 6 ? true : dy < -6 ? false : h);
      }
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (prog.current) prog.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Mobile menu: lock scroll, focus the close button, Escape closes, focus returns to the burger.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); burger.current?.focus(); };
  }, [menuOpen]);

  const inner = (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <AnimatePresence>
      {annOpen && mode !== 'bare' && !(adaptive && solid) && (
        <motion.div key="ann" className="ann" role="region" aria-label="Announcement"
          variants={enter} initial="hidden" animate="show" custom={0}
          style={adaptive ? { overflow: 'hidden' } : undefined}
          exit={adaptive ? { opacity: 0, height: 0, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } } : { opacity: 0, transition: spring.smooth }}>
          <div className="wrap">
            <span className="ann-pill">{NAV.announce.pill}</span>
            <span>{NAV.announce.text}</span>
            <a href={localize(NAV.announce.href)}>{NAV.announce.cta}</a>
            <button type="button" className="ann-x" aria-label="Dismiss announcement" onClick={() => setAnnOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Entrance animates opacity only: the header's transform belongs to the hide-on-scroll rule. */}
      <motion.header ref={headerEl} className={['nav', solid && mode !== 'bare' && 'solid', hide && !fixed && 'hide', adaptive && 'adapt'].filter(Boolean).join(' ')}
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { ...spring.soft, delay: 0.05 } }}>
        <div className="nav-bg" />
        <div className="wrap">
          <span ref={prog} className="nav-prog" aria-hidden="true" style={{ transform: 'scaleX(0)' }} />
          <a className="nav-logo" href={hrefs?.home || '#top'} aria-label="Frank home">
            <img src={LOGO} alt="Frank" width="77" height="22" />
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV.links.map(l => (mega && MENUS[l.label]) ? (
                <li key={l.label} onPointerEnter={e => e.pointerType === 'mouse' && hoverOpen(l.label)} onPointerLeave={e => e.pointerType === 'mouse' && hoverLeave()}>
                  <button type="button" ref={el => { triggers.current[l.label] = el; }}
                    aria-expanded={mOpen === l.label} aria-controls="mega-panel"
                    onClick={() => { clearT(); setMOpen(o => o === l.label ? null : l.label); }}
                    className={'inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border-0 px-3.5 font-sans text-[15px] font-[450] text-inherit transition-[background-color,color] duration-200 ease-out hover:bg-[#1a1714]/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink/30 ' + (mOpen === l.label ? 'bg-[#1a1714]/[0.06]' : 'bg-transparent')}>
                    {l.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                      className={'transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (mOpen === l.label ? 'rotate-180' : '')}><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </li>
              ) : <li key={l.label}><a href={(l.label === 'Pricing' && hrefs?.pricing) || localize(l.href)} aria-current={current === l.label ? 'page' : undefined}
                    className={current === l.label ? '!rounded-full !bg-[#1a1714]/[0.06]' : undefined}>{l.label}</a></li>)}
            </ul>
          </nav>
          <div className="nav-act">
            <a className="nav-login" href={NAV.login.href}>{NAV.login.label}</a>
            <a className="btn btn-p btn-sm" href={NAV.cta.href}>{NAV.cta.label}</a>
          </div>
          <button ref={burger} type="button" className="burger" aria-label="Open menu"
            aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
          </button>
        </div>
        {mega && <MegaPanel open={mOpen} reduce={reduce} anchor={anchor} onPick={() => setMOpen(null)} onEnter={clearT} onLeave={hoverLeave} link={link} />}
      </motion.header>

      {menuOpen && (
        <div id="mobile-menu" className="mm" style={mega ? { overflowY: 'auto' } : undefined} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mm-top">
            <img src={LOGO} alt="Frank" width="77" height="22" />
            <button ref={closeBtn} type="button" className="burger" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <ul>
            {NAV.links.map(l => (mega && MENUS[l.label]) ? (
              // Phone menu with `mega`: each menu is an expandable group listing its items by title.
              <li key={l.label}>
                <details className="group/d border-b border-[var(--line)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-serif text-[34px] leading-[1.15] tracking-[-0.02em] text-ink [&::-webkit-details-marker]:hidden">
                    {l.label}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-open/d:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <div className="pb-4 pt-1">
                    {MENUS[l.label].groups.map(g => (
                      <div key={g.label} className="mt-3 first:mt-0">
                        <p className="m-0 mb-1 font-sans text-[12px] font-light uppercase tracking-[0.08em] text-ink-3">{g.label}</p>
                        {g.items.map(i => <a key={i.title} href={link(i.href)} onClick={() => setMenuOpen(false)} style={{ font: '400 17px/1.4 var(--sans)', border: 0, padding: '6px 0', letterSpacing: 0 }}>{i.title}</a>)}
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ) : <li key={l.label}><a href={(l.label === 'Pricing' && hrefs?.pricing) || localize(l.href)} aria-current={current === l.label ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{l.label}</a></li>)}
          </ul>
          <div className="mm-ctas">
            <a className="btn btn-s" href={NAV.login.href}>{NAV.login.label}</a>
            <a className="btn btn-p" href={NAV.cta.href}>{NAV.cta.label}</a>
          </div>
        </div>
      )}
    </>
  );
  if (!fixed) return inner;
  // Adaptive: always on screen, except where the page asks for it hidden (mode 'hidden'), when it slides
  // up out of view (quick, strong ease-out) and back (450ms, the drawer curve). Reduced motion: it fades.
  const away = mode === 'hidden';
  const adaptiveStyle = reduce
    ? { opacity: away ? 0 : 1, pointerEvents: away ? 'none' : undefined, transition: 'opacity .2s ease' }
    : { transform: away ? 'translateY(calc(-100% - 14px))' : 'translateY(0)', pointerEvents: away ? 'none' : undefined,
        transition: away ? 'transform .3s cubic-bezier(.23,1,.32,1)' : 'transform .45s cubic-bezier(.32,.72,0,1)' };
  return (
    <div className={'fixed inset-x-0 top-0 z-50 ' + (adaptive ? '' : 'transition-transform duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)]')}
      style={adaptive ? adaptiveStyle : { transform: mode === 'hidden' || (mode === 'auto' && hide) ? 'translateY(calc(-100% - 14px))' : 'none' }}>
      {inner}
    </div>
  );
}
