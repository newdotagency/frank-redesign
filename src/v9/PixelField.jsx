// PixelField — fps.hu's pixel motif, spread around the edges of the hero so the centred title
// and chat stay clear. Four small stepped clusters of research tiles (listen, quote, insight,
// done, talk) sit in the side gutters, with stray pixels between them. On load the pixels fly
// in from scattered spots and settle into their steps; after that only the strays drift on long
// offset loops and the waveform tile plays. Frank colours only: brand green, violet, ink, white.
// Tiles have notched pixel corners. Decorative: aria-hidden, pointer-events none.
// Wide screens only (the side gutters are too narrow below 1280px). Reduced motion: placed, still.
import { motion } from 'framer-motion';
import { EXPO_OUT } from '../v3/HeroHeadline';
import { ResearchDefs, Magnifier, Note, Pen, Bulb, Bars, Bubble, Ear } from './ResearchTiles';

const INK = '#1a1714', LIME = '#d1f899', LIME_S = '#a0d05f', LIME_50 = '#f4fde6', LIME_800 = '#455b24';
const VIOLET = '#d1b2ff', VIOLET_5 = '#ba86fc', VIOLET_2 = '#ece1fd';

const notch = n => `polygon(${n}px 0, calc(100% - ${n}px) 0, calc(100% - ${n}px) ${n}px, 100% ${n}px, 100% calc(100% - ${n}px), calc(100% - ${n}px) calc(100% - ${n}px), calc(100% - ${n}px) 100%, ${n}px 100%, ${n}px calc(100% - ${n}px), 0 calc(100% - ${n}px), 0 ${n}px, ${n}px ${n}px)`;

