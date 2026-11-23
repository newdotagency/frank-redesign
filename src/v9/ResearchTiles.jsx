// ResearchTiles — fps.hu-style animated illustrations for the V9 pixel clusters.
// Hand-drawn research objects (magnifier over a line chart, note, pen, bulb, bar chart, speech
// bubble), with grain on the tile ground, stippled shading and stop-motion "boiling" lines.
// All motion is CSS (ResearchTiles.css); <ResearchDefs /> must be rendered once on the page.
// Each illustration fills its tile (width/height 100%) and is decorative (the field is aria-hidden).
import './ResearchTiles.css';

const INK = '#1a1714', LIME = '#d1f899', LIME_S = '#86b648', LIME_50 = '#f4fde6', LIME_800 = '#455b24';
const VIOLET = '#d1b2ff', VIOLET_5 = '#ba86fc', VIOLET_2 = '#ece1fd', PAPER = '#fcfcfb';

const rough = (id, seed) => (
  <filter id={id} filterUnits="userSpaceOnUse" x="-200" y="-200" width="720" height="720">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} />
    <feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

export function ResearchDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="rt-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.2" intercept="-0.6" />
            <feFuncG type="linear" slope="2.2" intercept="-0.6" />
            <feFuncB type="linear" slope="2.2" intercept="-0.6" />
            <feFuncA type="linear" slope="0" intercept="1" />
          </feComponentTransfer>
        </filter>
        <filter id="rt-speck" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.08  6 0 0 0 -3.1" result="d" />
          <feComposite in="d" in2="SourceAlpha" operator="in" />
        </filter>
        {rough('rt-r1', 2)}{rough('rt-r2', 7)}{rough('rt-r3', 13)}
        <pattern id="rt-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill={PAPER} />
          <path d="M0 0V8" stroke={INK} strokeWidth="2.5" />
        </pattern>
      </defs>
    </svg>
  );
}

const Tile = ({ size = 160, bg, children }) => (
  <svg viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <rect width={size} height={size} fill={bg} />
    {children}
    <rect className="rt-grain" width={size} height={size} filter="url(#rt-grain)" />
  </svg>
);

// Magnifier scanning a hand-drawn line chart; circles the peak. (2×2-ish tile)
export const MagnifierChart = ({ bg = LIME }) => (
  <Tile size={320} bg={bg}>
    <g className="rt-boil" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 46V264H288" />
      <path d="M38 96H56M38 146H56M38 196H56" />
      <path d="M110 256V274M180 256V274M250 256V274" />
    </g>
    <g className="rt-boil">
      <path className="rt-draw rt-dl" pathLength="1" d="M62 230C78 214 88 196 100 196S124 214 136 210 158 158 170 156 194 176 206 170 230 116 242 110 266 96 276 90" stroke={INK} strokeWidth="7" />
      <path className="rt-draw rt-dc" pathLength="1" d="M224 104C220 84 254 78 262 98 270 118 240 128 226 118 214 108 226 90 246 88" stroke="#8931da" strokeWidth="6" />
    </g>
    <g fill={VIOLET_5} stroke={INK} strokeWidth="4">
      <circle className="rt-dot" cx="100" cy="196" r="9" style={{ animationDelay: '0.5s' }} />
      <circle className="rt-dot" cx="170" cy="156" r="9" style={{ animationDelay: '1.25s' }} />
      <circle className="rt-dot" cx="242" cy="110" r="9" style={{ animationDelay: '2.05s' }} />
    </g>
    <g className="rt-scan">
      <g className="rt-tilt">
        <g className="rt-flick" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
          <path d="M0-56V-70M40-40 50-50M-40-40-50-50M-56 0H-70M-40 40-50 50M56 0H70" />
        </g>
        <path d="M30 30 72 72" stroke={INK} strokeWidth="18" strokeLinecap="round" />
        <path d="M26 26 38 38" stroke="#5c554d" strokeWidth="22" />
        <circle r="38" fill={PAPER} fillOpacity="0.45" />
        <path d="M9 34A35 35 0 0 0 34 9H22A23 23 0 0 1 9 22Z" fill={INK} filter="url(#rt-speck)" />
        <path d="M-22-9A24 24 0 0 1-7-23" fill="none" stroke={PAPER} strokeWidth="6" strokeLinecap="round" />
        <circle r="38" fill="none" stroke={INK} strokeWidth="11" />
      </g>
    </g>
  </Tile>
);

