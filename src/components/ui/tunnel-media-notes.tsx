// Media notes for the perspective tunnel (V17): some customer notes arrive as a video clip of the
// person talking, some as a voice call, the rest stay plain quotes. Both keep the note's colour
// and its quote (as the clip's transcript), so the tunnel still reads as one set of voices.
//  • Video: a flat illustrated head-and-shoulders portrait in a rounded frame; eyes blink and
//    the mouth moves in stepped lip-sync, a play/duration chip sits top-left and a thin progress
//    line runs along the bottom.
//  • Voice: an initials avatar, "Voice call" with a live dot and the call time, then a waveform
//    whose bars bounce in staggered time.
// All motion is CSS (tunnel-media-notes.css), transform/opacity only; reduced motion holds still.
import { useEffect, useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import "./tunnel-media-notes.css";
import type { TunnelItem } from "./perspective-tunnel-hero";

const INK = "#1a1714";

export type Portrait = {
    skin: string;
    hair: string;
    hairStyle: "long" | "short" | "curly";
    shirt: string;
    wall: string;
};

function Person({ p }: { p: Portrait }) {
    return (
        <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" className="block h-full w-full">
            <rect width="160" height="120" fill={p.wall} />
            {/* a shelf and a plant: just enough room to read as someone's home office */}
            <path d="M104 34H150" stroke={INK} strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" />
            <rect x="120" y="20" width="10" height="14" rx="2" fill={INK} fillOpacity="0.12" />
            <path d="M125 20C121 12 124 6 128 4M125 20C129 13 134 12 137 13" stroke={INK} strokeOpacity="0.14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {p.hairStyle === "long" && <path d="M54 58C52 30 66 24 80 24 96 24 108 32 106 58L108 98H52Z" fill={p.hair} />}
            <path d="M30 120C33 98 52 88 80 88 108 88 127 98 130 120Z" fill={p.shirt} />
            <rect x="72" y="70" width="16" height="22" rx="6" fill={p.skin} />
            <path d="M72 84C76 88 84 88 88 84V90H72Z" fill={INK} fillOpacity="0.12" />
            <ellipse cx="80" cy="54" rx="22" ry="26" fill={p.skin} />
            {p.hairStyle === "long" && <path d="M58 50C58 34 68 27 80 27 93 27 103 35 102 50 94 44 84 38 70 40 64 42 60 46 58 50Z" fill={p.hair} />}
            {p.hairStyle === "short" && <path d="M58 50C56 32 68 25 81 25 95 25 105 33 103 50 99 42 92 37 80 37 68 37 61 42 58 50Z" fill={p.hair} />}
            {p.hairStyle === "curly" && (
                <g fill={p.hair}>
                    <circle cx="64" cy="38" r="10" /><circle cx="76" cy="30" r="11" /><circle cx="90" cy="31" r="11" />
                    <circle cx="99" cy="41" r="9" /><circle cx="60" cy="49" r="7" /><circle cx="101" cy="51" r="6" />
                </g>
            )}
            <g className="tmn-blink" fill={INK}>
                <ellipse cx="72" cy="55" rx="2.2" ry="2.6" />
                <ellipse cx="88" cy="55" rx="2.2" ry="2.6" />
            </g>
            <path d="M70 47C72 46 74 46 76 47M84 47C86 46 88 46 90 47" stroke={INK} strokeOpacity="0.55" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            {/* mouth: closed line and open shape swap in stepped time */}
            <path className="tmn-shut" d="M75 68C78 69.5 82 69.5 85 68" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path className="tmn-open" d="M74.5 66.5C77 65.5 83 65.5 85.5 66.5 85 71 82.5 73 80 73 77.5 73 75 71 74.5 66.5Z" fill={INK} />
        </svg>
    );
}

export function VideoNote({ item, portrait, showNames }: { item: TunnelItem; portrait: Portrait; showNames: boolean }) {
    return (
        <>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/10">
                <Person p={portrait} />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#1a1714]/80 px-1.5 py-0.5 font-sans text-[9.5px] font-medium tabular-nums text-white sm:text-[10.5px]">
                    <svg viewBox="0 0 10 10" className="size-2" aria-hidden="true"><path d="M2 1.2v7.6L8.6 5z" fill="currentColor" /></svg>
                    {item.duration ?? "0:42"}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-black/15" aria-hidden="true">
                    <span className="tmn-progress block h-full w-full origin-left bg-[#d1f899]" />
                </span>
            </div>
            <blockquote className="relative mt-2.5 font-serif text-[12px] leading-snug text-[#0a0a0a] sm:mt-3 sm:text-[14.5px]">
                {item.quote}
            </blockquote>
            <div className="relative mt-auto pt-2 font-sans text-[10.5px] leading-tight text-neutral-600 sm:pt-3 sm:text-xs">
                {showNames && <p className="font-medium">{item.author}</p>}
                <p>{item.role}</p>
            </div>
        </>
    );
}

// Bar heights for the waveform (0–1), uneven like real speech.
const WAVE = [0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.55, 0.3, 0.65, 0.85, 0.45, 0.7, 0.95, 0.4, 0.6, 0.8, 0.5, 0.3, 0.55, 0.75, 0.4, 0.25, 0.5, 0.7, 0.35, 0.55];
const PLAYED = 0.42; // share of the waveform already heard

// Voice call on the note's own colour, with delicate details: a soft translucent avatar with
// deep-coloured initials, a thin waveform that reads like a playback bar (the heard part in the
// deep shade and gently moving, the rest a faint wash that stays still) and small type.
const VOICE_TONE: Record<TunnelItem["type"], { deep: string; tint: string; rest: string }> = {
    problem: { deep: "#7a2ccc", tint: "rgba(255,255,255,0.5)", rest: "rgba(122,44,204,0.24)" },
    thought: { deep: "#4d6a24", tint: "rgba(255,255,255,0.55)", rest: "rgba(77,106,36,0.24)" },
};

const clock = (secs: number) => `${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, "0")}`;

export function VoiceNote({ item, showNames }: { item: TunnelItem; accent?: string; showNames: boolean }) {
    const tone = VOICE_TONE[item.type];
    const initials = item.author.split(" ").map(w => w[0]).join("").slice(0, 2);
    const total = item.duration ?? "03:18";
    const [m, sec] = total.split(":").map(Number);
    const heard = clock((m * 60 + sec) * PLAYED);
    const playedBars = Math.round(WAVE.length * PLAYED);
    return (
        <>
            <div className="relative flex items-center gap-2 sm:gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full font-sans text-[9px] font-semibold sm:size-8 sm:text-[11px]"
                    style={{ backgroundColor: tone.tint, color: tone.deep }}>
                    {initials}
                </span>
                <span className="min-w-0 font-sans leading-tight">
                    <span className="block text-[10.5px] font-medium text-[#1a1714] sm:text-[12.5px]">{showNames ? item.author : item.role}</span>
                    {showNames && <span className="block text-[9.5px] text-[#5c554d] sm:text-[11px]">{item.role}</span>}
                </span>
            </div>
            <div className="relative mt-3 flex h-6 items-center justify-between sm:mt-3.5 sm:h-7" aria-hidden="true">
                {WAVE.map((h, i) => {
                    const played = i < playedBars;
                    return (
                        <span key={i} className={"block w-[2px] shrink-0 rounded-full" + (played ? " tmn-bar" : "")}
                            style={{ height: `${Math.round(h * 100)}%`, backgroundColor: played ? tone.deep : tone.rest, animationDelay: played ? `${-((i * 137) % 900) / 1000}s` : undefined }} />
                    );
                })}
            </div>
            <div className="relative mt-1 flex justify-between font-sans text-[9px] tabular-nums text-[#5c554d] sm:text-[10.5px]" aria-label={`Voice call, ${total} long`}>
                <span style={{ color: tone.deep }}>{heard}</span>
                <span>{total}</span>
            </div>
            <blockquote className="relative mt-3 font-serif text-[12px] leading-snug text-[#1a1714] sm:mt-3.5 sm:text-[15px]">
                {item.quote}
            </blockquote>
        </>
    );
}

// Real video calls (V17): the whole note is the call tile — a muted, looping clip of the person
// talking, filling the card (4:5) or a wider laptop-style tile (16:9). The quote sits over the
// bottom of the picture like live captions, with the speaker's name and role under it, and a
// small chip top-left keeps the note's type (Problem / Thought) and its colour.
// The clip only plays while the card is in view (`playing`); with reduced motion it never plays
// and the poster frame stands in.
export type CallClip = { card: string; wide: string; cardPoster: string; widePoster: string };

const TYPE_DOT: Record<TunnelItem["type"], string> = { problem: "#c9a2fb", thought: "#d1f899" };

export function CallVideoNote({ item, clip, wide, playing, reduce, showNames, quoteIn }: {
    item: TunnelItem; clip: CallClip; wide: boolean; playing: boolean; reduce: boolean; showNames: boolean;
    /** V21.1 (refined): 0 at rest → 1 once scrolling starts. At rest the call shows just the person, a
     *  live dot and their name; the quote rises in as the cards set off toward you. */
    quoteIn?: MotionValue<number>;
}) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const v = ref.current; if (!v) return;
        if (playing && !reduce) { v.play().catch(() => {}); } else { v.pause(); }
    }, [playing, reduce]);
    const label = item.type === "problem" ? "Problem" : "Thought";
    if (quoteIn) return <RefinedCall item={item} clip={clip} wide={wide} videoRef={ref} quoteIn={quoteIn} showNames={showNames} />;
    return (
        <>
            <video ref={ref} src={wide ? clip.wide : clip.card} poster={wide ? clip.widePoster : clip.cardPoster}
                muted loop playsInline preload="metadata" aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#1a1714]/85 via-[#1a1714]/45 to-transparent" />
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#1a1714]/55 px-2 py-1 font-sans text-[10px] font-medium leading-none text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:text-[11.5px]">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: TYPE_DOT[item.type] }} aria-hidden="true" />
                {label}
            </span>
            <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[#1a1714]/55 px-1.5 py-1 font-sans text-[9.5px] font-medium leading-none text-white/90 backdrop-blur-sm sm:right-3 sm:top-3 sm:text-[10.5px]" aria-hidden="true">
                <span className="tmn-live size-1.5 rounded-full bg-[#d1f899]" />
                Live
            </span>
            <figcaption className="relative mt-auto bg-gradient-to-t from-[#1a1714]/70 via-[#1a1714]/35 to-transparent px-2.5 pb-2.5 pt-9 sm:px-4 sm:pb-4 sm:pt-12">
                <blockquote className="font-serif text-[10.5px] leading-snug text-white [text-shadow:0_1px_8px_rgba(26,23,20,0.45)] sm:text-[15px]">
                    {item.quote}
                </blockquote>
                <p className="mt-1.5 font-sans text-[9px] leading-tight text-white/75 sm:mt-2 sm:text-[11.5px]">
                    {showNames ? <><span className="font-medium text-white">{item.author}</span> · {item.role}</> : item.role}
                </p>
            </figcaption>
        </>
    );
}

