// PricingPage (V21.04) — hifrank.ai/pricing brought into the V21.04 style. The content (words, prices, plans,
// links) is the live page's, unchanged; only the design is new. Its structure follows the live page, which
// reads better than a flat white page:
//   1. Hero: a forest-green panel (the homepage cards' colour, frame and faint grain glow) with the label,
//      the title, the subtitle and the billing switch (Monthly / Yearly, "Save 2 months"; Yearly first, as
//      live). The plan cards rise over the panel's bottom edge.
//   2. The four plans as clean white cards, all alike so they compare at a glance; Growth, the most popular,
//      is marked by a lime outline, its tag and a lime button. A card: name, who it's for, the price (it
//      rolls when billing changes), how it's billed, the button, then "What's included".
//   3. Under the cards: Enterprise as one wide card (label, the question as heading, the offer, "Book a Demo"),
//      the student discount as a lime pill under the offer; then "Common questions" in the homepage FAQ's
//      two-column layout.
//   4. "Frank was built by Prelaunch.com": an orbit of brands around Prelaunch (see BuiltBy), then the footer.
// Entrance: the first screen (hero, billing, plans) rises in once on load, a beat apart; the rest rises in
// with the scroll (reveal.jsx).
import { useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, GraduationCap } from 'lucide-react';
import Header from '../components/Header';
import HighlightMarker from '../components/HighlightMarker';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import { PL_LOGOS } from './logos/prelaunchBrands';
import FAQ from './FAQ';
import Footer from './Footer';

const SIGNUP = 'https://app.hifrank.ai/signup';
const DEMO = 'https://meetings.hubspot.com/ani-gharibyan/frank-ai-research-inplatform';
const EASE = [0.23, 1, 0.32, 1];

// Prices: [yearly, monthly] per month; billed: what the yearly plan comes to.
const PLANS = [
  { id: 'free', name: 'Free', blurb: 'Try AI interviews with basic features. No credit card required.', free: true,
    cta: 'Get started free',
    items: ['60 voice minutes / month', '~4 interviews (15 min each)', '10-minute max interview length', 'Sentiment & thematic analysis', 'Video reels compilation', 'Unlimited anonymous viewers'] },
  { id: 'starter', name: 'Starter', blurb: 'For solo innovators & DTC brands starting out.', price: [49, 59], billed: '$590',
    cta: 'Start free trial', perMin: 'Average at $0.50/min.',
    items: ['120 voice minutes / month', '~8 interviews (15 min each)', '20-minute max interview length', '50 chat conversations', 'Full analytics suite'] },
  { id: 'growth', name: 'Growth', blurb: 'For product teams and startups scaling their customer insights.', price: [166, 199], billed: '$1,990',
    cta: 'Start free trial', perMin: 'Average at $0.45/min.', popular: true,
    items: ['450 voice minutes / month', '~30 interviews (15 min each)', '20-minute max interview length', 'Credit rollovers (30 days)'] },
  { id: 'business', name: 'Business', blurb: 'Advanced tools for established teams.', price: [312, 375], billed: '$3,750',
    cta: 'Start free trial', perMin: 'Average at $0.40/min.',
    items: ['950 voice minutes / month', '~63 interviews (15 min each)', '30-minute max interview length', 'Everything in Growth'] },
];

const FAQS = [
  { q: 'What is a credit?', a: ['10 credits equals roughly 1 minute of voice interview or 10 chat messages. Credits give you flexibility to mix and match interview types.'] },
  { q: 'Can I switch plans anytime?', a: ['Yes. You can upgrade or downgrade at any time. When upgrading, you get immediate access to new plan features. Downgrades take effect at the next billing cycle.'] },
  { q: 'What happens if I exceed my minutes?', a: ['You can keep interviewing at the overage rate for your plan. There are no hard caps — your research never stops mid-conversation.'] },
  { q: 'Do unused credits roll over?', a: ['On Growth and above, unused credits roll over for 30 days. Free and Starter plans reset monthly.'] },
  { q: 'Is there a free trial?', a: ['All paid plans include a 14-day free trial. No credit card required to start.'] },
  { q: 'What interview formats are supported?', a: ['Frank supports voice interviews, video interviews, WhatsApp chat, and web chat. Each format uses credits at a different rate — voice is the most efficient.'] },
];

const LBL = 'm-0 font-sans text-[12px] font-light uppercase leading-none tracking-[0.08em]';

