// Testimonials (V21.22) — "Founders who stopped guessing", just before the FAQ. Four quotes, each
// picked to answer one doubt (will customers talk to an AI, are the follow-ups any good, how soon is it
// useful, does it work for online stores). A quote leads with its result (in ink), the rest follows in
// grey.
// The heading is left-aligned. One quote at a time, set like an editorial slider, straight on the page (no card): the founder's image
// (a grey placeholder for now) top left and the slide dots bottom left; on
// the right the doubt it answers, the quote large in serif, and under it a handwritten signature beside
// the role, with a "Read the case study" link under each quote. The link carries the hero's lime highlighter. Slides crossfade and move on every
// 8 s; hovering or focusing the band pauses that, and reduced motion turns it off. Every slide shares
// one grid cell, so the band keeps the height of the longest one. Below 1024px it stacks: portrait,
// quote, signature, then the dots.
// The founder image is a grey 4:5 rectangle with an image icon in the middle, a placeholder until the real
// founders' photos come in (add `photo` to a quote and it shows in black and white instead).
// The quotes and names are SAMPLE copy written to the brief (the names are made up), until real ones are collected.
// Swap them in QUOTES.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import HighlightMarker from '../components/HighlightMarker';
import { useReducedMotion } from 'framer-motion';
import { TITLE, Eyebrow, SUBTITLE } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';
const EVERY_MS = 8000;

// lead: the result, said first. rest: the rest of the quote. Each stays under 30 words.
const QUOTES = [
  { id: 'reaction', doubt: 'Will customers talk to an AI?',
    lead: 'Customers talked for 14 minutes on average, twice as long as on our sales calls.',
    rest: 'A few wrote back to thank us for asking.',
    name: 'Maya Lindqvist', role: 'Founder, B2B SaaS' },
  { id: 'quality', doubt: 'Are the follow-ups any good?',
    lead: 'Frank caught the pricing complaint I’d missed in twenty calls.',
    rest: 'It asks the second “why” I always forget to ask.',
    name: 'Daniel Okafor', role: 'Head of Product, analytics tool' },
  { id: 'speed', doubt: 'How soon is it useful?',
    lead: 'By day two we knew onboarding, not price, was losing our trials.',
    rest: 'We rebuilt the first screen that same week.',
    name: 'Priya Raman', role: 'Co-founder, scheduling app' },
  { id: 'store', doubt: 'Does it work for online stores?',
    lead: 'Abandoned carts dropped 18% once Frank showed us shipping costs were the surprise.',
    rest: 'We moved them onto the product page.',
    name: 'Tomás Ferreira', role: 'Shopify store owner, home goods' },
];

// The founder's image: a grey 4:5 rectangle with an image icon, until a real photo is passed (then the
// photo, in black and white). V21.04: larger, 280 / 320 / 360 / 400px wide (phone / tablet / 1024px / 1280px and up).
function Portrait({ q }) {
  return (
    <div className="relative grid aspect-[4/5] w-[280px] place-items-center overflow-hidden rounded-[24px] bg-[#e6e5e1] sm:w-80 lg:w-[360px] xl:w-[400px]">
      {q.photo
        ? <img src={q.photo} alt="" className="absolute inset-0 size-full object-cover grayscale" />
        : <ImageIcon role="img" aria-label="Image placeholder" className="size-10 text-[#1a1714]/30" strokeWidth={1.25} />}
    </div>
  );
}

// The quote's signature line: the name in a hand (Homemade Apple), the role beside it.
const Signature = ({ q }) => (
  <p className="m-0 flex flex-wrap items-baseline gap-x-5 gap-y-1">
    <span className="font-['Homemade_Apple',cursive] text-[22px] leading-[1.6] text-ink sm:text-[26px]">{q.name}</span>
    <span className="font-sans text-[15px] text-ink-3">{q.role}</span>
  </p>
);