// The refined call (V21.1): fewer layers over the face. A soft scrim at the bottom only; the name with
// a live dot sits there at rest, and the quote rises in above it once scrolling starts.
function RefinedCall({ item, clip, wide, videoRef, quoteIn, showNames }: {
    item: TunnelItem; clip: CallClip; wide: boolean; videoRef: React.RefObject<HTMLVideoElement>; quoteIn: MotionValue<number>; showNames: boolean;
}) {
    const opacity = useTransform(quoteIn, [0.1, 0.7], [0, 1]);
    const transform = useTransform(quoteIn, (v: number) => `translateY(${8 * (1 - Math.min(1, Math.max(0, (v - 0.1) / 0.6)))}px)`);
    const scrim = useTransform(quoteIn, [0, 0.7], [0.55, 1]);
    return (
        <>
            <video ref={videoRef} src={wide ? clip.wide : clip.card} poster={wide ? clip.widePoster : clip.cardPoster}
                muted loop playsInline preload="metadata" aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover" />
            <motion.span aria-hidden="true" style={{ opacity: scrim }} className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-[#1a1714]/85 via-[#1a1714]/35 to-transparent" />
            <figcaption className="relative mt-auto px-3 pb-3 sm:px-4 sm:pb-3.5">
                <motion.blockquote style={{ opacity, transform }} className="m-0 font-serif text-[10.5px] leading-snug text-white [text-shadow:0_1px_8px_rgba(26,23,20,0.45)] sm:text-[14.5px]">
                    {item.quote}
                </motion.blockquote>
                <p className="m-0 mt-1.5 flex min-w-0 items-center gap-1.5 font-sans text-[9px] leading-tight text-white/80 sm:mt-2 sm:text-[11.5px]">
                    <span className="tmn-live size-1.5 flex-none rounded-full bg-[#d1f899]" aria-hidden="true" />
                    {showNames ? <><span className="flex-none font-medium text-white">{item.author}</span><span className="truncate text-white/65">{item.role}</span></> : item.role}
                </p>
            </figcaption>
        </>
    );
}
