// V20 — V19, where the visitor can do more than chat. Under the chat and its template pills, a
// dark "incoming call" bar from Frank offers a live interview: the visitor plays the customer in
// a two-minute voice interview (LiveInterview). The light chat is for asking Frank; the dark bar
// is for talking to him, and it opens the dark call room. The sections below are V19's.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import FrankGlasses from '../components/FrankGlasses';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import HeroHeadline, { HEADLINE_DONE } from '../v3/HeroHeadline';
import DockingInput, { useSlotOutOfView } from '../v8/DockingInput';
import LineBurst from '../v9/LineBurst';
import LogoStrip from '../v9/LogoStrip';
import DockGlasses from '../v9/DockGlasses';
import ParticleSphere from '../components/ParticleSphere';
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero';
import Glasses from '../v3/Glasses';
import WhatIsFrank from '../components/WhatIsFrank';
import HowItWorks from '../v19/HowItWorks';
import LiveInterview from './LiveInterview';

// The examples the chat box types out, one after another.
const PROMPTS = [
  'Why do trial users leave before day 7?',
  'Why are shoppers abandoning checkout at shipping?',
  'What do power users love that we’re underselling?',
  'Is our new pricing page confusing anyone?',
];

const STAGE = '#FFFDF3';  // tunnel + hero share one cream stage
const PAGE = '#ffffff';

// Eight notes, all real video calls: licensed Envato clips cut to 8 s muted loops in the 4:5 card
// shape, with the quote as a caption over the bottom of the picture.
const clip = (n) => ({
  card: `/videos/call-${n}-card.mp4`, wide: `/videos/call-${n}-h.mp4`,
  cardPoster: `/videos/call-${n}-card.jpg`, widePoster: `/videos/call-${n}-h.jpg`,
});
const V20_ITEMS = [
  { quote: 'I gave up halfway through checkout — there were too many steps.', type: 'problem', author: 'Maya Lindqvist', role: 'Online shopper', media: 'call', clip: clip('01'), shape: 'card' },
  { quote: "Honestly, I'd pay more if setup took five minutes instead of a week.", type: 'thought', author: 'Tomás Herrera', role: 'Founder, 12-person team', media: 'call', clip: clip('02'), shape: 'card', restShift: { y: -70 } },
  { quote: "I never know which plan I'm on until the invoice arrives.", type: 'problem', author: 'Grace Whitfield', role: 'Finance lead', media: 'call', clip: clip('04'), shape: 'card' },
  { quote: 'I wish I could see what my team already tried before starting.', type: 'thought', author: 'Daniel Okafor', role: 'Product manager', media: 'call', clip: clip('05'), shape: 'card' },
  { quote: "If search understood what I meant, I'd stop asking colleagues.", type: 'thought', author: 'Lukas Brandt', role: 'Support engineer', media: 'call', clip: clip('03'), shape: 'card', restShift: { y: -70 } },
  { quote: 'We lost a week of feedback because the survey link expired.', type: 'problem', author: 'Sofia Marchetti', role: 'UX researcher', media: 'call', clip: clip('06'), shape: 'card' },
  { quote: 'Every report needs exporting to Excel before anyone can read it.', type: 'problem', author: 'Priya Raman', role: 'Ops analyst', media: 'call', clip: clip('08'), shape: 'card' },
  { quote: 'Half our onboarding calls are spent re-explaining the same setup steps.', type: 'problem', author: 'Marcus Bell', role: 'Onboarding manager', media: 'call', clip: clip('07'), shape: 'card' },
];