// The page's first screen (hero, billing, plans) is there on arrival, so it plays its entrance once on load
// (a 16px fade-up, strong ease-out, a beat apart) instead of waiting for the scroll. Reduced motion: fade only.
function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

// Monthly / Yearly on the green panel: a radio group; the selected side is a white pill that slides across.
// "Save 2 months" sits outside the switch, handwritten in lime (Caveat: a hand that stays easy to read), with
// a hand-drawn arrow curving out of Yearly to it: beside the switch from 640px, under it on phones. The
// arrow draws itself once on load (its stroke), then the words fade in; reduced motion: both simply show.
function Billing({ yearly, onChange, reduce }) {
  const opt = (on, label, value) => (
    <button type="button" role="radio" aria-checked={on} onClick={() => onChange(value)}
      className={'relative inline-flex h-10 cursor-pointer items-center rounded-full border-0 bg-transparent px-5 font-sans text-[14.5px] transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ' + (on ? 'text-ink' : 'text-white/70 hover:text-white')}>
      {on && <motion.span layoutId="pr-billing" aria-hidden="true" className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)]"
        transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.15 }} />}
      <span className="relative">{label}</span>
    </button>
  );
  const draw = { initial: reduce ? false : { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.7, delay: 0.6, ease: [0.65, 0, 0.35, 1] } };
  const words = { initial: reduce ? false : { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 1.2, ease: 'easeOut' } };
  const HAND = "pointer-events-none whitespace-nowrap font-['Caveat',cursive] text-[22px] font-semibold leading-none text-[#d1f899]";
  return (
    <div className="relative inline-flex flex-col items-center">
      <div role="radiogroup" aria-label="Billing period" aria-describedby="pr-save" className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] p-1 ring-1 ring-inset ring-white/[0.1]">
        {opt(!yearly, 'Monthly', false)}
        {opt(yearly, 'Yearly', true)}
      </div>
      {/* From 640px: beside the switch, the arrow rising out of Yearly's right side to the words. */}
      <div aria-hidden="true" className="absolute left-full top-[-16px] ml-1 hidden items-start sm:flex">
        <svg width="58" height="44" viewBox="0 0 58 44" fill="none" className="mt-2 shrink-0 text-[#d1f899]">
          <motion.path d="M4 38 C 14 40, 30 34, 40 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...draw} />
          <motion.path d="M33 17 L 40.5 13 L 42 21.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 1.25, ease: 'easeOut' }} />
        </svg>
        <motion.span className={HAND + ' -ml-1 inline-block [transform:rotate(-6deg)]'} {...words}>Save 2 months</motion.span>
      </div>
      {/* Phones: under the switch, the arrow curling up out of Yearly. */}
      <div aria-hidden="true" className="mt-1 flex translate-x-[92px] items-end sm:hidden">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="shrink-0 text-[#d1f899]">
          <motion.path d="M28 30 C 14 30, 8 22, 10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...draw} />
          <motion.path d="M4.5 11 L 10 5 L 15 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 1.25, ease: 'easeOut' }} />
        </svg>
        <motion.span className={HAND + ' mb-[-2px] ml-1 inline-block [transform:rotate(-4deg)]'} {...words}>Save 2 months</motion.span>
      </div>
      <span id="pr-save" className="sr-only">Yearly: save 2 months</span>
    </div>
  );
}

// The price: the number rolls up into place when billing changes (reduced motion: it just swaps).
function Price({ p, yearly, reduce, dark }) {
  if (p.free) return <p className={'m-0 font-[\'Figtree\',sans-serif] text-[44px] font-medium leading-none tracking-[-0.03em] ' + (dark ? 'text-white' : 'text-ink')}>Free</p>;
  const n = yearly ? p.price[0] : p.price[1];
  return (
    <p className={'m-0 flex items-start font-[\'Figtree\',sans-serif] font-medium leading-none tracking-[-0.03em] ' + (dark ? 'text-white' : 'text-ink')}>
      <span className="mt-1 text-[20px]">$</span>
      <span className="relative inline-flex overflow-hidden text-[44px] tabular-nums">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={n} initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(60%)' }}
            animate={{ opacity: 1, transform: 'translateY(0%)' }} exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-60%)' }}
            transition={{ duration: 0.3, ease: EASE }}>{n}</motion.span>
        </AnimatePresence>
      </span>
      <span className={'ml-1 self-end pb-1 font-sans text-[15px] tracking-normal ' + (dark ? 'text-white/55' : 'text-ink-3')}>/mo</span>
    </p>
  );
}

