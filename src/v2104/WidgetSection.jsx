// WidgetSection (V21.1) — "Add Frank to your site in seconds. No code." The calm version: one idea,
// shown once, clearly. V21 put eleven setting pills, a rule bar and a fully detailed shop around the
// widget; here the shop recedes: a real, believable product page set at low contrast, so Frank's
// widget is the one crisp thing in the frame. Each time he lands in a placement, a faint neutral
// ring eases out from his card once. One control picks where he appears — in-line, floating
// or pop-up — and the widget itself glides and reshapes between those places (a shared-layout move,
// not a fade-swap; a smooth ease-in-out glide), and the product details slide aside to make room for
// him in-line. While the frame is in view the tabs change themselves every 3.5s, a thin line filling
// across the active tab as the countdown; a click picks a tab and restarts the countdown. When and who-sees-it stay in the paragraph above.
// Reduced motion: no cycling, no gliding (placements switch in place).
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion';
import { AppWindow, LayoutPanelTop, MessageCircle, Mic, Moon, ShoppingBag, Sun, Tag } from 'lucide-react';
import FrankGlasses from '../components/FrankGlasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle, useScrubIn } from './reveal';
import { cornerGlowGrain } from '../components/grain';

const MODES = [
  { id: 'inline', icon: LayoutPanelTop, label: 'In-line', says: 'in-line, in the product column' },
  { id: 'floating', icon: MessageCircle, label: 'Floating', says: 'as a floating bubble in the corner' },
  { id: 'popup', icon: AppWindow, label: 'Pop-up', says: 'as a pop-up' },
];
const THEMES = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
];
const ASK = 'What stopped you from checking out last time?';
const EASE = [0.23, 1, 0.32, 1];
// The placement move: a gentle ease-in-out glide, no bounce (easeInOutCubic, easings.net).
const GLIDE = { duration: 0.7, ease: [0.65, 0, 0.35, 1] };
const CYCLE_MS = 3500;

const SKIN = {
  light: { card: 'bg-white text-ink ring-1 ring-[#1a1714]/[0.08] shadow-[0_1px_1px_rgba(26,23,20,0.03),0_2px_4px_rgba(26,23,20,0.03),0_8px_16px_-4px_rgba(26,23,20,0.04),0_24px_48px_-12px_rgba(26,23,20,0.06),0_48px_96px_-24px_rgba(26,23,20,0.08)]',
    sub: 'text-ink-3', avatar: 'bg-[#d1f899]', glasses: '#1a1714', primary: 'bg-ink text-white', secondary: 'text-ink-3' },
  // Dark: a lifted surface, lighter than the dark store behind it, with a clear light edge and a deep
  // shadow, so it stands out on a dark page.
  dark: { card: 'bg-[#262a33] text-white ring-1 ring-white/[0.16] shadow-[0_22px_50px_-16px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.35)]',
    sub: 'text-white/60', avatar: 'bg-[#343945]', glasses: '#fffdf3', primary: 'bg-[#d1f899] text-ink', secondary: 'text-white/55' },
};

// Frank's widget. One element (layoutId) wherever it sits, so a placement change moves it rather
// than swapping it; its content waits inside the clipped box and fades in as the move settles.
function FrankWidget({ mode, theme, reduce, className = '' }) {
  const k = SKIN[theme];
  return (
    <motion.div layoutId="wg-frank"
      // Landing: a faint neutral ring eases out from the card's edge and fades, once, after the glide.
      initial={reduce ? false : { outlineColor: 'rgba(26,23,20,0.07)', outlineOffset: '0px' }}
      animate={reduce ? undefined : { outlineColor: 'rgba(26,23,20,0)', outlineOffset: '6px' }}
      transition={{ layout: reduce ? { duration: 0 } : GLIDE, default: { duration: 1.2, ease: EASE, delay: 0.5 } }}
      // The radius is given to Motion (not only the class), so the corners stay round while the card
      // changes size mid-glide.
      style={{ borderRadius: 16 }}
      className={'overflow-hidden rounded-[16px] p-3.5 font-sans outline outline-[2px] outline-transparent transition-[background-color,color] duration-200 ease-[ease] ' + k.card + ' ' + className}>
      {/* The card clips its content, and the content fades in over the second half of the glide, once
          the box is nearly its new size: nothing shows outside the box while it resizes. */}
      <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease: EASE, delay: 0.4 }}>
      <div className="flex items-start gap-3">
        <span className={'grid size-8 shrink-0 place-items-center rounded-full ' + k.avatar}>
          <span className="block w-[62%]"><FrankGlasses pose="Curious" ink={k.glasses} follow={false} shift={false} blink reducedMotion={reduce} /></span>
        </span>
        <div className="min-w-0">
          <p className={'m-0 text-[10.5px] ' + k.sub}>Frank · Voice chat · 2 min</p>
          <p className="m-0 mt-0.5 font-serif text-[14px] leading-snug">{ASK}</p>
        </div>
      </div>
      {/* The actions, together at the end of the card: "Not now" right beside "Start voice chat". */}
      <div className="mt-3 flex items-center justify-end gap-4">
        <span className={'text-[11px] ' + k.secondary}>Not now</span>
        <span className={'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ' + k.primary}>
          <Mic className="size-3" strokeWidth={2.25} />Start voice chat
        </span>
      </div>
      </motion.div>
    </motion.div>
  );
}

