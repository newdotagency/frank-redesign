// InterviewExample (V21; from V19) — "Experience a Frank interview yourself": a real voice interview, set in
// the page. The heading follows "What is Frank" (title left, the invitation and what to listen for on
// the right). Below it, a wide cream stage holds only the call room (V20's LiveInterview, inline, with
// the "why you'd like to use Frank" script).
// Full screen: once the interview starts, the cream stage fills the screen with the call larger in the
// middle, until "Exit full screen", Escape, or "Try again". The page keeps its place underneath and
// doesn't scroll. Mid-call back in the page, "Full screen" returns to it.
// Entrance, tied to the scroll (reveal.jsx): the label, the title line by line from behind a mask,
// the paragraphs, then the stage rising and growing in.
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { InterviewRoom, SCRIPTS } from '../v20/LiveInterview';
import { cardGrainPaper } from '../components/grain';
import { TITLE, Eyebrow } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle, useScrubIn } from './reveal';

export default function InterviewExample() {
  const reduce = !!useReducedMotion();
  const head = useRef(null);
  // Full screen while the call runs. The slot keeps the stage's height in the page meanwhile.
  const slot = useRef(null);
  const [full, setFull] = useState(false);
  const [slotH, setSlotH] = useState(0);
  const [inCall, setInCall] = useState(false);
  const scrub = useScrubIn(slot, reduce);
  const goFull = useCallback(() => { setSlotH(slot.current?.offsetHeight || 0); setFull(true); }, []);
  const onPhase = useCallback(phase => {
    setInCall(phase !== 'intro');
    if (phase === 'live') goFull();
    if (phase === 'intro') setFull(false);
  }, [goFull]);
  useEffect(() => {
    if (!full) return;
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') setFull(false); };
    document.addEventListener('keydown', onKey);
    return () => { html.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [full]);

  return (
    <section aria-labelledby="ie-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div ref={head}>
          {/* The label travels with the title, so the two columns can end on one line while the
              label-to-title gap stays the same as in the other sections. */}
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20">
            <div>
              <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Interview example</Eyebrow></ScrubText>
              <ScrubTitle reduce={reduce} id="ie-title" className={'m-0 leading-[1.04] text-ink ' + TITLE}
                lines={['Experience a Frank', 'interview yourself']} />
            </div>
            <ScrubText reduce={reduce} lag={0.2} offset={END_OFFSET} className="max-w-[48ch] text-[17px] leading-[1.55] text-ink-2 sm:text-[18px]">
              <p className="m-0">Want to see Frank interview live? Join the voice interview below and share why you’d like to use Frank.</p>
              <p className="m-0 mt-4">Pay attention to how Frank adapts based on your responses, asking relevant follow-ups, keeping you on track, and digging deeper to understand the real reasons why.</p>
            </ScrubText>
          </div>
        </div>

        {/* The stage: the call room alone on cream (#fffdf3, the hero's stage colour), the same padding all round. Full screen while the call runs. */}
        <div ref={slot} className="mt-[clamp(36px,5vw,64px)]" style={full ? { height: slotH } : undefined}>
        {/* Full screen drops the scroll-in transform, so the fixed stage always fills the screen. */}
        <motion.div style={full ? { opacity: 1, transform: 'none' } : scrub}
          className={'overflow-hidden bg-[#fffdf3] ' + (full
            ? 'ie-full fixed inset-0 z-[80] grid place-items-center rounded-none p-4 sm:p-8'
            : 'relative rounded-[22px] p-3 sm:rounded-[28px] sm:p-6 lg:p-8')}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cardGrainPaper} />
          {/* In full screen: leave it. Back in the page mid-call: go full screen again. */}
          {(full || inCall) && (
            <button type="button" onClick={() => (full ? setFull(false) : goFull())} aria-label={full ? 'Exit full screen' : 'Full screen'}
              className={'absolute z-10 inline-flex cursor-pointer items-center gap-2 rounded-full border-0 font-sans text-[14px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 '
                + (full ? 'right-4 top-4 h-10 bg-white/80 px-4 text-ink hover:bg-white focus-visible:outline-ink sm:right-8 sm:top-8'
                  // In the page: in the call's own top bar (its right end is free), styled for the dark room.
                  : 'right-6 top-6 h-8 bg-white/10 px-2.5 text-[13px] text-white/85 hover:bg-white/15 focus-visible:outline-white sm:right-9 sm:top-9 lg:right-11 lg:top-11 lg:px-3')}>
              {full ? <><Minimize2 className="size-4" />Exit full screen</> : <><Maximize2 className="size-3.5" /><span className="hidden sm:inline">Full screen</span></>}
            </button>
          )}
          <div className={'relative w-full ' + (full ? 'mx-auto max-w-[1120px]' : '')}>
            <InterviewRoom script={SCRIPTS.whyFrank} reduced={reduce} onPhase={onPhase} typeOption={false}
              className={'w-full rounded-[20px] shadow-[0_30px_70px_-30px_rgba(14,16,22,0.55)] ' + (full ? 'h-[min(760px,calc(100svh-168px))]' : 'h-[620px]')} />
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
