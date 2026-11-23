// CallCard (V21.04): the shared hero visual for the use-case landings (Churn first; ~10 more to come).
// A video interview, as on the home page's How it works (Interview step): the customer on a dark call frame
// (their clip, the call controls under it), Frank as a small self-view tile, and the conversation beside it as
// chat bubbles that arrive one at a time, the oldest sliding away. The first bubble is the template's core
// question, and the call frame carries the use case's icon and name, so the card says which landing it is.
//   Call frame: top-left the use case chip, top-right a recording dot and timer; bottom-left the customer's
//   name (with a waveform while they speak); under the timer Frank's tile (ringed in white while he speaks), clear
//   of the bubbles.
//   Bubbles: Frank's cream with his glasses, the customer's white; the last three stay on screen.
// Lime is kept to Frank's own avatar (the hero's lime CTA sits beside the card), so the hero doesn't overuse it.
// The clip and the conversation loop only while on screen. Reduced motion: the clip's still frame and the last
// three bubbles.
// Data per landing (./usecases/<name>.js): { icon, name, hero: { clip, focus, person, turns: [['frank'|'customer', text]] } };
// clip is a /videos/<clip>.mp4 (+ .jpg poster) call card; focus (0–1, default 0.5) is where the face sits across
// the clip, so the frame can centre it.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, PhoneOff, Video } from 'lucide-react';
import Glasses from '../v3/Glasses';

const SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 };
const STEP_MS = 2400;   // between bubbles
const END_MS = 3200;    // after the last bubble, before the loop restarts
const SHOW = 3;         // bubbles on screen
const BARS = [0.45, 0.8, 0.55, 1, 0.65, 0.9, 0.5];
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function Wave({ on, reduce }) {
  return (
    <span className="flex h-3 items-center gap-[2px]" aria-hidden="true">
      {BARS.map((h, k) => (
        <motion.span key={k} className="w-[2px] origin-center rounded-full bg-white/85" style={{ height: '100%' }}
          initial={{ scaleY: 0.25 }}
          animate={on && !reduce ? { scaleY: [h * 0.3, h, h * 0.5, h * 0.9, h * 0.3] } : { scaleY: 0.25 }}
          transition={on && !reduce ? { duration: 0.85 + (k % 3) * 0.15, delay: k * 0.05, repeat: Infinity, ease: [0.45, 0, 0.55, 1] } : { duration: 0.2 }} />
      ))}
    </span>
  );
}

