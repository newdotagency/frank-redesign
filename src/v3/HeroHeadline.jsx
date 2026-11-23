// HeroHeadline — headline + subline revealed line by line: each line slides up from
// behind its own clip (mask reveal). Timing/curve follow Lassie's motion scale:
// 1s on expo.out (≈ cubic-bezier(.16,1,.3,1)), lines staggered 120ms.
// Reduced motion: lines fade in place, no movement.
import { motion } from 'framer-motion';
import HighlightMarker from '../components/HighlightMarker';

export const EXPO_OUT = [0.16, 1, 0.3, 1];
const STEP = 0.12;

function MaskLine({ children, i, delay, reduced, className = '' }) {
  return (
    // Padding/negative margin give descenders room inside the clip without changing layout.
    <span className={'block overflow-hidden pb-[0.14em] -mb-[0.14em] ' + className}>
      <motion.span className="block"
        initial={reduced ? { opacity: 0 } : { y: '105%' }}
        animate={reduced ? { opacity: 1 } : { y: '0%' }}
        transition={{ duration: reduced ? 0.4 : 1, ease: EXPO_OUT, delay: delay + i * STEP }}>
        {children}
      </motion.span>
    </span>
  );
}

const SUB = ['Frank runs hundreds of AI-moderated interviews overnight', 'and brings back the answers, in your customers’ own words.'];
const SIZE = 'text-[clamp(44px,min(6.2vw,9vh),92px)]';

// sub / sizeClass / subClass let a version shorten the copy or resize (V6); defaults = V3/V4/V5.
export default function HeroHeadline({ reduced, delay = 0.15, markerColor = '#ffffff', markerShade = '#f1f3ea', sub = SUB, sizeClass = SIZE,
  subClass = 'mx-auto mt-4 max-w-[34ch] text-[16px] leading-[1.5] text-ink-2 sm:mt-7 sm:max-w-none sm:text-[19px] sm:leading-[1.55]' }) {
  const head = ['Ask your customers', 'anything.'];
  const subDelay = delay + head.length * STEP + 0.18;
  return (
    <>
      {/* Screen readers get each sentence whole; the animated line pieces are hidden from them. */}
      <h1 id="hero-title"
        className={'font-serif font-normal leading-[0.92] tracking-[-0.035em] text-ink ' + sizeClass}>
        <span className="sr-only">{head.join(' ')}</span>
        <span aria-hidden="true">
          <MaskLine i={0} delay={delay} reduced={reduced}>Ask your customers</MaskLine>
          {/* V1 treatment: "anything." in Lora italic with the hand-drawn marker. On the lime field the
              marker is white (flat, solid); it draws on once the line has risen into place. */}
          <MaskLine i={1} delay={delay} reduced={reduced}>
            <span className="italic">
              <HighlightMarker reduced={reduced} delay={delay + STEP + 0.85} color={markerColor} shade={markerShade}>anything.</HighlightMarker>
            </span>
          </MaskLine>
        </span>
      </h1>
      <p className={subClass}>
        <span className="sr-only">{sub.join(' ')}</span>
        {/* Phones: one clipped block (the desktop line breaks would wrap raggedly). sm+: line by line. */}
        <span aria-hidden="true" className="sm:hidden"><MaskLine i={0} delay={subDelay} reduced={reduced}>{sub.join(' ')}</MaskLine></span>
        <span aria-hidden="true" className="hidden sm:block">{sub.map((l, i) => <MaskLine key={l} i={i} delay={subDelay} reduced={reduced}>{l}</MaskLine>)}</span>
      </p>
    </>
  );
}

export const HEADLINE_DONE = 0.15 + 2 * STEP + 0.18 + 2 * STEP + 0.55; // seconds until the copy has settled
