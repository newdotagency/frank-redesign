// VoicePage (V21.04) — hifrank.ai/ai-voice-interviewer brought into the V21.04 style. The words and links are
// the live page's (titles in sentence case); the design is new and shares the pricing page's frame:
//   1. Hero: the forest-green panel split in two: the label, title, subtitle and two actions on the left;
//      one voice moment on the right (Frank asks, she answers out loud, he catches a pause, frustration, emphasis).
//   2. "Trusted by 1,000+ brands": the Prelaunch brand logos in one quiet grey row.
//   3. Three figures (100x, 50x, 30+) on hairline columns.
//   4. Three answers, alternating sides, each with its visual: tone and scale reuse the live page's videos
//      (a phone on a voice call; a calendar filling with interviews); reach is hello in many languages,
//      one lit at a time.
//   5. "Try the AI interviewer yourself": the live voice widget from the homepage, so the visitor can talk to
//      Frank right here ("Try it now" across the page scrolls to it).
//   6. How it works: the homepage's own section, as it is there (its title, steps and scenes).
//   7. Security (SOC 2, the ESOMAR award, GDPR), the FAQ, a lime closing panel, then the footer.
// Entrance: the hero rises in once on load; everything else rises in with the scroll (reveal.jsx).
// Motion inside the scenes runs only while they're on screen; reduced motion: they hold still.
import TrustStrip from './TrustStrip';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Globe, List, MicOff, PhoneOff } from 'lucide-react';
import Header from '../components/Header';
import HighlightMarker from '../components/HighlightMarker';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import MarkedPhrase from './MarkedPhrase';
import { ScrubText, ScrubTitle } from './reveal';
import { InterviewRoom, SCRIPTS } from './LiveInterview';
import { PLATE, GRAIN } from './InterviewExample';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import SecuritySection from './SecuritySection';
import Footer from './Footer';

const SIGNUP = 'https://app.hifrank.ai/signup';
const FRANK_PHOTO = '/videos/frank-avatar.jpg';  // Frank's realistic photo: a square crop of his greeting video at 5 s (mouth closed, a slight smile)
const TRY = '/try-frank'; // the Try Frank page on this site
const EASE = [0.23, 1, 0.32, 1];
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const BODY = 'font-sans text-[17px] leading-[1.6] text-ink-2 sm:text-[18px]';

// "Try it now" buttons on this page scroll to the live widget (section 5), its title clear of the header.
// (Exported, with Rise, Btn, the scenes and Answer, for the AI video interviewer page, which shares this frame.)
export const toSection = id => e => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
};
const toTry = toSection('vo-try');

