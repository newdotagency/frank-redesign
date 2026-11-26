// MidCTA (V21.04): the mid-page call to action, right after "Your customers love talking to Frank", while the
// proof is still fresh. A screen-tall card in Frank's brand lime (#d1f899, with the closing panel's soft top
// light), framed like the Interview example and Agentic cards. Frank's glasses above the title look up while
// the button is hovered; the title is section size; one subtitle and a single "Get started" button.
// "Try it now!" gets the hero's hand-drawn violet highlight once the title is in view.
// Entrance: the same as the Interview example and Agentic cards. Tied to the scroll, the card rises, fades
// up and opens out sideways from a narrower, inset shape to its full width (a clip, so its content never
// squashes), done as its top nears the upper fifth of the window; then the title lines slide up.
// Reduced motion keeps only the fade.
import { useRef, useState } from 'react';
import { motion, useInView, useMotionTemplate, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Glasses from '../v3/Glasses';
import HighlightMarker from '../components/HighlightMarker';
import { TITLE } from './titles';
import { ScrubText, ScrubTitle, useProgress } from './reveal';

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function MidCTA() {
  const reduce = !!useReducedMotion();
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: useTransform(cp, [0, 0.35], [0, 1]),
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  const [pose, setPose] = useState('Ready');
  const titleBox = useRef(null);
  const titleIn = useInView(titleBox, { once: true, amount: 0.6 });
  const tryIt = titleIn
    ? <HighlightMarker reduced={reduce} delay={0.5} color="#d1b2ff" shade="#c4a0fb">Try it now!</HighlightMarker>
    : <span className="relative inline-block">Try it now!</span>;

  return (
    // The same frame as the Interview example and Agentic cards: full width with a 16px (phones) / 40px
    // gap from the window's edges, a screen's height, 32/44px corners, the content centred inside.
    <section aria-labelledby="mc-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      <motion.div ref={card} style={cardIn}
        className="relative grid min-h-[calc(100svh-32px)] place-items-center overflow-hidden rounded-[32px] bg-[#d1f899] [--r:32px] md:[--r:44px] px-6 py-[clamp(64px,9vw,128px)] text-center md:min-h-[calc(100svh-80px)] md:rounded-[44px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 100%)' }} />
        <div className="relative mx-auto max-w-[900px]">
          <div aria-hidden="true" className="mx-auto w-[84px] sm:w-[104px]">
            <Glasses pose={pose} reduced={reduce} />
          </div>
          <div ref={titleBox}>
            <ScrubTitle reduce={reduce} id="mc-title"
              className={'m-0 mt-8 leading-[1.06] text-ink [text-wrap:balance] sm:mt-10 ' + TITLE}
              lines={['Frank is so good you’ll want', 'to send it to your customers.', <span key="t" className="italic">{tryIt}</span>]} />
          </div>
          <ScrubText as="p" reduce={reduce} lag={0.15}
            className="mx-auto mb-0 mt-5 max-w-[44ch] font-sans text-[17px] leading-[1.5] text-ink/75 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
            Get your first interview up in under 5 minutes and see for yourself!
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.25} className="mt-8 flex justify-center sm:mt-9">
            {/* The arrow sits in its own circle at the button's end and nudges forward on hover. */}
            <a href="https://app.hifrank.ai/signup" onPointerEnter={() => setPose('Curious')} onPointerLeave={() => setPose('Ready')}
              className={'group inline-flex h-14 items-center gap-3 rounded-full bg-black py-1.5 pl-6 pr-1.5 font-sans text-[16px] text-white no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#262626] active:scale-[0.98] ' + FOCUS}>
              Get started
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-white/[0.12] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
                <ArrowRight className="size-[18px]" strokeWidth={1.75} />
              </span>
            </a>
          </ScrubText>
        </div>
      </motion.div>
    </section>
  );
}
