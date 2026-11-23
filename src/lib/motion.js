import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// One spring vocabulary for the whole hero. No linear, no abrupt steps.
export const spring = {
  soft:   { type: 'spring', visualDuration: 0.9,  bounce: 0 },    // entrances, large moves
  smooth: { type: 'spring', visualDuration: 0.45, bounce: 0.12 }, // hovers, state changes
  snappy: { type: 'spring', visualDuration: 0.25, bounce: 0.2 },  // presses, toggles
};

export const STAGGER = 0.08;

// Staggered entrance: fade + slight rise + blur-in. `custom` is the step index.
export const enter = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  show: i => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { ...spring.soft, delay: 0.05 + i * STAGGER },
    transitionEnd: { filter: 'none' } }), // drop the filter so it can't trap fixed/stacked children
};

// Slightly magnetic hover: the element leans toward the pointer and springs back.
// `lift` adds a hover raise in px that composes with the magnetic offset.
export function useMagnetic({ strength = 0.22, lift = 0 } = {}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0), ml = useMotionValue(0);
  const cfg = { stiffness: 240, damping: 20, mass: 0.5 };
  const x = useSpring(mx, cfg), yRaw = useSpring(my, cfg), l = useSpring(ml, cfg);
  const y = useTransform([yRaw, l], ([a, b]) => a + b);

  const onPointerMove = e => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    if (reduced) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onPointerEnter = e => { if (e.pointerType === 'mouse' && !reduced) ml.set(-lift); };
  const onPointerLeave = () => { mx.set(0); my.set(0); ml.set(0); };

  return { ref, style: { x, y }, handlers: { onPointerMove, onPointerEnter, onPointerLeave } };
}
