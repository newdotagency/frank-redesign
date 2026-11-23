// CustomerStory (V21.22) — customer proof, right after How it works. The label and the title, centred
// ("They stopped guessing. Everything changed."); then two stories side by side, after the "Our customers
// say it the best" layout: a wide feature video (10Web) and a tall narrow one (Lumera). Each video card
// carries its company's mark and a round play button (the 10Web one its headline too); under each sits who tells the story, the name handwritten.
// Pressing play swaps the poster for the video with controls. Below 1024px the two stack.
// With a mouse, at 1024px and up, hovering the Lumera card widens it and narrows 10Web: the headline folds
// away on 10Web and opens on Lumera, and the Lumera frame plays as a silent preview; the grid rules are .cs-grid in v19.css.
// 10Web: everything in [brackets] is a slot for the real details (the number, the name, the video).
// Lumera: the video comes from hifrank.ai.
import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const LUMERA_VIDEO = 'https://cdn.prod.website-files.com/69a70197ba94114928669352%2F69f5c0b821f4a6d576ab7bbe_Frank%20AI%20Testimonial%20Lumera%20With%20Subtitles%20%281%29_mp4.mp4';

// src is the video file; poster an optional still. Without a poster, a video shows its frame at `at` seconds.
const TENWEB = {
  brand: '10Web', src: null, poster: null,
  title: 'How 10Web hears from [number] customers a [week/month] without running a single call',
  sub: '[Name, role at 10Web] on what changed when Frank took over their customer interviews.',
  name: 'Artavazd Minasyan', role: 'Co-founder',
};
const LUMERA = {
  brand: 'Lumera', src: LUMERA_VIDEO, poster: null, at: 3,
  title: 'How Lumera stopped building on assumptions',
  sub: 'David, co-founder of Lumera, on letting Frank run customer interviews 24/7, in any language or time zone.',
  name: 'David', role: 'Co-founder',
};

const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

// The company's mark, as a wordmark in a dark see-through pill until the real logo files are added.
const Mark = ({ children }) => (
  <span className="inline-grid h-10 shrink-0 place-items-center rounded-full bg-black/45 px-4 font-sans text-[15px] font-semibold tracking-[-0.02em] text-white ring-1 ring-inset ring-white/15">{children}</span>
);

// One video: the poster (a still, the video's own frame, or a quiet dark placeholder) until play is
// pressed, then the video with controls.
function Video({ v, children, className = '' }) {
  const [on, setOn] = useState(false);
  const still = useRef(null);
  const reduce = !!useReducedMotion();
  // With a mouse, the poster frame plays as a silent preview while the pointer is over the card.
  const preview = play => e => {
    const el = still.current;
    if (!el || reduce || e.pointerType !== 'mouse') return;
    if (play) el.play().catch(() => {}); else el.pause();
  };
  const ready = !!v.src;
  const label = `the ${v.brand} story`;
  return (
    <figure onPointerEnter={preview(true)} onPointerLeave={preview(false)} className={'relative m-0 overflow-hidden rounded-[28px] bg-[#1d1b18] ' + className}>
      {on && ready ? (
        <video src={v.src} poster={v.poster || undefined} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" />
      ) : (
        <>
          {v.poster ? <img src={v.poster} alt="" className="absolute inset-0 size-full object-cover" />
            : ready ? <video ref={still} aria-hidden="true" src={`${v.src}#t=${v.at || 1}`} muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
            : <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,#3a362f_0%,#1d1b18_60%)]" />}
          {/* Darkens the bottom so the white text reads on any frame. */}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          {children}
          <button type="button" onClick={() => ready && setOn(true)} aria-disabled={!ready}
            aria-label={ready ? `Play ${label}` : `${label}: video coming soon`}
            className={'group absolute bottom-5 right-5 grid size-14 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-500 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-7 sm:right-7 sm:size-16 aria-disabled:cursor-default '
              + EASE + (ready ? ' hover:scale-105' : '')}>
            <Play aria-hidden="true" className="ml-0.5 size-6 fill-current sm:size-7" strokeWidth={0} />
          </button>
        </>
      )}
    </figure>
  );
}

// The card's headline and subtitle. On a wide screen with a mouse only the wide card shows them; the
// narrow one folds them away to its mark (.cs-fold in v19.css).
const Copy = ({ s }) => (
  <div className="cs-fold"><div>
    <h3 className="m-0 mt-5 max-w-[24ch] font-sans text-[22px] font-medium leading-[1.2] tracking-[-0.015em] text-white sm:text-[30px]">{s.title}</h3>
    <p className="m-0 mt-3 max-w-[52ch] font-sans text-[15px] leading-[1.45] text-white/70">{s.sub}</p>
  </div></div>
);

// Who tells the story, under the card: the name in a hand (Homemade Apple, as in Testimonials), the role beside it.
const Signature = ({ s }) => (
  <p className="m-0 mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-1">
    <span className="font-['Homemade_Apple',cursive] text-[20px] leading-[1.6] text-ink sm:text-[22px]">{s.name}</span>
    <span className="font-sans text-[15px] text-ink-3">{s.role}</span>
  </p>
);

export default function CustomerStory() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="cs-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[920px] text-center">
          <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">Customer story</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="cs-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['They stopped guessing.', 'Everything changed.']} />
        </div>

        <ScrubText reduce={reduce} lag={0.1} className="cs-grid mt-[clamp(40px,6vw,72px)] grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          {/* The feature: 10Web. */}
          <article className="cs-tenweb min-w-0">
            <Video v={TENWEB} className="aspect-[3/4] sm:aspect-[16/11] lg:aspect-auto lg:h-[600px]">
              <figcaption className="absolute bottom-5 left-5 right-24 sm:bottom-7 sm:left-7 sm:right-32">
                <Mark>{TENWEB.brand}</Mark>
                <Copy s={TENWEB} />
              </figcaption>
            </Video>
            <Signature s={TENWEB} />
          </article>

          {/* The second: Lumera, tall and narrow. */}
          <article className="cs-lumera min-w-0">
            <Video v={LUMERA} className="aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              <figcaption className="absolute bottom-5 left-5 right-24 sm:bottom-7 sm:left-7 sm:right-32">
                <Mark>{LUMERA.brand}</Mark>
                <Copy s={LUMERA} />
              </figcaption>
            </Video>
            <Signature s={LUMERA} />
          </article>
        </ScrubText>
      </div>
    </section>
  );
}
