// WidgetSection (V21; from V19) — "Add Frank to your site in seconds. No code." The heading follows the other
// sections (label travels with the title; both columns end on one line). Below, a cream stage lets the
// visitor set Frank up the way they would: how he shows (in-line, floating, pop-up), in light (default) or
// dark, when (a page, a
// time, an event) and for whom (a segment), with a quiet line about the no-code installs under them.
// A small mock customer site (Halden, an online shoe store: a product page) shows the result live — the widget moves into
// place, and its question changes with the audience — and one plain sentence under it spells out the rule.
// The choices are native radio buttons (keyboard and screen readers work as usual); the mock is a
// picture of the result, described by that sentence. Reduced motion: the widget swaps without moving.
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AppWindow, FileText, LayoutPanelTop, MessageCircle, Mic, Moon, MousePointerClick, Repeat, ShoppingBag, ShoppingCart, Star, Sun, Tag, Timer, UserRoundPlus, X } from 'lucide-react';
import FrankGlasses from '../components/FrankGlasses';
import { TITLE, Eyebrow } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle, reveal, useScrubIn } from './reveal';
import { cornerGlowGrain } from '../components/grain';

export const MODES = [
  { id: 'inline', icon: LayoutPanelTop, label: 'In-line', says: 'shows in-line' },
  { id: 'floating', icon: MessageCircle, label: 'Floating', says: 'floats in the corner' },
  { id: 'popup', icon: AppWindow, label: 'Pop-up', says: 'pops up' },
];
export const THEMES = [
  { id: 'light', icon: Sun, label: 'Light', says: 'in light mode' },
  { id: 'dark', icon: Moon, label: 'Dark', says: 'in dark mode' },
];
export const WHEN = [
  { id: 'page', icon: FileText, label: 'On the product page', says: 'on the product page' },
  { id: 'time', icon: Timer, label: 'After 20 seconds', says: 'after someone has been on the page for 20 seconds' },
  { id: 'event', icon: MousePointerClick, label: 'On “Add to cart”', says: 'when someone clicks “Add to cart”' },
];
export const WHO = [
  { id: 'new', icon: UserRoundPlus, label: 'First-time visitors', says: 'for first-time visitors only', ask: 'What made you curious about this pair?' },
  { id: 'returning', icon: Repeat, label: 'Returning customers', says: 'for returning customers', ask: 'What brings you back to Halden today?' },
  { id: 'cart', icon: ShoppingCart, label: 'Left their cart', says: 'for people who left their cart last time', ask: 'What stopped you from checking out last time?' },
];
const EASE = [0.23, 1, 0.32, 1];

// Frank's question: when the audience changes, the new one fades in over the old (no jump).
const Ask = ({ ask, className }) => (
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.p key={ask} className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
      {ask}
    </motion.p>
  </AnimatePresence>
);