function Plan({ p, yearly, reduce, lag }) {
  const pop = !!p.popular;
  return (
    <Rise reduce={reduce} delay={lag}
      className={'relative flex flex-col rounded-[24px] bg-white p-6 sm:p-7 '
        + (pop ? 'shadow-[0_0_0_2px_#a0d05f,0_24px_50px_-28px_rgba(42,50,30,0.35)]' : 'shadow-[0_0_0_1px_rgba(26,23,20,0.07),0_24px_50px_-30px_rgba(42,50,30,0.25)]')}>
      {pop && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#d1f899] px-3 py-1 font-sans text-[11.5px] font-medium uppercase tracking-[0.06em] text-ink shadow-[0_0_0_1px_#a0d05f]">Most popular</span>
      )}
      <h3 className="m-0 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink">{p.name}</h3>
      <p className="m-0 mt-2 min-h-[42px] font-sans text-[14px] leading-[1.5] text-ink-3">{p.blurb}</p>
      <div className="mt-5"><Price p={p} yearly={yearly} reduce={reduce} /></div>
      <p className="m-0 mt-2 h-5 font-sans text-[13px] text-[#5f8f22]">
        {p.free ? '' : yearly ? `Billed as ${p.billed}/year` : 'Billed monthly'}
      </p>
      <a href={SIGNUP}
        className={'mt-5 inline-flex h-11 items-center justify-center rounded-full px-5 font-sans text-[14.5px] font-medium no-underline transition-[background-color,transform] duration-200 ease-out active:scale-[0.98] ' + FOCUS + ' '
          + (pop ? 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]' : p.free ? 'bg-white text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.14)] hover:bg-[#f6f5f1]' : 'bg-[#1a1714] text-white hover:bg-[#2a2622]')}>
        {p.cta}
      </a>
      <div className="mt-6 border-0 border-t border-solid border-[#1a1714]/[0.07] pt-5">
        <p className={LBL + ' text-ink-3'}>What’s included</p>
        <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
          {p.items.map(t => (
            <li key={t} className="flex items-start gap-2.5 font-sans text-[14px] leading-[1.4] text-ink-2">
              <Check aria-hidden="true" className="mt-[2px] size-[15px] shrink-0 text-[#6fa62f]" strokeWidth={2} />
              {t}
            </li>
          ))}
          {p.perMin && (
            <li className="flex items-start gap-2.5 font-sans text-[14px] leading-[1.4] text-ink-2">
              <Check aria-hidden="true" className="mt-[2px] size-[15px] shrink-0 text-[#6fa62f]" strokeWidth={2} />
              {p.perMin}
            </li>
          )}
        </ul>
      </div>
    </Rise>
  );
}

// ——— "Frank was built by Prelaunch.com" (the live page's closing visual, rebuilt). A warm cream card in the
// homepage cards' frame: the title (Prelaunch.com in the page's Lora italic) and the line about Prelaunch,
// then an orbit rising from the card's lower edge: Prelaunch.com at the centre as a white pill (its own
// bold wordmark, linking to prelaunch.com), two soft rings around it, and the seven brands that use
// Prelaunch on the rings' upper arcs, all in view at once. Each ring sways gently a few degrees and back
// (opposite ways), the logos staying upright. Only while the card is on screen; reduced motion: still. Logos:
// the same SVGs as prelaunch.com's "Trusted by" strip (logos/prelaunchBrands.js), all one grey via currentColor;
// each brand's height evens out their visual weight.
const Logo = ({ svg, h }) => (
  <span aria-hidden="true" className="flex items-center [&>svg]:h-full [&>svg]:w-auto" style={{ height: h }} dangerouslySetInnerHTML={{ __html: svg }} />
);
const BRANDS = {
  Bosch: { svg: PL_LOGOS.bosch, h: 20 },
  Ducati: { svg: PL_LOGOS.ducati, h: 18 },
  '3M': { svg: PL_LOGOS['3m'], h: 26 },
  Haier: { svg: PL_LOGOS.haier, h: 24 },
  Philips: { svg: PL_LOGOS.philips, h: 17 },
  'P&G': { svg: PL_LOGOS.pg, h: 27 },
  Audi: { svg: PL_LOGOS.audi, h: 24 },
};
// Two rings: diameter (px at full size), how long one sway takes, its direction, and the brands at fixed
// angles on the upper arc (degrees from the top, clockwise), so all seven are always in view.
const RINGS = [
  { d: 780, dur: 9, rev: false, brands: ['P&G', 'Ducati', 'Philips', '3M'], at: [-67, -24, 24, 67] },
  { d: 520, dur: 11, rev: true, brands: ['Haier', 'Bosch', 'Audi'], at: [-50, 0, 50] },
];