export default function CallCard({ data, reduce, className = '' }) {
  const { icon: Icon, name, hero: { clip, person, turns, focus = 0.5 } } = data;
  // Centre the face: zoom just enough to shift the clip by the face's offset from the middle, without showing
  // an edge (scale ≥ 1 / (1 − 2|offset|)); the shift is in the clip's own width, applied before the zoom.
  const off = focus - 0.5;
  const zoom = Math.abs(off) < 0.005 ? 1 : 1 / (1 - 2 * Math.abs(off));
  const frame = zoom === 1 ? undefined : { transform: `scale(${zoom.toFixed(3)}) translateX(${(-off * 100).toFixed(2)}%)` };
  const root = useRef(null);
  const video = useRef(null);
  const [seen, setSeen] = useState(false);
  const [n, setN] = useState(reduce ? turns.length : 0); // bubbles that have arrived
  const [clock, setClock] = useState(12);
  const running = seen && !reduce;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (running) v.play().catch(() => {}); else v.pause();
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const t = n < turns.length
      ? setTimeout(() => setN(n + 1), n === 0 ? 700 : STEP_MS)
      : setTimeout(() => { setN(0); setClock(12); }, END_MS);
    return () => clearTimeout(t);
  }, [running, n, turns.length]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setClock(c => c + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const shown = turns.slice(Math.max(0, n - SHOW), n).map((t, k) => [t, Math.max(0, n - SHOW) + k]);
  const latest = n > 0 ? turns[n - 1][0] : null;
  const speaking = running ? latest : null;
  const label = s => (s === 'frank' ? 'Frank' : person);

  return (
    <figure ref={root} role="img"
      aria-label={`Example ${name.toLowerCase()} on a video call with ${person}. ` + turns.map(([s, t]) => `${label(s)}: ${t}`).join(' ')}
      className={'relative m-0 pb-2 ' + className}>
      <div aria-hidden="true">
        {/* The call frame. */}
        <div className="w-[78%] rounded-[22px] bg-[#1a1714] p-1 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.08] sm:w-[60%]">
          <div className="relative overflow-hidden rounded-[18px]">
            <video ref={video} src={`/videos/${clip}.mp4`} poster={`/videos/${clip}.jpg`} muted loop playsInline preload="metadata"
              style={frame} className="block aspect-[4/5] w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/45 py-1 pl-1 pr-2.5 font-sans text-[11.5px] font-medium text-white">
              {Icon && <span className="grid size-5 place-items-center rounded-full bg-white/[0.16] text-white"><Icon className="size-3" strokeWidth={1.75} /></span>}
              {name}
            </span>
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 font-gmono text-[11px] tabular-nums text-white">
              <span className="relative grid size-2 place-items-center">
                {running && <span className="absolute inset-0 animate-ping rounded-full bg-[#ef4444]/60" />}
                <span className="relative size-1.5 rounded-full bg-[#ef4444]" />
              </span>
              {mmss(clock)}
            </span>

            <span className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 font-sans text-[12px] text-white">
              {person}
              <Wave on={speaking === 'customer'} reduce={reduce} />
            </span>
            {/* Frank's self-view tile. */}
            <span className={'absolute right-2.5 top-11 grid size-[52px] place-items-center rounded-[12px] bg-[#0f2e27] transition-shadow duration-300 sm:size-14 ' +
              (speaking === 'frank' ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.85)]' : 'shadow-[0_0_0_1px_rgba(255,255,255,0.15)]')}>
              <span className="grid size-8 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[64%]"><Glasses pose="Ready" reduced /></span></span>
            </span>
          </div>
          <div className="flex justify-center gap-2 py-2">
            <span className="grid size-7 place-items-center rounded-full bg-white/[0.14] text-white"><Mic className="size-3.5" strokeWidth={1.75} /></span>
            <span className="grid size-7 place-items-center rounded-full bg-white/[0.14] text-white"><Video className="size-3.5" strokeWidth={1.75} /></span>
            <span className="grid size-7 place-items-center rounded-full bg-[#e5484d] text-white"><PhoneOff className="size-3.5" strokeWidth={1.75} /></span>
          </div>
        </div>

        {/* The conversation, as bubbles: beside and over the call frame's right edge; on phones under the frame,
            overlapping only its bottom edge, in a fixed-height column so the hero doesn't jump. */}
        <div className="relative z-10 -mt-14 ml-auto flex min-h-[236px] w-[90%] flex-col items-stretch justify-end gap-2.5 sm:absolute sm:bottom-[14%] sm:right-0 sm:mt-0 sm:min-h-0 sm:w-[54%]">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map(([[s, text], k]) => {
              const frank = s === 'frank';
              return (
                <motion.div key={k} layout="position"
                  initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.96, transition: { duration: 0.3 } }}
                  transition={SPRING}
                  className={'max-w-[92%] rounded-[18px] px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] ' +
                    (frank ? 'self-start rounded-tl-[6px] bg-[#fffdf3] text-ink' : 'self-end rounded-tr-[6px] bg-white text-ink')}>
                  <span className="flex items-center gap-1.5 font-sans text-[11px] font-medium text-ink-2">
                    {frank && <span className="grid size-4 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[70%]"><Glasses pose="Ready" reduced /></span></span>}
                    {label(s)}
                  </span>
                  <span className="mt-0.5 block font-sans text-[14px] leading-[1.4] sm:text-[14.5px]">{text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
