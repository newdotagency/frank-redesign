// Section entrances (V19): a part rises 24px and fades in once, the first time it scrolls into
// view. Parts of one section use small delays (0, 0.08, 0.16 …) so they arrive in reading order.
// Reduced motion: a plain fade, no movement.
//
//   reveal(reduce, delay)       — spread onto a motion element; plays when that element is in view.
//   useEntrance(ref) + enter()  — for a section's opening group: plays when the group is in view, but
//                                 queued behind any section that started just before, so two sections
//                                 arriving on screen together (the logos and "What is Frank") play one
//                                 after the other, not at once.
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1];

const states = (reduce, y, fadeOnly) => ({
  hidden: fadeOnly || reduce ? { opacity: 0 } : { opacity: 0, transform: `translateY(${y}px)` },
  shown: fadeOnly || reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px)' },
});
const timing = (reduce, delay) => ({ duration: reduce ? 0.4 : 0.8, ease: EASE, delay });

export const reveal = (reduce, delay = 0, { y = 24, amount = 0.3, fadeOnly = false } = {}) => {
  const s = states(reduce, y, fadeOnly);
  return { initial: s.hidden, whileInView: s.shown, viewport: { once: true, amount }, transition: timing(reduce, delay) };
};

// When the last queued section's entrance is far enough along for the next one to start (ms).
let queueEnd = 0;

// true once the group has come into view and its turn in the queue has come.
// span: seconds the group holds the queue (its staggered parts mostly in place).
export function useEntrance(ref, { span = 0.7, amount = 0.3 } = {}) {
  const inView = useInView(ref, { once: true, amount });
  const [go, setGo] = useState(false);
  const startAt = useRef(0);
  useEffect(() => {
    if (!inView) return;
    if (!startAt.current) {
      const now = performance.now();
      startAt.current = Math.max(now, queueEnd);
      queueEnd = startAt.current + span * 1000;
    }
    const t = setTimeout(() => setGo(true), Math.max(0, startAt.current - performance.now()));
    return () => clearTimeout(t);
  }, [inView, span]);
  return go;
}

export const enter = (reduce, go, delay = 0, { y = 24, fadeOnly = false } = {}) => {
  const s = states(reduce, y, fadeOnly);
  return { initial: s.hidden, animate: go ? s.shown : s.hidden, transition: timing(reduce, delay) };
};
