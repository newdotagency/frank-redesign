"use client";

// PerspectiveTunnelHero — cards of user thoughts and problems fly toward you through a 3D
// corridor as you scroll (wheel / trackpad / touch). Adapted from 21st.dev's perspective tunnel:
// images replaced by quote cards, light theme only, copy as props, and scrolling no longer gets
// trapped — at either end the page keeps scrolling.
import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    MotionValue,
    useMotionValueEvent,
} from "framer-motion";
import { noteCornerGrain } from "@/components/grain";
import { CallVideoNote, VideoNote, VoiceNote, type CallClip, type Portrait } from "@/components/ui/tunnel-media-notes";
import HighlightMarker from "@/components/HighlightMarker";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type TunnelItem = {
    quote: string;
    type: "thought" | "problem";
    author: string;
    role: string;
    /** Show this note as an illustrated video, a voice call, or a real video call (V17). */
    media?: "video" | "voice" | "call";
    /** Clip files for a real video call note. */
    clip?: CallClip;
    /** Call tile shape on wide screens: the 4:5 card (default) or a 16:9 laptop-style tile.
     *  Phones always use the card shape. */
    shape?: "card" | "wide";
    /** Nudge this note's resting spot on the first screen, in on-screen px at a 900px-tall
     *  viewport (scaled to the real height). It has no effect once the notes are in flight. */
    restShift?: { x?: number; y?: number };
    /** Override the direction (degrees, 0 = right, 90 = down) this note flies along, e.g. to keep
     *  it off the line of an earlier note so they don't stack in flight. */
    angle?: number;
    /** Push this note's flight path further out from the centre (1 = normal), e.g. to fill an
     *  empty side. Its resting spot on the first screen is unchanged. */
    reach?: number;
    /** Clip or call length shown on media notes, e.g. "0:42". */
    duration?: string;
    /** Illustrated person for a video note. */
    portrait?: Portrait;
};

export const ITEMS: TunnelItem[] = [
    { quote: "I gave up halfway through checkout — there were too many steps.", type: "problem", author: "Maya Lindqvist", role: "Online shopper" },
    { quote: "I wish I could see what my team already tried before starting.", type: "thought", author: "Daniel Okafor", role: "Product manager" },
    { quote: "Every report needs exporting to Excel before anyone can read it.", type: "problem", author: "Priya Raman", role: "Ops analyst" },
    { quote: "Honestly, I'd pay more if setup took five minutes instead of a week.", type: "thought", author: "Tomás Herrera", role: "Founder, 12-person team" },
    { quote: "I never know which plan I'm on until the invoice arrives.", type: "problem", author: "Grace Whitfield", role: "Finance lead" },
    { quote: "The mobile app is where I actually work. The desktop one I just tolerate.", type: "thought", author: "Kenji Watanabe", role: "Field sales" },
    { quote: "Notifications ping me for everything, so now I ignore all of them.", type: "problem", author: "Amara Nwosu", role: "Customer success" },
    { quote: "If search understood what I meant, I'd stop asking colleagues.", type: "thought", author: "Lukas Brandt", role: "Support engineer" },
    { quote: "We lost a week of feedback because the survey link expired.", type: "problem", author: "Sofia Marchetti", role: "UX researcher" },
];

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

const CARD_BG: Record<TunnelItem["type"], string> = {
    problem: "#D8AFFB",
    thought: "#D0FA94",
};

interface TunnelCardData {
    item: TunnelItem;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

// Same golden-angle layout as the original.
function layoutCards(items: TunnelItem[], tilt = 1): TunnelCardData[] {
    return items.map((item, i) => {
        const goldenAngle = (item.angle ?? i * 137.5) * (Math.PI / 180);
        const radiusFactorX = 0.28 + (i % 3) * 0.08;
        const radiusFactorY = 0.26 + (i % 2) * 0.09;
        return {
            item,
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX,
            radiusFactorY,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2) * tilt,
            index: i,
        };
    });
}

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

