// TryPage (V21.04) — hifrank.ai/try-frank in the V21.04 style: where every "Try a live demo" button lands.
// The words are the live page's ("Try Frank for free", "Experience a live interview", the line under it, the
// email field and "Talk to AI"); the design is new and shares the AI voice interviewer page's frame:
//   1. Hero: the forest-green panel in two columns. Left: the label, title, line, the email field with the lime
//      "Talk to AI" pill (CLAUDE.md, buttons on dark green) and three reassurances. Right: Frank on a call card,
//      greeting the visitor (his greeting video, muted, looping while on screen).
//      "Talk to AI" (user, 2026-11-24: start the in-browser demo) swaps the call card for the live voice
//      interview (LiveInterview's InterviewRoom, the AI voice interviewer page's widget) with the churn script:
//      Frank interviews the visitor about an app they stopped using, a few questions, about two minutes, the way he
//      would interview their customers. It runs in the browser; the email isn't sent anywhere until the form is
//      connected to Frank's sign-up system (a developer's job: see onSubmit).
//   2. What to expect: the first section after the hero, so its title has the styled phrase (MarkedPhrase); then
//      three steps on hairline columns (he asks; you answer out loud; you see what he heard).
//   3. Footer.
// Entrance: the hero rises in once on load; the steps rise in with the scroll. Reduced motion: the video's poster.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Mail, Mic } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import { TITLE, SUBTITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import MarkedPhrase from './MarkedPhrase';
import { InterviewRoom, SCRIPTS } from './LiveInterview';
import { PLATE, GRAIN } from './InterviewExample';
import Footer from './Footer';

const EASE = [0.23, 1, 0.32, 1];
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// The live page's three reassurances. "About 2 minutes" is this demo's length (the live page's session runs ~5 min).
const SURE = ['No credit card required', 'About 2 minutes', 'Your data is never shared'];

// The email field with "Talk to AI": one white pill from 640px (the lime button inside it), stacked below that.
function EmailForm({ onStart }) {
  const [email, setEmail] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    // Not sent anywhere yet: connect this to Frank's sign-up / lead system before launch.
    onStart(email);
  };
  return (
    <form onSubmit={onSubmit} className="mx-auto mt-9 w-full max-w-[520px] xl:mx-0" aria-label="Start a live interview">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.6)]">
        <label className="flex h-14 items-center gap-3 rounded-full bg-white px-5 sm:h-12 sm:flex-1 sm:bg-transparent sm:pl-4 sm:pr-2">
          <Mail aria-hidden="true" className="size-[18px] shrink-0 text-ink-3" strokeWidth={1.75} />
          <span className="sr-only">Business email</span>
          <input type="email" required autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your business email"
            className="h-full min-w-0 flex-1 border-0 bg-transparent font-sans text-[16px] text-ink outline-none placeholder:text-ink-3" />
        </label>
        <button type="submit"
          className={'group inline-flex h-14 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full border-0 bg-[#d1f899] py-1.5 pl-6 pr-1.5 font-sans text-[15.5px] font-medium text-ink transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#c4ef84] active:scale-[0.98] sm:h-12 sm:pl-5 ' + FOCUS + ' focus-visible:outline-[#d1f899]'}>
          Talk to AI
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#1a1714]/[0.07] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5">
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </span>
        </button>
      </div>
      <ul className="m-0 mt-5 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 font-sans text-[13.5px] text-white/70 xl:justify-start">
        {SURE.map(t => (
          <li key={t} className="inline-flex items-center gap-1.5"><Check aria-hidden="true" className="size-3.5 text-[#d1f899]" strokeWidth={2.25} />{t}</li>
        ))}
      </ul>
    </form>
  );
}

// Before the visitor starts: Frank on a call card, greeting them. The clip plays muted while on screen.
function FrankCard({ reduce }) {
  const box = useRef(null);
  const video = useRef(null);
  const seen = useInView(box, { amount: 0.3 });
  useEffect(() => {
    const v = video.current; if (!v) return;
    if (seen && !reduce) v.play().catch(() => {}); else v.pause();
  }, [seen, reduce]);
  return (
    <div ref={box} className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#1a1714] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      <video ref={video} className="absolute inset-0 size-full object-cover" src="/videos/frank-greeting.mp4" poster="/videos/frank-greeting.jpg"
        muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-[linear-gradient(rgba(0,0,0,0.45),transparent)] px-5 pb-10 pt-4 font-sans text-white">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium"><span className="size-2 rounded-full bg-[#d1f899]" />Frank · AI interviewer</span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] backdrop-blur">Ready</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.6))] px-5 pb-5 pt-16">
        <p className="m-0 max-w-[30ch] rounded-[18px] rounded-bl-[6px] bg-white/95 px-4 py-3 font-sans text-[15px] leading-[1.45] text-ink shadow-[0_12px_30px_-16px_rgba(0,0,0,0.6)]">
          Hi, I’m Frank. Enter your email and I’ll interview you, the way I’d interview your customers.
        </p>
      </div>
    </div>
  );
}