// Minimal magnifier from the V9 design file: a lens glides over transcript lines and really
// magnifies them (the content inside the lens counter-moves at 1.8x), then sparks on the
// highlighted phrase. The transform attributes are the resting pose for reduced motion.
const TRANSCRIPT = [
  'M48 110H98M112 110H170M184 110H236M250 110H274',
  'M48 140H78M92 140H150M164 140H230M244 140H274',
  'M48 170H110M124 170H186M200 170H252',
  'M48 200H128M142 200H196M210 200H262',
  'M48 230H90M104 230H170',
];
const MARK = 'M200 170H252';

export const Magnifier = ({ bg = LIME }) => (
  <Tile size={320} bg={bg}>
    <defs>
      <clipPath id="rt-lens" clipPathUnits="userSpaceOnUse"><circle r="50" /></clipPath>
    </defs>
    <g className="rt-boil" fill="none" stroke={LIME_S} strokeWidth="7" strokeLinecap="round">
      <path d={MARK} stroke={VIOLET} strokeWidth="20" />
      {TRANSCRIPT.map((d) => <path key={d} d={d} />)}
    </g>
    <g className="rt-lens-move" transform="translate(222 178)">
      <path d="M28 28 82 82" stroke={INK} strokeWidth="24" strokeLinecap="round" />
      <path d="M42 50 50 42M54 62 62 54M66 74 74 66" stroke="#a0d05f" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 24 36 36" stroke="#5c554d" strokeWidth="30" />
      <circle r="50" fill={PAPER} />
      <g clipPath="url(#rt-lens)">
        <g className="rt-lens-zoom" transform="translate(-399.6 -320.4) scale(1.8)">
          <rect width="320" height="320" fill={LIME_50} />
          <g fill="none" stroke="#58782c" strokeWidth="7" strokeLinecap="round">
            <path d={MARK} stroke={VIOLET} strokeWidth="20" />
            {TRANSCRIPT.map((d) => <path key={d} d={d} />)}
            <path d="M226 170H252" stroke={INK} />
          </g>
        </g>
        <path d="M-10 46A48 48 0 0 0 46 -10H34A36 36 0 0 1-10 34Z" fill={INK} filter="url(#rt-speck)" opacity="0.7" />
      </g>
      <path className="rt-boil" d="M-32 -6A34 34 0 0 1-8 -32" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <circle className="rt-boil" r="50" fill="none" stroke={INK} strokeWidth="14" />
      <g className="rt-lens-spark" fill="none" stroke="#8931da" strokeWidth="5" strokeLinecap="round">
        <path d="M44 -56 52 -66M62 -40 74 -44M20 -66 20 -78" />
      </g>
    </g>
  </Tile>
);

const scribble = 'c5 -8 8 5 13 0s8 -8 13 0 8 5 13 0 8 -8 13 0';

