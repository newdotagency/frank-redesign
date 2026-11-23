import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Header from './components/Header';
import HeroInput from './components/HeroInput';
import TemplatePills from './components/TemplatePills';
import FrankGlasses from './components/FrankGlasses';
import HighlightMarker from './components/HighlightMarker';
import { enter, spring, STAGGER } from './lib/motion';

// Two slow, blurred light pools behind the composer. They brighten while it has focus.
function Glow({ lit }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-x-24 -inset-y-28 -z-10 sm:-inset-x-40">
      <motion.div
        className="absolute left-[12%] top-[18%] h-[58%] w-[52%] rounded-full bg-brand blur-[72px]"
        initial={false}
        animate={{ opacity: lit ? 0.7 : 0.5, x: [0, 46, -18, 0], y: [0, -22, 16, 0] }}
        transition={{ opacity: spring.soft, x: { duration: 22, ease: 'easeInOut', repeat: Infinity }, y: { duration: 18, ease: 'easeInOut', repeat: Infinity } }}
      />
      <motion.div
        className="absolute right-[10%] top-[28%] h-[54%] w-[46%] rounded-full bg-violet-400 blur-[80px]"
        initial={false}
        animate={{ opacity: lit ? 0.48 : 0.32, x: [0, -40, 20, 0], y: [0, 18, -14, 0] }}
        transition={{ opacity: spring.soft, x: { duration: 26, ease: 'easeInOut', repeat: Infinity }, y: { duration: 20, ease: 'easeInOut', repeat: Infinity } }}
      />
    </div>
  );
}

export default function App() {
  const reduced = !!useReducedMotion();
  const input = useRef(null);
  const [status, setStatus] = useState({});
  const [hovered, setHovered] = useState(null);
  const [flash, setFlash] = useState('');
  const [react, setReact] = useState(0);
  const [reactKind, setReactKind] = useState('nod');
  const flashTimer = useRef(0);

  const [activeId, setActiveId] = useState(null);
  const clearActive = useCallback(() => setActiveId(null), []);

  const pick = useCallback(p => {
    setActiveId(p.id);
    input.current?.fill(p.prompt);
    clearTimeout(flashTimer.current);
    setFlash('Insight');
    flashTimer.current = setTimeout(() => setFlash(''), 1400);
  }, []);

  // A nod when the guide comes back.
  useEffect(() => {
    if (status.phase === 'ready') { setReactKind('nod'); setReact(n => n + 1); }
  }, [status.phase]);
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  // The glasses follow what the user is doing.
  const pose = flash
    || (status.phase === 'drafting' ? 'Thinking'
      : status.phase === 'ready' ? 'Agreeing'
      : status.listening ? 'Listening'
      : hovered ? 'Curious'
      : status.hasText ? 'Listening'
      : status.focused ? 'Attentive'
      : 'Ready');

  // Placeholder starts typing once the entrance has settled.
  const typeDelay = Math.round((0.05 + 3 * STAGGER + 0.7) * 1000);

  return (
    <MotionConfig reducedMotion="user">
      <div className="fk relative min-h-[100dvh]" id="top">
        <div className="grain" aria-hidden="true" />
        <Header />

        <main id="main" className="relative z-10">
          <section aria-labelledby="hero-title"
            className="mx-auto flex min-h-[calc(100dvh-120px)] max-w-[1180px] flex-col items-center px-4 pb-20 pt-[clamp(28px,7vh,104px)] text-center sm:px-6">

            <motion.div variants={enter} initial="hidden" animate="show" custom={1} className="mb-5 w-[72px] sm:mb-6 sm:w-[84px]">
              <FrankGlasses pose={pose} ink="#1a1714" follow react={react} reactKind={reactKind} reducedMotion={reduced} />
            </motion.div>

            <motion.h1 id="hero-title" variants={enter} initial="hidden" animate="show" custom={1}
              className="font-serif text-[clamp(38px,min(6.1vw,9.5vh),84px)] font-normal leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance]">
              Ask your customers<br className="hidden sm:block" />{' '}
              <span className="italic">
                <HighlightMarker reduced={reduced} delay={0.05 + STAGGER + 0.6}>anything.</HighlightMarker>
              </span>
            </motion.h1>

            <motion.p variants={enter} initial="hidden" animate="show" custom={2}
              className="mt-5 max-w-[34ch] text-[17px] leading-[1.6] text-ink-2 [text-wrap:pretty] sm:mt-6 sm:max-w-[46ch] sm:text-[19px]">
              Frank runs hundreds of AI-moderated interviews overnight and brings back the answers, in your customers’ own words.
            </motion.p>

            <motion.div variants={enter} initial="hidden" animate="show" custom={3}
              className="relative isolate mt-9 w-full max-w-[720px] text-left sm:mt-[clamp(32px,5vh,48px)]">
              <Glow lit={!!status.focused || !!status.hasText} />
              <HeroInput ref={input} reduced={reduced} onStatus={setStatus} onUserEdit={clearActive} startDelay={typeDelay} />
            </motion.div>

            <motion.div variants={enter} initial="hidden" animate="show" custom={4}
              className="mt-6 w-full max-w-[720px] text-left sm:mt-7">
              <TemplatePills onPick={pick} onHover={setHovered} activeId={activeId} />
            </motion.div>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
