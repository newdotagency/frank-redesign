// Template icon from the Frank Components library (Figma › Template-Icons, Size=Small).
// The glyph sits centred in a fixed box so every chip lines up; it draws in currentColor,
// so the chip decides whether it is neutral or in the template's own colour.
//
// Hover motion: each icon moves one meaningful part, never its size. Classes (ti-*) live
// in index.css, gated to real hover devices and to prefers-reduced-motion: no-preference.
// Origins are in the glyph's own user units (SVG default transform-box: view-box).
import { TEMPLATE_ICONS } from '../data/templateIcons';

// For each template: a class for the whole glyph and/or for specific path indexes.
const MOTION = {
  churn:      { paths: { 2: 'ti-slide-x' } },                               // minus slides out
  activation: { all: 'ti-tilt', origin: '7.3px 12.5px' },                   // barrier tips back
  trial:      { all: 'ti-flip', origin: '6.5px 6.5px' },                    // coin flips
  adoption:   { paths: { 0: 'ti-spin' }, origin: '6.125px 6.125px' },       // sparkle twinkles
  funnel:     { paths: { 4: 'ti-slide-down' } },                            // arrow drops
  engagement: { paths: { 0: 'ti-draw-rev' }, draw: [0] },                   // bars redraw bottom-up
  upgrade:    { paths: { 1: 'ti-lift' } },                                  // shackle unlocks
  requests:   { all: 'ti-swing', origin: '5.15px 0.65px' },                 // bulb swings from top
  value:      { paths: { 0: 'ti-draw' }, draw: [0] },                       // heart traces itself
  checkout:   { all: 'ti-slide-x' },                                        // card swipes
  downgrade:  { paths: { 1: 'ti-slide-down', 2: 'ti-slide-down' } },        // arrow steps down
};

export default function PlaybookIcon({ p, box = 16, className = '' }) {
  const ic = TEMPLATE_ICONS[p.id];
  if (!ic) return null;
  const m = MOTION[p.id] || {};
  const origin = m.origin ? { transformOrigin: m.origin } : undefined;
  return (
    <span aria-hidden="true" className={'grid shrink-0 place-items-center ' + className} style={{ width: box, height: box }}>
      <svg width={ic.w} height={ic.h} viewBox={ic.vb} fill="none" overflow="visible">
        <g className={m.all} style={m.all ? origin : undefined}>
          {ic.paths.map((pt, i) => {
            const cls = m.paths?.[i];
            const draws = m.draw?.includes(i);
            return (
              <path key={i} d={pt.d} className={cls} style={cls ? origin : undefined}
                pathLength={draws ? 1 : undefined}
                stroke={pt.sw ? 'currentColor' : undefined} strokeWidth={pt.sw}
                fill={pt.fill ? 'currentColor' : 'none'}
                strokeLinecap="round" strokeLinejoin="round" />
            );
          })}
        </g>
      </svg>
    </span>
  );
}