export function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// Buttons: the page's pill with its arrow in a circle at the end (nudges forward on hover), and a quiet one.
export function Btn({ href, onClick, tone = 'ink', children, arrow = true, ext = false }) {
  const tones = {
    ink: 'bg-[#1a1714] text-white hover:bg-[#2a2622]',
    lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]',
    white: 'bg-white text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.08)] hover:bg-[#fafaf7]',
    ghost: 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:bg-white/[0.14]',
  };
  return (
    <a href={href} onClick={onClick} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={'group inline-flex h-12 items-center gap-3 rounded-full font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ' + (arrow ? 'py-1.5 pl-5 pr-1.5 ' : 'px-6 ') + tones[tone] + ' ' + FOCUS}>
      {children}
      {arrow && (
        <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5 ' + (tone === 'ink' || tone === 'ghost' ? 'bg-white/[0.12]' : 'bg-[#1a1714]/[0.07]')}>
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </a>
  );
}

// A row of bars that move like a voice while `live`. Heights follow a fixed pattern so it reads as speech
// (phrases and pauses), not noise; each bar breathes on its own beat (CSS, v19.css .vo-bar).
const WAVE = [3, 5, 8, 12, 7, 4, 9, 14, 18, 11, 6, 3, 2, 4, 10, 16, 20, 15, 9, 5, 7, 12, 17, 13, 8, 4, 2, 3, 6, 11, 15, 10, 6, 3];
function Wave({ live, n = WAVE.length, color = 'currentColor', h = 44, gap = 3, w = 3, className = '' }) {
  const bars = Array.from({ length: n }, (_, i) => WAVE[i % WAVE.length]);
  return (
    <span aria-hidden="true" className={'vo-wave flex items-center ' + (live ? 'on ' : '') + className} style={{ height: h, gap }}>
      {bars.map((b, i) => (
        <span key={i} className="vo-bar block rounded-full"
          style={{ width: w, height: `${Math.max(12, (b / 20) * 100)}%`, background: color, animationDelay: `${(i * 97) % 900}ms`, animationDuration: `${900 + ((i * 131) % 600)}ms` }} />
      ))}
    </span>
  );
}

// ——— 1. Hero visual: many conversations at once, one voice at a time. A stack of call cards (real customer
// call clips, the homepage's): the front card is the customer speaking: their clip plays, a live tag sits on
// top, and what they say rises in as a caption with the feeling Frank heard in it. The next customers wait
// behind, a little smaller and turned. Every few seconds the front card steps back to the end of the queue
// and the next comes forward (a spring). Runs while on screen; reduced motion: the stack, still.
// avatar: a square still from the clip, picked with eyes open and mouth closed (frames pulled on this Mac,
// 320×320, cropped on the face Vision finds so it sits in the middle of the circle), for the voice cards. The voice page's people (01, 04, 08, 05) differ from the video page's (09, 02,
// 10, 11, 03), so each page has its own faces.
const clipOf = n => ({ video: `/videos/call-${n}-card.mp4`, poster: `/videos/call-${n}-card.jpg`, avatar: `/videos/call-${n}-avatar.jpg?v=2` });  // ?v: bump when an avatar is re-cropped, so browsers fetch it again
const CROWD = [
  { ...clipOf('01'), name: 'Amara J.', q: 'I couldn’t work out how to invite my team.', tag: 'Confused', tone: 'bg-[#e8eefb] text-[#2e4f8a]' },
  { ...clipOf('04'), name: 'Sophie R.', q: 'I’d pay more if setup took five minutes.', tag: 'Eager', tone: 'bg-[#eaf8d6] text-[#3f6b12]' },
  { ...clipOf('08'), name: 'Elena V.', q: 'Moving our old data took a whole weekend.', tag: 'Frustrated', tone: 'bg-[#fdebec] text-[#9f2f2d]' },
  { ...clipOf('05'), name: 'Jordan P.', q: 'We only find out why they leave once they’re gone.', tag: 'Concerned', tone: 'bg-[#fbf3db] text-[#8a6100]' },
];
// Where a card sits by its place in the queue (0 = speaking, at the front).
const SLOT = [
  { transform: 'translate(0px, 0px) rotate(0deg) scale(1)', opacity: 1 },
  { transform: 'translate(46px, -26px) rotate(5deg) scale(0.92)', opacity: 0.85 },
  { transform: 'translate(-44px, -40px) rotate(-6deg) scale(0.86)', opacity: 0.6 },
  { transform: 'translate(0px, -54px) rotate(0deg) scale(0.8)', opacity: 0 },
];
// mode 'video' (the video page): the card is the customer's clip, playing while in front. mode 'voice' (this
// page): a voice call card: the customer's avatar (a still from their clip, eyes open) in the middle, lime rings
// breathing out of it and a waveform under it while they speak; no video.
function CrowdCard({ c, k, live, reduce, saw, mode }) {
  const vid = useRef(null);
  const front = k === 0;
  const voice = mode === 'voice';
  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (front && live) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [front, live]);
  const speaking = front && live;
  return (
    <motion.div initial={false} animate={SLOT[Math.min(k, SLOT.length - 1)]}
      transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.9, bounce: 0.18 }}
      className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#1d3b32] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-40px_rgba(0,0,0,0.7)]"
      style={{ zIndex: 10 - k }}>
      {voice ? (
        <>
          <span className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 50% at 50% 34%, rgba(209,248,153,0.16), rgba(209,248,153,0) 100%)' }} />
          <div className="absolute inset-x-0 top-[17%] flex flex-col items-center">
            <div className="relative size-[112px] sm:size-[128px]">
              {[0, 1].map(i => (
                <span key={i} className={'vo-pulse absolute inset-0 rounded-full ' + (speaking ? 'on' : '')} style={{ animationDelay: `${i * 1.2}s` }} />
              ))}
              <img src={c.avatar || c.poster} alt="" className="relative block size-full rounded-full object-cover shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" />
            </div>
            <span className="mt-6 text-[#d1f899]"><Wave live={speaking} n={22} h={30} w={3} gap={3} /></span>
          </div>
        </>
      ) : (
        <video ref={vid} src={c.video} poster={c.poster} muted loop playsInline preload="metadata" className="block size-full object-cover" />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {/* Live tag and who it is. */}
      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/35 py-1 pl-2 pr-3 font-sans text-[12px] text-white">
        <span className="relative grid size-2 place-items-center">
          {front && live && <span className="absolute inset-0 animate-ping rounded-full bg-[#d1f899]" />}
          <span className="relative size-2 rounded-full bg-[#d1f899]" />
        </span>
        {c.name}
      </span>
      {/* What they say, and the feeling Frank heard. */}
      <AnimatePresence>
        {front && (
          <motion.div key="cap" initial={{ opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-3 bottom-3 rounded-[18px] bg-white/95 p-3.5 shadow-[0_16px_32px_-18px_rgba(0,0,0,0.6)]">
            <p className="m-0 font-serif text-[16px] leading-[1.35] text-ink">“{c.q}”</p>
            <span className="mt-2 flex items-center gap-2 font-sans text-[11.5px] text-ink-3">
              {saw}
              <span className={'rounded-full px-2 py-0.5 font-medium ' + c.tone}>{c.tag}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
// crowd: the cards (default the voice page's); saw: the words before the tag ("Frank heard" by voice).
export function VoiceCrowd({ reduce, crowd = CROWD, saw = 'Frank heard', mode = 'video' }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.3 }) && !reduce;
  const [who, setWho] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setWho(w => (w + 1) % crowd.length), 3600);
    return () => clearInterval(id);
  }, [live, crowd.length]);
  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto flex h-[400px] w-full max-w-[560px] items-end justify-center pb-2 sm:h-[460px]">
      <div className="relative aspect-[4/5] w-[260px] sm:w-[300px]">
        {crowd.map((c, i) => <CrowdCard key={c.video} c={c} k={(i - who + crowd.length) % crowd.length} live={live} reduce={reduce} saw={saw} mode={mode} />)}
      </div>
    </div>
  );
}