export default function AppV20() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
  const [slotEl, setSlotEl] = useState(null);
  const [heroEl, setHeroEl] = useState(null);
  const [status, setStatus] = useState({});
  const [hovered, setHovered] = useState(null);
  const [flash, setFlash] = useState('');
  const [react, setReact] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const flashTimer = useRef(0);
  const clearActive = useCallback(() => setActiveId(null), []);
  // The live interview; focus goes back to the call bar when it closes.
  const [interview, setInterview] = useState(false);
  const callBar = useRef(null);
  const closeInterview = useCallback(() => { setInterview(false); requestAnimationFrame(() => callBar.current?.focus()); }, []);

  const pick = useCallback(p => {
    setActiveId(p.id);
    input.current?.fill(p.prompt);
    clearTimeout(flashTimer.current);
    setFlash('Insight');
    flashTimer.current = setTimeout(() => setFlash(''), 1400);
  }, []);
  useEffect(() => { if (status.phase === 'ready') setReact(n => n + 1); }, [status.phase]);
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const pose = flash
    || (status.phase === 'drafting' ? 'Thinking'
      : status.phase === 'ready' ? 'Agreeing'
      : status.listening ? 'Listening'
      : hovered ? 'Curious'
      : status.hasText ? 'Listening'
      : status.focused ? 'Attentive'
      : 'Ready');

  const docked = useSlotOutOfView(slotEl);

  // Scroll through the pinned run (600svh tall, so the notes fly slowly):
  //   0–0.58    the tunnel flies; 0.52–0.64 the chat screen rises in;
  //   0.65      catch + hold on the chat screen; 0.65–0.78 it stays put (dwell);
  //   0.78–0.94 the chat screen wraps into a rounded card; then the card scrolls away.
  const run = useRef(null);
  const { scrollYProgress } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.6, restDelta: 0.0005 });
  const tunnelProgress = useTransform(p, [0, 0.58], [0, 1], { clamp: true });
  const tunnelOpacity = useTransform(p, [0.54, 0.64], [1, 0], { clamp: true });
  const heroIn = useTransform(p, [0.52, 0.64], [0, 1], { clamp: true });
  const heroScale = useTransform(heroIn, [0, 1], [reduced ? 1 : 0.94, 1]);
  // Card wrap (as in V12): the stage gains an even margin and rounded corners, content shrinks a touch.
  const wrap = useTransform(p, [0.78, 0.94], [0, 1], { clamp: true });
  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => { const on = () => setVw(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const margin = vw < 768 ? 16 : 40, RADIUS = 44;
  const stageClip = useTransform(wrap, w => `inset(${(margin * w).toFixed(2)}px round ${(RADIUS * w).toFixed(2)}px)`);
  const stageContentScale = useTransform(wrap, [0, 1], [1, reduced ? 1 : 0.93]);

  const [heroLive, setHeroLive] = useState(false);     // hero interactive (and in the a11y tree)
  // Navigation through the scene: normal at the very top; hidden while flying through the tunnel;
  // back as a bare nav row (no background, no announcement) once the chat screen has arrived;
  // normal again after the scene.
  const [inScene, setInScene] = useState(true);
  const [atTop, setAtTop] = useState(true);
  useMotionValueEvent(scrollYProgress, 'change', v => setInScene(v < 0.995));
  const { scrollY: pageY } = useScroll();
  useMotionValueEvent(pageY, 'change', y => setAtTop(y < 40));
  // Arrival: once the chat screen is fully in, the sphere assembles and the headline reveals —
  // replayed on every arrival (going back into the tunnel resets them).
  const [arrivals, setArrivals] = useState(0);
  const [arrived, setArrived] = useState(false);
  const arrivedRef = useRef(false);
  useMotionValueEvent(heroIn, 'change', v => {
    setHeroLive(v > 0.5);
    if (v > 0.9 && !arrivedRef.current) { arrivedRef.current = true; setArrived(true); setArrivals(n => n + 1); }
    else if (v < 0.05 && arrivedRef.current) { arrivedRef.current = false; setArrived(false); }
  });
  // Catch the chat screen: scrolling down into it (even a fast flick or trackpad momentum) stops
  // on it and holds. It releases only after HOLD_MS *and* once the scroll input has gone quiet
  // (trackpad momentum finished), so moving on needs a fresh, deliberate scroll. Once per pass;
  // scrolling back up into the tunnel re-arms it. An overshoot snaps back to the chat screen.
  useEffect(() => {
    const el = run.current; if (!el) return;
    const HOLD_MS = 1200, QUIET_MS = 350;
    let armed = true, locked = false, unlock = 0, lastY = window.scrollY, lockedAt = 0, lastInput = 0, lockY = 0;
    const tryUnlock = () => {
      const now = performance.now();
      if (now - lockedAt >= HOLD_MS && now - lastInput >= QUIET_MS) { locked = false; return; }
      unlock = setTimeout(tryUnlock, 100);
    };
    const chatY = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return Math.round(top + 0.65 * (el.offsetHeight - window.innerHeight)); // chat fully in
    };
    const block = e => { if (locked) { lastInput = performance.now(); e.preventDefault(); } };
    const KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar', 'End', 'Home']);
    const blockKey = e => { if (locked && KEYS.has(e.key) && !e.target.closest?.('input, textarea, [contenteditable]')) { lastInput = performance.now(); e.preventDefault(); } };
    const onScroll = () => {
      // While held, nothing moves the page off the chat screen (scrollbar drags included).
      if (locked) { if (Math.abs(window.scrollY - lockY) > 1) window.scrollTo({ top: lockY, behavior: 'auto' }); lastY = lockY; return; }
      const y = window.scrollY, at = chatY();
      if (y < at - window.innerHeight * 0.6) armed = true;
      if (armed && !locked && lastY < at && y >= at) {
        armed = false; locked = true; lockedAt = lastInput = performance.now(); lockY = at;
        window.scrollTo({ top: at, behavior: 'auto' });
        clearTimeout(unlock);
        unlock = setTimeout(tryUnlock, HOLD_MS);
      }
      lastY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', blockKey);
    return () => {
      clearTimeout(unlock);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      window.removeEventListener('keydown', blockKey);
    };
  }, []);

  const heroLayer = useRef(null);
  useEffect(() => {
    const el = heroLayer.current; if (!el) return;
    if (heroLive) el.removeAttribute('inert'); else el.setAttribute('inert', '');
  }, [heroLive]);
  const inputAt = HEADLINE_DONE - 0.35;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 v20 relative" id="top" style={{ background: PAGE }}>
        <Header fixed mode={atTop || !inScene ? 'auto' : arrived ? 'bare' : 'hidden'} />

        <main id="main">
          <section aria-labelledby="hero-title">
            <div ref={run} className="relative h-[600svh]">
              <motion.div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: STAGE, clipPath: stageClip }}>
               <motion.div className="absolute inset-0" style={{ scale: stageContentScale }}>
                {/* 1 — the tunnel, driven by page scroll; fades out as the chat arrives. */}
                <motion.div className="absolute inset-0" style={{ opacity: tunnelOpacity, pointerEvents: heroLive ? 'none' : 'auto' }}>
                  <PerspectiveTunnelHero items={V20_ITEMS} restProgress={0.33} restVisible={5} progress={tunnelProgress} promptIcon={<Glasses pose="Attentive" reduced={reduced} />} />
                </motion.div>

                {/* 2 — the chat hero, rising in on the same screen. */}
                <motion.div ref={heroLayer} className="absolute inset-0" style={{ opacity: heroIn, scale: heroScale, pointerEvents: heroLive ? 'auto' : 'none' }}>
                  <div ref={setHeroEl} className="relative flex h-full flex-col items-center justify-center px-5 pb-8 pt-[150px] text-center sm:px-8 sm:pt-[124px]">
                    {/* White particle sphere, mounted on arrival so its assembly plays while the page holds. */}
                    <div className="absolute inset-x-0 bottom-[-8%] top-[8%]">
                      {arrived && <ParticleSphere key={arrivals} colors={{ background: 'transparent', particle: '#FFFFFF', highlight: '#FFFFFF' }} halo={false} glowSize="sphere" />}
                    </div>
                    <LineBurst anchor={slotEl} container={heroEl} start={HEADLINE_DONE} rays={false} />

                    <div className="relative mb-4 w-[76px] sm:mb-5 sm:w-[92px]">
                      <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                    </div>

                    {/* Headline reveal replays on arrival (kept in layout, hidden until then). */}
                    <div className="relative" style={{ opacity: arrived ? 1 : 0 }}>
                      <HeroHeadline key={arrivals} reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84"
                        sizeClass="text-[clamp(38px,min(4.5vw,7.2vh),64px)]"
                        sub={['Hundreds of customer interviews, overnight.', 'The answers, by morning.']}
                        subClass="mx-auto mt-5 max-w-[34ch] text-[16px] leading-[1.5] text-ink-2 sm:max-w-none sm:text-[18px]" />
                    </div>

                    {/* The chat. DockingInput moves it to the bottom bar once this is out of view. */}
                    <div ref={setSlotEl} className="relative mt-9 w-full max-w-[680px] text-left" />
                    <div className="relative mt-6 w-full max-w-[680px] text-left">
                      <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} tooltips={false} />
                    </div>

                    {/* Or talk to Frank: an incoming-call bar that opens a two-minute voice interview
                        where the visitor is the customer. The whole bar is the button. */}
                    <div className="relative mt-6 w-full max-w-[680px]">
                      <button ref={callBar} type="button" onClick={() => setInterview(true)} aria-label="Try a live interview" aria-describedby="call-bar-note"
                        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(null)}
                        className="group flex w-full cursor-pointer flex-wrap items-center gap-x-3.5 gap-y-3 rounded-[24px] border-0 bg-ink p-3 text-left sm:flex-nowrap sm:py-2.5 sm:pr-2.5 font-sans text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#2b2823] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink sm:rounded-full sm:pl-3">
                        {/* Frank, ringing */}
                        <span aria-hidden="true" className="relative grid size-11 shrink-0 place-items-center rounded-full bg-[#2e2b26]">
                          <span className="tmn-ring absolute inset-0 rounded-full border border-solid border-[#d1f899]/60" />
                          <span className="block w-[60%]"><FrankGlasses pose={hovered === true ? 'Curious' : 'Ready'} ink="#fffdf3" follow={false} shift={false} blink reducedMotion={reduced} /></span>
                        </span>
                        <span id="call-bar-note" className="min-w-0 flex-1 text-[13.5px] leading-[1.4] text-white/75">
                          Be the ‘customer’ for 2 minutes and be sure you’re giving your customers a great experience.
                        </span>
                        <span className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#d1f899] px-5 text-[14.5px] font-medium text-ink transition-colors duration-150 group-hover:bg-[#c4ef84] sm:w-auto">
                          <Mic className="size-4" strokeWidth={2} aria-hidden="true" />
                          Try a live interview
                        </span>
                      </button>
                      <p className="m-0 mt-3 text-center font-sans text-[12.5px] leading-[1.5] text-ink-3">
                        Works with Dot, Instinct, Claude, ChatGPT, Cursor and any MCP client. No credit card required.
                      </p>
                    </div>
                  </div>
                </motion.div>
               </motion.div>
              </motion.div>
            </div>
          </section>

          <LogoStrip />
          <WhatIsFrank titleStyle="v19" eyebrow="What is Frank" />
          <HowItWorks />
        </main>

        <DockingInput slot={slotEl} docked={docked} reduced={reduced} maxWidth={700} aside={<DockGlasses />}>
          {isDocked => (
            <HeroInput ref={input} skin="frank" docked={isDocked} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
              startDelay={Math.round((inputAt + 0.8) * 1000)} prompts={PROMPTS} />
          )}
        </DockingInput>

        <LiveInterview open={interview} onClose={closeInterview} reduced={reduced} />
      </div>
    </MotionConfig>
  );
}
