// Section entrances (V21), after Lassie (lassie.ai): everything is tied to scroll position, not a
// timer. It moves as the page moves, pauses when the scroll pauses and runs back on the way up.
// Progress goes through a light spring, so a mouse wheel's steps read as one glide.
//
//   ScrubText     — a label, paragraph or row rising 30px and fading in as its top travels from
//                   92% to 60% of the viewport. `lag` (0–0.3) holds it back a little behind its
//                   neighbours. `offset` overrides the range: paragraphs set beside a title, ending on
//                   its last line, time from their bottom edge (END_OFFSET) so they follow the title.
//   ScrubTitle    — a section title, line by line: each line slides up from behind its own edge
//                   (like the hero headline), a little behind the one above.
//   useScrubIn    — a big stage (the call, the shop, the step card) rising 64px and growing from
//                   94% as it scrolls in.
// Reduced motion: everything only fades, nothing moves or grows.
import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion';

export { reveal } from '../v19/reveal';

const SPRING = { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0005 };
const TEXT_OFFSET = ['start 0.92', 'start 0.6'];
export const END_OFFSET = ['end 1.05', 'end 0.72'];

function useProgress(target, offset) {
  const { scrollYProgress } = useScroll({ target, offset });
  return useSpring(scrollYProgress, SPRING);
}

export function ScrubText({ as = 'div', reduce, lag = 0, offset = TEXT_OFFSET, className, children, ...rest }) {
  const ref = useRef(null);
  const p = useProgress(ref, offset);
  const opacity = useTransform(p, [lag, lag + 0.6], [0, 1]);
  const y = useTransform(p, [lag, 1], [reduce ? 0 : 30, 0]);
  const transform = useMotionTemplate`translateY(${y}px)`;
  const M = motion[as];
  return <M ref={ref} style={reduce ? { opacity } : { opacity, transform }} className={className} {...rest}>{children}</M>;
}

// One line of a title. The padding and matching negative margin give descenders room inside the clip.
function TitleLine({ p, i, reduce, children }) {
  const range = [i * 0.14, i * 0.14 + 0.62];
  const y = useTransform(p, range, [105, 0]);
  const opacity = useTransform(p, range, [0, 1]);
  const transform = useMotionTemplate`translateY(${y}%)`;
  return (
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <motion.span className="block" style={reduce ? { opacity } : { transform }}>{children}</motion.span>
    </span>
  );
}

export function ScrubTitle({ as = 'h2', lines, reduce, className, ...rest }) {
  const ref = useRef(null);
  const p = useProgress(ref, TEXT_OFFSET);
  const T = as;
  return (
    <T ref={ref} className={className} {...rest}>
      {lines.map((l, i) => <TitleLine key={i} p={p} i={i} reduce={reduce}>{l}</TitleLine>)}
    </T>
  );
}

// offset: from the target's top meeting the viewport's bottom to its top at 55% of the viewport.
export function useScrubIn(target, reduce, { offset = ['start end', 'start 0.55'], y = 64, from = 0.94 } = {}) {
  const p = useProgress(target, offset);
  const opacity = useTransform(p, [0, 0.55], [0, 1]);
  const ty = useTransform(p, [0, 1], [reduce ? 0 : y, 0]);
  const sc = useTransform(p, [0, 1], [reduce ? 1 : from, 1]);
  const transform = useMotionTemplate`translateY(${ty}px) scale(${sc})`;
  return reduce ? { opacity } : { opacity, transform };
}