function Slide({ q, on, reduce }) {
  const fade = 'transition-[opacity,transform] duration-700 ' + EASE + ' '
    + (on ? 'opacity-100 [transform:none]' : 'pointer-events-none opacity-0 ' + (reduce ? '' : '[transform:translateY(10px)]'));
  return (
    <>
      {/* Left: the portrait (the dots sit under it, outside the slides). */}
      <div aria-hidden={!on} className={fade + ' [grid-area:1/1]'}>
        <Portrait q={q} />
      </div>
      {/* Right: the doubt, the quote, the signature. From 1024px it shares the portrait's row (V21.04), so the
          signature sits on the image's bottom line. */}
      <figure aria-hidden={!on} className={fade + ' m-0 flex flex-col [grid-area:2/1] lg:[grid-area:1/2]'}>
        <p className="m-0 font-sans text-[14px] text-ink-3">{q.doubt}</p>
        <blockquote className="m-0 mt-4 font-serif text-[26px] leading-[1.3] tracking-[-0.015em] sm:text-[34px] lg:text-[40px] lg:leading-[1.25]">
          <span className="text-ink">“{q.lead}</span>{' '}
          <span className="text-ink-3">{q.rest}”</span>
        </blockquote>
        {/* Each quote links to its full story; `caseStudy` is the address (a placeholder until the pages exist). */}
        <a href={q.caseStudy || '#'} tabIndex={on ? 0 : -1}
          className="group mt-6 inline-flex items-center gap-2.5 self-start font-sans text-[18px] font-normal sm:text-[19px] text-ink no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1714]">
          {/* The hero's lime highlighter ("anything." on the first screen), drawn each time the slide comes in. */}
          {on ? <HighlightMarker reduced={reduce} delay={0.35}>Read the case study</HighlightMarker> : <span>Read the case study</span>}
          <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
        </a>
        <figcaption className="mt-auto pt-10"><Signature q={q} /></figcaption>
      </figure>
    </>
  );
}

export default function Testimonials() {
  const reduce = !!useReducedMotion();
  const [at, setAt] = useState(0);
  const [hold, setHold] = useState(false);
  // The next slide comes in after EVERY_MS, and the active dot fills over that time to show how soon.
  // Hovering or focusing the band pauses both (the timer keeps what's left, the fill stops where it is);
  // with reduced motion there's no fill and no moving on.
  const left = useRef(EVERY_MS);
  useEffect(() => { left.current = EVERY_MS; }, [at]);
  useEffect(() => {
    if (reduce || hold) return;
    const t0 = Date.now();
    const t = setTimeout(() => setAt(i => (i + 1) % QUOTES.length), left.current);
    return () => { clearTimeout(t); left.current = Math.max(0, left.current - (Date.now() - t0)); };
  }, [at, hold, reduce]);

  return (
    <section aria-labelledby="ts-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="max-w-[860px] text-left">
          <ScrubText reduce={reduce}><Eyebrow line={false} align="start" className="mb-6 sm:mb-8">Testimonials / draft</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ts-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Founders who', 'stopped guessing']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className={'mb-0 max-w-[56ch] [text-wrap:balance] mt-6 ' + SUBTITLE}>
            And what their customers said about talking to an AI.
          </ScrubText>
        </div>

        <ScrubText reduce={reduce} as="div" lag={0.1} className="mt-[clamp(40px,6vw,72px)]">
          <div role="group" aria-roledescription="carousel" aria-label="Testimonials"
            onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
            onFocus={() => setHold(true)} onBlur={() => setHold(false)}
            className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto]">
            {QUOTES.map((q, i) => <Slide key={q.id} q={q} on={i === at} reduce={reduce} />)}

            {/* The dots: the active one stretches into a short bar that fills toward the next slide. */}
            <div className="flex items-center gap-1 [grid-area:3/1] lg:self-end lg:[grid-area:2/1]">
              {QUOTES.map((q, i) => (
                <button key={q.id} type="button" aria-label={`Testimonial ${i + 1} of ${QUOTES.length}`} aria-current={i === at}
                  onClick={() => setAt(i)}
                  className="grid h-6 cursor-pointer place-items-center border-0 bg-transparent px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1714]">
                  <span className={'relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-500 ' + EASE + ' '
                    + (i === at ? 'w-8 bg-[#1a1714]/15' : 'w-1.5 bg-[#1a1714]/25')}>
                    {i === at && (
                      <span key={at}
                        className={'absolute inset-0 origin-left rounded-full bg-[#1a1714] ' + (reduce ? '' : 'ts-fill')}
                        style={{ animationDuration: `${EVERY_MS}ms`, animationPlayState: hold ? 'paused' : 'running' }} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrubText>
      </div>
    </section>
  );
}
