// Highlighter stroke behind a word. It wipes on left→right like a pen pass (clip-path,
// so the brush ends never distort), plays once after the headline lands, and redraws
// when the word is hovered. Reduced motion: it just fades in, no wipe, no replay.
import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const HIDDEN = 'inset(0% 100% 0% 0%)';
const SHOWN = 'inset(0% 0% 0% 0%)';
// Drawing across the screen: strong ease-in-out. Rare (once per visit), so it may take longer than UI motion.
const DRAW = { duration: 0.75, ease: [0.77, 0, 0.175, 1] };

// color/shade: brush body and the lighter ink-pooling band (V1 lime by default; V3 uses white on its lime field).
export default function HighlightMarker({ children, delay = 0, reduced = false, color = '#d1f899', shade = '#c4ef84' }) {
  const controls = useAnimationControls();
  const busy = useRef(false);

  useEffect(() => {
    if (reduced) {
      controls.set({ clipPath: SHOWN, opacity: 0 });
      controls.start({ opacity: 1, transition: { duration: 0.4, ease: 'easeOut', delay } });
      return;
    }
    busy.current = true;
    controls.set({ clipPath: HIDDEN, opacity: 1 });
    controls.start({ clipPath: SHOWN, transition: { ...DRAW, delay } }).then(() => { busy.current = false; });
  }, [controls, delay, reduced]);

  // Hover redraw: only on real hover devices, never while a pass is running.
  const redraw = e => {
    if (reduced || busy.current || e.pointerType !== 'mouse') return;
    busy.current = true;
    controls.set({ clipPath: HIDDEN });
    controls.start({ clipPath: SHOWN, transition: DRAW }).then(() => { busy.current = false; });
  };

  return (
    <span className="relative inline-block isolate" onPointerEnter={redraw}>
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute -left-[0.08em] right-[0.04em] bottom-[0.1em] -z-10 h-[0.38em] -skew-x-12">
        <motion.svg viewBox="0 0 200 24" preserveAspectRatio="none" className="block h-full w-full"
          initial={{ clipPath: reduced ? SHOWN : HIDDEN, opacity: reduced ? 0 : 1 }} animate={controls}>
          {/* Brush body with slightly uneven edges, plus a lighter ink-pooling pass along the bottom */}
          <path fill={color}
            d="M4.5 7.2C38 3.9 92 2.6 148 3.4c18 .3 34 .9 47.6 1.9 2.4 3.9 2.7 9.6 1.2 14.6-30.6 2.2-77 3.5-126 2.9-23.2-.3-45.5-1.2-66-2.6C.9 15.9.6 11.1 4.5 7.2Z" />
          <path fill={shade} opacity="0.55"
            d="M6 15.8c42 2.3 104 2.6 189.5-.6-.4 1.4-.9 2.7-1.6 3.9-33 2-80 3-128.6 2.5-21-.2-41.4-.9-58.6-2-.6-1.2-.9-2.5-.7-3.8Z" />
        </motion.svg>
      </span>
    </span>
  );
}