function BuiltBy({ reduce }) {
  const ref = useRef(null);
  const live = useInView(ref, { margin: '0px 0px -10% 0px' }) && !reduce;
  // "Prelaunch.com" gets the hero's hand-drawn lime marker, drawn once when the title comes into view
  // (and again on hover), like "tell Frank?" in the closing CTA.
  // A plain title (user rule, 2026-11-23: only the first section title after the hero is styled; here that is
  // the FAQ's "Common questions").
  const titleBox = useRef(null);
  return (
    <section aria-labelledby="pr-built-title" className="relative px-4 pb-[clamp(96px,11vw,160px)] md:px-10">
      <div ref={ref} className="relative overflow-hidden rounded-[32px] bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] md:rounded-[44px]"
        style={{ '--play': live ? 'running' : 'paused' }}>
        <div className="relative z-[1] mx-auto max-w-[720px] px-6 pt-[clamp(56px,6vw,88px)] text-center">
          <div ref={titleBox}>
            <ScrubTitle reduce={reduce} id="pr-built-title" className={'m-0 leading-[1.08] text-ink [text-wrap:balance] ' + TITLE}
              lines={['Frank was built by', 'Prelaunch.com']} />
          </div>
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[42ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
            an award-winning product validation platform trusted by over 1,000 brands globally.
          </ScrubText>
        </div>

        {/* The orbit: its centre is the Prelaunch pill's centre, 96px above the card's bottom edge; on smaller
            screens the rings scale down. */}
        <div className="relative mt-8 h-[310px] sm:h-[400px] lg:h-[530px]">
          <div className="absolute bottom-[96px] left-1/2 size-0 origin-center scale-[0.5] sm:scale-[0.72] lg:scale-100">
            {RINGS.map((r, k) => (
              <div key={r.d}
                className={'pr-ring absolute rounded-full ' + (r.rev ? 'rev' : '')}
                style={{ width: r.d, height: r.d, left: -r.d / 2, top: -r.d / 2, '--dur': r.dur + 's',
                  background: k === 1 ? 'radial-gradient(closest-side, rgba(255,255,255,0.8), rgba(255,255,255,0.5))' : 'radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0.2))',
                  boxShadow: 'inset 0 0 0 1px rgba(26,23,20,0.05)' }}>
                {r.brands.map((b, i) => {
                  const a = r.at[i];
                  return (
                    <div key={b} className="absolute left-1/2 top-1/2 hidden size-0 sm:block" style={{ transform: `rotate(${a}deg) translateY(${-r.d / 2}px) rotate(${-a}deg)` }}>
                      <div className={'pr-upright size-0 ' + (r.rev ? 'rev' : '')} style={{ '--dur': r.dur + 's' }}>
                        <span className="absolute left-0 top-0 inline-flex h-14 -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full bg-white px-6 text-[#8f897f] shadow-[0_0_0_1px_rgba(26,23,20,0.05),0_10px_24px_-14px_rgba(42,50,30,0.35)]">
                          <span className="sr-only">{b}</span><Logo {...BRANDS[b]} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Phones: the rings are too wide for the logos to ride them readably, so all seven sit as a wrapped
              group of smaller pills above Prelaunch.com (the rings stay as a quiet backdrop). */}
          <ul aria-label="Brands that use Prelaunch" className="absolute inset-x-4 top-2 m-0 flex list-none flex-wrap justify-center gap-2 p-0 sm:hidden">
            {Object.keys(BRANDS).map(b => (
              <li key={b} className="inline-flex h-11 items-center rounded-full bg-white px-4 text-[#8f897f] shadow-[0_0_0_1px_rgba(26,23,20,0.05),0_10px_24px_-14px_rgba(42,50,30,0.35)]">
                <span className="sr-only">{b}</span><Logo svg={BRANDS[b].svg} h={Math.round(BRANDS[b].h * 0.75)} />
              </li>
            ))}
          </ul>
          {/* Prelaunch.com at the centre. */}
          <a href="https://www.prelaunch.com" target="_blank" rel="noopener noreferrer"
            className={'group absolute bottom-[68px] left-1/2 inline-flex h-14 -translate-x-1/2 sm:bottom-[64px] items-center gap-2.5 rounded-full bg-white px-7 text-ink no-underline shadow-[0_0_0_1px_rgba(26,23,20,0.06),0_18px_40px_-18px_rgba(42,50,30,0.45)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 sm:h-16 sm:px-8 ' + FOCUS}>
            <span className="sr-only">Prelaunch.com</span>
            <span aria-hidden="true" className="flex h-[18px] items-center [&>svg]:h-full [&>svg]:w-auto sm:h-[21px]" dangerouslySetInnerHTML={{ __html: PL_LOGOS.prelaunch }} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  const reduce = !!useReducedMotion();
  const [yearly, setYearly] = useState(true);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Pricing" hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews' }} />
        <main id="main">
          {/* 1 — Hero: the green panel, framed like the homepage cards (16px / 40px from the window's edges,
              32 / 44px corners), starting under the header. The plan cards overlap its bottom edge. */}
          <section aria-labelledby="pr-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 pb-[clamp(170px,15vw,210px)] pt-[clamp(48px,5vw,72px)] text-center md:rounded-[44px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div className="relative mx-auto max-w-[860px]">
                <Rise reduce={reduce}><Eyebrow className="mb-6 !text-white/85 sm:mb-8">Pricing</Eyebrow></Rise>
                <Rise as="h1" reduce={reduce} delay={0.06} id="pr-title" className={'m-0 leading-[1.04] text-white [text-wrap:balance] ' + TITLE}>
                  <span className="block">Know what your customers</span><span className="block">actually think.</span>
                </Rise>
                <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-5 max-w-[50ch] font-sans text-[17px] leading-[1.55] text-white/70 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
                  AI-powered voice &amp; chat interviews that scale your customer research. Choose the plan that fits your team.
                </Rise>
                <Rise reduce={reduce} delay={0.22} className="mt-12 sm:mt-14">
                  <Billing yearly={yearly} onChange={setYearly} reduce={reduce} />
                </Rise>
              </div>
            </div>
          </section>

          {/* 2 — The plans, rising over the panel's bottom edge. */}
          <section aria-label="Plans" className="relative -mt-[clamp(130px,11vw,160px)] px-4 sm:px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((p, i) => <Plan key={p.id} p={p} yearly={yearly} reduce={reduce} lag={0.3 + i * 0.06} />)}
            </div>

            {/* 3 — Enterprise, as one wide card under the plans (the same white card, so it reads as the next
                step up): a small label, the question as its heading, the offer, and "Book a Demo" on the right.
                The student discount sits under the offer as a soft lime pill. No drop shadow, just a hairline. */}
            <Rise reduce={reduce} delay={0.55} className="mx-auto mt-10 max-w-[1312px] overflow-hidden rounded-[24px] bg-white sm:mt-12 shadow-[0_0_0_1px_rgba(26,23,20,0.07)]">
              <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-12">
                <div className="max-w-[640px]">
                  <p className={LBL + ' text-ink-3'}>Enterprise</p>
                  <h3 className="m-0 mt-3 font-['Figtree',sans-serif] text-[22px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[24px]">Need more than 950 minutes?</h3>
                  <p className="m-0 mt-2 font-sans text-[15px] leading-[1.55] text-ink-2 sm:text-[16px]">Our Enterprise plans offer custom minute pools, SSO, API integration, and dedicated support.</p>
                  <p className="m-0 mt-4 inline-flex items-center gap-2 rounded-full bg-[#f4fde6] py-1 pl-1 pr-3.5 font-sans text-[13.5px] leading-snug text-ink-2 ring-1 ring-inset ring-[#a0d05f]/35">
                    <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[#5f8f22]">
                      <GraduationCap className="size-[14px]" strokeWidth={1.5} />
                    </span>
                    Students get 50% off — verify your status to claim the discount.
                  </p>
                </div>
                <a href={DEMO} target="_blank" rel="noopener noreferrer"
                  className={'group inline-flex h-12 shrink-0 items-center gap-3 self-start rounded-full bg-[#1a1714] py-1.5 pl-5 pr-1.5 font-sans text-[15px] font-medium text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2a2622] active:scale-[0.98] md:self-center ' + FOCUS}>
                  Book a Demo
                  <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </span>
                </a>
              </div>
            </Rise>
          </section>

          {/* Common questions, in the homepage FAQ's two-column layout. */}
          <div className="pt-[clamp(112px,13vw,200px)]">
            <FAQ items={FAQS} label={null} lines={[<>Common <MarkedPhrase reduce={reduce}>questions</MarkedPhrase></>]} id="pr-faq-title" contact={false} />
          </div>

          {/* 4 — Who built Frank. */}
          <BuiltBy reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