// ——— 4. The three answers' scenes. Each sits in a cream card at 5:4 (near the homepage's 4:3 objection boxes).
export const CARD = 'relative w-full overflow-hidden rounded-[28px] bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.04)] lg:rounded-[32px]';
const SCENE = CARD + ' aspect-square sm:aspect-[5/4]';

// Tone: the live page's "Voice Call" phone, rebuilt in Frank's colours (the video's lavender ring, red button,
// stray grid lines and uneven bottom tray gone), as a conversation between two: the customer big and square on
// video (a real call clip, call-09) and Frank, the bot, as a small square still photo (from his greeting video,
// no video) in its top-right corner. They take turns: the speaker gets the lime (rings round Frank's photo, or a
// lime edge on her video) and their line in the transcript below lights up with a live waveform. A ticking
// timer on the video; the call controls on a clean tray (end call in ink).
// Everything inside the phone is sized to the phone's width (container units), so it scales as one piece.
// Motion only while on screen; reduced motion: still, the clip's first frame.
export function PhoneScene({ reduce }) {
  const box = useRef(null);
  const vid = useRef(null);
  const live = useInView(box, { amount: 0.3 }) && !reduce;
  const [sec, setSec] = useState(484);
  // Who's speaking: 0 Frank (asking), 1 the customer (answering); they swap every few seconds.
  const [who, setWho] = useState(1);
  useEffect(() => {
    const v = vid.current;
    if (v) { if (live) v.play().catch(() => {}); else v.pause(); }
    if (!live) return;
    const id = setInterval(() => setSec(s => s + 1), 1000);
    const turn = setInterval(() => setWho(w => 1 - w), 3400);
    return () => { clearInterval(id); clearInterval(turn); };
  }, [live]);
  // One speaker's avatar: the lime rings breathe out of it only while they speak.
  // (Plain functions, not components: the timer's re-render must not remount them and restart their motion.)
  const rings = on => [0, 1].map(i => (
    <span key={i} className={'vo-pulse absolute inset-0 rounded-[5cqw] ' + (live && on ? 'on' : '')} style={{ animationDelay: `${i * 1.2}s` }} />
  ));
  const line = (me, text, right) => {
    const on = who === me;
    return (
      <div key={me} className={'flex items-center gap-[2.2cqw] rounded-[4cqw] px-[3.2cqw] py-[2.4cqw] transition-[background-color,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ' + (right ? 'ml-[8cqw] ' : 'mr-[8cqw] ') + (on ? (right ? 'bg-[#eef9dd] opacity-100 shadow-[inset_0_0_0_1px_rgba(95,143,34,0.18)]' : 'bg-[#fffdf3] opacity-100 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)]') : 'bg-[#1a1714]/[0.025] opacity-[0.55]')}>
        <span className="shrink-0 text-[#5f8f22]"><Wave live={live && on} n={5} h={12} w={2} gap={1.5} /></span>
        <span className="font-sans text-[3.5cqw] leading-[1.35] text-ink-2">{text}</span>
      </div>
    );
  };
  const time = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const ctl = 'grid place-items-center rounded-full';
  return (
    // A taller card than the other scenes (4:5), so the phone is big enough to read.
    <div ref={box} aria-hidden="true" className={CARD + ' mx-auto aspect-[4/5] max-w-[480px]'}>
      <div className="absolute inset-[6%] flex items-center justify-center">
        {/* The phone's shape comes from its height and aspect ratio; its content sits on an absolute layer that fills it,
            and that layer is the size container. (Safari mis-sizes cqw when the container itself gets its width from aspect-ratio.) */}
        {/* The video square has an explicit width (100cqw less its 6cqw margins): Safari sizes a stretched aspect-square
            flex item from the full width, margins ignored, so it overflowed the phone's right edge. */}
        <div className="relative h-full w-auto max-w-full overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_rgba(26,23,20,0.06),0_28px_56px_-30px_rgba(42,50,30,0.45)] [aspect-ratio:436/756]">
        <div className="absolute inset-0 flex flex-col [container-type:inline-size]">
          {/* A soft lime light behind the two avatars. */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-[60%]" style={{ background: 'radial-gradient(80% 50% at 50% 32%, rgba(209,248,153,0.32), rgba(209,248,153,0) 100%)' }} />
          {/* Status bar. */}
          <div className="relative flex items-center justify-between px-[7cqw] pt-[5cqw] font-sans text-[4.4cqw] font-medium text-ink">
            <span>9:41</span>
            <span className="flex items-center gap-[1.5cqw]">
              <svg viewBox="0 0 18 12" className="h-[3cqw] w-auto fill-current"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" opacity=".3" /></svg>
              <svg viewBox="0 0 26 12" className="h-[3cqw] w-auto"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" /><rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4" /></svg>
            </span>
          </div>
          {/* The customer on video, big and square; Frank (the bot: a still photo, no video) as a small square
              avatar in its top-right corner, like a call's picture-in-picture. The timer sits top-left; her name bottom-left.
              Whoever is speaking gets the lime: rings breathing out of Frank's avatar, or a lime edge on her video. */}
          <div className="relative mx-[6cqw] mt-[4cqw] aspect-square w-[88cqw] shrink-0">
            <div className={'absolute inset-0 overflow-hidden rounded-[6cqw] bg-[#efeee9] transition-shadow duration-500 ' + (who === 1 ? 'shadow-[0_0_0_0.9cqw_#d1f899]' : 'shadow-[0_0_0_0.9cqw_rgba(26,23,20,0.04)]')}>
              <video ref={vid} src="/videos/call-09-card.mp4" poster="/videos/call-09-card.jpg" muted loop playsInline preload="metadata"
                className="block size-full object-cover [object-position:50%_28%]" />
              <span className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-[3.5cqw] left-[3.5cqw] inline-flex items-center gap-[1.8cqw] font-sans text-white">
                <span className="text-[#d1f899]"><Wave live={live && who === 1} n={4} h={10} w={2} gap={1.5} /></span>
                <span className="text-[3.8cqw] font-medium leading-none">Chloe Martin</span>
                <span className="text-[3.2cqw] leading-none text-white/70">Customer</span>
              </span>
              <span className="absolute left-[3cqw] top-[3cqw] inline-flex items-center gap-[1.4cqw] rounded-full bg-black/35 px-[2.4cqw] py-[1cqw] font-gmono text-[3.4cqw] tabular-nums text-white backdrop-blur-[2px]">
                <span className="size-[1.5cqw] rounded-full bg-[#d1f899]" />{time}
              </span>
            </div>
            <div className="absolute right-[3cqw] top-[3cqw] flex flex-col items-center">
              <div className="relative aspect-square w-[22cqw]">
                {rings(who === 0)}
                <span className={'absolute inset-0 overflow-hidden rounded-[5cqw] bg-[#efeee9] transition-shadow duration-500 ' + (who === 0 ? 'shadow-[0_0_0_0.8cqw_#fff,0_0_0_1.6cqw_#d1f899]' : 'shadow-[0_0_0_0.8cqw_#fff]')}>
                  <img src={FRANK_PHOTO} alt="" className="block size-full object-cover" />
                </span>
              </div>
            </div>
          </div>
          {/* The transcript: Frank's question, then her answer; the line being spoken is lit. */}
          <div className="relative mx-[6cqw] mt-auto grid gap-[1.8cqw]">
            {line(0, 'What slowed you down most during setup?')}
            {line(1, '“Honestly… it took longer than I hoped.”', true)}
          </div>
          {/* Call controls. */}
          <div className="relative mt-[4cqw] flex items-center justify-center gap-[9cqw] border-0 border-t border-solid border-[#1a1714]/[0.06] pb-[3cqw] pt-[4cqw]">
            <span className={ctl + ' size-[11cqw] bg-[#1a1714]/[0.04] text-ink-2'}><List className="size-[5cqw]" strokeWidth={1.75} /></span>
            <span className={ctl + ' size-[15cqw] bg-[#1a1714] text-white shadow-[0_0_0_2.2cqw_rgba(26,23,20,0.06)]'}><PhoneOff className="size-[6cqw]" strokeWidth={1.75} /></span>
            <span className={ctl + ' size-[11cqw] bg-[#1a1714]/[0.04] text-ink-2'}><MicOff className="size-[5cqw]" strokeWidth={1.75} /></span>
          </div>
          <span className="relative mx-auto mb-[2.5cqw] block h-[1.2cqw] w-[32cqw] rounded-full bg-[#1a1714]" />
        </div>
        </div>
      </div>
    </div>
  );
}
// Scale: the live page's own "Calendar" video (720×720: a month, then a day opening and crowded with
// interviews), kept as it is except the selected day: the 9th's cell and its "Thu" label recoloured from teal
// to Frank's lime and green (re-encoded on this Mac with Core Image: calendar-brand.mp4). Centred on the cream
// card, rounded like a screen, muted and looping while on screen (paused off screen); reduced motion: the
// first frame.
export function CalendarScene({ reduce }) {
  const box = useRef(null);
  const vid = useRef(null);
  const live = useInView(box, { amount: 0.3 }) && !reduce;
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (live) v.play().catch(() => {}); else v.pause();
  }, [live]);
  return (
    <div ref={box} aria-hidden="true" className={SCENE}>
      <div className="absolute inset-[8%] flex items-center justify-center">
        <video ref={vid} src="/videos/calendar-brand.mp4" poster="/videos/calendar-brand.jpg" muted loop playsInline preload="metadata"
          className="block aspect-square h-full max-h-full w-auto max-w-full rounded-[22px] object-cover shadow-[0_0_0_1px_rgba(26,23,20,0.06),0_28px_56px_-30px_rgba(42,50,30,0.45)]" />
      </div>
    </div>
  );
}

