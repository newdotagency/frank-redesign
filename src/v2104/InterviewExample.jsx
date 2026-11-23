// InterviewExample (V21.11) — "Experience a Frank interview yourself", in two columns on the page's
// own white: on the left, the label, title, a short line and three notes on what to listen for; on
// the right, the voice call as Frank's website widget (a light card: Frank, his status, the question,
// a small row of controls; LiveInterview's widget skin). Each note lights up the moment Frank makes that
// move in your call (the room reports its moves: a follow-up on your words, a nudge back on track
// when an answer is short, a deeper why); they reset when the call starts over.
// It all sits in one cream card (#fffdf3) at the size of the page's other full-screen cards: the
// window less an even 16px (phones) / 40px gap, a screen tall, 44px corners; the content centred. Entrance, tied to the scroll (reveal.jsx): the
// card rising and opening out to its full width, then the label, the title line by line, the line and the
// notes, and on the right the green plate growing from its corner with the widget following it up.
// Below 1024px: the text first, then the widget, centred.
import { useCallback, useRef, useState } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CornerDownRight, Compass, Search } from 'lucide-react';
import { InterviewRoom, SCRIPTS } from './LiveInterview';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle, useProgress } from './reveal';

const NOTES = [
  { id: 'follow', icon: CornerDownRight, title: 'Follows up', body: 'Asks about what you just said, not the next question on a list.' },
  { id: 'track', icon: Compass, title: 'Keeps you on track', body: 'Gently brings a short answer back to the point.' },
  { id: 'deeper', icon: Search, title: 'Digs into the why', body: 'Keeps asking until the real reason comes out.' },
];

// The widget's plate: a lime gradient with a visible grain, set behind the widget's top-left corner only.
// The grain is a fractal-noise tile turned into moss-green specks (an SVG data URI, painted once).
export const PLATE = 'radial-gradient(90% 80% at 0% 0%, #e4f9bd 0%, rgba(228,249,189,0) 60%), '
  + 'linear-gradient(150deg, #d6f59f 0%, #c4ee84 100%)';
export const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.56 0 0 0 0 0.16 -5 0 0 0 2.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url%28%23n%29'/%3E%3C/svg%3E\")";

// On wide screens the widget's right edge lines up with How it works' visual: that section's content box
// (1240px max, clamp(16px,4vw,48px) side padding, on the viewport) less this one's (the card 40px in from
// the window, clamp(48px,6vw,96px) padding, 1120px max), as a negative right margin.
const ALIGN = 'calc(min(50vw + 560px, 100vw - 40px - clamp(48px, 6vw, 96px)) - min(50vw + 572px, 100vw - clamp(16px, 4vw, 48px)))';

