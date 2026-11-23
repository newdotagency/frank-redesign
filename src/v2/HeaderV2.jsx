// V2 header — DESIGN-2 "Top Nav Bar": transparent on the eggshell canvas, not sticky,
// Inter 14px links, outline "Log in" + filled "Sign up" pills. The announcement is a
// quiet taupe band (no dark bar on cream paper). Same content and logo as V1.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { enter } from '../lib/motion';

const NAV = {
  announce: { pill: 'New', text: 'Frank now works inside your AI. Run research and uncover insights without leaving the chat.', cta: 'Learn more', href: 'https://www.hifrank.ai/mcp' },
  links: [
    { label: 'Platform', href: '#' }, { label: 'Solutions', href: '#' },
    { label: 'Resources', href: '#' }, { label: 'Pricing', href: 'https://www.hifrank.ai/pricing' },
  ],
  login: { label: 'Log in', href: '#' },
  cta: { label: 'Sign up', href: '#signup' },
};
const LOGO = '/frank-logo.png';

export const PILL = 'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border text-[14px] font-medium leading-none transition-colors duration-200 ease-[ease]';
export const PILL_FILLED = PILL + ' border-hair bg-black px-4 text-white hover:bg-graphite';
export const PILL_OUTLINE = PILL + ' border-hair bg-egg px-3.5 text-black hover:bg-taupe';

export default function HeaderV2() {
  const [annOpen, setAnnOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtn = useRef(null);
  const burger = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); burger.current?.focus(); };
  }, [menuOpen]);

  return (
    <motion.div variants={enter} initial="hidden" animate="show" custom={0}>
      <a className="skip" href="#main">Skip to content</a>

      <AnimatePresence>
        {annOpen && (
          <motion.div key="ann" role="region" aria-label="Announcement"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="border-b border-stone bg-taupe">
            <div className="relative mx-auto flex min-h-10 max-w-[1280px] flex-wrap items-center gap-x-3 gap-y-1 py-2 pl-5 pr-14 text-[13px] text-graphite md:justify-center md:px-16">
              <span className="rounded-full border border-stone bg-egg px-2 py-0.5 font-gmono text-[11px] uppercase tracking-[0.06em] text-black">{NAV.announce.pill}</span>
              <span>{NAV.announce.text}</span>
              <a href={NAV.announce.href} className="font-medium text-black underline decoration-stone underline-offset-4 transition-colors duration-200 hover:decoration-black">{NAV.announce.cta}</a>
              <button type="button" aria-label="Dismiss announcement" onClick={() => setAnnOpen(false)}
                className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-smoke transition-colors duration-200 hover:bg-stone hover:text-black md:right-8">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-5 md:px-16">
        <a href="#top" aria-label="Frank home" className="flex h-11 items-center">
          <img src={LOGO} alt="Frank" width="70" height="20" className="h-5 w-auto" />
        </a>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.links.map(l => (
              <li key={l.label}>
                <a href={l.href} className="inline-flex h-9 items-center rounded-full px-3 text-[14px] tracking-[0.01em] text-graphite transition-colors duration-200 hover:text-black">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a href={NAV.login.href} className={PILL_OUTLINE}>{NAV.login.label}</a>
          <a href={NAV.cta.href} className={PILL_FILLED}>{NAV.cta.label}</a>
        </div>
        <button ref={burger} type="button" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu-v2"
          onClick={() => setMenuOpen(true)} className="ml-auto grid size-11 place-items-center rounded-full text-black md:hidden">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-menu-v2" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[80] flex flex-col bg-egg px-5 pb-8 pt-3">
            <div className="flex h-14 items-center justify-between">
              <img src={LOGO} alt="Frank" width="70" height="20" className="h-5 w-auto" />
              <button ref={closeBtn} type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid size-11 place-items-center rounded-full text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <ul className="mt-8">
              {NAV.links.map(l => (
                <li key={l.label} className="border-b border-stone">
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 text-[32px] font-light leading-[1.13] tracking-[-0.02em] text-black">{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-2">
              <a href={NAV.login.href} className={PILL_OUTLINE + ' h-11'}>{NAV.login.label}</a>
              <a href={NAV.cta.href} className={PILL_FILLED + ' h-11'}>{NAV.cta.label}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
