// V6 — structure and calm. V1's styling (warm canvas, Lora with the marked "anything.", soft
// frosted surfaces, layered soft shadows, lime accent, colour-on-hover template icons) with no
// gradients: the V1 glow blobs are gone. A three-column grid: the chat stack in the centre,
// and the live study as four small cards around it (customer voice left, Frank's work right),
// all driven by one shared timeline.
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from '../components/Header';
import HeroInput from '../components/HeroInput';
import TemplatePills from '../components/TemplatePills';
import Glasses from '../v3/Glasses';
import HeroHeadline, { EXPO_OUT, HEADLINE_DONE } from '../v3/HeroHeadline';
import { ActivityTicker } from '../v3/ActivityFeed';
import HeroScrollCard from '../v3/HeroScrollCard';
import { useStudy, QuoteCard, StatsCard, ProgressCard, ThemesCard } from './StudyStack';

const CANVAS = '#F9F8F5';  // V1 canvas
const PAGE = '#ece8e1';    // around the card once it wraps

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

export default function AppV6() {
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

  const inputAt = HEADLINE_DONE - 0.35;
  const cardsAt = HEADLINE_DONE + 0.1;   // side cards settle in after the copy, 120ms apart
  const studyAt = HEADLINE_DONE + 0.8;   // then the study starts running
  const st = useStudy({ start: studyAt, reduced });

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v6 relative" id="top" style={{ background: PAGE }}>
        {/* V1 paper grain: fixed, non-interactive, very light (texture, not a gradient) */}
        <div className="grain" aria-hidden="true" style={{ zIndex: 40, opacity: 0.32 }} />
        <Header fixed />

        <main id="main">
          <section aria-labelledby="hero-title">
            <HeroScrollCard reduced={reduced} background={CANVAS} pageColor={PAGE}>
              <div className="relative mx-auto flex h-full max-w-[1360px] items-center px-5 pb-12 pt-[176px] sm:px-8 sm:pt-[132px] xl:px-10">
                <div className="grid w-full grid-cols-1 items-center gap-12 xl:grid-cols-[minmax(0,1fr)_640px_minmax(0,1fr)] xl:gap-14">

                  {/* Left: the customer's voice */}
                  <div className="hidden flex-col items-center gap-10 xl:flex">
                    <div className="w-full max-w-[280px] -translate-x-4"><QuoteCard st={st} i={0} start={cardsAt} reduced={reduced} /></div>
                    <div className="w-full max-w-[280px] translate-x-6"><StatsCard st={st} i={2} start={cardsAt} reduced={reduced} /></div>
                  </div>

                  {/* Centre: the chat */}
                  <div className="min-w-0 text-center">
                    <motion.div className="mx-auto mb-4 w-[60px] sm:mb-5 sm:w-[76px]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.1 }}>
                      <Glasses pose={pose} react={react} reactKind="nod" reduced={reduced} />
                    </motion.div>

                    <HeroHeadline reduced={reduced} markerColor="#d1f899" markerShade="#c4ef84"
                      sizeClass="text-[clamp(44px,min(5vw,8.6vh),74px)]"
                      sub={['Hundreds of customer interviews, overnight.', 'The answers, by morning.']}
                      subClass="mx-auto mt-5 max-w-[34ch] text-[17px] leading-[1.5] text-ink-2 sm:max-w-none sm:text-[19px]" />

                    <motion.div className="mx-auto mt-7 max-w-[640px] xl:hidden" {...rise(studyAt - 0.4, reduced)}>
                      <ActivityTicker start={studyAt} reduced={reduced} />
                    </motion.div>
                    <motion.div className="mx-auto mt-5 max-w-[640px] text-left xl:mt-10" {...rise(inputAt, reduced)}>
                      <HeroInput ref={input} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive}
                        startDelay={Math.round((inputAt + 0.8) * 1000)} />
                    </motion.div>
                    <motion.div className="mx-auto mt-6 max-w-[640px] text-left" {...rise(inputAt + 0.1, reduced)}>
                      <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} />
                    </motion.div>
                  </div>

                  {/* Right: Frank's work */}
                  <div className="hidden flex-col items-center gap-10 xl:flex">
                    <div className="w-full max-w-[280px] translate-x-4"><ProgressCard st={st} i={1} start={cardsAt} reduced={reduced} /></div>
                    <div className="w-full max-w-[280px] -translate-x-6"><ThemesCard st={st} i={3} start={cardsAt} reduced={reduced} /></div>
                  </div>
                </div>
              </div>
            </HeroScrollCard>
          </section>

          <section aria-labelledby="how-title" className="relative mx-auto max-w-[1180px] px-5 pb-32 pt-24 sm:px-8 md:pt-32">
            <h2 id="how-title" className="max-w-[16ch] font-serif text-[clamp(36px,5vw,60px)] font-normal leading-[1] tracking-[-0.03em] text-ink">
              One question tonight. Answers by morning.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map(s => (
                <li key={s.when} className="border-t border-[rgba(26,23,20,0.18)] pt-5">
                  <p className="text-[15px] font-medium text-ink">{s.when}</p>
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