// One note: lit (Frank just made this move), made (earlier in this call), dim (not yet), or at rest.
function Note({ note, state, reduce }) {
  const Icon = note.icon, lit = state === 'lit';
  return (
    <motion.li initial={false} animate={{ opacity: state === 'dim' ? 0.5 : 1 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="flex items-start gap-3.5">
      <span className={'relative grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-500 '
        + (lit ? 'bg-[#d1f899] text-[#1a1714]' : state === 'made' ? 'bg-[#d1f899]/50 text-[#1a1714]' : 'bg-[#1a1714]/[0.05] text-ink-2')}>
        {lit && !reduce && (
          <motion.span aria-hidden="true" className="absolute inset-0 rounded-full border border-solid border-[#a0d05f]"
            initial={{ opacity: 0.8, transform: 'scale(1)' }} animate={{ opacity: 0, transform: 'scale(1.5)' }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }} />
        )}
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <div>
        <p className="m-0 font-sans text-[16px] font-medium leading-snug text-ink">{note.title}</p>
        <p className="m-0 mt-0.5 max-w-[36ch] font-sans text-[15px] leading-[1.5] text-ink-2">{note.body}</p>
      </div>
    </motion.li>
  );
}

export default function InterviewExample() {
  const reduce = !!useReducedMotion();
  // The card's entrance, tied to the scroll: it rises, fades up and opens out sideways from a narrower,
  // inset shape to its full width (a clip, so its content never squashes), done as its top nears the
  // upper fifth of the window. Reduced motion keeps only the fade.
  const card = useRef(null);
  const cp = useProgress(card, ['start end', 'start 0.2']);
  const cardFade = useTransform(cp, [0, 0.35], [0, 1]);
  const cardY = useTransform(cp, [0, 0.8], [reduce ? 0 : 96, 0]);
  const cardSide = useTransform(cp, [0, 0.8], [reduce ? 0 : 8, 0]);
  const cardIn = {
    opacity: cardFade,
    transform: useMotionTemplate`translateY(${cardY}px)`,
    clipPath: useMotionTemplate`inset(0% ${cardSide}% round var(--r))`,
  };
  // Then the widget column: the green plate grows in from its corner, and the widget follows it up,
  // a beat later. After that the widget drifts a little against its plate as the section passes.
  const plate = useRef(null);
  const pp = useProgress(plate, ['start 0.95', 'start 0.4']);
  const plateIn = {
    opacity: useTransform(pp, [0, 0.5], [0, 1]),
    transform: useMotionTemplate`scale(${useTransform(pp, [0, 1], [reduce ? 1 : 0.86, 1])})`,
  };
  const enter = useTransform(pp, [0.15, 1], [reduce ? 0 : 64, 0]);
  const widgetFade = useTransform(pp, [0.15, 0.6], [0, 1]);
  const { scrollYProgress: pass } = useScroll({ target: plate, offset: ['start end', 'end start'] });
  const drift = useTransform(pass, [0, 1], reduce ? [0, 0] : [22, -22]);
  const lift = useTransform([drift, enter], ([d, e]) => `translateY(${(d + e).toFixed(2)}px)`);
  // Which moves Frank has made in this call (null before it starts: every note at rest).
  const [hit, setHit] = useState(null);
  const [last, setLast] = useState(null);
  const onMove = useCallback(m => {
    if (m === null) { setHit(null); setLast(null); return; }
    setHit(h => ({ ...(h || {}), [m]: true }));
    setLast(m);
  }, []);
  const onPhase = useCallback(phase => { if (phase === 'live') setHit(h => h || {}); }, []);
  const state = id => (hit === null ? 'rest' : last === id ? 'lit' : hit[id] ? 'made' : 'dim');

  return (
    <section aria-labelledby="ie-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] md:px-10">
      {/* The whole section sits in one card, in the page's cream (#fffdf3), so the white widget stands out on it;
          the card rises and opens out to its full width with the scroll. */}
      <motion.div ref={card} style={cardIn}
        className="grid min-h-[calc(100svh-32px)] items-center overflow-hidden rounded-[32px] bg-[#fffdf3] [--r:32px] md:[--r:44px] px-5 py-12 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)] lg:py-[clamp(64px,7vw,104px)]">
      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16">
        {/* The widget, with a green grained plate tucked behind its top-right corner: it reaches out to the right and only a thin strip shows above.
            V21.04: from 1024px it sits 24px lower beside the text. */}
        <div ref={plate} className="relative order-2 mx-auto w-full max-w-[540px] pr-3 pt-6 sm:pr-4 sm:pt-14 lg:left-[30px] lg:top-6 lg:ml-auto lg:mr-[var(--align)] lg:pr-0"
          style={{ '--align': ALIGN }}>
          <motion.div aria-hidden="true" className="pointer-events-none absolute right-[-12px] top-[14px] h-[64%] w-[80%] origin-top-right overflow-hidden rounded-[28px] sm:right-[-40px] sm:top-[36px] sm:rounded-[36px] lg:right-[-12px] xl:right-[-24px]"
            style={{ backgroundImage: PLATE, ...plateIn }}>
            <span className="absolute inset-0 opacity-[0.7]"
              style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} />
          </motion.div>
          <motion.div className="relative w-full" style={{ transform: lift, opacity: widgetFade }}>
            <InterviewRoom skin="widget" script={SCRIPTS.whyFrank} reduced={reduce} onMove={onMove} onPhase={onPhase} />
          </motion.div>
        </div>

        <div className="relative order-1 lg:right-[30px]">
          <ScrubText reduce={reduce}><Eyebrow align="start" line={false} className="mb-6 sm:mb-8">Demo Frank</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ie-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Experience a Frank', 'interview yourself']} />
          <ScrubText as="p" reduce={reduce} lag={0.1} className={'mb-0 max-w-[44ch] mt-6 ' + SUBTITLE}>
            Want to see Frank interview live? Join the voice interview below and share why you’d like to use Frank.
          </ScrubText>
          <ScrubText reduce={reduce} lag={0.2}>
            <ul className="m-0 mt-8 grid list-none gap-6 p-0">
              {NOTES.map(n => <Note key={n.id} note={n} state={state(n.id)} reduce={reduce} />)}
            </ul>
          </ScrubText>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
