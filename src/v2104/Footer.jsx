// Footer (V21.1) — the old landing's footer (hifrank.ai), reset for this page. Left: the Frank logo, the
// line "Making customer research faster, smarter, and scalable.", the support email and the six social
// links as quiet round icons. Right: the old site's link groups, with its long "Platform" list split in
// two (the interviewers, then Price/Quality/Speed/Scale as "Why Frank"). A hairline, then the copyright
// and legal links. Last, the Frank wordmark, page-wide in the closing card's lime, rising into place as
// the page reaches its end (after V5's footer) and cut off by the page's bottom edge.
// The docked chat floats over the bottom of the screen, so the legal row sits clear of it and only the
// decorative wordmark runs underneath.
import { useRef } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { siFacebook, siInstagram, siLinkedin, siTiktok, siX, siYoutube } from 'simple-icons';

const LOGO = '/frank-logo.png';
const SITE = 'https://hifrank.ai';
const MASK = {
  WebkitMaskImage: `url(${LOGO})`, maskImage: `url(${LOGO})`,
  WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
};

const SOCIALS = [
  { icon: siLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/frank-ai-researcher/' },
  { icon: siX, label: 'X', href: 'https://x.com/hifrankai' },
  { icon: siYoutube, label: 'YouTube', href: 'https://www.youtube.com/@FrankAIResearcher' },
  { icon: siInstagram, label: 'Instagram', href: 'https://www.instagram.com/hifrank.ai' },
  { icon: siTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@hifrank.ai' },
  { icon: siFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1WxnW51dsB/' },
];

const COLUMNS = [
  { title: 'Platform', links: [
    ['Voice Interviewer', '/ai-voice-interviewer'],
    ['Video Interviewer', '/ai-video-interviewer'],
  ] },
  { title: 'Why Frank', links: [
    ['Price', '/benefits/price'],
    ['Quality', '/benefits/quality'],
    ['Speed', '/benefits/speed'],
    ['Scale', '/benefits/scale'],
  ] },
  { title: 'Use cases', links: [
    ['Discovery calls', '/use-case/ai-discovery-calls'],
    ['Churn', '/use-case/ai-churn-interviews', '/use-case/ai-churn-interviews'],
    ['Product discovery', '/use-case/ai-product-discovery'],
    ['Feature discovery', '/use-case/ai-feature-discovery'],
    ['Market discovery', '/use-case/market-discovery'],
  ] },
  { title: 'Features', links: [
    ['Global scalability', '/features/global-scalability'],
    ['Always-on availability', '/features/always-on-availability'],
    ['Transparency & security', '/features/transparency-security'],
    ['Automated summaries', '/features/automated-summaries'],
  ] },
  { title: 'Resources', links: [
    ['Blog', '/blog', '/blog'], // third item: this version's own page, used instead of the live one
    ['Docs & guides', '/docs'],
    ['Case studies', '/case-study', '/case-study'],
  ] },
];

const LEGAL = [['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service'], ['Cookie settings', '/cookies-settings']];

const FOCUS = 'rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
// Links: muted ink that darkens, with an underline drawn from the left on hover.
const LINK = 'relative inline-block text-ink/65 no-underline transition-colors duration-200 ease-out hover:text-ink '
  + 'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.23,1,0.32,1)] hover:after:scale-x-100 ' + FOCUS;

export default function Footer() {
  const reduce = !!useReducedMotion();
  const mark = useRef(null);
  // The wordmark rises from 45% of its height to rest as it comes up into the screen.
  const { scrollYProgress } = useScroll({ target: mark, offset: ['start end', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0005 });
  const y = useTransform(p, [0, 1], [45, 0]);
  const rise = useMotionTemplate`translateY(${y}%)`;

  return (
    <footer className="relative mt-[clamp(72px,9vw,128px)] overflow-hidden px-4 sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(5,minmax(0,1fr))] lg:gap-y-12">
          <div className="col-span-2 max-w-[340px] sm:col-span-3 lg:col-span-1">
            <a href="#top" aria-label="Frank, back to top" className={'inline-block ' + FOCUS}>
              <img src={LOGO} alt="" width="84" height="24" className="block h-6 w-auto" />
            </a>
            <p className="m-0 mt-5 font-sans text-[17px] leading-[1.5] text-ink/70 [text-wrap:balance]">
              Making customer research faster, smarter, and scalable.
            </p>
            <a href="mailto:support@hifrank.ai" className={'mt-5 font-sans text-[15px] ' + LINK}>support@hifrank.ai</a>
            <ul className="m-0 mt-7 flex list-none flex-wrap gap-2 p-0">
              {SOCIALS.map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={'Frank on ' + s.label}
                    className={'grid h-10 w-10 place-items-center rounded-full text-ink/70 ring-1 ring-[#1a1714]/[0.1] transition-[background-color,color,transform] duration-200 ease-out hover:bg-black hover:text-white hover:ring-black active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d={s.icon.path} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="contents">
            {COLUMNS.map(c => (
              <div key={c.title}>
                <h2 className="m-0 font-sans text-[14px] font-medium text-ink">{c.title}</h2>
                <ul className="m-0 mt-4 grid list-none gap-3 p-0 font-sans text-[15px] leading-[1.35]">
                  {c.links.map(([label, path, local]) => <li key={label}><a href={local || SITE + path} className={LINK}>{label}</a></li>)}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-[clamp(48px,6vw,80px)] flex flex-col gap-4 border-t border-[#1a1714]/[0.08] pt-6 font-sans text-[14px] text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© 2026 Frank. All rights reserved.</p>
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            {LEGAL.map(([label, path]) => <li key={label}><a href={SITE + path} className={LINK.replace('text-ink/65', 'text-ink/55')}>{label}</a></li>)}
          </ul>
        </div>
      </div>

      {/* The wordmark: the logo used as a mask, filled with the closing card's lime; the bottom ~20% of
          it is cut off by the page's end. */}
      <div ref={mark} aria-hidden="true" className="mx-auto mt-[clamp(40px,5vw,72px)] max-w-[1312px] overflow-hidden">
        <motion.div style={reduce ? MASK : { ...MASK, transform: rise }}
          className="-mb-[4%] aspect-[3000/854] w-full bg-[#d1f899]" />
      </div>
    </footer>
  );
}
