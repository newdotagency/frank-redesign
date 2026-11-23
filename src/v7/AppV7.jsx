// V7 — Delphi's "Perspectives" hierarchy as the structural reference, pushed further:
//  • The chat is the hero. Headline modest, input the largest object, templates right under it.
//  • Everything else is atmosphere, never a rival: faint voice rings around the input (one wave
//    rolls out each time the input is clicked) and four tiny customer-quote chips at the edges.
//  • The rich content moves below the fold: "Studies Frank ran last night".
// Styled in Frank's own language (V1 / Homepage V5): warm canvas, ink type, Lora with the
// lime-marked "anything.", soft frosted surfaces, lime focus, violet eyebrow. No gradients.
// (The DESIGN-5 parchment take is saved as snapshots/2026-10-21/v7-parchment.html.)
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import Glasses from '../v3/Glasses';
import HeroHeadline, { EXPO_OUT, HEADLINE_DONE } from '../v3/HeroHeadline';
import HeroScrollCard from '../v3/HeroScrollCard';
import AmbientVoices from './AmbientVoices';
import StudyCards from './StudyCards';

const CANVAS = '#F9F8F5';  // Frank canvas
const PAGE = '#ece8e1';    // page around the card once it wraps, and the band below

const rise = (delay, reduced) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay },
});

export default function AppV7() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
  const heroBox = useRef(null);
  const inputBox = useRef(null);
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
  // One ring wave each time the input gains focus.
  const [pulse, setPulse] = useState(0);
  useEffect(() => { if (status.focused) setPulse(n => n + 1); }, [status.focused]);

  const inputAt = HEADLINE_DONE - 0.35;

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v7 relative" id="top" style={{ background: PAGE }}>
        <Header fixed />

        <main id="main">
          <section aria-labelledby="hero-title">
            <HeroScrollCard reduced={reduced} background={CANVAS} pageColor={PAGE}>
              <div ref={heroBox} className="relative flex h-full flex-col items-center justify-center px-5 pb-14 pt-[176px] text-center sm:px-8 sm:pt-[132px]">
                <AmbientVoices anchorRef={inputBox} containerRef={heroBox} pulse={pulse} reduced={reduced} start={HEADLINE_DONE} />

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

                <motion.div ref={inputBox} className="relative mt-9 w-full max-w-[680px] text-left sm:mt-11" {...rise(inputAt, reduced)}>
                  <HeroInput ref={input} skin="frank" reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
                    startDelay={Math.round((inputAt + 0.8) * 1000)} />
                </motion.div>
                <motion.div className="relative mt-6 w-full max-w-[680px] text-left" {...rise(inputAt + 0.1, reduced)}>
                  <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} />
                </motion.div>
              </div>
            </HeroScrollCard>
          </section>

          <StudyCards reduced={reduced} />
        </main>
      </div>
    </MotionConfig>
  );
}