// The store, quietly: real words and controls, all at low contrast, so they read as context. It
// follows the widget's theme: light, or a dark store when the widget is dark (colours cross-fade).
const FADE = 'transition-[background-color,color,border-color] duration-300 ease-[ease]';
const STORE = {
  light: {
    shell: 'bg-[#f7f6f2] ring-[#1a1714]/[0.08]', page: 'bg-white ring-[#1a1714]/[0.06]', dot: 'bg-[#1a1714]/[0.12]',
    url: 'bg-white text-ink-3 ring-[#1a1714]/[0.05]', brand: 'text-[#1a1714]/70', mute: 'text-[#1a1714]/45', icon: 'text-[#1a1714]/50',
    photo: 'bg-[#f1efea]', name: 'text-[#1a1714]/75', price: 'text-[#1a1714]/60', was: 'text-[#1a1714]/35',
    swatchRing: 'ring-[#1a1714]/10', picked: 'outline-[#134c3f]/60', thumbRing: 'ring-[#134c3f]/50 ring-offset-white',
    cta: 'bg-[#134c3f]/80 text-white/90',
  },
  dark: {
    shell: 'bg-[#1c1f25] ring-white/[0.08]', page: 'bg-[#15171c] ring-white/[0.06]', dot: 'bg-white/[0.14]',
    url: 'bg-[#15171c] text-white/45 ring-white/[0.06]', brand: 'text-white/75', mute: 'text-white/45', icon: 'text-white/55',
    photo: 'bg-[#1c1f25]', name: 'text-white/80', price: 'text-white/65', was: 'text-white/35',
    swatchRing: 'ring-white/15', picked: 'outline-[#7fd1b4]/70', thumbRing: 'ring-[#7fd1b4]/60 ring-offset-[#15171c]',
    cta: 'bg-[#2a7a63] text-white/95',
  },
};
const PHOTOS = ['/widget/sneaker-t1.jpg', '/widget/sneaker-t2.jpg', '/widget/sneaker-t3.jpg'];