// Notepad: lines get written one by one, then a box is ticked.
export const Note = ({ bg = VIOLET }) => (
  <Tile bg={bg}>
    <g className="rt-wig">
      <g transform="rotate(-5 80 82)">
        <path className="rt-boil" d="M40 30 122 28 124 130 106 138 42 136Z" fill={PAPER} stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M42 38H54V134H42Z" fill={INK} filter="url(#rt-speck)" />
        <path d="M124 130 106 138 108 124Z" fill="#cec9c1" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <g fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round">
          <path d="M58 38C56 22 67 20 67 31M76 38C74 22 85 20 85 31M94 38C92 22 103 20 103 31" />
        </g>
        <g stroke={INK} strokeWidth="4">
          <path className="rt-draw rt-w" pathLength="1" d={`M58 58${scribble}`} />
          <path className="rt-draw rt-w" pathLength="1" d={`M58 78${scribble}`} style={{ animationDelay: '0.75s' }} />
          <path className="rt-draw rt-w" pathLength="1" d="M80 112c5 -6 8 3 12 0s7 -6 12 0" style={{ animationDelay: '2.6s' }} />
        </g>
        <rect x="58" y="102" width="15" height="15" rx="2" fill="none" stroke={INK} strokeWidth="3.5" />
        <path className="rt-draw rt-w" pathLength="1" d="M59 107 65 115 80 96" stroke={LIME_800} strokeWidth="6" style={{ animationDelay: '2.1s' }} />
      </g>
    </g>
  </Tile>
);

// Pen writing a line, with looping scribbles behind (the fps pencil tile).
export const Pen = ({ bg = VIOLET_2 }) => (
  <Tile bg={bg}>
    <g className="rt-boil" fill="none" stroke={VIOLET_5} strokeWidth="5" strokeLinecap="round">
      <path d="M-6 54C20 20 40 70 22 84 4 98-4 60 30 46 64 32 70 64 96 52 122 40 116 8 166 22" />
      <path d="M60 170C70 140 100 150 108 138 118 122 96 116 104 104 114 90 150 110 170 96" />
    </g>
    <path className="rt-draw rt-pw rt-boil" pathLength="1" d="M28 128c6 -10 10 6 14 -2s8 -12 12 -2 6 8 12 -4 8 -10 12 0 8 6 12 -4 6 -6 10 2" stroke={INK} strokeWidth="5" />
    <g className="rt-pen">
      <g transform="rotate(35)">
        <rect x="-10" y="-58" width="20" height="76" rx="5" fill={INK} />
        <path d="M-5-50V0" stroke="#5c554d" strokeWidth="3" strokeLinecap="round" />
        <path d="M6-54V-22" stroke={VIOLET} strokeWidth="4" strokeLinecap="round" />
        <rect x="-10" y="6" width="20" height="12" fill="#cec9c1" />
        <path d="M-10 18H10L2.5 44H-2.5Z" fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 18H10L2.5 44H0Z" fill={INK} filter="url(#rt-speck)" />
        <path d="M-2.5 44H2.5L0 50Z" fill={INK} />
      </g>
    </g>
  </Tile>
);

// Light bulb flickers on, glows and throws rays: the insight.
export const Bulb = ({ bg = '#433d37' }) => (
  <Tile size={320} bg={bg}>
    <g transform="translate(160 166) scale(1.55) translate(-80 -67)">
      <g className="rt-bulb-ring" fill="none" stroke={LIME} strokeWidth="2.5" opacity="0"><circle cx="80" cy="64" r="46" /></g>
      <g className="rt-bulb-burst rt-boil" fill="none" stroke={LIME} strokeWidth="5" strokeLinecap="round">
        <path d="M80 14V0M118 28 128 18M134 62H148M124 98 134 106M36 98 26 106M26 62H12M42 28 32 18" />
      </g>
      <g className="rt-boil">
        <path className="rt-bulb-lit" d="M80 34C61 34 50 49 50 64 50 77 59 83 63 91 65 96 65 101 65 105H95C95 101 95 96 97 91 101 83 110 77 110 64 110 49 99 34 80 34Z" fill={LIME} stroke="#f9f8f6" strokeWidth="4" strokeLinejoin="round" />
        <path d="M86 37C101 40 110 51 110 64 110 77 101 83 97 91 95 96 95 101 95 103H88Z" fill={INK} opacity="0.5" filter="url(#rt-speck)" />
        <path className="rt-draw rt-bulb-fil" pathLength="1" d="M72 103V86C72 76 64 70 70 62 76 54 88 58 86 68 84 78 72 74 76 64 80 54 94 58 90 70 88 78 88 84 88 103" stroke={INK} strokeWidth="3.5" />
        <path d="M60 62C60 52 66 45 74 42" fill="none" stroke={PAPER} strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <rect x="65" y="105" width="30" height="8" rx="1.5" fill="#cec9c1" />
      <rect x="66" y="114" width="28" height="7" rx="1.5" fill="#a59f98" />
      <rect x="67" y="122" width="26" height="6" rx="1.5" fill="#cec9c1" />
      <path d="M73 129H87L84 136H76Z" fill="#7d766e" />
    </g>
  </Tile>
);

// Hatched bars grow in turn, then a rising trend arrow draws in.
export const Bars = ({ bg = LIME_50 }) => (
  <Tile bg={bg}>
    <path className="rt-boil" d="M28 26V134H140" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <g className="rt-boil" stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <rect className="rt-bar" x="38" y="102" width="20" height="32" fill="url(#rt-hatch)" />
      <rect className="rt-bar" x="64" y="82" width="20" height="52" fill="url(#rt-hatch)" style={{ animationDelay: '0.3s' }} />
      <rect className="rt-bar" x="90" y="94" width="20" height="40" fill="url(#rt-hatch)" style={{ animationDelay: '0.6s' }} />
      <rect className="rt-bar" x="116" y="58" width="20" height="76" fill="url(#rt-hatch)" style={{ animationDelay: '0.9s' }} />
    </g>
    <g className="rt-boil" stroke={LIME_800} strokeWidth="5">
      <path className="rt-draw rt-tr" pathLength="1" d="M40 86C60 80 78 64 96 70 108 74 118 52 128 36" />
      <path className="rt-draw rt-tr" pathLength="1" d="M116 38 129 33 132 47" style={{ animationDelay: '0.6s' }} />
    </g>
  </Tile>
);

// Speech bubble with typing dots: Frank is mid-interview.
export const Bubble = ({ bg = VIOLET_2 }) => (
  <Tile bg={bg}>
    <path className="rt-boil" d="M28 38H132V104H72L46 126V104H28Z" fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <g fill={INK}>
      <circle className="rt-type" cx="58" cy="72" r="8" />
      <circle className="rt-type" cx="80" cy="72" r="8" style={{ animationDelay: '0.15s' }} />
      <circle className="rt-type" cx="102" cy="72" r="8" style={{ animationDelay: '0.3s' }} />
    </g>
  </Tile>
);

// An ear, listening: sound-wave arcs pulse in from the left, outermost first. Pairs with the
// speech bubble (customers talking, Frank listening).
export const Ear = ({ bg = LIME }) => (
  <Tile bg={bg}>
    <g className="rt-boil" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
      <path className="rt-wave" d="M20 50C6 68 6 94 20 112" />
      <path className="rt-wave" d="M33 58C23 72 23 90 33 104" style={{ animationDelay: '0.25s' }} />
      <path className="rt-wave" d="M46 66C40 74 40 88 46 96" style={{ animationDelay: '0.5s' }} />
    </g>
    <g className="rt-boil" strokeLinecap="round" strokeLinejoin="round">
      {/* silhouette: helix over the top and down the back to the lobe */}
      <path d="M72 50C72 30 88 20 104 22C124 25 134 42 132 62C130 80 118 88 112 100C106 112 108 126 96 134C86 141 72 138 68 128C64 118 66 106 68 94C70 80 72 66 72 50Z" fill={PAPER} stroke={INK} strokeWidth="5" />
      {/* concha shading (stipple) */}
      <path d="M94 64C86 68 85 80 92 86C98 90 106 84 104 74C103 68 99 63 94 64Z" fill={INK} filter="url(#rt-speck)" />
      {/* antihelix fold, tragus, lobe crease */}
      <path d="M86 54C90 43 106 41 114 51C120 59 116 71 108 77C102 82 100 89 100 97" fill="none" stroke={INK} strokeWidth="4.5" />
      <path d="M90 66C85 70 84 77 89 82" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M88 104C84 110 86 118 92 120" fill="none" stroke={INK} strokeWidth="4" />
    </g>
  </Tile>
);
