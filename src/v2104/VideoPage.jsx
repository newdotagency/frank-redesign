// VideoPage (V21.04) — hifrank.ai/ai-video-interviewer in the V21.04 style, built from the AI voice interviewer
// page's pieces (VoicePage exports them), so the two read as one family. The words are the live page's (titles in
// sentence case); the order follows it:
//   1. Hero: the forest-green panel; the label with a "Coming soon" tag, title, the two lines under it and the two
//      actions on the left; on the right the stack of customer video cards (VoiceCrowd), each tagged with the
//      reaction Frank saw. (The voice page uses the same stack with avatars and a waveform instead of video.)
//   2. "Trusted by 1,000+ brands" and 3. the three figures: as on the voice page.
//   4. Two answers, alternating sides: "Watch how customers actually feel" (a video interview: CallCard) and
//      "Let AI do it all" (the calendar filling with interviews).
//   5. "Try the AI interviewer yourself" with the live widget ("Try it now" across the page scrolls to it).
//   6. How it works (the homepage's layout), 7. security, the FAQ and the lime closing panel.
import { useRef } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { Video } from 'lucide-react';
import Header from '../components/Header';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import BrandMarquee from './BrandMarquee';
import { PL_LOGOS } from './logos/prelaunchBrands';
import { InterviewRoom, SCRIPTS } from './LiveInterview';
import { PLATE, GRAIN } from './InterviewExample';
import HowItWorks from './HowItWorks';
import { Share } from './StepVisuals';
import FAQ from './FAQ';
import SecuritySection from './SecuritySection';
import Footer from './Footer';
import CallCard from './CallCard';
import { Answer, BRANDS, Btn, CARD, CalendarScene, Note, Rise, STATS, VoiceCrowd, toSection } from './VoicePage';

const SIGNUP = 'https://app.hifrank.ai/signup';
const TRY = '/try-frank';
const toTry = toSection('vi-try');

// ——— 4. "Watch how customers actually feel": a video interview (CallCard, as on the use-case pages): what Frank
// sees matters here, so he asks about a reaction as well as an answer.
const HERO_CALL = {
  icon: Video,
  name: 'Video interview',
  hero: {
    clip: 'call-07-card',
    focus: 0.55,
    person: 'Marcus',
    turns: [
      ['frank', 'When you first opened the dashboard, what did you expect to see?'],
      ['customer', 'My numbers, honestly. Not a product tour.'],
      ['frank', 'You smiled when you said that. What’s behind it?'],
      ['customer', 'The tour took ten minutes. I almost closed the tab.'],
      ['frank', 'What made you stay?'],
      ['customer', 'A teammate had already set up our first report.'],
    ],
  },
};

// ——— 1. Hero visual: the stack of customer video cards (VoiceCrowd), each with what they say and the reaction
// Frank saw on their face.
const clipOf = n => ({ video: `/videos/call-${n}-card.mp4`, poster: `/videos/call-${n}-card.jpg` });
const FACES = [
  { ...clipOf('09'), name: 'Chloe M.', q: 'When the report just appeared, I was genuinely relieved.', tag: 'Delighted', tone: 'bg-[#eaf8d6] text-[#3f6b12]' },
  { ...clipOf('02'), name: 'Tomás H.', q: 'I think the pricing is fine… mostly.', tag: 'Hesitant', tone: 'bg-[#fbf3db] text-[#8a6100]' },
  { ...clipOf('10'), name: 'Lea N.', q: 'Wait, where did my saved filters go?', tag: 'Confused', tone: 'bg-[#e8eefb] text-[#2e4f8a]' },
  { ...clipOf('11'), name: 'David K.', q: 'If it did this for every project, I’d use it daily.', tag: 'Excited', tone: 'bg-[#eaf8d6] text-[#3f6b12]' },
  { ...clipOf('03'), name: 'Lukas B.', q: 'Setup was quicker than I expected, honestly.', tag: 'Surprised', tone: 'bg-[#e8eefb] text-[#2e4f8a]' },
];
// The answer's scene: the video interview itself (CallCard: the customer on video, Frank's tile, the
// conversation as bubbles), on the cream card.
function CallScene({ reduce }) {
  return (
    <div className={CARD + ' px-5 py-10 sm:px-10 sm:py-14'}>
      <CallCard data={HERO_CALL} reduce={reduce} />
    </div>
  );
}

