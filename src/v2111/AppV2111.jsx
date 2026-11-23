// V21.11 — V21.1 with the hero's order swapped: the chat screen first ("Ask your customers
// anything." with the composer and template pills, its sphere and headline playing on load), then,
// as you scroll, the chat steps back and the video tunnel takes over ("Your customers are talking."),
// and the page carries on to the logo strip once the calls have flown past.
// V21.1 — V21 with a calmer Widget section (one placement switch, a quiet wireframe store, the
// widget gliding between placements). Below, V21's notes:
// V21 — V19 with Lassie-style section entrances: titles slide up line by line from behind a mask,
// and the big stages rise and grow in tied to the scroll (reveal.js).
// V19 — V17 (every customer note a real video call) plus the "What is Frank" section after the
// logo strip, then "How it works". Titles are Figtree with their italic phrase in Lora (v19.css);
// the new sections' titles are all Figtree. New sections also get a hairline + spaced caps eyebrow (titles.jsx),
// the same distance above every title.
// Otherwise the hero is as in V17.
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import HeroHeadline, { HEADLINE_DONE } from '../v3/HeroHeadline';
import DockingInput from '../v8/DockingInput';
import LineBurst from '../v9/LineBurst';
import DockGlasses from '../v9/DockGlasses';
import ParticleSphere from '../components/ParticleSphere';
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero';
import Glasses from '../v3/Glasses';
import WhatIsFrank from './WhatIsFrank';
import HowItWorks from './HowItWorks';
import TrustStrip from './TrustStrip';
import InterviewExample from './InterviewExample';
import WidgetSection from './WidgetSection';
import UseCases from './UseCases';
import AgenticWorkflow from './AgenticWorkflow';
import Features from './Features';
import FAQ from './FAQ';
import ClosingCTA from './ClosingCTA';
import Footer from './Footer';

// The examples the chat box types out, one after another.
const PROMPTS = [
  'Why do trial users leave before day 7?',
  'Why are shoppers abandoning checkout at shipping?',
  'What do power users love that we’re underselling?',
  'Is our new pricing page confusing anyone?',
];

// "What is Frank": what he is and who he's for, under the section's promise; [[…]] is highlighted violet.
const FRANK_ABOUT = [
  'Frank is an [[AI customer interviewer]] that conducts short interviews at scale, asking adaptive follow-up questions to [[uncover the why]] behind customer behavior.',
  'Built for SaaS and ecommerce teams, Frank turns customer conversations into [[actionable insights and next steps]] across the entire customer lifecycle, from discovery and onboarding to conversion, retention, and churn.',
];

const STAGE = '#FFFDF3';  // tunnel + hero share one cream stage
const PAGE = '#ffffff';

// Eight notes, all real video calls: licensed Envato clips cut to 8 s muted loops in the 4:5 card
// shape, with the quote as a caption over the bottom of the picture.
const clip = (n) => ({
  card: `/videos/call-${n}-card.mp4`, wide: `/videos/call-${n}-h.mp4`,
  cardPoster: `/videos/call-${n}-card.jpg`, widePoster: `/videos/call-${n}-h.jpg`,
});
const V19_ITEMS = [
  // The first five rest around the headline on the first screen; three of them are Frank's own recorded
  // calls (call-09…11: cut to 8 s muted 4:5 loops), the rest appear once scrolling starts.
  { quote: 'I signed up for the trial, then couldn’t work out how to invite my team.', type: 'problem', author: 'Chloe Martin', role: 'Marketing manager', media: 'call', clip: clip('09'), shape: 'card' },
  { quote: "Honestly, I'd pay more if setup took five minutes instead of a week.", type: 'thought', author: 'Tomás Herrera', role: 'Founder, 12-person team', media: 'call', clip: clip('02'), shape: 'card', restShift: { y: -70 } },
  { quote: 'I’d switch today if moving our old data didn’t take a whole weekend.', type: 'thought', author: 'Lea Novak', role: 'Operations lead', media: 'call', clip: clip('10'), shape: 'card' },
  { quote: 'We only find out why customers leave after they’ve already gone.', type: 'problem', author: 'David Kerr', role: 'Head of growth', media: 'call', clip: clip('11'), shape: 'card' },
  { quote: "If search understood what I meant, I'd stop asking colleagues.", type: 'thought', author: 'Lukas Brandt', role: 'Support engineer', media: 'call', clip: clip('03'), shape: 'card', restShift: { y: -70 } },
  { quote: 'I gave up halfway through checkout — there were too many steps.', type: 'problem', author: 'Maya Lindqvist', role: 'Online shopper', media: 'call', clip: clip('01'), shape: 'card' },
  { quote: "I never know which plan I'm on until the invoice arrives.", type: 'problem', author: 'Grace Whitfield', role: 'Finance lead', media: 'call', clip: clip('04'), shape: 'card' },
  { quote: 'I wish I could see what my team already tried before starting.', type: 'thought', author: 'Daniel Okafor', role: 'Product manager', media: 'call', clip: clip('05'), shape: 'card' },
  { quote: 'We lost a week of feedback because the survey link expired.', type: 'problem', author: 'Sofia Marchetti', role: 'UX researcher', media: 'call', clip: clip('06'), shape: 'card' },
  { quote: 'Every report needs exporting to Excel before anyone can read it.', type: 'problem', author: 'Priya Raman', role: 'Ops analyst', media: 'call', clip: clip('08'), shape: 'card' },
  { quote: 'Half our onboarding calls are spent re-explaining the same setup steps.', type: 'problem', author: 'Marcus Bell', role: 'Onboarding manager', media: 'call', clip: clip('07'), shape: 'card' },
];

