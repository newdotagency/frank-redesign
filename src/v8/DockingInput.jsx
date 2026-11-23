// DockingInput — one composer, two homes, zero lag.
//  • Home: the composer is a real child of its slot in the hero, so it scrolls, wraps and
//    scales with the hero card natively (no JS position tracking).
//  • Dock: only once the slot is completely out of view (the first screen has scrolled away, or
//    the composer itself has left the viewport) does it move into a full-width bar that slides
//    up from the bottom edge. Scroll back until the slot is in view and it goes home again.
// It is the SAME HeroInput DOM node: React renders it into a portal host, and the host element
// is moved between the slot and the dock. Text, caret, focus and the typewriter carry over.
// Reduced motion: the bar fades instead of sliding.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';

// docked = the slot is entirely outside the viewport. Takes the slot ELEMENT (not a ref): the
// hero card can remount its content (e.g. when it upgrades to the native scroll timeline), and
// the observer must follow the live element.
export function useSlotOutOfView(slot) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (!slot) return;
    const io = new IntersectionObserver(([e]) => setOut(!e.isIntersecting), { threshold: 0 });
    io.observe(slot);
    return () => io.disconnect();
  }, [slot]);
  return out;
}

// Optional (V9): `maxWidth` centres the docked bar at that width instead of full width, and
// `aside` renders beside the bar on its left (e.g. Frank's glasses). Omitted = V8 behaviour.
// Optional (V21.02): `floor={false}` fades the white floor under the bar out (e.g. while a dark card is
// behind it). Omitted = on, as before.
export default function DockingInput({ slot, docked, reduced, children, maxWidth, aside, floor = true }) {
  const host = useMemo(() => { const d = document.createElement('div'); d.className = 'text-left'; return d; }, []);
  const dock = useRef(null);
  const [inDock, setInDock] = useState(false);

  // Move the host node. Keep the slot's height while the composer is away so nothing jumps.
  useLayoutEffect(() => {
    const target = docked ? dock.current : slot;
    if (!target || host.parentNode === target) return;
    const ta = host.querySelector('textarea');
    const hadFocus = ta && document.activeElement === ta;
    const sel = hadFocus ? [ta.selectionStart, ta.selectionEnd] : null;
    if (docked && slot) slot.style.minHeight = slot.offsetHeight + 'px';
    target.appendChild(host);
    if (hadFocus) { ta.focus({ preventScroll: true }); ta.setSelectionRange(...sel); }
    setInDock(docked);
  }, [docked, host, slot]);
  // Back home and laid out inline again (same frame, before paint): let the slot size itself.
  useLayoutEffect(() => { if (!inDock && slot) slot.style.minHeight = ''; }, [inDock, slot]);

  return (
    <>
      {createPortal(children(inDock), host)}

      {/* Soft floor under the dock so content scrolling beneath never fights the bar. */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-32"
        style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0))' }}
        initial={false} animate={{ opacity: docked && floor ? 1 : 0 }} transition={{ duration: 0.5, ease: EXPO_OUT }} />

      {/* The dock: same side gutters as the wrapped hero card (40 / 16px). */}
      <motion.div className="fixed inset-x-4 bottom-4 z-40 md:inset-x-10 md:bottom-7"
        style={{ pointerEvents: docked ? 'auto' : 'none' }}
        initial={false}
        animate={docked
          ? { y: 0, opacity: 1 }
          : { y: reduced ? 0 : 'calc(100% + 32px)', opacity: 0 }}
        transition={{ duration: reduced ? 0.25 : docked ? 0.7 : 0.35, ease: EXPO_OUT }}>
        <div className="relative mx-auto" style={maxWidth ? { maxWidth } : undefined}>
          {aside}
          <div ref={dock} />
        </div>
      </motion.div>
    </>
  );
}