const ANSWERS = [
  { id: 'vi-feel', kicker: 'Need more than words?', title: ['Watch how customers', 'actually feel'], Scene: CallScene,
    text: ['Surveys and transcripts tell you what people say, but not what they mean, or why they feel that way.',
      'With AI Video Interviews, you can see their facial expressions, micro-reactions, and body language. All decoded by AI to reveal true emotion, hesitation, and delight.'] },
  { id: 'vi-auto', kicker: 'Hours on moderation & transcription?', title: ['Let AI do it all'], Scene: CalendarScene, flip: true,
    text: ['Traditional video interviews are powerful, but painful to manage. Scheduling, recording, transcribing, summarizing… It’s a full-time job!',
      'Frank’s AI Video Interviewer automates everything: it runs the interview, asks adaptive follow-up questions, and delivers distilled insights in minutes.'] },
];

// ——— 6. How it works: the homepage's layout, with the live page's three steps.
const STEPS = [
  { name: 'Set up', title: 'Set up your goals', body: [
    'Tell the AI what you want to learn. Early product discovery, usability feedback, post-launch reactions, churn analysis, or anything else you’re interested in knowing more about.',
    'Our Research Agent creates a tailored interview guide for you, that you can edit and review.'] },
  { name: 'Share', title: 'Share the video interview link & let the AI lead the conversation', scene: Share, body: [
    'Place your interview link anywhere — your site, an email, or in-product. Participants can join on their own time, from any browser or phone.',
    'The AI interviewer engages your participants naturally, adapting questions in real time based on their responses. It captures both what they say and how they say it, from tone to emotion to body language.'] },
  { name: 'Analyze', title: 'Analyze & act on insights', body: [
    'Instantly access insights powered by emotion and sentiment analysis.',
    'View key insight highlights, summaries, and side-by-side comparisons of different interview segments, all ready to share with your team.'] },
];

const FAQS = [
  { q: 'Do people feel comfortable talking to AI on video?', a: ['Yes. People find it surprisingly natural and more personal. The AI’s adaptive follow-ups help users feel understood and open up easily.'] },
  { q: 'What extra insights can video interviews provide?', a: ['Video interviews add another layer of visual emotion. You can see smiles, confusion, or hesitation, and the AI translates those cues into emotional and behavioral insights.'] },
  { q: 'Do I need special software or downloads?', a: ['No. Participants can join directly from their browser or phone. No logins or installations needed!'] },
  { q: 'Are video interviews private and secure?', a: ['Absolutely. Prelaunch is SOC 2 certified and GDPR compliant. All videos are encrypted, anonymized, and stored securely.'] },
  { q: 'Can I share highlights with my team?', a: ['Yes. Every interview is summarized into short, shareable video clips so your team can see and hear your customers directly, no decks required.'] },
];