// Opening quote mark set large in Lora (the headline serif), in the card's deeper shade — a
// typographic accent rather than an icon. The box is sized to the glyph's ink (Lora's “ inks from
// about 0.10em to 0.38em below the top of a 1em line), so the label centres on the visible mark.
const QUOTE_INK: Record<TunnelItem["type"], string> = { problem: "#8931da", thought: "#58782c" };
function QuoteMark({ type }: { type: TunnelItem["type"] }) {
    return (
        <span aria-hidden="true" style={{ color: QUOTE_INK[type] }}
            className="block h-[11px] w-[15px] shrink-0 select-none overflow-visible font-serif text-[40px] leading-[40px] sm:h-[14px] sm:w-[18px] sm:text-[48px] sm:leading-[48px]">
            <span className="relative -top-[4px] block sm:-top-[5px]">&ldquo;</span>
        </span>
    );
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    /** 0 at rest → 1 once scrolling is under way: moves the card from its resting spot (around
     *  the headline) onto the readable flight path. */
    blend: MotionValue<number>;
    /** 0–1 multiplier on the card's opacity (1 = always as normal). */
    reveal: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
    spread: number;
    flightSpread: number;
    cardScale: number;
    /** Resting progress and the copy block's half-size (px): a card whose resting spot would land
     *  on the copy is pushed just outside it. */
    rest: number;
    keepOut: { halfW: number; halfH: number } | null;
    /** Grain in one bottom corner of the (solid) card. */
    grain: boolean;
    /** Show the speaker's name above their role. */
    showNames: boolean;
    /** Smaller quote text. */
    smallText: boolean;
    /** Keep this card hidden on the resting first screen; it fades in once scrolling starts. */
    hideAtRest: boolean;
    /** How close (px of depth) a card comes before it leaves; smaller keeps close-ups smaller. */
    nearDepth: number;
    /** V21.1: call cards framed in a thin white bezel, quote revealed once scrolling starts. */
    refined?: boolean;
    /** The stage colour the refined cards mist into. */
    stageColor?: string;
    /** V21.11: cards straighten as they come forward, quotes show by distance, and a card leaves by
     *  flying on past you and out of the frame (solid all the way) instead of misting away. */
    passBy?: boolean;
}

