// AmbientVoices — the hero's atmosphere. Everything here is an addition to the chat, never a
// rival: faint, small, behind the content, non-interactive, aria-hidden.
//  • Voice rings: 1px concentric rings centred on the input, like the rings of a recording.
//    They stay still. Each time the input is focused (clicked), ONE wave travels outward from
//    it and fades — the background answers the user's action, then goes quiet again.
//  • Voice chips: four tiny customer-quote chips at the edges, each cycling through short
//    quotes on its own offset timer. Small, pale, slow.
// Transform/opacity only. Reduced motion: rings static, chips fixed on their first quote.
import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';

const RING = '#e7e3db';  // warm grey, just off the canvas
const QUOTES = [
  ['MK', 'I didn’t know where to start'], ['JR', 'Too expensive for what I use'], ['AL', 'I’d pay for this'],
  ['SP', 'Setup took forever'], ['TD', 'I just want exports'], ['NB', 'Support saved me'],
  ['CW', 'I never saw the value'], ['EO', 'The reports are gold'], ['RV', 'Pricing confused me'],
  ['LH', 'It does too much'], ['GF', 'Onboarding was smooth'], ['YS', 'I forgot to come back'],
];
// Edge positions: the top pair (above the headline line) from 1280px; the lower pair (beside the input row) only from
// 1400px, where the side gutters are wide enough to keep clear of the input and templates.
const SPOTS = [
  { cls: 'left-[5%] top-[23%]', wide: false, start: 0 },
  { cls: 'right-[5%] top-[19%]', wide: false, start: 3 },
  { cls: 'left-[5%] top-[66%]', wide: true, start: 6 },
  { cls: 'right-[5%] top-[71%]', wide: true, start: 9 },
];

function Chip({ spot, k, reduced, start }) {
  const [i, setI] = useState(spot.start);
  useEffect(() => {
    if (reduced) return;
    let id;
    const t = setTimeout(() => { id = setInterval(() => setI(n => (n + 1) % QUOTES.length), 6400); }, 1600 * k + 2000);
    return () => { clearTimeout(t); clearInterval(id); };
  }, [reduced, k]);
  const [who, text] = QUOTES[i];
  return (
    <motion.div className={'absolute ' + spot.cls + (spot.wide ? ' hidden min-[1400px]:block' : ' hidden xl:block')}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.4 : 1.2, ease: EXPO_OUT, delay: start + k * 0.15 }}>
      <motion.div animate={reduced ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 9 + k * 1.3, ease: [0.45, 0, 0.55, 1], repeat: Infinity }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={i}
            className="inline-flex items-center gap-2 rounded-full bg-white/75 py-1 pl-1 pr-3 text-[12.5px] text-ink-3 shadow-[0_0_0_1px_rgba(26,23,20,0.07)]"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.7, ease: EXPO_OUT }}>
            <span className="grid size-[22px] place-items-center rounded-full bg-[#e9f8d1] text-[9.5px] font-medium tracking-[0.02em] text-[#455b24]">{who}</span>
            “{text}”
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// `fade` (V8): optional CSS mask image for the rings layer, e.g. to let them dissolve toward an edge.
export default function AmbientVoices({ anchorRef, containerRef, pulse = 0, reduced, start = 1.2, ring = RING, wave = '#d8d2c6', fade }) {
  // Centre the rings on the input (measured in the container's unscaled space).
  const [c, setC] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const a = anchorRef.current, box = containerRef.current; if (!a || !box) return;
      const b = box.getBoundingClientRect(), r = a.getBoundingClientRect();
      const k = b.width / (box.offsetWidth || 1);
      setC({ x: (r.left + r.width / 2 - b.left) / k, y: (r.top + r.height / 2 - b.top) / k });
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 1600); // after the entrance has settled
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, [anchorRef, containerRef]);

  const radii = [190, 290, 400, 520, 650, 790];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {c && (
        <motion.svg className="absolute inset-0 h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={fade ? { maskImage: fade, WebkitMaskImage: fade } : undefined}
          transition={{ duration: 1.6, ease: EXPO_OUT, delay: start - 0.4 }}>
          {radii.map((r, i) => (
            <circle key={r} cx={c.x} cy={c.y} r={r} fill="none" stroke={ring} strokeWidth="1" opacity={1 - i * 0.12} />
          ))}
          {!reduced && pulse > 0 && (
            // One wave per focus: keyed by the focus count so each click replays it exactly once.
            // Scaled (transform), stroke kept at 1px; strong ease-out so it leaves fast and settles.
            <motion.circle key={pulse} cx={c.x} cy={c.y} r={100} fill="none" stroke={wave} strokeWidth="1"
              vectorEffect="non-scaling-stroke" style={{ transformOrigin: `${c.x}px ${c.y}px`, transformBox: 'view-box' }}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: [1.8, 8], opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], times: [0, 0.12, 1] }} />
          )}
        </motion.svg>
      )}
      {SPOTS.map((s, k) => <Chip key={k} spot={s} k={k} reduced={reduced} start={start} />)}
    </div>
  );
}
