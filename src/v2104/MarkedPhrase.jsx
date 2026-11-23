// MarkedPhrase (V21.04): the styled phrase of a page's first section title after the hero (user rule, 2026-11-23:
// only that title gets this look; later section titles are plain). The phrase in the Lora italic, under the lime
// highlighter, which draws once the phrase scrolls into view (HighlightMarker plays when it mounts).
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import HighlightMarker from '../components/HighlightMarker';

export default function MarkedPhrase({ children, reduce, delay = 0.35 }) {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, amount: 0.8 });
  const phrase = <span className="italic">{children}</span>;
  return (
    <span ref={ref} className="relative inline-block">
      {on ? <HighlightMarker reduced={reduce} delay={delay}>{phrase}</HighlightMarker> : phrase}
    </span>
  );
}