function TunnelCard({ card, progress, blend, reveal, pointer, total, stage, spread, flightSpread, cardScale, rest, keepOut, grain, showNames, smallText, hideAtRest, nearDepth, refined, stageColor, passBy }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? Math.min(350, nearDepth) : nearDepth;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    // Refined (V21.1): cards stay solid and clear, so a near card never shows the ones behind it through
    // itself. Only in the last moment, as it reaches you, does it mist into the cream stage (`fog`) and
    // then disappear once fully cream; far away it mists in the same way as it arrives.
    // Pass-by (V21.11): no mist on the way out; the card flies off the frame (see the transform) and
    // only goes invisible once it's out of sight.
    const baseOpacity = useTransform(localProgress, refined ? (passBy ? [0, 0.01, 0.996, 0.999] : [0, 0.01, 0.994, 0.998]) : [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
    const fog = useTransform(localProgress, passBy ? [0, 0.16, 2, 3] : [0, 0.16, 0.97, 0.994], [1, 0, 0, 1], { clamp: true });
    const shadowOpacity = useTransform(fog, (f: number) => 1 - f);
    const restGate = useTransform(progress, [rest, rest + 0.04], hideAtRest ? [0, 1] : [1, 1], { clamp: true });
    const opacity = useTransform([baseOpacity, reveal, restGate], ([o, r, g]: number[]) => o * r * g);

    const isCall = card.item.media === "call" && !!card.item.clip;
    const wide = isCall && !stage.isMobile && card.item.shape === "wide";
    const cardWidth = (wide ? 1.45 : 1) * cardScale * (stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18)));

    // Call clips only play while their card is visible.
    const reduceMotion = useReducedMotion();
    const [playing, setPlaying] = useState(false);
    const playingRef = useRef(false);
    const syncPlaying = (v: number) => {
        const on = v > 0.04;
        if (isCall && on !== playingRef.current) { playingRef.current = on; setPlaying(on); }
    };
    useMotionValueEvent(opacity, "change", syncPlaying);
    // Cards resting on the first screen never change opacity, so check once on mount too.
    useEffect(() => { syncPlaying(opacity.get()); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const unitX = card.angleCos * (stage.width * card.radiusFactorX);
    const unitY = card.angleSin * (stage.height * card.radiusFactorY);
    // Flight path: tighter than the resting spread, so cards come toward you through the
    // middle of the screen and stay readable. `reach` pushes one note's flight further out.
    const reach = card.item.reach ?? 1;
    const flightX = unitX * flightSpread * reach, flightY = unitY * flightSpread * reach;
    // Resting spot: spread out around the headline.
    let baseX = unitX * spread;
    let baseY = unitY * spread;

    // Keep the resting card off the copy: where it would overlap, scale its offset out to the
    // nearest edge of the copy block (plus the card's own half-size and a parallax margin).
    if (keepOut) {
        const perspective = stage.isMobile ? 900 : 1200;
        const restLocal = Math.min(1, Math.max(0, (rest - start) / staggerSpan));
        const restZ = farZ + (nearZ - farZ) * restLocal;
        const f = perspective / (perspective - restZ);          // on-screen scale at rest
        const heightRatio = wide ? 9 / 16 : card.item.media === "video" ? 1.75 : card.item.media === "voice" ? 1.45 : 1.25;
        const halfCardW = (cardWidth * f) / 2, halfCardH = (cardWidth * heightRatio * f) / 2;
        const margin = (stage.isMobile ? 20 : 45) + 16;        // parallax pan + breathing room
        const needX = keepOut.halfW + halfCardW + margin, needY = keepOut.halfH + halfCardH + margin;
        const px = Math.abs(baseX * f), py = Math.abs(baseY * f);
        if (px < needX && py < needY) {
            const sx = px > 0.5 ? needX / px : Infinity, sy = py > 0.5 ? needY / py : Infinity;
            const k = Math.min(sx, sy);
            if (Number.isFinite(k)) { baseX *= k; baseY *= k; }
        }
    }
    // Optional nudge of the resting spot, converted from on-screen px to the card's depth.
    if (card.item.restShift && !stage.isMobile) {
        const perspective = 1200;
        const restLocal = Math.min(1, Math.max(0, (rest - start) / staggerSpan));
        const f = perspective / (perspective - (farZ + (nearZ - farZ) * restLocal));
        const k = stage.height / 900;
        baseX += ((card.item.restShift.x ?? 0) * k) / f;
        baseY += ((card.item.restShift.y ?? 0) * k) / f;
    }
    const panStrength = stage.isMobile ? 20 : 45;

    // Pass-by (V21.11): once scrolling starts, each card straightens as it comes forward, so the one
    // you're reading faces you (at rest, blend 0, the cards keep their tilt). Over the last stretch it
    // carries on past you: it keeps coming closer (growing to about 3x its close-up size) while it
    // drifts outward along its own flight line, both accelerating (squared, like something passing
    // close by), until it is clear of the frame.
    const settle = (l: number) => Math.min(1, Math.max(0, (l - 0.35) / 0.4));
    const flightLen = Math.hypot(flightX, flightY);
    const dirX = flightLen > 1 ? flightX / flightLen : card.angleCos, dirY = flightLen > 1 ? flightY / flightLen : card.angleSin;
    const exitReach = Math.max(stage.width, stage.height) * 0.6;
    const exitDepth = stage.isMobile ? 450 : 500; // extra z on the way past (nearZ 500 → 1000 of a 1200 perspective)
    const transform = useTransform(
        [z, pointer.x, pointer.y, blend, localProgress],
        ([currZ, px, py, b, l]: number[]) => {
            let offsetX = baseX + (flightX - baseX) * b - px * panStrength;
            let offsetY = baseY + (flightY - baseY) * b - py * panStrength;
            let rot = card.rotationZ, zz = currZ;
            if (passBy) {
                rot = card.rotationZ * (1 - b * settle(l));
                const e = Math.min(1, Math.max(0, (l - 0.84) / 0.15));
                const push = exitReach * e * e;
                offsetX += dirX * push; offsetY += dirY * push;
                zz += exitDepth * e * e;
            }
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${zz}px) rotateZ(${rot.toFixed(2)}deg)`;
        }
    );
    // Pass-by: the quote rises in per card, only as that card comes close enough to read (far cards
    // show just the face and name); never on the resting first screen. Otherwise all quotes follow blend.
    const quoteIn = useTransform([blend, localProgress], ([b, l]: number[]) => passBy ? b * Math.min(1, Math.max(0, (l - 0.5) / 0.18)) : b);

    const { item } = card;
    const label = item.type === "problem" ? "Problem" : "Thought";
    const media = item.media === "video" && item.portrait ? "video" : item.media === "voice" ? "voice" : null;

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                zIndex: card.index + 1,
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 will-change-transform select-none cursor-pointer"
        >
            {isCall && item.clip && refined ? (
            // A hairline warm-white edge around the call (2px); the corners are concentric (19px
            // outside, 17px inside) and the shadow is soft and tinted, not grey.
            <figure className="relative w-full rounded-[19px] bg-[#fdfcf8] p-[2px] ring-1 ring-[#1a1714]/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <motion.span aria-hidden="true" style={{ opacity: shadowOpacity }}
                    className="pointer-events-none absolute inset-0 rounded-[19px] shadow-[0_2px_6px_rgba(26,23,20,0.05),0_28px_60px_-26px_rgba(26,23,20,0.38)]" />
                <div className="relative flex w-full flex-col overflow-hidden rounded-[17px] bg-[#1a1714]"
                    style={{ minHeight: cardWidth * (wide ? 9 / 16 : 1.25) - 4 }}>
                    <CallVideoNote item={item} clip={item.clip} wide={wide} playing={playing} reduce={!!reduceMotion} showNames={showNames} quoteIn={quoteIn} />
                </div>
                <motion.span aria-hidden="true" style={{ opacity: fog, backgroundColor: stageColor ?? "#FFFDF3" }} className="pointer-events-none absolute -inset-px rounded-[19px]" />
            </figure>
            ) : isCall && item.clip ? (
            <figure
                className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-[#1a1714] ring-1 ring-black/10 shadow-xl shadow-black/10 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1"
                style={{ minHeight: cardWidth * (wide ? 9 / 16 : 1.25) }}
            >
                <CallVideoNote item={item} clip={item.clip} wide={wide} playing={playing} reduce={!!reduceMotion} showNames={showNames} />
            </figure>
            ) : (
            <figure
                className={`relative flex w-full flex-col rounded-2xl p-3 ring-1 sm:p-4 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 ring-black/5 shadow-xl shadow-black/5 hover:ring-black/15`}
                style={{ backgroundColor: CARD_BG[item.type], minHeight: cardWidth * (media === "voice" ? 1.1 : 1.25) }}
            >
                {grain && media !== "voice" && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl" style={noteCornerGrain(item.type)} />}
                <figcaption className={`relative flex items-center gap-2 font-sans text-[12px] font-medium leading-none text-neutral-700 sm:text-[14px] ${media ? "mb-2.5 sm:mb-3" : ""}`}>
                    <QuoteMark type={item.type} />
                    {label}
                </figcaption>
                {media === "video" && item.portrait ? (
                    <VideoNote item={item} portrait={item.portrait} showNames={showNames} />
                ) : media === "voice" ? (
                    <VoiceNote item={item} accent={QUOTE_INK[item.type]} showNames={showNames} />
                ) : (
                    <>
                        <blockquote className={`relative mt-2.5 font-serif leading-snug text-[#0a0a0a] sm:mt-3 ${smallText ? "text-[11px] sm:text-[13.5px]" : "text-[12px] sm:text-[15.5px]"}`}>
                            {item.quote}
                        </blockquote>
                        <div className="relative mt-auto pt-2 font-sans text-[10.5px] leading-tight text-neutral-600 sm:pt-3 sm:text-xs">
                            {showNames && <p className="font-medium">{item.author}</p>}
                            <p>{item.role}</p>
                        </div>
                    </>
                )}
            </figure>
            )}
        </motion.div>
    );
}

