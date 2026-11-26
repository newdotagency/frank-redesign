// ChurnPage (V21.04): the Churn use-case page (brief "Landing Page: Churn Reasons Interview", 2026-11-16).
// The words are the brief's, unchanged, with headings in sentence case; the comparison table's words are the user's
// (2026-11-23). Drafted here: the hero's conversation (it acts out the brief's own "too expensive" line). Layout, on the home page's container
// (CLAUDE.md, "Frank landing pages: page container"):
//   1. Hero: the forest-green panel as an editorial split: label, title, description and the two CTAs on the left;
//      on the right the shared CallCard (the use-case template hero: a video call as on the home page's How it
//      works, with the conversation beside it as chat bubbles), filled from ./usecases/churn.js.
//   2. What is a churn interview? Two columns: label and title ("churn interview?" under the marker), the first sentence
//      as the subtitle (the shared SUBTITLE style from ./titles) on the left, the second paragraph over the pull quote on the right, the subtitle and paragraph in Geist,
//      the pull quote in the Lora italic (user asked to try its first font again, 2026-11-23); then "When to run it" with the four
//      moments in one row from 1280px (2×2 below, one column on phones), all four cards white, each with its icon at the
//      top, then title and text (user, 2026-11-23: icons instead of the small pictures).
//   4. The research guide: pinned label pill, title and subtitle on the left; the six steps on a 1px rule on the right,
//      a small node per step and the rule filling violet with the scroll; the cream note box under the list.
//      (A first heavier version and a recording/waveform version were tried and removed, 2026-11-23.)
//   5. Frank vs cancellation surveys: the user's comparison table (8 rows, in two groups) with Frank's answers on one
//      forest-green column, then the table's closing line as the takeaway.
//   5b. What you get: pinned label, title and intro on the left; the four top reasons as cards that stack one by
//      one as you scroll (as on hifrank.ai/roles/product-managers), each with its count, finding and quote.
//   5c. More templates: the home page's use-case wheel with the other ten templates.
//   5d. FAQ: the user's nine questions in the home page's FAQ layout.
//   6. Closing: the lime panel with the brief's alternative headlines and both CTAs, then the footer. "Hear it." in the
//      Lora italic under the violet highlighter, brand-secondary (user asked, 2026-11-23; an exception to the first-title-only rule).
// "Preview the interview" opens the home page's live interview; "Make it yours" opens sign-up.
// Titles (user rule, 2026-11-23): only the first section after the hero has the styled title (the Lora italic phrase
// under the lime marker); every later section title is plain Figtree. The hero keeps its own italic phrase.
// Entrance: the hero rises in on load, its cards settling on a spring; the rest rises in with the scroll.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import UseCases from './UseCases';
import MarkedPhrase from './MarkedPhrase';
import FAQ from './FAQ';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnalyticsUpIcon, MessageQuestionIcon, Tag01Icon, CheckmarkCircle02Icon, UserRemove01Icon } from '@hugeicons/core-free-icons';
import Header from '../components/Header';
import HighlightMarker from '../components/HighlightMarker';
import { cornerGlowGrain } from '../components/grain';
import Glasses from '../v3/Glasses';
import { TITLE, SUBTITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';
import Footer from './Footer';
import CallCard from './CallCard';
import { CHURN } from './usecases/churn';

const SIGNUP = 'https://app.hifrank.ai/signup';
// The home page's live interview. Address and anchor stay apart so the build can rewrite the address.
const PREVIEW = { href: '/', hash: '#ie-title' };
const EASE = [0.23, 1, 0.32, 1];
const CURVE = 'ease-[cubic-bezier(0.32,0.72,0,1)]';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const FIG = "font-['Figtree',sans-serif] font-medium";
const PAD = 'px-4 sm:px-[clamp(16px,4vw,48px)]';
const H2 = 'm-0 text-[clamp(32px,4.4vw,56px)] leading-[1.06] text-ink [text-wrap:balance] ' + TITLE;
const SECTION = 'pt-[clamp(112px,13vw,200px)] ';

// Each moment: its icon (Hugeicons stroke rounded, the design system's icon set; free package, 2026-11-23), the card's
// only visual, in a soft tile at the top; then title and text (the brief's words).
const WHEN = [
  [UserRemove01Icon, 'Right after cancellation', 'Trigger the interview pop-up on your site’s cancellation flow while the decision is still fresh. A week later, the details are gone.'],
  [AnalyticsUpIcon, 'When churn goes up', 'A bad month tells you how many left. Talk to the customers behind the number before you commit to a fix.'],
  [Tag01Icon, 'After a pricing change', 'Find out whether the new price caused the cancellations, or just gave customers a moment to reconsider.'],
  [MessageQuestionIcon, 'When your exit survey goes vague', 'If “Other” or “Too expensive” tops your cancellation reasons, those are the answers that need a follow-up question.'],
];

const GUIDE = CHURN.steps;

function Rise({ as = 'div', delay = 0, reduce, className, children, ...rest }) {
  const M = motion[as];
  return (
    <M initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(16px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.7, ease: EASE, delay }} className={className} {...rest}>{children}</M>
  );
}

