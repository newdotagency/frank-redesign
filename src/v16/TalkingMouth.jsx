// MouthTile — V16's tile for the V9 pixel field, in place of the speech bubble: a hand-drawn mouth
// that talks, in the same stop-motion language as the research tiles (ink outlines that "boil",
// stippled shading, grain on the ground, stepped timing). Four mouth shapes (closed, "ah", "ee",
// "oo") swap on a 2.4 s loop like lip-sync frames and sound arcs pulse out of both corners while
// it speaks. All motion is CSS (talking-mouth.css); the boil, speck and grain filters come from
// <ResearchDefs />, which PixelField renders.
import './talking-mouth.css';

const INK = '#1a1714', PAPER = '#fcfcfb', LIP = '#d1b2ff', TONGUE = '#ba86fc';

// Drawn on a 240 × 160 board, then scaled (0.72) to fill the 160 tile; strokes are set for that scale.
const FRAMES = {
  closed: {
    lips: 'M36 80C58 58 86 50 104 56 112 59 116 62 120 60 124 62 128 59 136 56 154 50 182 58 204 80 184 100 154 110 120 110 86 110 56 100 36 80Z',
    line: 'M46 81C70 86 96 88 120 87 144 88 170 86 194 81',
    shine: 'M92 100C102 104 112 105 118 105',
  },
  ah: {
    lips: 'M36 78C58 50 86 40 104 46 112 49 116 52 120 50 124 52 128 49 136 46 154 40 182 50 204 78 186 116 156 132 120 132 84 132 54 116 36 78Z',
    hole: 'M50 78C74 70 100 66 120 68 140 66 166 70 190 78 172 104 148 114 120 114 92 114 68 104 50 78Z',
    teeth: 'M64 76C84 71 104 69 120 70 136 69 156 71 176 76L172 83C156 80 138 79 120 79 102 79 84 80 68 83Z',
    tongue: 'M84 108C92 96 108 92 120 96 132 92 148 96 156 108 146 113 134 115 120 115 106 115 94 113 84 108Z',
    shine: 'M92 124C102 128 112 129 118 129',
  },
  ee: {
    lips: 'M30 80C54 62 84 56 104 60 112 62 116 64 120 63 124 64 128 62 136 60 156 56 186 62 210 80 188 100 156 108 120 108 84 108 52 100 30 80Z',
    hole: 'M46 80C72 75 98 73 120 74 142 73 168 75 194 80 170 93 146 97 120 97 94 97 70 93 46 80Z',
    teeth: 'M58 79C80 76 100 75 120 75.5 140 75 160 76 182 79L179 86C160 84 140 83 120 83 100 83 80 84 61 86Z',
    shine: 'M92 101C102 103 110 104 116 104',
  },
  oo: {
    lips: 'M64 80C66 54 92 44 120 48 148 44 174 54 176 80 174 108 148 122 120 122 92 122 66 108 64 80Z',
    hole: 'M100 84C100 70 110 64 120 64 130 64 140 70 140 84 140 98 130 104 120 104 110 104 100 98 100 84Z',
    tongue: 'M106 98C112 92 128 92 134 98 128 102 112 102 106 98Z',
    shine: 'M104 113C110 116 116 116 121 116',
  },
};

function Frame({ name, f }) {
  return (
    <g className={'tm-f tm-' + name}>
      <g className="rt-boil" strokeLinejoin="round" strokeLinecap="round">
        <path d={f.lips} fill={LIP} stroke={INK} strokeWidth="7" />
        {/* stippled shade on the lower right of the lips */}
        <path d={f.lips} fill={INK} opacity="0.55" filter="url(#rt-speck)" clipPath="url(#tm-shade)" />
        {f.hole && <path d={f.hole} fill={INK} stroke={INK} strokeWidth="5" />}
        {f.teeth && <path d={f.teeth} fill={PAPER} />}
        {f.tongue && <path d={f.tongue} fill={TONGUE} />}
        {f.line && <path d={f.line} fill="none" stroke={INK} strokeWidth="6" />}
        <path d={f.shine} fill="none" stroke={PAPER} strokeWidth="6" />
      </g>
    </g>
  );
}

export function MouthTile({ bg = '#ece1fd' }) {
  return (
    <svg className="tm" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="tm-shade" clipPathUnits="userSpaceOnUse"><path d="M120 92H240V160H120Z" /></clipPath>
      </defs>
      <rect width="160" height="160" fill={bg} />
      <g transform="translate(-6.4 16.6) scale(0.72)">
        {/* sound arcs out of both corners, pulsing while it talks */}
        <g className="rt-boil" fill="none" stroke={INK} strokeWidth="6.5" strokeLinecap="round">
          <path className="tm-wave" d="M20 64C12 74 12 88 20 98" />
          <path className="tm-wave" d="M220 64C228 74 228 88 220 98" />
        </g>
        {Object.entries(FRAMES).map(([name, f]) => <Frame key={name} name={name} f={f} />)}
      </g>
      <rect className="rt-grain" width="160" height="160" filter="url(#rt-grain)" />
    </svg>
  );
}