function QuietStore({ mode, theme, reduce }) {
  const t = STORE[theme];
  return (
    // The browser, the same as the Agentic workflow's (after Frank Components node 2226:248): a flat shell
    // with three dots and the address pill in its top strip, and the store as a panel inset 6px inside it,
    // its corners concentric with the shell's (24px outside, 18px inside).
    <div aria-hidden="true" className={'rounded-[24px] p-1.5 ring-1 shadow-[0_1px_1px_rgba(26,23,20,0.03),0_2px_4px_rgba(26,23,20,0.03),0_8px_16px_-4px_rgba(26,23,20,0.04),0_24px_48px_-12px_rgba(26,23,20,0.06),0_48px_96px_-24px_rgba(26,23,20,0.08)] ' + FADE + ' ' + t.shell}>
      <div className="flex items-center gap-3 px-2.5 pb-2 pt-1 sm:px-3">
        <span className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className={'size-2 rounded-full ' + FADE + ' ' + t.dot} />)}</span>
        <span className={'min-w-0 flex-1 truncate rounded-full px-3 py-[5px] font-sans text-[11.5px] ring-1 ' + FADE + ' ' + t.url}>halden.co/products/wave-runner</span>
      </div>
      <div className={'relative h-[400px] overflow-hidden rounded-[18px] ring-1 sm:h-[420px] ' + FADE + ' ' + t.page}>
      <div className="px-5 pt-4 font-sans">
        {/* Nav */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className={'text-[12px] font-semibold tracking-[0.18em] ' + FADE + ' ' + t.brand}>HALDEN</span>
          <span className={'hidden gap-3.5 sm:flex ' + FADE + ' ' + t.mute}><span>Men</span><span>Women</span><span>New in</span></span>
          <ShoppingBag className={'ml-auto size-4 ' + FADE + ' ' + t.icon} strokeWidth={1.6} />
        </div>
        <div className="mt-5 grid gap-6 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div>
            <div className={'relative aspect-[4/3] overflow-hidden rounded-[12px] ' + FADE + ' ' + t.photo}>
              <img src="/widget/sneaker-main.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="mt-2 hidden grid-cols-3 gap-2 sm:grid">
              {PHOTOS.map((src, i) => (
                <img key={src} src={src} alt="" className={'block aspect-[4/3] w-full rounded-[8px] object-cover ' + (i ? 'opacity-60' : 'ring-1 ring-offset-1 ' + t.thumbRing)} />
              ))}
            </div>
          </div>
          <div>
            {/* In-line: Frank sits at the top of the product column. */}
            {mode === 'inline' && <FrankWidget mode={mode} theme={theme} reduce={reduce} className="mb-4" />}
            {/* The product details slide down (and back up) with the same glide as Frank arrives in
                the column, rather than jumping. */}
            <motion.div layout="position" transition={reduce ? { duration: 0 } : GLIDE}>
            <p className={'m-0 text-[19px] font-semibold tracking-[-0.02em] ' + FADE + ' ' + t.name}>Wave Runner</p>
            <p className={'m-0 mt-1 text-[15px] font-medium ' + FADE + ' ' + t.price}>$128 <span className={'text-[12px] font-normal line-through ' + t.was}>$160</span></p>
            <p className={'m-0 mt-3 max-w-[34ch] text-[12px] leading-[1.55] ' + FADE + ' ' + t.mute}>A light everyday runner with a cushioned, wave-shaped sole.</p>
            <p className={'m-0 mt-4 text-[11px] ' + FADE + ' ' + t.mute}>Colour: Cloud</p>
            <div className="mt-2 flex gap-2">
              {['linear-gradient(180deg,#f7f5f6 0%,#f7f5f6 55%,#a9dbe0 56%,#8fcfd6 100%)', '#e8e0d2', '#1f1d1b'].map((c, i) => (
                <span key={i} className={'size-5 rounded-full ring-1 ' + t.swatchRing + ' ' + (i === 0 ? 'outline outline-1 outline-offset-2 ' + t.picked : 'opacity-80')} style={{ background: c }} />
              ))}
            </div>
            <span className={'mt-3 block rounded-[8px] py-2 text-center text-[12px] ' + FADE + ' ' + t.cta}>Add to cart</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating: a bubble in the corner. */}
      {mode === 'floating' && <FrankWidget mode={mode} theme={theme} reduce={reduce} className="absolute bottom-4 right-4 w-[min(270px,calc(100%-32px))]" />}

      {/* Pop-up: the page dims a little, Frank in the middle. */}
      <AnimatePresence>
        {mode === 'popup' && (
          <motion.div key="dim" className="absolute inset-0 bg-[#1a1714]/[0.14]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: EASE }} />
        )}
      </AnimatePresence>
      {mode === 'popup' && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <FrankWidget mode={mode} theme={theme} reduce={reduce} className="w-[min(320px,100%)]" />
        </div>
      )}
      </div>
    </div>
  );
}

