// V8 — V7 (Frank style, chat-first) with two changes:
//  • Background: a handhold.io-style grain gradient — soft blurred colour fields with a fine
//    stipple grain — as the hero card's own background (see ./grain.js).
//  • Docked input: once the composer has left the viewport, it docks as a full-width bar fixed
//    to the bottom of the viewport, so "ask" is always one click away.
// The scroll wrap (HeroScrollCard) is untouched. (V7 is saved as snapshots/2026-10-21/v7-frank.html.)
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import Glasses from '../v3/Glasses';
import HeroHeadline, { EXPO_OUT, HEADLINE_DONE } from '../v3/HeroHeadline';
import HeroScrollCard from '../v3/HeroScrollCard';
import AmbientVoices from '../v7/AmbientVoices';
import StudyCards from '../v7/StudyCards';
import DockingInput, { useSlotOutOfView } from './DockingInput';
import { GRAIN_GRADIENT } from './grain';

const PAGE = '#ffffff';   // page around the card once it wraps, and the band below: white

const rise = (delay, reduced) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay },
});

export default function AppV8() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
  const heroBox = useRef(null);
  const inputSlot = useRef(null);
  const [slotEl, setSlotEl] = useState(null);
  const slotRef = useCallback(el => { inputSlot.current = el; setSlotEl(el); }, []);
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
  // Dock only once the composer's home is completely out of view.
  const docked = useSlotOutOfView(slotEl);
  // One ring wave per focus — only while the composer is home in the hero.
  const [pulse, setPulse] = useState(0);
  useEffect(() => { if (status.focused && !docked) setPulse(n => n + 1); }, [status.focused]); // eslint-disable-line react-hooks/exhaustive-deps

  const inputAt = HEADLINE_DONE - 0.35;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v8 relative" id="top" style={{ background: PAGE }}>
        <Header fixed />

        <main id="main">
          <section aria-labelledby="hero-title">
            <HeroScrollCard reduced={reduced} background={GRAIN_GRADIENT} pageColor={PAGE}>
              <div ref={heroBox} className="relative flex h-full flex-col items-center justify-center px-5 pb-14 pt-[176px] text-center sm:px-8 sm:pt-[132px]">
                <AmbientVoices anchorRef={inputSlot} containerRef={heroBox} pulse={pulse} reduced={reduced} start={HEADLINE_DONE}
                  ring="rgba(26,23,20,0.075)" wave="rgba(26,23,20,0.14)"
                  fade="linear-gradient(to bottom, #000 0%, #000 58%, transparent 82%)" />

                <motion.div className="relative mb-4 w-[58px] sm:mb-5 sm:w-[68px]"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.1 }}>
                  <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                </motion.div>

                <div className="relative">
                  <HeroHeadline reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84"
                    sizeClass="text-[clamp(42px,min(4.8vw,8vh),66px)]"
                    sub={['Hundreds of customer interviews, overnight.', 'The answers, by morning.']}
                    subClass="mx-auto mt-5 max-w-[34ch] text-[16px] leading-[1.5] text-ink-2 sm:max-w-none sm:text-[18px]" />
                </div>

                {/* The composer's home in the hero (DockingInput moves it in and out). */}
                <motion.div ref={slotRef} className="relative mt-9 w-full max-w-[680px] sm:mt-11" {...rise(inputAt, reduced)} />
                <motion.div className="relative mt-6 w-full max-w-[680px] text-left" {...rise(inputAt + 0.1, reduced)}>
                  <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} />
                </motion.div>
              </div>
            </HeroScrollCard>
          </section>

          <StudyCards reduced={reduced} />
        </main>

        <DockingInput slot={slotEl} docked={docked} reduced={reduced}>
          {isDocked => (
            <HeroInput ref={input} skin="frank" docked={isDocked} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
              startDelay={Math.round((inputAt + 0.8) * 1000)} />
          )}
        </DockingInput>
      </div>
    </MotionConfig>
  );
}