export interface PerspectiveTunnelHeroProps {
    items?: TunnelItem[];
    eyebrow?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Optional external progress (0–1), e.g. from page scroll. When given, the tunnel follows it
     *  and does not capture the wheel or touch itself. */
    progress?: MotionValue<number>;
    /** Where the cards rest before any scrolling (0–1). A little above 0 so a few voices are
     *  already drifting in the depth on the first screen. */
    restProgress?: number;
    /** Scroll cue under the copy. Clicking it starts the scroll. */
    prompt?: ReactNode;
    /** Optional mark shown above the scroll cue (V14: Frank's glasses). */
    promptIcon?: ReactNode;
    /** How far from the centre the cards travel (1 = original corridor). Larger values keep the
     *  resting cards clear of the headline. */
    spread?: { desktop: number; mobile: number };
    /** Card size relative to the original tunnel (1 = original). */
    cardScale?: number;
    /** Spread of the flight path once scrolling starts (1 = original corridor). */
    flightSpread?: number;
    /** false: no notes on the first screen — they fade in once scrolling starts (V15). */
    notesAtRest?: boolean;
    /** Grain in a bottom corner of each note (default false). */
    grain?: boolean;
    /** Show each speaker's name on their note (default true); false leaves just the role. */
    showNames?: boolean;
    /** Smaller quote text on the notes (default false). */
    smallText?: boolean;
    /** How many notes show on the resting first screen (default: all that the rest point reveals). */
    restVisible?: number;
    /** How close cards come before leaving (default 500); lower keeps close-ups smaller and stops
     *  big cards from covering the ones behind them. */
    nearDepth?: number;
    /** V21.1: framed call cards with the quote revealed on scroll, and calmer tilts. */
    refined?: boolean;
    /** The stage's background colour (default the cream #FFFDF3). */
    stageColor?: string;
    /** V21.11: cards straighten, quotes by distance, and cards leave by flying past you. */
    passBy?: boolean;
    /** V21.11: a small violet glow and dot field that fade out well inside the stage, so a boxed
     *  (clipped) stage keeps clean edges. Default false: both reach the edges. */
    compactGlow?: boolean;
}