const Icon = ({ children, color, k = 0.44 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={{ width: `calc(var(--u) * ${k})`, height: `calc(var(--u) * ${k})` }}>{children}</svg>
);
const Wave = () => (
  <svg viewBox="0 0 24 24" className="eq-live" style={{ width: 'calc(var(--u) * 0.46)', height: 'calc(var(--u) * 0.46)' }}>
    <g fill={LIME}>
      <rect className="eq-bar" x="5.5" y="5" width="3" height="14" rx="1.5" />
      <rect className="eq-bar" x="10.5" y="5" width="3" height="14" rx="1.5" />
      <rect className="eq-bar" x="15.5" y="5" width="3" height="14" rx="1.5" />
    </g>
  </svg>
);
const Quote = ({ k = 0.72 }) => <span className="font-serif leading-none text-ink" style={{ fontSize: `calc(var(--u) * ${k})`, transform: 'translateY(18%)' }}>“</span>;
const Arcs = () => (
  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
    <path d="M-6 30A36 36 0 0 1 30-6" stroke={VIOLET_5} strokeWidth="7" />
    <path d="M106 70A36 36 0 0 1 70 106" stroke={VIOLET_5} strokeWidth="7" />
  </svg>
);

// Each cluster: anchor (CSS position in % of the hero), and pieces placed in grid units.
// tile: { x, y, s, bg, ring?, icon?, arcs? }   bit: plain square.   from = start offset (units).
// Illustrated tiles (art) are fps-style animated research objects from ResearchTiles.
// Tiles keep ~0.35u of air between them so each illustration reads on its own.
export const CLUSTERS = [
  { id: 'a', at: { left: '5%', top: '22%' }, w: 3.5, h: 3.45, pieces: [
    { x: 1.9, y: 0, s: 1.6, bg: '#433d37', art: <Bulb />, from: [-1.6, -1.2] },
    { x: 0, y: 1.95, s: 1.5, bg: VIOLET, art: <Note />, from: [-2.2, 1.4] },
    { x: 1.9, y: 2.0, s: 0.5, bg: LIME_S, from: [1.8, 1.6] },
    { x: 1.2, y: 1.25, s: 0.4, bg: VIOLET_2, from: [2.4, -1.4] },
  ] },
  { id: 'b', at: { right: '5%', top: '17%' }, w: 2.8, h: 3.8, pieces: [
    { x: 1.3, y: 0.4, s: 1.5, bg: LIME, art: <Magnifier />, from: [1.6, -1.4] },
    { x: 0, y: 2.3, s: 1.5, bg: VIOLET_2, art: <Pen />, from: [-1.8, 1.8] },
    { x: 0.35, y: 1.55, s: 0.5, bg: INK, from: [-2.4, -1.2] },
  ] },
  { id: 'c', at: { left: '9%', top: '67%' }, w: 2.4, h: 2.15, pieces: [
    { x: 0, y: 0.4, s: 1.6, bg: LIME_50, ring: true, art: <Bars />, from: [-1.6, 1.4] },
    { x: 1.95, y: 0, s: 0.4, bg: VIOLET_5, from: [1.8, -1.6] },
    { x: 1.95, y: 1.85, s: 0.3, bg: INK, from: [2.2, 1.2] },
  ] },
  // Talking + listening: the speech bubble with the ear beside it.
  { id: 'd', at: { right: '8%', top: '68%' }, w: 2.05, h: 2.35, pieces: [
    { x: -1.6, y: -0.9, s: 1.5, bg: LIME, art: <Ear />, from: [-1.8, 1.2] },
    { x: 0.1, y: 0.5, s: 1.2, bg: VIOLET_2, art: <Bubble />, from: [-1.4, -1.6] },
    { x: 1.55, y: 0, s: 0.5, bg: INK, from: [2, -1.2] },
    { x: 1.55, y: 1.85, s: 0.5, bg: LIME, from: [1.6, 1.8] },
  ] },
];
// Strays: drifting single pixels in the gutters (left/top in % of the hero, size in units).
const STRAYS = [
  { left: '17%', top: '41%', s: 0.22, bg: LIME_S, d: 9 },
  { left: '3.5%', top: '52%', s: 0.3, bg: VIOLET, d: 11 },
  { left: '21%', top: '80%', s: 0.18, bg: INK, d: 10 },
  { left: '13%', top: '21%', s: 0.16, bg: VIOLET_5, d: 12 },
  { left: '88%', top: '47%', s: 0.34, bg: LIME, d: 9.5 },
  { left: '79%', top: '84%', s: 0.2, bg: INK, d: 11.5 },
  { left: '95%', top: '38%', s: 0.24, bg: VIOLET, d: 10.5 },
  { left: '83%', top: '16%', s: 0.18, bg: INK, d: 12.5 },
];

const place = (x, y, s) => ({
  left: `calc(var(--u) * ${x})`, top: `calc(var(--u) * ${y})`,
  width: `calc(var(--u) * ${s})`, height: `calc(var(--u) * ${s})`,
});

// `clusters` lets a version swap tiles (V16 puts a talking mouth where the speech bubble is).
export default function PixelField({ u = 44, reduced, start = 0.6, clusters = CLUSTERS }) {
  let n = 0; // running index for the stagger across all clusters
  return (
    <div aria-hidden="true" className={`rt pointer-events-none absolute inset-0 hidden select-none xl:block${reduced ? ' rt-still' : ''}`} style={{ '--u': `${u}px` }}>
      <ResearchDefs />
      {STRAYS.map((p, i) => (
        <motion.span key={'s' + i} className="absolute" style={{ left: p.left, top: p.top, width: u * p.s, height: u * p.s }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EXPO_OUT, delay: start + 1 + i * 0.07 }}>
          <motion.span className="absolute inset-0" style={{ background: p.bg }}
            animate={reduced ? undefined : { x: [0, i % 2 ? 7 : -7, 0], y: [0, i % 3 ? -9 : 9, 0] }}
            transition={{ duration: p.d, ease: [0.45, 0, 0.55, 1], repeat: Infinity, delay: i * 0.6 }} />
        </motion.span>
      ))}

      {clusters.map(c => (
        <div key={c.id} className="absolute" style={{ ...c.at, width: u * c.w, height: u * c.h }}>
          {c.pieces.map(p => {
            const i = n++;
            const fly = {
              initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.24, x: p.from[0] * u, y: p.from[1] * u },
              animate: { opacity: 1, scale: 1, x: 0, y: 0 },
              transition: { duration: reduced ? 0.4 : 1.2, ease: EXPO_OUT, delay: start + i * 0.07 },
            };
            return p.icon || p.arcs || p.art ? (
              <motion.div key={i} className="absolute" style={place(p.x, p.y, p.s)} {...fly}>
                <div className="relative grid h-full w-full place-items-center overflow-hidden"
                  style={{ background: p.bg, clipPath: notch(p.s > 1 ? 8 : 5), boxShadow: p.ring ? 'inset 0 0 0 1px rgba(26,23,20,0.12)' : undefined }}>
                  {p.arcs && <Arcs />}
                  {p.art && <div className="absolute inset-0">{p.art}</div>}
                  {p.icon}
                </div>
              </motion.div>
            ) : (
              <motion.span key={i} className="absolute" style={{ ...place(p.x, p.y, p.s), background: p.bg }} {...fly} />
            );
          })}
        </div>
      ))}
    </div>
  );
}
