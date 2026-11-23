// V11 — V10 with the interactive 3D particle sphere (components/ParticleSphere) behind the hero
// in place of the glass bubble. Everything else is V9/V10:
//  • Centred stack, V8 typography: Lora headline with the lime-marked italic "anything.",
//    Geist subline, then the chat and templates — the chat stays the centre of the page.
//  • Behind everything: animaapp.com-style rays that travel out of the chat to the edges, with a
//    mini star twinkling where each one lands, plus a few free twinkling stars.
//  • Glasses above the title, as in V8. Flat canvas, brand green / violet / ink only.
//    (The fps-style pixel clusters were removed; PixelField.jsx is no longer used.)
//  • From V11: a logo strip under the hero, and the docked chat as a centred 700px bar with
//    Frank's glasses beside it.
// Kept from V8: the scroll wrap (HeroScrollCard), and the composer docking to the bottom once it
// has left the viewport. (V8 is saved as snapshots/2026-10-21/v8-ribbon-white.html.)
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import HeroHeadline, { EXPO_OUT, HEADLINE_DONE } from '../v3/HeroHeadline';
import HeroScrollCard from '../v3/HeroScrollCard';
import StudyCards from '../v7/StudyCards';
import DockingInput, { useSlotOutOfView } from '../v8/DockingInput';
import LineBurst from '../v9/LineBurst';
import LogoStrip from '../v9/LogoStrip';
import DockGlasses from '../v9/DockGlasses';
import ParticleSphere from '../components/ParticleSphere';
import Glasses from '../v3/Glasses';

const CANVAS = '#F9F8F5';
const PAGE = '#ffffff';

const rise = (delay, reduced) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay },
});

export default function AppV11() {
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

  const docked = useSlotOutOfView(slotEl);
  const inputAt = HEADLINE_DONE - 0.35;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v11 relative" id="top" style={{ background: PAGE }}>
        <Header fixed />

        <main id="main">
          <section aria-labelledby="hero-title">
            <HeroScrollCard reduced={reduced} background={CANVAS} pageColor={PAGE}>
              <div ref={setHeroEl} className="relative flex h-full flex-col items-center justify-center px-5 pb-8 pt-[150px] text-center sm:px-8 sm:pt-[124px]">
                {/* The particle sphere, furthest back, a little below centre (behind title and chat).
                    Transparent background so the hero canvas shows through. */}
                <div className="absolute inset-x-0 bottom-[-8%] top-[8%]">
                  <ParticleSphere colors={{ background: 'transparent' }} />
                </div>
                {/* Twinkling mini stars (V9's lines are off in this version). */}
                <LineBurst anchor={slotEl} container={heroEl} start={HEADLINE_DONE} rays={false} />

                <motion.div className="relative mb-4 w-[58px] sm:mb-5 sm:w-[68px]"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.1 }}>
                  <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                </motion.div>

                {/* Same typography as V8: Lora headline, lime-marked italic "anything.", Geist subline. */}
                <div className="relative">
                  <HeroHeadline reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84"
                    sizeClass="text-[clamp(42px,min(4.8vw,8vh),66px)]"
                    sub={['Hundreds of customer interviews, overnight.', 'The answers, by morning.']}
                    subClass="mx-auto mt-5 max-w-[34ch] text-[16px] leading-[1.5] text-ink-2 sm:max-w-none sm:text-[18px]" />
                </div>

                {/* The chat, centred. DockingInput moves it to the bottom bar once this is out of view. */}
                <motion.div ref={setSlotEl} className="relative mt-9 w-full max-w-[680px] text-left" {...rise(inputAt, reduced)} />
                <motion.div className="relative mt-6 w-full max-w-[680px] text-left" {...rise(inputAt + 0.1, reduced)}>
                  <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} />
                </motion.div>
              </div>
            </HeroScrollCard>
          </section>

          <LogoStrip />
          <StudyCards reduced={reduced} />
        </main>

        <DockingInput slot={slotEl} docked={docked} reduced={reduced} maxWidth={700} aside={<DockGlasses />}>
          {isDocked => (
            <HeroInput ref={input} skin="frank" docked={isDocked} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
              startDelay={Math.round((inputAt + 0.8) * 1000)} />
          )}
        </DockingInput>
      </div>
    </MotionConfig>
  );
}