export default function PerspectiveTunnelHero({
    items = ITEMS,
    eyebrow,
    title,
    subtitle = "Last night Frank interviewed 214 of them. Scroll to hear what they said.",
    progress: externalProgress,
    restProgress = 0.22,
    prompt = "Scroll to listen",
    promptIcon,
    spread = { desktop: 1.85, mobile: 1.35 },
    cardScale = 0.8,
    flightSpread = 0.7,
    notesAtRest = true,
    grain = false,
    showNames = true,
    smallText = false,
    restVisible = Infinity,
    nearDepth = 500,
    refined = false,
    stageColor = "#FFFDF3",
    compactGlow = false,
    passBy = false,
}: PerspectiveTunnelHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const [keepOut, setKeepOut] = useState<{ halfW: number; halfH: number } | null>(null);
    useEffect(() => {
        const el = copyRef.current; if (!el) return;
        const measure = () => setKeepOut({ halfW: el.offsetWidth / 2, halfH: el.offsetHeight / 2 });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const cards = layoutCards(items, refined ? 0.4 : 1);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Raw motion value controlled directly by mouse wheel / trackpad / touch
    const rawProgress = useMotionValue(0);
    const springProgress = useSpring(rawProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });
    const smoothProgress = externalProgress ?? springProgress;
    // Cards start part-way down the corridor, so the first screen already has voices in it.
    const cardProgress = useTransform(smoothProgress, (v: number) => restProgress + v * (1 - restProgress));
    // Cards leave their resting spots around the headline and move onto the readable flight
    // path over the first stretch of scrolling, while the headline fades.
    const blend = useTransform(smoothProgress, [0.06, 0.36], [0, 1], { clamp: true });
    const reveal = useTransform(smoothProgress, [0.015, 0.1], notesAtRest ? [1, 1] : [0, 1], { clamp: true });
    const heading = title ?? (
        <>
            Your customers
            <br />
            are{" "}
            <span className="italic">
                <HighlightMarker reduced={!!reduce} delay={0.7}>talking.</HighlightMarker>
            </span>
        </>
    );

    // Wheel + touch drive the tunnel while it fills the viewport. At progress 0 scrolling up,
    // or at progress 1 scrolling down, the event is left alone so the page keeps scrolling.
    // When the tunnel is only partly on screen it snaps into place before taking over.
    useEffect(() => {
        const el = containerRef.current;
        if (!el || externalProgress) return;

        const advance = (deltaY: number, e: Event) => {
            const current = rawProgress.get();
            if ((current <= 0 && deltaY < 0) || (current >= 1 && deltaY > 0)) return; // let the page scroll
            const rect = el.getBoundingClientRect();
            const aligned = Math.abs(rect.top) <= 2;
            if (!aligned) {
                // Close enough: snap the tunnel to fill the viewport, then take over.
                if (Math.abs(rect.top) < window.innerHeight * 0.35) {
                    e.preventDefault();
                    window.scrollBy({ top: rect.top, behavior: reduce ? "auto" : "smooth" });
                }
                return;
            }
            e.preventDefault();
            const delta = deltaY * 0.0008; // Adjust speed of tunnel travel here
            rawProgress.set(Math.min(1, Math.max(0, current + delta)));
        };

        const handleWheel = (e: WheelEvent) => advance(e.deltaY, e);

        let lastY: number | null = null;
        const handleTouchStart = (e: TouchEvent) => { lastY = e.touches[0]?.clientY ?? null; };
        const handleTouchMove = (e: TouchEvent) => {
            const y = e.touches[0]?.clientY;
            if (y == null || lastY == null) return;
            const deltaY = (lastY - y) * 2; // finger up = forward
            lastY = y;
            advance(deltaY, e);
        };
        const handleTouchEnd = () => { lastY = null; };

        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [rawProgress, reduce, externalProgress]);

    const pointer = useCameraParallax(!reduce);

    // The copy starts crisp and recedes into the corridor as the cards fly past.
    const titleScale = useTransform(smoothProgress, [0, 1], [1, 1.3]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.1, 0.32], [1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
    const startScroll = () => window.scrollBy({ top: window.innerHeight * 0.7, behavior: reduce ? "auto" : "smooth" });

    return (
        <div
            ref={containerRef}
            className="relative flex h-[100svh] w-full select-none items-center justify-center overflow-hidden text-neutral-900"
            style={{
                backgroundColor: stageColor,
                perspective: stage.isMobile ? "900px" : "1200px",
                transformStyle: "preserve-3d",
            }}
        >
            {/* Background dot grid & glow */}
            {compactGlow ? (
                <>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(216,175,251,0.4)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(circle_at_50%_50%,#000_0,#000_18vmin,transparent_42vmin)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,175,251,0.25)_0%,transparent_34vmin)]" />
                </>
            ) : (
                <>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(216,175,251,0.4)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,175,251,0.25)_0%,transparent_70%)]" />
                </>
            )}

            {/* Depth ring guides */}
            <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-[#D8AFFB]/40" />
            <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-neutral-300/60" />

            {/* Central anchor typography: the hero's own type (Lora in ink, italic lime-marked word, Geist subline). */}
            <motion.div
                style={{ scale: titleScale, opacity: titleOpacity }}
                className="pointer-events-none relative z-20 flex max-w-3xl flex-col items-center px-6 text-center"
            >
                {/* Soft cream halo so the voices drifting behind never cut into the copy. */}
                <div aria-hidden="true" className="absolute -inset-x-8 -inset-y-6 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,253,243,0.92)_45%,rgba(255,253,243,0.6)_72%,rgba(255,253,243,0)_100%)]" />
                <motion.div
                    ref={copyRef}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0.4 : 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    className="flex flex-col items-center"
                >
                    {eyebrow && <p className="mb-4 font-sans text-[13px] text-neutral-600">{eyebrow}</p>}
                    <h2 className="font-serif text-[clamp(38px,min(5vw,8vh),72px)] font-normal leading-[0.95] tracking-[-0.035em] text-[#1a1714] [text-wrap:balance]">
                        {heading}
                    </h2>
                    <p className="mt-6 max-w-[38ch] font-sans text-[16px] leading-[1.5] text-[#5c554d] sm:text-[18px]">{subtitle}</p>
                </motion.div>
            </motion.div>

            {/* Scroll cue: a thin lavender line that keeps drawing downward; clicking it starts the scroll. */}
            <motion.button
                type="button"
                onClick={startScroll}
                style={{ opacity: promptOpacity }}
                className="absolute bottom-8 z-20 flex flex-col items-center gap-3 rounded-full px-4 py-2 font-sans text-[13px] text-neutral-600 outline-none transition-colors duration-200 hover:text-[#1a1714] focus-visible:ring-2 focus-visible:ring-[#1a1714]/40"
            >
                {promptIcon && <span aria-hidden="true" className="-mb-1 block w-[52px]">{promptIcon}</span>}
                <span>{prompt}</span>
                <span className="relative block h-10 w-px overflow-hidden bg-[#D8AFFB]/25" aria-hidden="true">
                    <motion.span
                        className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-[#D8AFFB] to-[#b98ef0]"
                        animate={reduce ? undefined : { scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
                        transition={{ duration: 1.8, times: [0, 0.6, 1], ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.3 }}
                    />
                </span>
            </motion.button>

            {/* 3D z-space plane */}
            <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {cards.map((card, i) => (
                    <TunnelCard
                        key={i}
                        card={card}
                        progress={cardProgress}
                        blend={blend}
                        reveal={reveal}
                        pointer={pointer}
                        total={cards.length}
                        stage={stage}
                        spread={stage.isMobile ? spread.mobile : spread.desktop}
                        flightSpread={flightSpread}
                        cardScale={cardScale}
                        rest={restProgress}
                        keepOut={keepOut}
                        grain={grain}
                        showNames={showNames}
                        smallText={smallText}
                        hideAtRest={i >= restVisible}
                        nearDepth={nearDepth}
                        refined={refined}
                        stageColor={stageColor}
                        passBy={passBy}
                    />
                ))}
            </div>
        </div>
    );
}