// After "Talk to AI": the live voice interview on the AI voice interviewer page's plate.
function Room({ reduce }) {
  return (
    <div className="relative mx-auto w-full max-w-[520px] pr-3 pt-6 sm:pr-4 sm:pt-10">
      <span aria-hidden="true" className="pointer-events-none absolute right-[-12px] top-[12px] h-[64%] w-[80%] overflow-hidden rounded-[28px] sm:right-[-24px] sm:top-[22px] sm:rounded-[36px]" style={{ backgroundImage: PLATE }}>
        <span className="absolute inset-0 opacity-[0.7]" style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} />
      </span>
      <div className="relative w-full"><InterviewRoom skin="widget" script={SCRIPTS.churn} reduced={reduce} /></div>
    </div>
  );
}

// What to expect: what the demo does, from LiveInterview's own behaviour.
const STEPS = [
  ['Frank asks', 'He opens the call and asks his first question out loud, the way he’d start an interview with one of your customers.'],
  ['You answer out loud', 'Talk as you would on a call. Frank listens, follows up on your own words, and digs deeper when an answer is short.'],
  ['See what he heard', 'When the call wraps up, you get the theme Frank took away, the words of yours behind it, and the transcript.'],
];

export default function TryPage() {
  const reduce = !!useReducedMotion();
  const [started, setStarted] = useState(false);
  const stage = useRef(null);
  const start = () => {
    setStarted(true);
    // Stacked layouts: bring the interview into view under the form.
    requestAnimationFrame(() => {
      const el = stage.current; if (!el || window.matchMedia('(min-width: 1280px)').matches) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: reduce ? 'auto' : 'smooth' });
    });
  };
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          {/* 1 — Hero. Below 1280px: stacked, text first (centred). */}
          <section aria-labelledby="try-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-12 sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)] xl:py-[clamp(64px,6vw,96px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-full xl:w-[60%]" style={{ background: 'radial-gradient(50% 50% at 50% 55%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:gap-16">
                <div className="text-center xl:text-left">
                  <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 justify-center !text-white/85 sm:mb-8 xl:justify-start">Try Frank for free</Eyebrow></Rise>
                  <Rise as="h1" reduce={reduce} delay={0.06} id="try-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                    <span className="block">Experience a live</span><span className="block"><span className="italic">interview</span></span>
                  </Rise>
                  <Rise as="p" reduce={reduce} delay={0.14} className="mx-auto mb-0 mt-5 max-w-[44ch] font-sans text-[16.5px] leading-[1.6] text-white/70 sm:mt-6 sm:text-[18px] xl:mx-0">
                    Enter your email and Frank will interview you, just like it would your customers.
                  </Rise>
                  <Rise reduce={reduce} delay={0.22}>
                    {started ? (
                      <p role="status" className="mx-auto mb-0 mt-9 inline-flex max-w-[44ch] items-center gap-2.5 rounded-full bg-white/[0.08] px-5 py-3 font-sans text-[15px] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] xl:mx-0">
                        <Mic aria-hidden="true" className="size-4 text-[#d1f899]" strokeWidth={2} />
                        Frank is ready. Press “Start interview” to begin.
                      </p>
                    ) : <EmailForm onStart={start} />}
                  </Rise>
                </div>
                <Rise reduce={reduce} delay={0.3}>
                  {/* The stage keeps Frank's card's 4:5 size, so the hero doesn't jump when the interview replaces it. */}
                  <div ref={stage} className="mx-auto grid aspect-[4/5] w-full max-w-[440px] items-center xl:max-w-none">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={started ? 'room' : 'frank'}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px) scale(0.98)' }}
                        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-8px) scale(0.98)' }}
                        transition={{ duration: 0.45, ease: EASE }}>
                        {started ? <Room reduce={reduce} /> : <FrankCard reduce={reduce} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Rise>
              </div>
            </div>
          </section>

          {/* 2 — What to expect: three steps on hairline columns. */}
          <section aria-labelledby="try-steps-title" className={'pb-[clamp(112px,13vw,200px)] pt-[clamp(96px,11vw,160px)] ' + PAD}>
            <div className="mx-auto max-w-[1312px]">
              <div className="max-w-[760px]">
                <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">What to expect</Eyebrow></ScrubText>
                <ScrubTitle reduce={reduce} id="try-steps-title" className={'m-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE}
                  lines={['Two minutes,', <MarkedPhrase key="m" reduce={reduce}>out loud with Frank</MarkedPhrase>]} />
                <ScrubText as="p" reduce={reduce} lag={0.12} className={'mb-0 mt-6 max-w-[56ch] ' + SUBTITLE}>
                  Frank interviews you about an app or subscription you stopped using: a few questions, the way he would interview your customers.
                </ScrubText>
              </div>
              <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-10 p-0 sm:mt-16 md:grid-cols-3 md:gap-8 lg:gap-12">
                {STEPS.map(([title, text], i) => (
                  <ScrubText as="li" key={title} reduce={reduce} lag={i * 0.05} className="border-0 border-t border-solid border-[#1a1714]/[0.1] pt-6">
                    <span className="font-sans text-[14px] tabular-nums text-ink-3">0{i + 1}</span>
                    <h3 className={FIG + ' m-0 mt-3 text-[clamp(21px,1.9vw,25px)] leading-[1.25] tracking-[-0.02em] text-ink'}>{title}</h3>
                    <p className="m-0 mt-3 max-w-[40ch] font-sans text-[16px] leading-[1.6] text-ink-2">{text}</p>
                  </ScrubText>
                ))}
              </ol>
              <ScrubText as="p" reduce={reduce} lag={0.1} className="m-0 mt-12 font-sans text-[14px] text-ink-3">
                Runs in your browser with your microphone. Chrome, Edge and Safari work best.
              </ScrubText>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
