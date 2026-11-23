// Grain gradients (handhold.io-style, as in V8): soft colour fields in Frank's colours with a
// fine stipple on top, so colour dissolves into grain instead of fading smoothly. Everything is
// CSS backgrounds (data-URI SVG noise tiles), so it needs no <defs> on the page and costs
// nothing per frame.

// Stipple: fractal noise turned into sparse specks of one colour (alpha only), tiled.
// alpha = slope × noise + cut: a gentle slope gives a soft haze, a steep one crisp dots
// (raise `cut` toward 0 for more of them). `srgb` reads the noise in sRGB (values around 0.5)
// instead of the filter default, linearRGB (values around 0.2). `opacity` scales the specks.
const speck = (seed: number, rgb: [number, number, number], cut: number, slope = 1.8, srgb = false, opacity = 1) =>
    `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n' x='0' y='0'${srgb ? " color-interpolation-filters='sRGB'" : ''}><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${slope} 0 0 0 ${cut}'/><feComponentTransfer><feFuncA type='linear' slope='${opacity}'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
    )}")`;

const TILE = "220px 220px";

// Notes: the card stays one solid colour; a stipple of its deeper shade gathers in one bottom
// corner (violet cards bottom-right, lime cards bottom-left) and thins out toward the quote.
const NOTE = {
    problem: { speck: speck(17, [0.54, 0.19, 0.85], -4.4, 8, true), corner: "100% 100%" },  // deep violet #8931da
    thought: { speck: speck(29, [0.35, 0.47, 0.17], -4.4, 8, true), corner: "0% 100%" },    // deep lime #58782c
} as const;

export const noteCornerGrain = (type: keyof typeof NOTE) => {
    const { speck: img, corner } = NOTE[type];
    const mask = `radial-gradient(85% 65% at ${corner}, #000 0%, rgba(0,0,0,0.5) 40%, transparent 100%)`;
    return { backgroundImage: img, backgroundSize: TILE, WebkitMaskImage: mask, maskImage: mask, opacity: 0.45 };
};

// Sphere glow: lime fields (a lit upper-left, a deeper lower-right) with a very light lime
// stipple, all cut to the sphere by a radial mask so the edge dissolves into grain.
// `f` = the sphere's silhouette as a fraction of the glow square's half-size.
// Kept very light: sparse, soft lime specks only (no ink).
const LIME_SPECK = speck(11, [0.63, 0.82, 0.37], -5.2, 8, true, 0.45);

export const sphereGrainGradient = (f: number) => {
    const p = (k: number) => `${(f * k).toFixed(1)}%`;
    const fields = [
        `radial-gradient(circle closest-side at 40% 36%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) ${p(55)})`,
        `radial-gradient(circle closest-side at 60% 64%, rgba(160,208,95,0.18) 0%, rgba(160,208,95,0) ${p(80)})`,
        `radial-gradient(circle closest-side at 50% 50%, rgba(209,248,153,0.36) 0%, rgba(209,248,153,0.26) ${p(60)}, rgba(209,248,153,0) ${p(100)})`,
    ];
    const mask = `radial-gradient(circle closest-side at 50% 50%, #000 ${p(55)}, rgba(0,0,0,0.5) ${p(85)}, transparent ${p(108)})`;
    return {
        backgroundImage: [LIME_SPECK, ...fields].join(", "),
        backgroundSize: [TILE, ...fields.map(() => "100% 100%")].join(", "),
        WebkitMaskImage: mask,
        maskImage: mask,
    };
};

// Card grain (V19 How it works): a dense stipple of mid green (#8cbf45) over the solid green card,
// spreading from the top-left corner across most of the card before it fades out.
const CARD_SPECK = speck(19, [0.55, 0.75, 0.27], -3.7, 8, true, 0.55);
const CARD_FADE = "radial-gradient(160% 130% at 0% 0%, #000 0%, rgba(0,0,0,0.6) 45%, transparent 85%)";
export const cardGrain = {
    backgroundImage: CARD_SPECK,
    backgroundSize: TILE,
    WebkitMaskImage: CARD_FADE,
    maskImage: CARD_FADE,
};

// The same card grain in violet (V19 Interview example, on #d1b2ff): mid violet (#a576e8) specks.
const CARD_SPECK_VIOLET = speck(19, [0.65, 0.46, 0.91], -3.7, 8, true, 0.55);
export const cardGrainViolet = {
    backgroundImage: CARD_SPECK_VIOLET,
    backgroundSize: TILE,
    WebkitMaskImage: CARD_FADE,
    maskImage: CARD_FADE,
};

// The same card grain on warm paper (V19 Interview example, on #efe9dd): soft warm-grey (#c9bda8) specks.
const CARD_SPECK_PAPER = speck(19, [0.79, 0.74, 0.66], -3.7, 8, true, 0.5);
export const cardGrainPaper = {
    backgroundImage: CARD_SPECK_PAPER,
    backgroundSize: TILE,
    WebkitMaskImage: CARD_FADE,
    maskImage: CARD_FADE,
};

// Corner glow (V19 Widget stage): a faint yellow field in the stage's top-right corner with a
// sparse stipple of a deeper yellow, masked to that corner so it dissolves into the cream.
const GLOW_SPECK = speck(23, [0.88, 0.72, 0.18], -4.4, 8, true, 0.16);  // golden yellow #e0b82e
const GLOW_FIELD = "radial-gradient(75% 100% at 100% 0%, rgba(250,224,110,0.16) 0%, rgba(252,236,160,0.09) 50%, rgba(252,236,160,0) 100%)";
const GLOW_MASK = "radial-gradient(85% 110% at 100% 0%, #000 25%, rgba(0,0,0,0.45) 60%, transparent 100%)";
export const cornerGlowGrain = {
    backgroundImage: [GLOW_SPECK, GLOW_FIELD].join(", "),
    backgroundSize: [TILE, "100% 100%"].join(", "),
    WebkitMaskImage: GLOW_MASK,
    maskImage: GLOW_MASK,
};
