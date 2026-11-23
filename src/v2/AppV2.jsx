// V2 — "Warm cream editorial" (DESIGN-2.md), built for Frank.
// Asymmetric hero: whisper-weight headline left, description + pill buttons right. Below,
// one large taupe feature panel holds the composer and templates, with Frank's voice orb
// (the only colour on the page) beside them. Same behaviour as V1, different style.
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import HeaderV2, { PILL_FILLED, PILL_OUTLINE } from './HeaderV2';
import HeroInputV2 from './HeroInputV2';
import TemplatePillsV2 from './TemplatePillsV2';
import VoiceOrb from './VoiceOrb';
import { enter, STAGGER } from '../lib/motion';

export default function AppV2() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
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
  const orbMode = status.phase === 'drafting' ? 'drafting'
    : status.phase === 'ready' ? 'ready'
    : (status.focused || status.hasText || status.listening) ? 'listening' : 'idle';

  const typeDelay = Math.round((0.05 + 3 * STAGGER + 0.7) * 1000);

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2 min-h-[100dvh]" id="top">
        <HeaderV2 />

        <main id="main">
          <section aria-labelledby="hero-title" className="mx-auto max-w-[1280px] px-5 pb-24 pt-14 md:px-16 md:pb-32 md:pt-24">
            {/* Asymmetric hero row */}
            <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
              <motion.div variants={enter} initial="hidden" animate="show" custom={1} className="md:col-span-7">
                <p className="mb-5 font-gmono text-[13px] leading-[1.69] text-smoke">AI-moderated customer interviews</p>
                <h1 id="hero-title" className="text-[36px] font-light leading-[1.08] tracking-[-0.02em] text-black sm:text-[44px] lg:text-[48px] [text-wrap:balance]">
                  Ask your customers<br className="hidden sm:block" /> anything.
                </h1>
              </motion.div>
              <motion.div variants={enter} initial="hidden" animate="show" custom={2} className="md:col-span-5 md:pb-1">
                <p className="max-w-[40ch] text-[16px] leading-[1.5] tracking-[0.01em] text-smoke sm:text-[18px] sm:leading-[1.6] sm:tracking-normal">
                  Frank runs hundreds of AI-moderated interviews overnight and brings back the answers, in your customers’ own words.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a href="#signup" className={PILL_FILLED}>Sign up for free</a>
                  <a href="#demo" className={PILL_OUTLINE}>Try a live demo</a>
                </div>
              </motion.div>
            </div>

            {/* Large feature panel: composer + templates, voice orb alongside */}
            <motion.div variants={enter} initial="hidden" animate="show" custom={3}
              className="mt-12 rounded-[24px] bg-taupe p-4 sm:p-6 md:mt-16 md:p-8">
              <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:gap-12">
                <div className="order-2 min-w-0 md:order-1">
                  <HeroInputV2 ref={input} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive} startDelay={typeDelay} />
                  <div className="mt-6">
                    <TemplatePillsV2 onPick={pick} onHover={setHovered} activeId={activeId} />
                  </div>
                </div>
                <div className="order-1 flex justify-center md:order-2">
                  <div className="md:hidden"><VoiceOrb mode={orbMode} pose={pose} react={react} reactKind="nod" reduced={reduced} size={150} /></div>
                  <div className="hidden md:block"><VoiceOrb mode={orbMode} pose={pose} react={react} reactKind="nod" reduced={reduced} size={220} /></div>
                </div>
              </div>
            </motion.div>

            <p className="mt-6 text-center text-[13px] text-ash md:text-left">Claim 225 signup credits · No credit card required</p>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