// Reach: hello in each language Frank supports as soft chips, plus a Multilanguage chip with a globe; one
// lights up at a time, as if Frank just greeted someone there.
const HELLOS = [
  ['Hello', 'English (US)'], ['Hola', 'Spanish'], ['Bonjour', 'French'], ['Hallo', 'German'], ['Ciao', 'Italian'],
  ['Olá', 'Portuguese'], ['こんにちは', 'Japanese'], ['안녕하세요', 'Korean'], ['你好', 'Chinese'],
  [Globe, 'Multilanguage'],
];
export function ReachScene({ reduce }) {
  const ref = useRef(null);
  const live = useInView(ref, { amount: 0.4 }) && !reduce;
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setK(x => (x + 3) % HELLOS.length), 1400);
    return () => clearInterval(id);
  }, [live]);
  return (
    <div ref={ref} aria-hidden="true" className={SCENE + ' grid place-items-center'}>
      <div className="flex max-w-[88%] flex-wrap justify-center gap-2 xl:gap-2.5">
        {HELLOS.map(([w, lang], i) => {
          const on = i === k;
          return (
            <span key={lang} className={'inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-sans text-[14px] transition-[background-color,color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] xl:h-11 xl:gap-2 xl:px-4 xl:text-[16px] ' + (on ? 'scale-[1.04] bg-[#1a1714] text-white shadow-[0_14px_28px_-16px_rgba(26,23,20,0.6)]' : 'bg-white text-ink-2 shadow-[0_0_0_1px_rgba(26,23,20,0.06)]')}>
              {typeof w === 'string' ? w : (() => { const Icon = w; return <Icon className="size-[1.05em]" strokeWidth={1.75} />; })()}
              <span className={'text-[11px] transition-colors xl:text-[11.5px] duration-500 ' + (on ? 'text-[#d1f899]' : 'text-ink-3')}>{lang}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

const ANSWERS = [
  { id: 'vo-hear', kicker: 'Struggling to capture real user emotion?', title: ['Hear their voices.', 'Literally.'], Scene: PhoneScene,
    text: ['Typed survey answers hide what words alone can’t reveal… frustration, excitement, hesitation.',
      'With Frank, you get natural-sounding, human conversations that capture vocal tone, pauses, and emphasis, revealing what customers actually feel beneath the surface, and how they say it.'] },
  { id: 'vo-auto', kicker: 'Tired of manual interview overload?', title: ['Automate voice', 'research with AI'], Scene: CalendarScene, flip: true,
    text: ['Scheduling, moderating, transcribing? Traditional voice interviews are a nightmare to scale beyond 2-3 interviews per week, especially on a busy schedule!',
      'Prelaunch’s AI Voice Interviewer can run hundreds of 1-on-1 voice conversations simultaneously, ask intelligent follow-up questions, and deliver structured insights automatically.'] },
  { id: 'vo-global', kicker: 'Need global reach?', title: ['Talk to anyone, anywhere,', 'instantly'], Scene: ReachScene,
    text: ['Your AI Voice Interviewer speaks 50+ interview languages and can conduct interviews in real time, across continents, time zones, and markets!',
      'Understand your customers no matter where they are.'] },
];

// first: the first of these sections, the page's first titled section after the hero, so the only one whose
// title is styled (its second line under the marker; user rule, 2026-11-23). The others are plain.
export function Answer({ a, reduce, first }) {
  const titleId = a.id + '-title';
  return (
    <section aria-labelledby={titleId} className="relative px-4 pb-[clamp(112px,13vw,200px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto grid max-w-[1312px] items-center gap-x-16 gap-y-10 lg:grid-cols-2">
        <div className={a.flip ? 'lg:order-2' : ''}>
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">{a.kicker}</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id={titleId} className={'m-0 leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
            lines={first ? [a.title[0], <MarkedPhrase key="m" reduce={reduce}>{a.title[1]}</MarkedPhrase>] : a.title} />
          <ScrubText reduce={reduce} lag={0.15} className={'mt-6 max-w-[50ch] space-y-4 sm:mt-8 ' + BODY}>
            {a.text.map(p => <p key={p.slice(0, 24)} className="m-0">{p}</p>)}
          </ScrubText>
        </div>
        <ScrubText reduce={reduce} lag={0.1} className={a.flip ? 'lg:order-1' : ''}>
          <a.Scene reduce={reduce} />
        </ScrubText>
      </div>
    </section>
  );
}

const FAQS = [
  { q: 'Do people feel comfortable talking to AI by voice?', a: ['Yes! And they actually open up more easily. The AI’s conversational tone builds comfort and trust, leading to more candid answers.'] },
  { q: 'Can the AI Voice Interviewer handle different accents and languages?', a: ['No problem. The AI Interviewer supports 50+ interview languages and automatically adapts to accents and speech patterns.'] },
  { q: 'How long does a typical AI Voice Interview take?', a: ['Most interviews last between 5–10 minutes, depending on your goals and user engagement.'] },
  { q: 'Can I get transcripts and summaries?', a: ['Absolutely. Every interview is automatically transcribed, analyzed, and summarized, with highlights you can share directly.'] },
  { q: 'Is it secure?', a: ['Yes! Prelaunch is SOC 2 and GDPR compliant. All audio data is encrypted and anonymized for privacy and compliance.'] },
];

export const STATS = [
  { n: '100x', what: 'more interviews per month', text: 'Run and analyze hundreds of deep interviews automatically. No scheduling, no transcripts, no hassle.' },
  { n: '50x', what: 'more affordable', text: 'Traditional interviews cost $500–$1,000 each. Get the same insights for a fraction of the price.' },
  { n: '30+', what: 'languages available', text: 'Talk to customers worldwide. Frank speaks 50+ interview languages and delivers instant translations (coming soon).' },
];

export const Note = ({ dark }) => (
  <p className={'m-0 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[13.5px] lg:justify-start ' + (dark ? 'text-ink/70' : 'text-ink-3')}>
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />Free plan: 60 voice minutes a month, no card required</span>
    <span className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5" strokeWidth={2} />No credit card required</span>
  </p>
);

export default function VoicePage() {
  const reduce = !!useReducedMotion();
  const closeTitle = useRef(null);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          {/* 1 — Hero: the green panel in two columns. Left, the label, title, the line under it and the two actions
              (the live page's words); right, a stack of call cards: one customer speaking at a time (VoiceCrowd). Below 1280px: stacked,
              text first (centred). */}
          <section aria-labelledby="vo-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-12 sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)] xl:py-[clamp(64px,6vw,96px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-full xl:w-[60%]" style={{ background: 'radial-gradient(50% 50% at 50% 55%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)] xl:gap-16">
                <div className="text-center xl:text-left">
                  <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 justify-center !text-white/85 sm:mb-8 xl:justify-start">AI voice interviewer</Eyebrow></Rise>
                  <Rise as="h1" reduce={reduce} delay={0.06} id="vo-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                    <span className="block">Human conversations,</span><span className="block"><span className="italic">automated</span></span>
                  </Rise>
                  <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-5 max-w-[50ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:mt-6 sm:text-[17px] xl:mx-0">
                    Go beyond typed chats and static surveys. With AI Voice Interviewer, you can capture real emotion, tone, and nuance directly from your customers… at scale! It listens, probes deeper, and uncovers what they truly feel, all without you lifting a finger
                  </Rise>
                  <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3 xl:justify-start">
                    <Btn href={SIGNUP} tone="lime">Sign up for free</Btn>
                    <Btn href={TRY} onClick={toTry} tone="ghost" arrow={false}>Try it now</Btn>
                  </Rise>
                </div>
                <Rise reduce={reduce} delay={0.3}><VoiceCrowd reduce={reduce} mode="voice" /></Rise>
              </div>
            </div>
          </section>

          {/* 2 — Trusted by. */}
          <TrustStrip />

          {/* 3 — Figures. */}
          <section aria-label="Frank in numbers" className="px-4 pb-[clamp(112px,13vw,200px)] pt-[clamp(80px,9vw,136px)] sm:px-[clamp(16px,4vw,48px)]">
            <ul className="mx-auto m-0 grid max-w-[1312px] list-none gap-10 p-0 md:grid-cols-3 md:gap-0">
              {STATS.map((s, i) => (
                <ScrubText as="li" key={s.n} reduce={reduce} lag={i * 0.06}
                  className={'md:px-10 ' + (i ? 'border-0 border-t border-solid border-[#1a1714]/[0.07] pt-10 md:border-l md:border-t-0 md:pt-0' : 'md:pl-0')}>
                  <p className="m-0 font-['Figtree',sans-serif] text-[56px] font-medium leading-none tracking-[-0.04em] text-ink sm:text-[64px]">{s.n}</p>
                  <p className="m-0 mt-4 font-sans text-[17px] font-medium text-ink">{s.what}</p>
                  <p className="m-0 mt-2 max-w-[36ch] font-sans text-[15.5px] leading-[1.55] text-ink-2">{s.text}</p>
                </ScrubText>
              ))}
            </ul>
          </section>

          {/* 4 — The three answers, all titles plain (user, 2026-11-26: no italic, no marker on these pages). */}
          {ANSWERS.map(a => <Answer key={a.id} a={a} reduce={reduce} />)}

          {/* 5 — Try it yourself, with the live voice widget (as in the homepage's Interview example). */}
          <section id="vo-try" aria-labelledby="vo-try-title" className="relative px-4 pb-[clamp(112px,13vw,200px)] md:px-10">
            <div className="grid min-h-[calc(100svh-32px)] items-center overflow-hidden rounded-[32px] bg-[#fffdf3] px-5 py-12 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)]">
              <div className="mx-auto grid w-full max-w-[1120px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
                <div className="text-center lg:text-left">
                  <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 justify-center sm:mb-8 lg:justify-start">Live demo</Eyebrow></ScrubText>
                  <ScrubTitle reduce={reduce} id="vo-try-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE} lines={['Try the AI interviewer', 'yourself']} />
                  <ScrubText as="p" reduce={reduce} lag={0.1} className={'mx-auto mb-0 mt-6 max-w-[46ch] lg:mx-0 ' + SUBTITLE}>
                    Be the first to interview your customers with AI Voice Interviews and start hearing what your customers really think, today. Start running 1,000+ deep voice interviews overnight. Without sending a single calendar invite!
                  </ScrubText>
                  <ScrubText reduce={reduce} lag={0.2}>
                    <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                      <Btn href={TRY} ext>Try it now</Btn>
                      <Btn href={TRY} tone="white" arrow={false}>Try a live demo</Btn>
                    </div>
                    <Note />
                  </ScrubText>
                </div>
                <ScrubText reduce={reduce} lag={0.15} className="relative mx-auto w-full max-w-[520px] pr-3 pt-6 sm:pr-4 sm:pt-12">
                  <span aria-hidden="true" className="pointer-events-none absolute right-[-12px] top-[12px] h-[64%] w-[80%] overflow-hidden rounded-[28px] sm:right-[-28px] sm:top-[28px] sm:rounded-[36px]" style={{ backgroundImage: PLATE }}>
                    <span className="absolute inset-0 opacity-[0.7]" style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} />
                  </span>
                  <div className="relative w-full">
                    <InterviewRoom skin="widget" script={SCRIPTS.whyFrank} reduced={reduce} />
                  </div>
                </ScrubText>
              </div>
            </div>
          </section>

          {/* 6 — How it works: the homepage's section, unchanged (user, 2026-11-26). */}
          <HowItWorks />

          {/* 7 — Security (shared with the feature pages). */}
          <SecuritySection reduce={reduce} id="vo-sec-title" />

          {/* FAQ, in the homepage FAQ's layout (title, how to reach the team; the questions on the right). */}
          <FAQ items={FAQS} label="FAQ" lines={['Have questions?', 'We have answers']} id="vo-faq-title" />

          {/* Closing, in Frank's lime. */}
          <section aria-labelledby="vo-cta-title" className="relative px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(72px,9vw,128px)] text-center md:rounded-[44px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 100%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <div aria-hidden="true" className="mx-auto w-[84px] sm:w-[100px]"><Glasses pose="Ready" reduced={reduce} /></div>
                <div ref={closeTitle}>
                  <ScrubTitle reduce={reduce} id="vo-cta-title" className={'m-0 mt-8 leading-[1.06] text-ink [text-wrap:balance] sm:mt-10 ' + TITLE}
                    lines={['Start listening with', 'AI voice interviewer.', 'Today.']} />
                </div>
                <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[46ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
                  Watch it ask questions, adapt, and go deep with real customer insights. Try it now. It’s a lot of fun!
                </ScrubText>
                <ScrubText reduce={reduce} lag={0.25}>
                  <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9">
                    <Btn href={SIGNUP}>Start scaling today</Btn>
                    <Btn href={TRY} tone="white" arrow={false}>Try a live demo</Btn>
                  </div>
                  <div className="[&>p]:!justify-center"><Note dark /></div>
                </ScrubText>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
