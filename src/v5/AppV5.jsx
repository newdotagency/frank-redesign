// V5 — V4's calm hero restyled with DESIGN-4 (warm cream editorial) as inspiration:
// cream canvas, warm hairlines, rounded (oval) shapes, a mono labelling system, black primary
// action, and one vivid violet used only on the "insight" moment (done checks, quote→theme
// lines, theme dots). Kept from earlier decisions: Lora headline with the italic, marked
// "anything.", the V5 header, the 44px scroll-card corners. Behaviour identical to V4.
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import Glasses from '../v3/Glasses';
import HeroHeadline, { EXPO_OUT, HEADLINE_DONE } from '../v3/HeroHeadline';
import { ActivityCard, ActivityTicker } from '../v3/ActivityFeed';
import HeroScrollCard from '../v3/HeroScrollCard';
import HeroGraphics, { EDITORIAL_C } from '../v4/HeroGraphics';

const BG = '#faf9f6';    // hero: canvas cream
const PAGE = '#e7e2d9';  // page around the card once it wraps: warm stone, a tone shift instead of a line

const rise = (delay, reduced) => ({
  initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay },
});

const STEPS = [
  { when: 'Tonight', what: 'Type what you want to learn, or start from a template. Frank drafts the interview guide.' },
  { when: 'Overnight', what: 'Frank interviews hundreds of your customers by voice, in their own language.' },
  { when: 'By morning', what: 'You get the themes, ranked, with the quotes and clips that back them up.' },
];

export default function AppV5() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
  const [status, setStatus] = useState({});
  const [hovered, setHovered] = useState(null);
  const [flash, setFlash] = useState('');
  const [react, setReact] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const flashTimer = useRef(0);
  const clearActive = useCallback(() => setActiveId(null), []);
  const heroBox = useRef(null);
  // Feed → graphics: once "Found N recurring themes" (row 4) is done, link quotes to themes.
  const [linked, setLinked] = useState(false);
  const onFeed = useCallback(s => setLinked(s.done >= 4 && !s.leaving), []);
  // Only the visible feed (card ≥1400px, ticker below) drives the lines.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1400px)');
    const on = () => setWide(mq.matches); on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

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

  // Sequence: copy reveals → input + templates rise → feed starts once everything has landed.
  const inputAt = HEADLINE_DONE - 0.35;
  const graphicsAt = HEADLINE_DONE - 0.1;        // artefacts settle in after the copy, 120ms apart
  const feedAt = HEADLINE_DONE + 0.5 + 0.6;       // then the feed starts

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v5 relative" id="top" style={{ background: PAGE }}>
        <Header fixed />

        <main id="main">
          <section aria-labelledby="hero-title">
            <HeroScrollCard reduced={reduced} background={BG} pageColor={PAGE}>
              <div ref={heroBox} className="relative flex h-full flex-col items-center justify-center px-4 pb-14 pt-[176px] text-center sm:px-6 sm:pb-24 sm:pt-[132px]">
                <HeroGraphics reduced={reduced} start={graphicsAt} linked={linked} containerRef={heroBox} theme={EDITORIAL_C} />
                <motion.div className="mb-3 w-[56px] sm:mb-6 sm:w-[84px]"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.1 }}>
                  <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                </motion.div>

                <HeroHeadline reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84" />

                <div className="mt-6 w-full max-w-[720px] sm:mt-10">
                  {/* Below 1400px the feed is one cycling line above the input */}
                  <motion.div className="mb-3 min-[1400px]:hidden sm:mb-4" {...rise(feedAt - 0.4, reduced)}>
                    <ActivityTicker skin="editorial" start={feedAt} reduced={reduced} onState={wide ? undefined : onFeed} />
                  </motion.div>
                  <motion.div className="text-left" {...rise(inputAt, reduced)}>
                    <HeroInput ref={input} skin="editorial" reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
                      startDelay={Math.round((inputAt + 0.8) * 1000)} />
                  </motion.div>
                  <motion.div className="mt-6 text-left sm:mt-7" {...rise(inputAt + 0.1, reduced)}>
                    <TemplatePills skin="editorial" onPick={pick} onHover={setHovered} activeId={activeId} />
                  </motion.div>
                </div>

                {/* 1400px and up: the feed is a small card beside the input row, clear of the headline */}
                <motion.div className="absolute bottom-[clamp(32px,7vh,80px)] right-8 hidden min-[1400px]:block"
                  {...rise(feedAt - 0.3, reduced)}>
                  <ActivityCard skin="editorial" start={feedAt} reduced={reduced} onState={wide ? onFeed : undefined} />
                </motion.div>
              </div>
            </HeroScrollCard>
          </section>

          <section aria-labelledby="how-title" className="relative mx-auto max-w-[1180px] px-4 pb-32 pt-24 sm:px-6 md:pt-32">
            <h2 id="how-title" className="max-w-[16ch] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1] tracking-[-0.03em] text-ink">
              One question tonight. Answers by morning.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map(s => (
                <li key={s.when} className="border-t border-[#111111] pt-5">
                  <p className="font-gmono text-[12px] tracking-[0.1em] text-[#585858]">{s.when}</p>
                  <p className="mt-2 max-w-[34ch] text-[16px] leading-[1.6] text-ink-2">{s.what}</p>
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