export default function VideoPage() {
  const reduce = !!useReducedMotion();
  const closeTitle = useRef(null);
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          {/* 1 — Hero: the green panel in two columns; below 1280px stacked, text first (centred). */}
          <section aria-labelledby="vi-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-12 sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)] xl:py-[clamp(64px,6vw,96px)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-full xl:w-[60%]" style={{ background: 'radial-gradient(50% 50% at 50% 55%, rgba(209,248,153,0.14), rgba(209,248,153,0) 70%)' }} />
              <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)] xl:gap-16">
                <div className="text-center xl:text-left">
                  <Rise reduce={reduce} className="mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:mb-8 xl:justify-start">
                    <Eyebrow align="start" className="!text-white/85">AI video interviewer</Eyebrow>
                    <span className="inline-flex h-8 items-center rounded-full bg-white/[0.1] px-3.5 font-sans text-[12.5px] font-medium uppercase leading-none tracking-[0.08em] text-[#d1f899]">Coming soon</span>
                  </Rise>
                  <Rise as="h1" reduce={reduce} delay={0.06} id="vi-title" className={'m-0 pb-1 leading-[1.06] text-white [text-wrap:balance] ' + TITLE}>
                    <span className="block">See what your customers</span><span className="block"><span className="italic">really think</span></span>
                  </Rise>
                  <Rise reduce={reduce} delay={0.14} className="mx-auto mt-5 max-w-[50ch] space-y-3 font-sans text-[16.5px] leading-[1.6] text-white/70 sm:mt-6 sm:text-[17px] xl:mx-0">
                    <p className="m-0">Get closer to your customers than ever before. With AI Video Interviews, you can read their expressions, hear their tone, and understand their reactions in real time.</p>
                    <p className="m-0">No scheduling. No wasted hours. Just real human emotion, captured automatically by AI.</p>
                  </Rise>
                  <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap justify-center gap-3 xl:justify-start">
                    <Btn href={SIGNUP} tone="lime">Sign up for free</Btn>
                    <Btn href={TRY} onClick={toTry} tone="ghost" arrow={false}>Try it now</Btn>
                  </Rise>
                </div>
                <Rise reduce={reduce} delay={0.3}><VoiceCrowd reduce={reduce} crowd={FACES} saw="Frank saw" /></Rise>
              </div>
            </div>
          </section>

          {/* 2 — Trusted by. */}
          <section aria-label="Trusted by 1,000+ brands" className="px-4 pt-[clamp(56px,6vw,88px)] sm:px-[clamp(16px,4vw,48px)]">
            <ScrubText reduce={reduce} className="mx-auto max-w-[1312px] text-center">
              <p className="m-0 font-sans text-[12.5px] font-light uppercase tracking-[0.08em] text-ink-3">Trusted by 1,000+ brands</p>
              <BrandMarquee brands={BRANDS} logos={PL_LOGOS} />
            </ScrubText>
          </section>

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

          {/* 4 — The two answers (only the first title styled: the page's first titled section). */}
          {ANSWERS.map((a, i) => <Answer key={a.id} a={a} reduce={reduce} first={i === 0} />)}

          {/* 5 — Try it yourself, with the live widget. */}
          <section id="vi-try" aria-labelledby="vi-try-title" className="relative px-4 pb-[clamp(112px,13vw,200px)] md:px-10">
            <div className="grid min-h-[calc(100svh-32px)] items-center overflow-hidden rounded-[32px] bg-[#fffdf3] px-5 py-12 sm:px-10 sm:py-16 md:min-h-[calc(100svh-80px)] md:rounded-[44px] lg:px-[clamp(48px,6vw,96px)]">
              <div className="mx-auto grid w-full max-w-[1120px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
                <div className="text-center lg:text-left">
                  <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 justify-center sm:mb-8 lg:justify-start">Live demo</Eyebrow></ScrubText>
                  <ScrubTitle reduce={reduce} id="vi-try-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE} lines={['Try the AI interviewer', 'yourself']} />
                  <ScrubText as="p" reduce={reduce} lag={0.1} className={'mx-auto mb-0 mt-6 max-w-[46ch] lg:mx-0 ' + SUBTITLE}>
                    Run 1,000+ face-to-face AI Video Interviews without joining a single Zoom link.
                  </ScrubText>
                  <ScrubText reduce={reduce} lag={0.2}>
                    <p className="m-0 mx-auto mt-4 max-w-[46ch] font-sans text-[16px] leading-[1.6] text-ink-2 sm:text-[17px] lg:mx-0">See real reactions. Get real insights. Start with AI Video Interviews today.</p>
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

          {/* 6 — How it works, in the homepage's layout. */}
          <HowItWorks steps={STEPS} label="How it works" lines={['From a goal to real reactions', 'in three steps']} subtitle={null}
            id="vi-how-title" action={<Btn href={TRY} onClick={toTry} tone="white">Try it now</Btn>} />

          {/* 7 — Security, the FAQ, then the closing panel in Frank's lime. */}
          <SecuritySection reduce={reduce} id="vi-sec-title" />
          <FAQ items={FAQS} label="FAQ" lines={['Have questions?', 'We have answers']} id="vi-faq-title" />

          <section aria-labelledby="vi-cta-title" className="relative px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
            <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(72px,9vw,128px)] text-center md:rounded-[44px]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgba(255,255,255,0.38), rgba(255,255,255,0) 100%)' }} />
              <div className="relative mx-auto max-w-[860px]">
                <div aria-hidden="true" className="mx-auto w-[84px] sm:w-[100px]"><Glasses pose="Ready" reduced={reduce} /></div>
                <div ref={closeTitle}>
                  <ScrubTitle reduce={reduce} id="vi-cta-title" className={'m-0 mt-8 leading-[1.06] text-ink [text-wrap:balance] sm:mt-10 ' + TITLE}
                    lines={['Stop leaving insights', 'on the table.']} />
                </div>
                <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 max-w-[46ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
                  Open the door to your customers via AI Video Interviews.
                </ScrubText>
                <ScrubText reduce={reduce} lag={0.25}>
                  <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9">
                    <Btn href={SIGNUP}>Sign up for free</Btn>
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