// A segmented control over native radios; the white marker slides to the chosen option.
// progress: { key, ms } draws a thin line along the very bottom of the active option, filling over ms
// (the auto-tour's countdown; the pill's rounded clip shapes its ends); key restarts it.
function Segmented({ name, label, options, value, onChange, iconOnly = false, progress = null }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <div className="relative flex rounded-full bg-[#1a1714]/[0.05] p-1">
        {options.map(o => {
          const on = value === o.id;
          return (
            <label key={o.id} className="relative cursor-pointer">
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)}
                aria-label={iconOnly ? o.label : undefined} className="peer absolute inset-0 m-0 cursor-pointer opacity-0" />
              {on && <motion.span layoutId={name + '-marker'} transition={{ duration: 0.25, ease: EASE }}
                className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-[0_1px_3px_rgba(26,23,20,0.12)] ring-1 ring-[#1a1714]/[0.06]">
                {progress && (
                  <motion.span key={progress.key} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#8fc24f]"
                    initial={{ transform: 'scaleX(0)' }} animate={{ transform: 'scaleX(1)' }} transition={{ duration: progress.ms / 1000, ease: 'linear' }} />
                )}
              </motion.span>}
              <span className={'relative flex items-center gap-1.5 rounded-full font-sans text-[13.5px] transition-colors duration-150 ease-out peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink '
                + (iconOnly ? 'px-2.5 py-2 ' : 'py-2 pl-3 pr-4 ') + (on ? 'text-ink' : 'text-ink-3 hover:text-ink-2')}>
                <o.icon aria-hidden="true" className={'size-4 ' + (on ? 'text-[#5f8f22]' : '')} strokeWidth={1.7} />
                {!iconOnly && o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function WidgetSection() {
  const reduce = !!useReducedMotion();
  const stage = useRef(null);
  const scrub = useScrubIn(stage, reduce);
  const [mode, setMode] = useState('floating');
  const [theme, setTheme] = useState('light');
  // The tabs change themselves: every CYCLE_MS while the frame is in view, the next placement. A click
  // picks one and restarts the countdown from there (round bumps, so even the same tab restarts it).
  const inView = useInView(stage, { amount: 0.5 });
  const [round, setRound] = useState(0);
  const touring = inView && !reduce;
  useEffect(() => {
    if (!touring) return;
    const id = setTimeout(() => {
      setMode(m => MODES[(MODES.findIndex(x => x.id === m) + 1) % MODES.length].id);
      setRound(r => r + 1);
    }, CYCLE_MS);
    return () => clearTimeout(id);
  }, [touring, round]);
  const pick = id => { setMode(id); setRound(r => r + 1); };
  const m = MODES.find(x => x.id === mode);

  return (
    <section aria-labelledby="wg-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20">
          <div>
            <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">No-code integration</Eyebrow></ScrubText>
            <ScrubTitle reduce={reduce} id="wg-title" className={'m-0 leading-[1.04] text-ink ' + TITLE}
              lines={['Add Frank to your site', 'in seconds']} />
            <ScrubText as="p" reduce={reduce} lag={0.1} className={'mb-0 max-w-[40ch] mt-6 ' + SUBTITLE}>
              Send Frank out as an email, or add Frank to your site in seconds.
            </ScrubText>
          </div>
          <ScrubText reduce={reduce} lag={0.2} offset={END_OFFSET} className="max-w-[48ch] text-[17px] leading-[1.55] text-ink-2 sm:text-[18px]">
            <p className="m-0">Add Frank to your site in seconds through Google Tag Manager or Shopify. Without writing a single line of code, Frank can be embedded in-line, appear as a floating widget, or pop-up based on the page, time events, and more.</p>
            <p className="m-0 mt-4">You can even narrow down who sees it, so Frank only interviews the relevant segments you want to hear from!</p>
          </ScrubText>
        </div>

        {/* The stage: one control, the quiet store, the install line. */}
        <motion.div ref={stage} style={scrub}
          className="relative mt-[clamp(36px,5vw,64px)] overflow-hidden rounded-[22px] bg-[#fffdf3] px-4 py-8 ring-1 ring-[#1a1714]/[0.06] sm:rounded-[28px] sm:px-8 sm:py-12 lg:py-14">
          {/* A faint grainy yellow glow in the stage's top-right corner. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cornerGlowGrain} />
          <div className="relative mx-auto max-w-[880px]">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Segmented name="wg-mode" label="Where Frank appears" options={MODES} value={mode} onChange={pick}
                progress={touring ? { key: round, ms: CYCLE_MS } : null} />
              <Segmented name="wg-theme" label="Widget theme" options={THEMES} value={theme} onChange={setTheme} iconOnly />
            </div>
            <div className="mt-6 sm:mt-8">
              <LayoutGroup id="wg">
                <QuietStore mode={mode} theme={theme} reduce={reduce} />
              </LayoutGroup>
            </div>
            <p className="m-0 mt-6 text-center font-sans text-[14px] leading-[1.7] text-ink-3">
              Installs with{' '}
              <span className="whitespace-nowrap text-ink-2"><Tag className="mr-1 inline size-3.5 align-[-2px]" strokeWidth={1.5} aria-hidden="true" />Google Tag Manager</span>
              {' '}or{' '}
              <span className="whitespace-nowrap text-ink-2"><ShoppingBag className="mr-1 inline size-3.5 align-[-2px]" strokeWidth={1.5} aria-hidden="true" />Shopify</span>. No code.
            </p>
            <p className="sr-only" aria-live="polite">Frank shows {m.says}, in {theme} mode.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