// One choice group: native radios dressed as light pills with a small line icon — a hairline outline;
// the chosen one gets a fine dark outline, a soft lift and a green icon rather than a solid fill.
function Choice({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2.5 p-0 font-sans text-[13px] font-medium text-ink-2">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map(o => (
          <label key={o.id} className="relative cursor-pointer">
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)}
              className="peer absolute inset-0 m-0 cursor-pointer opacity-0" />
            <span className="flex items-center gap-1.5 rounded-full bg-transparent py-1.5 pl-2.5 pr-3 font-sans text-[13px] text-ink-2 ring-1 ring-[#1a1714]/[0.12] transition-[background-color,color,box-shadow] duration-150 ease-out
              peer-hover:text-ink peer-hover:ring-[#1a1714]/20 peer-checked:bg-white peer-checked:text-ink peer-checked:ring-[#1a1714]/[0.28] peer-checked:shadow-[0_1px_3px_rgba(26,23,20,0.08)]
              peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              <o.icon aria-hidden="true" strokeWidth={1.6}
                className={'size-3.5 shrink-0 transition-colors duration-150 ' + (value === o.id ? 'text-[#5f8f22]' : 'text-ink-3')} />
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// The widget's two looks. Light (the default) suits most stores: a white card with a hairline and a
// soft shadow, Frank's glasses on a lime circle, an ink button. Dark: the same on near-black, lime button.
const SKIN = {
  light: {
    card: 'bg-white text-ink ring-1 ring-[#1a1714]/[0.08] shadow-[0_18px_44px_-18px_rgba(26,23,20,0.35)]',
    sub: 'text-ink-3', avatar: 'bg-[#d1f899]', glasses: '#1a1714',
    primary: 'bg-ink text-white', secondary: 'text-ink-3', close: 'text-ink-3',
  },
  dark: {
    card: 'bg-[#0e1016] text-white ring-1 ring-white/[0.06] shadow-[0_18px_44px_-18px_rgba(14,16,22,0.7)]',
    sub: 'text-white/55', avatar: 'bg-[#1c202b]', glasses: '#fffdf3',
    primary: 'bg-[#d1f899] text-ink', secondary: 'text-white/55', close: 'text-white/50',
  },
};

const Avatar = ({ k, size = 'size-9' }) => (
  <span className={'grid shrink-0 place-items-center rounded-full ' + size + ' ' + k.avatar}>
    <span className="block w-[62%]"><FrankGlasses pose="Curious" ink={k.glasses} follow={false} shift={false} blink /></span>
  </span>
);

// Frank as the visitor would meet him on the customer's site (pop-up and floating).
function FrankCard({ ask, theme = 'light', compact = false }) {
  const k = SKIN[theme];
  return (
    <div className={'relative rounded-[16px] font-sans ' + k.card + (compact ? ' p-3.5' : ' p-4')}>
      <X aria-hidden="true" className={'absolute right-3 top-3 size-3.5 ' + k.close} strokeWidth={2} />
      <div className="flex items-start gap-3 pr-5">
        <Avatar k={k} />
        <div className="min-w-0">
          <p className={'m-0 text-[10.5px] ' + k.sub}>Frank · Voice chat · 2 min</p>
          <Ask ask={ask} className="m-0 mt-0.5 font-serif text-[14.5px] leading-snug" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 pl-12">
        <span className={'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium ' + k.primary}>
          <Mic className="size-3" strokeWidth={2.25} />Start voice chat
        </span>
        <span className={'text-[11.5px] ' + k.secondary}>Not now</span>
      </div>
    </div>
  );
}

// Frank in-line: part of the page, so flat (a hairline, no floating shadow) and as wide as the column
// it sits in; the whole question shows, the button under it.
function FrankInline({ ask, theme = 'light' }) {
  const k = SKIN[theme];
  // A real border (inside the box), not a ring: the wrapper that animates the height clips anything
  // drawn outside it.
  const flat = theme === 'light' ? 'border border-solid border-[#1a1714]/[0.1] bg-[#fbfaf7] text-ink' : 'border border-solid border-white/[0.08] bg-[#0e1016] text-white';
  return (
    <div className={'rounded-[12px] p-3 font-sans ' + flat}>
      <div className="flex items-start gap-2.5">
        <Avatar k={k} size="size-7" />
        <div className="min-w-0">
          <p className={'m-0 text-[10px] ' + k.sub}>Frank · Voice chat · 2 min</p>
          <Ask ask={ask} className="m-0 mt-0.5 font-serif text-[13px] leading-snug" />
          <span className={'mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium ' + k.primary}>
            <Mic className="size-3" strokeWidth={2.25} />Start voice chat
          </span>
        </div>
      </div>
    </div>
  );
}

// Halden's product photos: one studio shot of the Wave Runner (white upper, aqua sole), with three
// close-up crops of it for the thumbnails, resized into public/widget.
const PHOTOS = { main: '/widget/sneaker-main.jpg', thumbs: ['/widget/sneaker-t1.jpg', '/widget/sneaker-t2.jpg', '/widget/sneaker-t3.jpg', '/widget/sneaker-t4.jpg'] };

// The customer's site: Halden's product page (an online shoe store), with Frank placed as chosen.
export function MockSite({ mode, ask, theme, reduce }) {
  const t = { duration: reduce ? 0.2 : 0.45, ease: EASE };
  const from = y => (reduce ? { opacity: 0 } : { opacity: 0, transform: `translateY(${y}px) scale(0.98)` });
  const to = { opacity: 1, transform: 'translateY(0px) scale(1)' };
  return (
    <div aria-hidden="true" className="relative h-[500px] overflow-hidden rounded-[16px] bg-white font-sans shadow-[0_24px_60px_-24px_rgba(26,23,20,0.35)] ring-1 ring-[#1a1714]/[0.06]">
      {/* Browser bar */}
      <div className="flex items-center gap-3 border-0 border-b border-solid border-[#1a1714]/[0.06] bg-[#f6f4ee] px-4 py-2.5">
        <span className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="size-2 rounded-full bg-[#ddd8cc]" />)}</span>
        <span className="flex-1 truncate rounded-full bg-white px-3 py-1 text-[11.5px] text-ink-3">halden.co/products/wave-runner</span>
      </div>
      {/* Page: Halden's product page for the Trail Runner — photo on the left, the buy box on the right. */}
      <div className="bg-[#134c3f] py-1 text-center text-[9.5px] tracking-[0.02em] text-white/90">Free shipping on orders over $100</div>
      <div className="px-5 pt-3.5">
        <div className="flex items-center gap-4 text-[11px] text-ink-2">
          <span className="text-[13px] font-semibold tracking-[0.18em] text-ink">HALDEN</span>
          <span className="hidden gap-3.5 sm:flex"><span>Men</span><span>Women</span><span>New in</span><span>Stories</span></span>
          <span className="relative ml-auto"><ShoppingBag className="size-4 text-ink" strokeWidth={1.75} />
            <span className="absolute -right-1.5 -top-1 grid size-3.5 place-items-center rounded-full bg-[#134c3f] text-[8px] text-white">1</span></span>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
          {/* Photo and thumbnails */}
          <div>
            <div className="relative grid aspect-[3/2] place-items-center overflow-hidden rounded-[12px] bg-[radial-gradient(120%_90%_at_50%_30%,#f6f7f9_0%,#e6e9ee_70%,#dde1e7_100%)]">
              <span className="absolute left-2 top-2 z-10 rounded-full bg-white px-1.5 py-[1px] text-[9px] font-medium text-[#134c3f]">Sale</span>
              <img src={PHOTOS.main} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {PHOTOS.thumbs.map((src, i) => (
                <img key={src} src={src} alt="" className={'block aspect-square w-full rounded-[8px] object-cover ' + (i === 0 ? 'ring-1 ring-[#134c3f] ring-offset-1' : '')} />
              ))}
            </div>
          </div>
          {/* Buy box */}
          <div className="text-ink">
            {/* In-line: Frank sits in the buy box, above the product name, as wide as the column. */}
            <AnimatePresence initial={false}>
              {mode === 'inline' && (
                <motion.div key="inline" className="overflow-hidden"
                  initial={{ ...from(6), height: 0 }} animate={{ ...to, height: 'auto' }} exit={{ ...from(0), height: 0 }} transition={t}>
                  <div className="pb-3"><FrankInline ask={ask} theme={theme} /></div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Name and rating on one line: the rating is one star and the score, with the count kept quiet. */}
            <div className="flex items-baseline justify-between gap-2">
              <p className="m-0 text-[18px] font-semibold tracking-[-0.02em]">Wave Runner</p>
              <p className="m-0 inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-ink">
                <Star className="size-3 text-[#134c3f]" fill="currentColor" strokeWidth={0} />4.8
                <span className="font-normal text-ink-3">(212)</span>
              </p>
            </div>
            <p className="m-0 mt-2 flex items-baseline gap-1.5 text-[16px] font-medium">$128 <span className="text-[11px] font-normal text-ink-3 line-through">$160</span></p>
            <p className="m-0 mt-2.5 text-[10px] text-ink-2">Colour: Cloud</p>
            <div className="mt-1.5 flex gap-1.5">
              {['linear-gradient(180deg,#f7f5f6 0%,#f7f5f6 55%,#a9dbe0 56%,#8fcfd6 100%)', '#e8e0d2', '#1f1d1b'].map((c, i) => (
                <span key={i} className={'size-4 rounded-full ring-1 ring-[#1a1714]/10 ' + (i === 0 ? 'outline outline-1 outline-offset-2 outline-[#134c3f]' : '')} style={{ background: c }} />
              ))}
            </div>
            {/* Sizes as a grid of boxes (one sold out; the picked one in the store's dark mint, like the picked
                thumbnail and colour), then the button, with the same corner radius. */}
            <div className="mt-2.5 flex items-baseline justify-between text-[10px]">
              <span className="text-ink-2">Size (US)</span>
              <span className="text-ink-3 underline decoration-[#1a1714]/25 underline-offset-2">Size guide</span>
            </div>
            <div className="mt-1.5 grid grid-cols-5 gap-1">
              {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'].map(z => (
                <span key={z} className={'rounded-[6px] py-1 text-center text-[10px] ring-1 '
                  + (z === '9' ? 'bg-[#e3efea] font-medium text-[#134c3f] ring-[#134c3f]' : z === '10.5' ? 'text-ink-3/60 line-through ring-[#1a1714]/[0.08]' : 'ring-[#1a1714]/15')}>{z}</span>
              ))}
            </div>
            <span className="mt-2.5 block rounded-[6px] bg-[#134c3f] py-2 text-center text-[11px] text-white">Add to cart</span>

          </div>
        </div>

      </div>

      {/* Floating: a bubble in the corner. */}
      <AnimatePresence>
        {mode === 'floating' && (
          <motion.div key="floating" className="absolute bottom-4 right-4 w-[270px]" initial={from(16)} animate={to} exit={from(16)} transition={t}>
            <FrankCard ask={ask} theme={theme} compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up: the page dims a little (the store stays readable behind him), Frank in the middle. */}
      <AnimatePresence>
        {mode === 'popup' && (
          <motion.div key="popup" className="absolute inset-0 grid place-items-center bg-[#1a1714]/[0.14] p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <motion.div className="w-[min(340px,100%)]" initial={from(12)} animate={to} exit={from(8)} transition={t}>
              <FrankCard ask={ask} theme={theme} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The rule, as a header over the site: "Live on halden.co" on the left, one token per choice on the
// right, no box of its own (the site under it is the card). A token swaps in place when its setting
// changes, so the header answers the click on the left.
function RuleBar({ picks, reduce }) {
  return (
    <div aria-hidden="true" className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-sans">
      <span className="inline-flex items-center gap-2 whitespace-nowrap pl-1 text-[13px] text-ink-2">
        <span className="relative flex size-2">
          {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-[#a0d05f] opacity-60" />}
          <span className="relative size-2 rounded-full bg-[#7fb63c]" />
        </span>
        Live on halden.co
      </span>
      <span className="flex flex-wrap items-center gap-1.5">
        {picks.map((o, i) => (
          <AnimatePresence key={i} mode="popLayout" initial={false}>
            <motion.span key={o.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(4px)' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-4px)' }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white py-1 pl-2 pr-2.5 text-[12.5px] text-ink ring-1 ring-[#1a1714]/[0.08]">
              <o.icon className="size-3.5 text-[#5f8f22]" strokeWidth={1.75} />{o.label}
            </motion.span>
          </AnimatePresence>
        ))}
      </span>
    </div>
  );
}

export default function WidgetSection() {
  const reduce = !!useReducedMotion();
  const head = useRef(null);
  const stage = useRef(null);
  const scrub = useScrubIn(stage, reduce);
  // Each settings group rises 12px into place, 60 ms after the one above, once the stage is in view.
  const settle = i => reveal(reduce, 0.15 + i * 0.06, { y: 12, amount: 0.4 });
  const [mode, setMode] = useState('floating');
  const [theme, setTheme] = useState('light');
  const [when, setWhen] = useState('page');
  const [who, setWho] = useState('cart');
  const m = MODES.find(x => x.id === mode), w = WHEN.find(x => x.id === when), p = WHO.find(x => x.id === who), th = THEMES.find(x => x.id === theme);
  const rule = `Frank ${m.says} ${th.says} ${w.says}, ${p.says}.`;

  return (
    <section aria-labelledby="wg-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div ref={head} className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20">
          <div>
            <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Widget</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id="wg-title" className={'m-0 leading-[1.04] text-ink ' + TITLE}
              lines={['Add Frank to your site', 'in seconds. No code.']} />
          </div>
          <ScrubText reduce={reduce} lag={0.2} offset={END_OFFSET} className="max-w-[48ch] text-[17px] leading-[1.55] text-ink-2 sm:text-[18px]">
            <p className="m-0">Add Frank to your site in seconds through Google Tag Manager or Shopify. Without writing a single line of code, Frank can be embedded in-line, appear as a floating widget, or pop-up based on the page, time events, and more.</p>
            <p className="m-0 mt-4">You can even narrow down who sees it, so Frank only interviews the relevant segments you want to hear from!</p>
          </ScrubText>
        </div>

        {/* The stage: set Frank up on the left, see him on the customer's site on the right. It rises
            and grows in with the scroll; inside, the settings follow each other 60 ms apart. */}
        <motion.div ref={stage} style={scrub}
          className="relative mt-[clamp(36px,5vw,64px)] overflow-hidden rounded-[22px] bg-[#fffdf3] p-5 ring-1 ring-[#1a1714]/[0.06] sm:rounded-[28px] sm:p-8 lg:p-12">
          {/* A faint grainy yellow glow in the stage's top-right corner. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cornerGlowGrain} />
          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
            <div>
              <div className="space-y-6">
                <motion.div {...settle(0)}><Choice legend="Show Frank" name="wg-mode" options={MODES} value={mode} onChange={setMode} /></motion.div>
                <motion.div {...settle(1)}><Choice legend="Theme" name="wg-theme" options={THEMES} value={theme} onChange={setTheme} /></motion.div>
                <motion.div {...settle(2)}><Choice legend="When" name="wg-when" options={WHEN} value={when} onChange={setWhen} /></motion.div>
                <motion.div {...settle(3)}><Choice legend="Who sees it" name="wg-who" options={WHO} value={who} onChange={setWho} /></motion.div>
              </div>
              <motion.p {...settle(4)} className="m-0 mt-7 border-0 border-t border-solid border-[#1a1714]/[0.08] pt-5 font-sans text-[13px] leading-[1.7] text-ink-3">
                Installs with{' '}
                <span className="whitespace-nowrap text-ink-2"><Tag className="mr-1 inline size-3.5 align-[-2px]" strokeWidth={1.5} aria-hidden="true" />Google Tag Manager</span>
                {' '}or{' '}
                <span className="whitespace-nowrap text-ink-2"><ShoppingBag className="mr-1 inline size-3.5 align-[-2px]" strokeWidth={1.5} aria-hidden="true" />Shopify</span>. <span className="whitespace-nowrap">No code.</span>
              </motion.p>
            </div>
            {/* The mock site, at most 700px wide, against the right edge of its column. */}
            <div className="ml-auto w-full max-w-[700px]">
              <RuleBar picks={[m, th, w, p]} reduce={reduce} />
              <MockSite mode={mode} ask={p.ask} theme={theme} reduce={reduce} />
              <p className="sr-only" aria-live="polite">{rule}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