// Buttons in the AI voice interviewer page's style (VoicePage.jsx Btn; user, 2026-11-23): a pill whose arrow sits
// in a soft circle of the pill's own colour; secondary actions are plain pills with no arrow. tone: 'lime' (on
// dark), 'ink' (on light), 'ghost' (secondary on dark), 'white' (secondary on light).
const FOCUS_RING = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
function Btn({ href, tone = 'ink', arrow = true, children }) {
  const tones = {
    ink: 'bg-[#1a1714] text-white hover:bg-[#2a2622]',
    lime: 'bg-[#d1f899] text-ink hover:bg-[#c4ef84]',
    white: 'bg-white text-ink shadow-[0_0_0_1px_rgba(26,23,20,0.08)] hover:bg-[#fafaf7]',
    ghost: 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:bg-white/[0.14]',
  };
  return (
    <a href={href}
      className={'group inline-flex h-12 items-center gap-3 rounded-full font-sans text-[15.5px] font-medium no-underline transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] ' + (arrow ? 'py-1.5 pl-5 pr-1.5 ' : 'px-6 ') + tones[tone] + ' ' + FOCUS_RING}>
      {children}
      {arrow && (
        <span aria-hidden="true" className={'grid size-9 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:translate-x-0.5 ' + (tone === 'ink' || tone === 'ghost' ? 'bg-white/[0.12]' : 'bg-[#1a1714]/[0.07]')}>
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </a>
  );
}

// ——— 1. Hero.
function Hero({ reduce }) {
  return (
    <section aria-labelledby="ch-title" className="relative px-4 pt-[188px] sm:pt-[124px] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0f2e27] px-5 py-[clamp(48px,6vw,88px)] sm:px-10 md:rounded-[44px] lg:px-[clamp(40px,5vw,80px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40" style={cornerGlowGrain} />
        <div className="relative mx-auto grid max-w-[1232px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Rise reduce={reduce}><Eyebrow align="start" className="mb-6 !text-white/85 sm:mb-8">{CHURN.label}</Eyebrow></Rise>
            <Rise as="h1" reduce={reduce} delay={0.06} id="ch-title" className={'m-0 pb-1 text-[clamp(36px,4.6vw,60px)] leading-[1.05] text-white [text-wrap:balance] ' + TITLE}>
              Frank finds out why customers <span className="italic">really cancel</span>
            </Rise>
            <Rise as="p" reduce={reduce} delay={0.14} className="m-0 mt-5 max-w-[52ch] font-sans text-[17px] leading-[1.6] text-white/70 sm:mt-6">
              In a short voice or video interview, Frank uncovers what led to the cancellation decision, which expectations went unmet, and what the customer will use instead. Then it ranks every reason by how many customers raised it.
            </Rise>
            <Rise reduce={reduce} delay={0.22} className="mt-9 flex flex-wrap items-center gap-3">
              <Btn href={PREVIEW.href + PREVIEW.hash} tone="lime">Preview the interview</Btn>
              <Btn href={SIGNUP} tone="ghost" arrow={false}>Make it yours</Btn>
            </Rise>
          </div>
          <Rise reduce={reduce} delay={0.3} className="mx-auto w-full max-w-[560px] lg:mr-0"><CallCard data={CHURN} reduce={reduce} /></Rise>
        </div>
      </div>
    </section>
  );
}

// ——— 2. What is a churn interview? (with When to run it)
function WhatIs({ reduce }) {
  // The marker draws once the title is in view (it plays when mounted), as in the home testimonials.
  const head = useRef(null);
  const on = useInView(head, { once: true, amount: 0.8 });
  const phrase = <span className="italic">churn interview?</span>;
  return (
    <section aria-labelledby="ch-what-title" className={SECTION + PAD}>
      <div className="mx-auto max-w-[1312px]">
        {/* The definition in two columns: label, title and subtitle on the left; the second paragraph and the pull
            quote on the right, sitting level with the subtitle. One column below 1024px. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end lg:gap-16 xl:gap-24">
          <div>
            <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Churn interviews with Frank</Eyebrow></ScrubText>
            <div ref={head}>
              <ScrubTitle reduce={reduce} id="ch-what-title" className={H2}
                lines={['What is a', <span key="i">{on ? <HighlightMarker reduced={reduce} delay={0.35}>{phrase}</HighlightMarker> : phrase}</span>]} />
            </div>
            <ScrubText as="p" reduce={reduce} lag={0.06} className={'mb-0 mt-6 max-w-[48ch] [text-wrap:balance] ' + SUBTITLE}>
              A churn interview is a short conversation with a customer who has just cancelled.
            </ScrubText>
          </div>
          <div className="flex flex-col gap-6 lg:pb-1">
            <ScrubText as="p" reduce={reduce} lag={0.1} className="m-0 max-w-[52ch] font-sans text-[16px] leading-[1.6] text-ink-2 sm:text-[17px]">
              It walks back through the decision: what they signed up for, when things started to slip, what they expected and didn&rsquo;t get, and where they&rsquo;re going next.
            </ScrubText>
            <ScrubText as="p" reduce={reduce} lag={0.14} className="m-0 max-w-[40ch] border-0 border-l-2 border-solid border-[#a0d05f] pl-5 font-serif text-[clamp(19px,1.6vw,22px)] italic leading-[1.45] text-ink [text-wrap:pretty]">
              The first answer to &ldquo;why did you cancel?&rdquo; is rarely the whole story. Frank follows up until it hears the reason behind the reason.
            </ScrubText>
          </div>
        </div>

        {/* When to run it: the four moments in one row on wide screens. */}
        <ScrubText as="h3" reduce={reduce} id="ch-when-title" className={FIG + ' m-0 mt-20 text-[clamp(22px,2vw,26px)] leading-[1.2] tracking-[-0.02em] text-ink sm:mt-24'}>When to run it</ScrubText>
        <ul aria-labelledby="ch-when-title" className="m-0 mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {WHEN.map(([Icon, title, text], i) => {
            return (
              <ScrubText as="li" key={title} reduce={reduce} lag={i * 0.04}>
                {/* One plain border (user, 2026-11-24: no two-layer frame). */}
                <div className={'h-full transition-transform duration-700 hover:-translate-y-1 ' + CURVE}>
                  <div className="flex h-full min-h-[248px] flex-col rounded-[24px] bg-white p-7 text-ink ring-1 ring-inset ring-[#1a1714]/[0.08]">
                    <span aria-hidden="true" className="grid size-14 place-items-center rounded-[16px] bg-[#f6f4ef] text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <HugeiconsIcon icon={Icon} size={28} strokeWidth={1.5} />
                    </span>
                    <span aria-hidden="true" className="block min-h-8 flex-1" />
                    <h4 className={FIG + ' m-0 text-[20px] leading-[1.25] tracking-[-0.02em] text-ink'}>{title}</h4>
                    <p className="m-0 mt-2.5 font-sans text-[15px] leading-[1.55] text-ink-2">{text}</p>
                  </div>
                </div>
              </ScrubText>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ——— 4. The research guide: the delicate take on the first version (user, 2026-11-23: "suggest delicate version
// of first version"; the first version itself was then removed, user 2026-11-23). The same layout and scroll behaviour, drawn lighter.
// It has the label pill and the cream note box (user, 2026-11-23: moved here from the first version). The rule is a 1px hairline with a small node per step that fills violet
// when reached; step titles and text a size smaller with more air.
function GuideStepLight({ i, title, text, reduce }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -45% 0px' });
  const on = reduce || seen;
  const T = 'transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ';
  return (
    <li ref={ref} className="relative pb-10 pl-8 last:pb-1 sm:pb-12">
      <span aria-hidden="true" className={'absolute left-[-3.5px] top-[9px] size-2 rounded-full ring-4 ring-white ' + T + (on ? 'bg-[#ba86fc]' : 'bg-[#d9d4ca]')} />
      <ScrubText reduce={reduce}>
        <h3 className={'hiw-step-title m-0 text-[clamp(19px,1.6vw,22px)] leading-[1.25] [text-wrap:balance] ' + T + (on ? 'text-ink' : 'text-ink-3')}>
          <span className="tabular-nums text-ink-2">{String(i + 1).padStart(2, '0')}</span>
          <span className="ml-3">{title}</span>
        </h3>
        <p className={'m-0 mt-2 max-w-[48ch] font-sans text-[15px] leading-[1.6] ' + T + (on ? 'text-ink-2' : 'text-ink-3')}>{text}</p>
      </ScrubText>
    </li>
  );
}

function GuideLight({ reduce }) {
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 55%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <section aria-labelledby="ch-guide-title" className={SECTION + PAD}>
      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Typical interview structure</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ch-guide-title" className={H2} lines={['The churn interview', 'research guide.']} />
          <ScrubText as="p" reduce={reduce} lag={0.12} className={'mb-0 mt-6 max-w-[46ch] ' + SUBTITLE}>
            Churn interviews generally follow a six-part guideline built to gather the verifiable insights you need. Every question is editable, and the AI Researcher helps you adapt the Research Guide to your product.
          </ScrubText>
        </div>

        <div className="lg:pt-3">
          <div ref={list} className="relative">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-[#e5e1d8]" />
            <motion.span aria-hidden="true" className="absolute inset-y-0 left-0 w-px origin-top bg-[#ba86fc]"
              style={{ scaleY: reduce ? 1 : fill }} />
            <ol className="relative m-0 list-none p-0">
              {GUIDE.map(([title, text], i) => <GuideStepLight key={title} i={i} title={title} text={text} reduce={reduce} />)}
            </ol>
          </div>
          {/* How Frank gets to the reason behind the reason: the brief's closing paragraph, under the list. */}
          <ScrubText reduce={reduce} className="mt-10">
            <div className="flex items-start gap-3 rounded-[20px] bg-[#fffdf3] p-5 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)] sm:p-6">
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d1f899]"><span className="block w-[62%]"><Glasses pose="Ready" reduced /></span></span>
              <p className="m-0 font-sans text-[15px] leading-[1.55] text-ink sm:text-[16px]">
                Frank doesn&rsquo;t stop at the first answer. It follows up when a reply is vague and comes back to topics later in the conversation. That&rsquo;s how &ldquo;too expensive&rdquo; becomes &ldquo;too expensive for the three of us who still used it.&rdquo;
              </p>
            </div>
          </ScrubText>
        </div>
      </div>
    </section>
  );
}

// ——— 5. Frank vs cancellation surveys (redesigned 2026-11-23 from the user's comparison table; the row words are
// the user's, unchanged). The title, then the table in two groups: the conversation itself and what you get after
// it (the group names are ours). On wide screens three columns: the aspect, the survey's answer in grey, and Frank's
// answer on one forest-green column that runs the table's full height, so Frank reads as one continuous story.
// Below 768px each aspect is its own block: the label, then the survey line, then Frank's line in a green card.
// The table's closing line sits under it as the section's takeaway.
const COMPARE = [
  ['In the interview', [
    ['What the customer does', 'Picks a reason from a list, maybe adds a comment', 'Talks through the decision in their own words'],
    ['Too expensive', 'Logged as a pricing problem', 'Followed up: compared to what, and which part wasn’t worth it?'],
    ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
    ['Reasons you didn’t list', 'Buried in “Other”', 'Captured and grouped into new themes'],
    ['Where they’re going', 'Rarely asked', 'Named, along with why they chose it'],
  ]],
  ['After the interview', [
    ['Analysis', 'You read open-text comments one by one', 'Themes ranked by how many customers raised them'],
    ['What you can act on', 'A percentage per reason', 'Action Items, each linked to the moment in the recording'],
    ['Evidence for your team', 'A row in a spreadsheet', 'The customer’s own voice, ready to play in a meeting'],
  ]],
];
const COLS = 'md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.15fr)]';

function Versus({ reduce }) {
  return (
    <section aria-labelledby="ch-vs-title" className={SECTION + PAD}>
      <div className="mx-auto max-w-[1312px]">
        <div className="max-w-[820px]">
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Comparison: Frank vs cancellation surveys</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ch-vs-title" className={H2} lines={['A survey counts the reasons.', 'Frank explains them.']} />
        </div>

        <ScrubText reduce={reduce} className="mt-12 sm:mt-16">
          <div role="table" aria-label="Cancellation survey compared with a Frank churn interview" className={'relative grid grid-cols-1 ' + COLS}>
            {/* The Frank column: one green panel behind the third column, full height (wide screens). */}
            {/* Column widths are 0.8 / 1 / 1.15 fr with no gap, so the third column starts at 1.8 / 2.95 = 61.017%. */}
            <div aria-hidden="true" className="absolute inset-y-0 left-[61.017%] right-0 hidden overflow-hidden rounded-[28px] bg-[#0f2e27] md:block">
              <div className="pointer-events-none absolute inset-0 opacity-40" style={cornerGlowGrain} />
            </div>

            {/* Column heads. */}
            <div role="row" className="contents">
              <span role="columnheader" className="hidden md:col-start-1 md:row-start-1 md:block"><span className="sr-only">Aspect</span></span>
              <span role="columnheader" className={FIG + ' hidden px-6 pb-6 pt-8 text-[17px] tracking-[-0.01em] text-ink-2 md:col-start-2 md:row-start-1 md:block'}>Cancellation survey</span>
              <span role="columnheader" className="relative hidden items-center gap-2.5 px-8 pb-6 pt-8 md:col-start-3 md:row-start-1 md:flex">
                <img src="/frank-logo.png" alt="Frank" className="block h-[22px] w-auto brightness-0 invert" />
                <span className={FIG + ' text-[17px] tracking-[-0.01em] text-white/80'}>churn interview</span>
              </span>
            </div>

            {COMPARE.map(([group, rows], g) => (
              <div key={group} role="rowgroup" className="contents">
                <span className={FIG + ' relative pb-3 text-[15px] tracking-[-0.01em] text-ink-2 md:col-span-2 md:col-start-1 ' + (g ? 'pt-12 md:pt-14' : 'pt-2 md:pt-4')}>{group}</span>
                <span aria-hidden="true" className="hidden md:col-start-3 md:block" />
                {rows.map(([label, survey, frank], r) => (
                  <div key={label} role="row" className="contents">
                    <span role="rowheader" className={FIG + ' relative pt-5 md:col-start-1 text-[17px] leading-[1.35] tracking-[-0.01em] text-ink md:border-0 md:border-t md:border-solid md:border-[#1a1714]/[0.08] md:py-5 md:pr-6 ' + (r === 0 ? 'max-md:pt-1' : 'max-md:border-0 max-md:border-t max-md:border-solid max-md:border-[#1a1714]/[0.08] max-md:mt-5')}>{label}</span>
                    <span role="cell" className="relative pt-2 md:col-start-2 font-sans text-[15px] leading-[1.55] text-ink-2 md:border-0 md:border-t md:border-solid md:border-[#1a1714]/[0.08] md:px-6 md:py-5 md:text-[16px]">
                      <span className="mr-1.5 font-medium text-ink-2 md:hidden">Survey:</span>{survey}
                    </span>
                    <span role="cell" className="relative mt-2.5 md:col-start-3 rounded-[16px] bg-[#0f2e27] px-4 py-3 font-sans text-[15px] leading-[1.55] text-white md:mt-0 md:rounded-none md:border-0 md:border-t md:border-solid md:border-white/[0.1] md:bg-transparent md:px-8 md:py-5 md:text-[16px]">
                      <span className="mr-1.5 font-medium text-[#d1f899] md:hidden">Frank:</span>{frank}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {/* Bottom padding inside the green column. */}
            <span aria-hidden="true" className="hidden h-6 md:col-start-3 md:block" />
          </div>
        </ScrubText>

        <ScrubText as="p" reduce={reduce} lag={0.08} className={FIG + ' m-0 mt-12 text-[clamp(22px,2.2vw,28px)] leading-[1.3] tracking-[-0.02em] text-ink [text-wrap:balance] sm:mt-16'}>
          <span className="block text-ink-2">Keep the survey for the quick tally.</span> <span className="block">Run Frank when you need to know what to fix.</span>
        </ScrubText>
      </div>
    </section>
  );
}

// ——— 5b. What you get (user's copy, 2026-11-23, words unchanged; headings in sentence case). Laid out like the
// "What PMs use Frank for" section on hifrank.ai/roles/product-managers (user's example): label, title and intro
// pinned on the left; on the right the four top reasons as cards that stack as you scroll, each new card sliding up
// over the one before, so one reason shows at a time. A card (the home Widget stage's cream with the corner glow): the
// share as 48 dots with this reason's customers filled and "17 of 48 customers" (user: a big number read as numbering),
// the reason, the follow-up finding and the customer's words. From 1024px one pinned stage (see OutcomesPinned); the study is
// labelled Example. Below 1024px, and with reduced motion, the cards are a plain list.
const OUT_TOTAL = 48;
const OUT_ROWS = [
  [17, 'Usage collapsed when the person who set it up left', 'Most of these customers first said the product “wasn’t a fit anymore.” Follow-ups traced it back to one departure.', 'Sarah built all the automations. When she left, nobody knew how they worked, so we stopped trusting them.'],
  [14, 'The price increase exposed seats nobody used', 'Every one of them opened with “too expensive.” Only 4 named a cheaper alternative.', 'We were paying for ten seats and three of us logged in. The new price just made us notice.'],
  [11, 'Reports didn’t match how managers review the week', 'Teams exported to spreadsheets every week, then questioned paying for the tool.', 'Every Monday I exported everything to Excel anyway. At some point my boss asked why we needed both.'],
  [9, 'A “good enough” tool came bundled with something they already pay for', null, 'It’s included in our Microsoft plan. It does most of what you do, and most was enough.'],
];

// Where they went (user, 2026-11-24): what the 48 customers moved to, as a donut with its legend. Colours from the
// brand ramps (lime 600, violet 500, blue 600), and greige 600 for "Nothing" on purpose: no destination reads as no
// colour. Checked with the dataviz validator: CVD and normal-vision separation pass; greige is below the chroma floor
// (by design) and violet is under 3:1 on white, so every slice is named with its count in the legend, never colour alone.
// Each slice is drawn as its own shape with softly rounded corners (user, 2026-11-24: a lighter redraw was tried and
// rejected in favour of this first version, with rounded corners added). The ring sweeps in when it scrolls into view.
// Hovering a slice or a legend row brings that slice forward and shows it in the centre.
const WENT = [
  ['Spreadsheets', 16, '#6e9738'],
  ['A direct competitor', 12, '#ba86fc'],
  ['Nothing', 11, '#7d766e'],
  ['A bundled tool', 9, '#4e7ff9'],
];
// A ring slice with rounded corners (viewBox units): the shape is inset by the corner radius and then stroked in its
// own colour with round joins, which puts the radius back as rounded corners. gap is the white space between slices.
function slicePath(a0, a1, rOut, rIn, corner, gap) {
  const ro = rOut - corner, ri = rIn + corner, inset = gap / 2 + corner;
  const pt = (r, a) => `${(100 + r * Math.cos(a)).toFixed(2)} ${(100 + r * Math.sin(a)).toFixed(2)}`;
  const o0 = a0 + inset / ro, o1 = a1 - inset / ro, i0 = a0 + inset / ri, i1 = a1 - inset / ri;
  const large = o1 - o0 > Math.PI ? 1 : 0;
  return `M${pt(ro, o0)} A${ro} ${ro} 0 ${large} 1 ${pt(ro, o1)} L${pt(ri, i1)} A${ri} ${ri} 0 ${large} 0 ${pt(ri, i0)} Z`;
}
// Action Items (user, 2026-11-24, words unchanged).
const ACTIONS = [
  ['Alert account owners when their admin goes inactive, and offer a handover session.', 17],
  ['Show seat usage on the billing page before renewal.', 14],
  ['Add scheduled report exports by email.', 11],
];
// One plain border (user, 2026-11-24: no two-layer frame); FRAME only sizes the wrapper.
const FRAME = 'h-full';
const PANEL = 'relative flex h-full flex-col rounded-[24px] bg-white p-7 text-ink ring-1 ring-inset ring-[#1a1714]/[0.08] sm:p-9';
const H3 = FIG + ' m-0 text-[clamp(22px,2vw,26px)] leading-[1.2] tracking-[-0.02em] text-ink';

function WhereTheyWent({ reduce }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [active, setActive] = useState(null);
  const mask = 'ch-went-mask';
  let start = -Math.PI / 2; // 12 o'clock, clockwise
  const slices = WENT.map(([label, n, color]) => {
    const span = (n / OUT_TOTAL) * Math.PI * 2;
    const s = { label, n, color, d: slicePath(start, start + span, 93, 63, 5, 3.5), pct: Math.round((n / OUT_TOTAL) * 100) };
    start += span;
    return s;
  });
  const on = active === null ? null : slices[active];
  return (
    <div className={FRAME}>
      <div className={PANEL}>
        <h3 id="ch-went-title" className={H3}>Where they went</h3>
        <div ref={ref} className="mt-8 grid flex-1 grid-cols-1 items-center gap-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10 lg:grid-cols-1 xl:grid-cols-[200px_minmax(0,1fr)]">
          <div className="relative mx-auto size-[200px]">
            <svg viewBox="0 0 200 200" className="block size-full" role="img" aria-labelledby="ch-went-title"
              onMouseLeave={() => setActive(null)}>
              {/* The sweep: a ring-shaped mask that draws clockwise from 12 o'clock. */}
              <mask id={mask}>
                <motion.circle cx="100" cy="100" r="78" fill="none" stroke="#fff" strokeWidth="40" pathLength="100"
                  transform="rotate(-90 100 100)"
                  initial={{ strokeDasharray: reduce ? '100 0' : '0 100' }}
                  animate={seen ? { strokeDasharray: '100 0' } : undefined}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.1 }} />
              </mask>
              <g mask={`url(#${mask})`}>
                {slices.map((s, i) => (
                  <motion.path key={s.label} d={s.d} fill={s.color} stroke={s.color} strokeWidth="10" strokeLinejoin="round"
                    animate={{ opacity: active === null || active === i ? 1 : 0.28 }} transition={{ duration: 0.25 }}
                    onMouseEnter={() => setActive(i)} className="cursor-default" />
                ))}
              </g>
            </svg>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <span className={FIG + ' block text-[40px] leading-none tracking-[-0.03em] tabular-nums text-ink'}>{on ? on.n : OUT_TOTAL}</span>
              <span className="mt-1.5 block max-w-[110px] font-sans text-[13px] leading-[1.3] text-ink-2">{on ? on.label : 'customers'}</span>
            </div>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {slices.map((s, i) => (
              <li key={s.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
                className={'flex items-center gap-3 border-0 border-t border-solid border-[#1a1714]/[0.08] py-3 font-sans text-[15px] transition-opacity duration-200 first:border-t-0 ' + (active === null || active === i ? 'opacity-100' : 'opacity-50')}>
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="min-w-0 flex-1 text-ink">{s.label}</span>
                <span className="tabular-nums font-medium text-ink">{s.n}</span>
                <span className="w-10 text-right tabular-nums text-ink-2">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ActionItems() {
  return (
    <div className={FRAME}>
      <div className={PANEL}>
        <h3 id="ch-actions-title" className={H3}>Action Items</h3>
        <ol aria-labelledby="ch-actions-title" className="m-0 mt-6 flex list-none flex-col p-0">
          {ACTIONS.map(([text, n], i) => (
            <li key={text} className="flex gap-3.5 border-0 border-t border-solid border-[#1a1714]/[0.08] py-6 first:border-t-0 first:pt-2 last:pb-0">
              {/* A plain stroke icon, no tile (user, 2026-11-24: simple icons, in green). Lime 600, the bars' colour: 3.4:1 on white. */}
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} strokeWidth={1.5} aria-hidden="true" className="mt-px shrink-0 text-[#6e9738]" />
              <div className="min-w-0 flex-1">
                <p className={FIG + ' m-0 text-[clamp(17px,1.4vw,19px)] leading-[1.35] tracking-[-0.01em] text-ink [text-wrap:pretty]'}>
                  <span className="sr-only">{i + 1}. </span>{text}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span aria-hidden="true" className="relative h-1 w-24 overflow-hidden rounded-full bg-[#1a1714]/[0.08]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-[#6e9738]" style={{ width: `${(n / OUT_TOTAL) * 100}%` }} />
                  </span>
                  <span className="whitespace-nowrap font-sans text-[14px] text-ink-2">Raised by <span className="font-medium text-ink">{n} customers</span></span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// One reason card. `stacked` (the pinned stack): the four cards' side edges line up, so outlines drawn outside them and
// their shadows add up to a dark line (user, 2026-11-24, as on the MCP page); a stacked card draws its outline inside
// its edge, where the card in front covers it, and its shadow only lifts its top edge.
function OutcomeCard({ row: [n, reason, note, quote], i, stacked }) {
  return (
    <div className={'relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[28px] bg-[#fffdf3] p-7 ring-1 sm:p-9 '
      + (stacked ? 'shadow-[0_-6px_12px_-8px_rgba(26,23,20,0.08)] ring-inset ring-[#1a1714]/[0.07]' : 'shadow-[0_-10px_30px_-12px_rgba(26,23,20,0.12)] ring-[#1a1714]/[0.06]')}>
      {/* The home page's Widget stage look: cream with the faint grainy yellow glow in the corner. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={cornerGlowGrain} />
      {/* The share, not a rank: 48 dots, one per customer interviewed, with this reason's customers filled. */}
      <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3">
        <span aria-hidden="true" className="grid grid-cols-[repeat(16,6px)] gap-[4px]">
          {Array.from({ length: OUT_TOTAL }, (_, d) => (
            <span key={d} className={'block size-[6px] rounded-full ' + (d < n ? 'bg-[#1a1714]' : 'bg-[#1a1714]/[0.12]')} />
          ))}
        </span>
        <span className="font-sans text-[15px] text-ink-2"><span className="font-medium text-ink">{n} of {OUT_TOTAL}</span> customers</span>
      </div>
      <h3 className={FIG + ' relative m-0 mt-7 text-[clamp(21px,1.9vw,25px)] leading-[1.25] tracking-[-0.02em] text-ink [text-wrap:balance]'}>
        <span className="sr-only">{i + 1}. </span>{reason}
      </h3>
      {note && <p className="relative m-0 mt-3 max-w-[52ch] font-sans text-[16px] leading-[1.55] text-ink-2">{note}</p>}
      <span aria-hidden="true" className="block min-h-6 flex-1" />
      <blockquote className="relative m-0 mt-6 max-w-[52ch] border-0 border-l-2 border-solid border-[#a0d05f] pl-4 font-serif text-[17px] italic leading-[1.5] text-ink">&ldquo;{quote}&rdquo;</blockquote>
    </div>
  );
}

function OutcomesHeader({ reduce }) {
  return (
    <div>
      <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">Frank interview outcomes</Eyebrow></ScrubText>
      <ScrubTitle reduce={reduce} id="ch-out-title" className={H2} lines={['What you get']} />
      <ScrubText as="p" reduce={reduce} lag={0.12} className={'mb-0 mt-6 max-w-[46ch] ' + SUBTITLE}>
        Every interview is recorded, transcribed and coded. Frank groups the answers into themes, counts how many customers raised each one, and turns the biggest into Action Items.
      </ScrubText>
      <ScrubText as="p" reduce={reduce} lag={0.16} className="m-0 mt-8 font-sans text-[14px] text-ink-2">
        Top reasons for cancelling. Example: {OUT_TOTAL} churn interviews.
      </ScrubText>
    </div>
  );
}

// From 1024px the label, title and the card stack pin as one stage (user, 2026-11-24: the MCP page's fixes here too): a
// track with a sticky stage 112px from the top at its own height; scrolling slides each next card up from below the
// screen to 18px under the one before; after the last the stage holds one more step, then the title and all four cards
// scroll away as one block, so no card leaves on its own.
const OUT_PIN = 112, OUT_STEP = 18, OUT_UNITS = 4; // 3 arriving cards + 1 hold
function OutcomeSlide({ i, progress, from, children }) {
  const y = useTransform(progress, p => {
    if (i === 0) return 0;
    const t = Math.min(1, Math.max(0, p * OUT_UNITS - (i - 1)));
    const e = 1 - Math.pow(1 - t, 3);
    return from * (1 - e) + i * OUT_STEP * e;
  });
  return <motion.li className="[grid-area:1/1]" style={{ y, zIndex: i }}>{children}</motion.li>;
}
function OutcomesPinned({ reduce }) {
  const track = useRef(null);
  const stage = useRef(null);
  const [stageH, setStageH] = useState(600);
  useLayoutEffect(() => {
    const el = stage.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setStageH(Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: track, offset: [`start ${OUT_PIN}px`, `end ${OUT_PIN + stageH}px`] });
  const [from, setFrom] = useState(800);
  useEffect(() => {
    const set = () => setFrom(window.innerHeight); // start a full screen below, out of sight
    set(); window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);
  return (
    <div ref={track} className="relative" style={{ height: `calc(${stageH}px + ${OUT_UNITS * 55}svh)` }}>
      <div ref={stage} className="sticky" style={{ top: OUT_PIN }}>
        <div className="mx-auto grid max-w-[1312px] grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-start gap-16 xl:gap-24">
          <OutcomesHeader reduce={reduce} />
          <ol aria-label="Top reasons for cancelling" className="m-0 grid list-none p-0" style={{ paddingBottom: (OUT_ROWS.length - 1) * OUT_STEP }}>
            {OUT_ROWS.map((row, i) => (
              <OutcomeSlide key={row[1]} i={i} progress={scrollYProgress} from={from}>
                <OutcomeCard row={row} i={i} stacked />
              </OutcomeSlide>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Outcomes({ reduce }) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const set = () => setWide(mq.matches);
    set(); mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return (
    <section aria-labelledby="ch-out-title" className={SECTION + PAD}>
      {wide && !reduce ? <OutcomesPinned reduce={reduce} /> : (
        <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24">
          <OutcomesHeader reduce={reduce} />
          <ol aria-label="Top reasons for cancelling" className="m-0 flex list-none flex-col gap-4 p-0">
            {OUT_ROWS.map((row, i) => <li key={row[1]}><OutcomeCard row={row} i={i} /></li>)}
          </ol>
        </div>
      )}

      {/* After the reasons: where those customers went, and the Action Items Frank drew from them. Side by side from
          1024px (the chart narrower), stacked below. */}
      <div className="mx-auto mt-[clamp(64px,8vw,112px)] grid max-w-[1312px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-5">
        <ScrubText reduce={reduce}><WhereTheyWent reduce={reduce} /></ScrubText>
        <ScrubText reduce={reduce} lag={0.06}><ActionItems /></ScrubText>
      </div>
    </section>
  );
}

// ——— 5c. More templates (user, 2026-11-23: kicker and title given; "reuse this for templates, get it from main
// landing page"). The home page's use-case wheel (UseCases.jsx) with this page's heading and no subtitle, showing
// the ten templates other than Churn. The page has no chat, so "Start with this template" opens sign-up.

// ——— 5d. FAQ (user's copy, 2026-11-23, words unchanged): the home page's FAQ section (FAQ.jsx: title and how to
// reach the team on the left, the questions as an accordion on the right), as on the Voice and competitor pages.
const CHURN_FAQ = [
  { q: 'Will customers who just cancelled actually talk to us?',
    a: ['More than you’d expect, if you ask at the right moment. Trigger the interview from the cancellation flow, keep it short, and let customers pick voice, video or WhatsApp. Many are glad someone finally asked.'] },
  { q: 'Who should I interview?',
    a: ['Customers who cancelled in the last few weeks. Add customers whose subscription lapsed without renewal, since they often have the clearest picture of a slow decline.'] },
  { q: 'How many interviews do I need?',
    a: ['In most studies, the main reasons start repeating within the first 15 to 20 interviews. Frank shows how many customers raised each theme, so you can see when patterns settle.'] },
  { q: 'How do I launch it?',
    a: ['Start from this template, and the AI Researcher helps you adapt the Research Guide to your product. Then add the interview to your cancellation flow as a floating button, an inline card, or a pop-up from your own button. You can also connect it through the API.'] },
  { q: 'Can I change the questions?',
    a: ['Yes. Every question in the template is editable. Add questions about a recent pricing change, a specific competitor, or a feature you’re unsure about.'] },
  { q: 'Does Frank try to win customers back?',
    a: ['No. The template is built to listen, not to sell. Customers speak more openly when they don’t expect a retention offer at the end.'] },
  { q: 'Does this replace our cancellation survey?',
    a: ['It doesn’t have to. Many teams keep the survey for a quick tally and use Frank to find out what’s behind the top answers.'] },
  { q: 'What languages does Frank support?',
    a: ['Frank interviews in English, Spanish, French, German, Italian, Portuguese, Japanese, Korean and Chinese, and has a Multilanguage mode.'] },
  { q: 'What happens after the interviews?',
    a: ['You get the recordings, transcripts, themes ranked by frequency in the Performance tab, and Action Items linked to the source quotes. Need a different view? Ask Analytics Chat for a chart or table.'] },
];

// ——— 6. Closing.
function Closing({ reduce }) {
  return (
    <section aria-labelledby="ch-cta-title" className="px-4 pb-[clamp(96px,11vw,160px)] pt-[clamp(112px,13vw,200px)] md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-[#d1f899] px-6 py-[clamp(64px,8vw,112px)] text-center md:rounded-[44px]">
        <ScrubText reduce={reduce} className="mx-auto mb-7 w-[72px]"><Glasses pose="Ready" reduced={reduce} /></ScrubText>
        <ScrubTitle reduce={reduce} id="ch-cta-title" className={H2} lines={['Every cancelled customer has a story.', <MarkedPhrase key="m" reduce={reduce} color="#d1b2ff" shade="#decbfd">Hear it.</MarkedPhrase>]} />
        <ScrubText as="p" reduce={reduce} lag={0.15} className={'mx-auto mb-0 mt-6 max-w-[42ch] [text-wrap:balance] ' + SUBTITLE}>
          Your exit survey has the what. Frank gets the why.
        </ScrubText>
        <ScrubText reduce={reduce} lag={0.25} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Btn href={SIGNUP} tone="ink">Make it yours</Btn>
          <Btn href={PREVIEW.href + PREVIEW.hash} tone="white" arrow={false}>Preview the interview</Btn>
        </ScrubText>
      </div>
    </section>
  );
}

export default function ChurnPage() {
  const reduce = !!useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      <div className="fk v9 v19 relative" id="top" style={{ background: '#ffffff' }}>
        <Header fixed mode="auto" mega adaptive current="Solutions"
          hrefs={{ home: '/', pricing: '/pricing', voice: '/ai-voice-interviewer', docs: '/docs', blog: '/blog', cases: '/case-study', comparison: '/comparison', churn: '/use-case/ai-churn-interviews', mcp: '/mcp' }} />
        <main id="main">
          <Hero reduce={reduce} />
          <WhatIs reduce={reduce} />
          <GuideLight reduce={reduce} />
          <Versus reduce={reduce} />
          <Outcomes reduce={reduce} />
          <UseCases exclude={['churn']} href={SIGNUP} sectionClass={SECTION + PAD}
            head={{ eyebrow: 'Build your study on the right foundation', lines: ['Discover more Frank', 'interview templates'], sub: null, titleId: 'ch-tpl-title', titleClass: H2 }} />
          <div className="pt-[clamp(112px,13vw,200px)]">
            <FAQ items={CHURN_FAQ} label="FAQ" lines={['Have questions?', 'We have answers.']} id="ch-faq-title" />
          </div>
          <Closing reduce={reduce} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