// Is the composer's home slot off screen? Measured against the window on scroll and resize (and
// when an observer notices a change), and never while the page has no height: the claude.ai viewer
// keeps the page hidden for a moment while it loads, which would otherwise dock the composer at the
// top of the page and leave it there.
function useSlotGone(slot) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (!slot) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = window.innerHeight;
      if (!h || document.visibilityState === 'hidden') return;
      const r = slot.getBoundingClientRect();
      setOut(r.bottom <= 0 || r.top >= h);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    const io = new IntersectionObserver(queue);
    io.observe(slot);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    document.addEventListener('visibilitychange', queue);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue);
      document.removeEventListener('visibilitychange', queue);
    };
  }, [slot]);
  return out;
}

export default function AppV2111() {
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

  // Two pinned runs.
  // 1 — the chat screen (150svh): it holds the screen while scrolling wraps it into a rounded card
  //     (as in V21.1: an even 16/40px margin, 44px corners, content shrinking a touch), then the card
  //     moves up and away.
  const chatRun = useRef(null);
  const { scrollYProgress: chatY } = useScroll({ target: chatRun, offset: ['start start', 'end end'] });
  const wrap = useSpring(chatY, { stiffness: 110, damping: 26, mass: 0.6, restDelta: 0.0005 });
  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => { const on = () => setVw(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const margin = vw < 768 ? 16 : 40, RADIUS = 44;
  const stageClip = useTransform(wrap, w => `inset(${(margin * w).toFixed(2)}px round ${(RADIUS * w).toFixed(2)}px)`);
  const stageContentScale = useTransform(wrap, [0, 1], [1, reduced ? 1 : 0.93]);
  // 2 — the tunnel (305svh): its first screen ("Your customers are talking.") rests a moment, then
  //     the calls fly at V21.1's pace. The run ends just as the last call has passed out of the frame
  //     (tunnel progress ~0.93 with pass-by exits), so there's no empty stretch before the page moves on.
  const run = useRef(null);
  const { scrollYProgress } = useScroll({ target: run, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.6, restDelta: 0.0005 });
  const tunnelProgress = useTransform(p, [0.04, 1], [0, 0.93], { clamp: true });
  // The tunnel arrives as a box (the chat card's mirror: the same margin, corners and slightly smaller
  // content) and opens out to full screen as it reaches the top of the window.
  const { scrollYProgress: tunnelEnter } = useScroll({ target: run, offset: ['start end', 'start start'] });
  const open = useSpring(tunnelEnter, { stiffness: 110, damping: 26, mass: 0.6, restDelta: 0.0005 });
  const tunnelClip = useTransform(open, o => `inset(${(margin * (1 - o)).toFixed(2)}px round ${(RADIUS * (1 - o)).toFixed(2)}px)`);
  const tunnelContentScale = useTransform(open, [0, 1], [reduced ? 1 : 0.93, 1]);

  // The composer docks into the bottom bar once the chat card has scrolled out of view.
  const docked = useSlotGone(slotEl);
  // Navigation: normal at the very top; a bare nav row while the chat holds; hidden while flying
  // through the tunnel; normal again after it.
  const [atTop, setAtTop] = useState(true);
  const [inChat, setInChat] = useState(true);
  const [inTunnel, setInTunnel] = useState(false);
  useMotionValueEvent(chatY, 'change', v => setInChat(v < 0.995));
  useMotionValueEvent(scrollYProgress, 'change', v => setInTunnel(v > 0.001 && v < 0.995));
  const { scrollY: pageY } = useScroll();
  useMotionValueEvent(pageY, 'change', y => setAtTop(y < 40));
  const navMode = atTop ? 'auto' : inChat ? 'bare' : inTunnel ? 'hidden' : 'auto';
  // The sphere is still and the headline reveals once, on load.
  const arrivals = 1, arrived = true;

  const inputAt = HEADLINE_DONE - 0.35;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: PAGE }}>
        <Header fixed mode={navMode} />

        <main id="main">
          <section aria-labelledby="hero-title">
            {/* 1 — the chat screen, wrapping into a card as you scroll on. */}
            <div ref={chatRun} className="relative h-[150svh]">
              <motion.div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: STAGE, clipPath: stageClip }}>
               <motion.div className="absolute inset-0" style={{ scale: stageContentScale }}>
                  <div ref={setHeroEl} className="relative flex h-full flex-col items-center justify-center px-5 pb-8 pt-[150px] text-center sm:px-8 sm:pt-[124px]">
                    {/* White particle sphere, still: no assembly, ripple or spin. */}
                    <div className="absolute inset-x-0 bottom-[-8%] top-[8%]">
                      <ParticleSphere still colors={{ background: 'transparent', particle: '#FFFFFF', highlight: '#FFFFFF' }} halo={false} glowSize="sphere" />
                    </div>
                    <LineBurst anchor={slotEl} container={heroEl} start={HEADLINE_DONE} rays={false} />

                    <div className="relative mb-4 w-[76px] sm:mb-5 sm:w-[92px]">
                      <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                    </div>

                    {/* Headline reveal replays on arrival (kept in layout, hidden until then). */}
                    <div className="relative" style={{ opacity: arrived ? 1 : 0 }}>
                      <HeroHeadline key={arrivals} reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84"
                        sizeClass="text-[clamp(38px,min(4.5vw,7.2vh),64px)]"
                        sub={['Just type what you want to learn, and Frank will build an AI Interview in minutes,', 'ready to try yourself before sending out.']}
                        subClass="mx-auto mt-5 max-w-[34ch] text-[16px] leading-[1.5] text-ink-2 sm:max-w-none sm:text-[18px]" />
                    </div>

                    {/* The chat. DockingInput moves it to the bottom bar once the chat can't be seen. */}
                    <div ref={setSlotEl} className="relative mt-9 w-full max-w-[680px] text-left" />
                    <div className="relative mt-6 w-full max-w-[680px] text-left">
                      <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} tooltips={false} />
                    </div>
                  </div>
               </motion.div>
              </motion.div>
            </div>

            {/* 2 — the tunnel: arrives as a box, opens to full screen, then flies with page scroll. */}
            <div ref={run} className="relative h-[305svh]">
              <motion.div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: '#ffffff', clipPath: tunnelClip }}>
                <motion.div className="absolute inset-0" style={{ scale: tunnelContentScale }}>
                  <PerspectiveTunnelHero refined passBy stageColor="#ffffff" compactGlow subtitle={<>Hundreds of customer interviews, overnight.<br />The answers, by morning.</>} items={V19_ITEMS} restProgress={0.33} restVisible={5} progress={tunnelProgress} promptIcon={<Glasses pose="Attentive" reduced={reduced} />} />
                </motion.div>
              </motion.div>
            </div>
          </section>

          <TrustStrip />
          <WhatIsFrank titleStyle="v19" eyebrow="What is Frank" description={FRANK_ABOUT} entrance />
          <HowItWorks />
          <InterviewExample />
          <WidgetSection />
          {/* Use cases: "Use template" types the question into the chat (docked at the bottom by then). */}
          <UseCases onUse={pick} />
          <AgenticWorkflow />
          <Features />
          <FAQ />
          <ClosingCTA />
        </main>
        <Footer />

        <DockingInput slot={slotEl} docked={docked} reduced={reduced} maxWidth={700} aside={<DockGlasses />}>
          {isDocked => (
            <HeroInput ref={input} skin="frank" docked={isDocked} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
              startDelay={Math.round((inputAt + 0.8) * 1000)} prompts={PROMPTS} />
          )}
        </DockingInput>
      </div>
    </MotionConfig>
  );
}
