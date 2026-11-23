// Grain gradient (handhold.io-style): soft, blurred colour fields in Frank's system colours —
// one low ribbon along the bottom, brand green melting into violet — with a
// fine stipple grain on top. All of it is ONE CSS background on the hero card, so it fills the
// card exactly, scales with the scroll wrap for free (compositor transform, no repaint) and
// costs nothing per frame. The grain also dithers away gradient banding.
const CANVAS = '#F9F8F5';

// Stipple: fractal noise turned into sparse warm-ink specks (alpha only), tiled.
const speck = (seed, rgb, a, b) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${a} 0 0 0 ${b}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
  )}")`;

export const GRAIN = speck(7, [0.10, 0.08, 0.06], 1.8, -0.86);          // dark specks
export const GRAIN_LIGHT = speck(23, [1, 1, 1], 1.8, -0.86);            // light specks (stipple on colour)

// Frank system colours: brand green (#d1f899 / strong #a0d05f) and violet (#d1b2ff / #ba86fc).
// One low ribbon hugging the bottom edge: brand green on the left melting into violet on the
// right, through a lighter, mixed middle. Wide but shallow (about a quarter of the hero high),
// so the top three quarters stay plain canvas. Ellipse centres sit just below the edge, so the
// colour rises from the bottom instead of floating as blobs.
export const FIELDS = [
  'radial-gradient(30% 26% at 14% 104%, rgba(184,232,118,0.90) 0%, rgba(209,248,153,0.50) 42%, rgba(209,248,153,0) 80%)',
  'radial-gradient(30% 26% at 86% 104%, rgba(186,134,252,0.70) 0%, rgba(209,178,255,0.42) 42%, rgba(209,178,255,0) 80%)',
  'radial-gradient(26% 18% at 38% 106%, rgba(209,248,153,0.55) 0%, rgba(209,248,153,0) 78%)',
  'radial-gradient(26% 18% at 62% 106%, rgba(209,178,255,0.50) 0%, rgba(209,178,255,0) 78%)',
];

export const GRAIN_GRADIENT = [GRAIN + ' 0 0 / 220px 220px repeat', GRAIN_LIGHT + ' 0 0 / 220px 220px repeat', ...FIELDS, CANVAS].join(', ');
