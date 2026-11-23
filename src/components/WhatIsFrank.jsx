// WhatIsFrank — the section after the hero: who Frank is, then the product video.
// Title on the left (Lora, with Frank's glasses inline after his name), the two-clock promise on
// the right, sitting on the title's last line; the video spans the column below and grows a touch
// as it scrolls in (the hero shrinks into a card, this opens back out).
// Until there's a video (`src`), the frame shows a poster: Frank's glasses on violet and a play
// affordance (V19: a plain grey "Video" placeholder instead). With `src`, the play button swaps the
// poster for the video with sound and controls.
// titleStyle="v19": the new-section title style — an eyebrow (hairline + spaced caps) above, and
// the title in one face (Figtree, from v19.css). Default: the plain Lora title (V18).
// description (optional, V19): the promise moves under the title; what Frank is and who he's for
// sit beside them from 1024px, ending on the promise's last line; narrower, one column. A phrase in
// [[double brackets]] gets a light violet marker highlight.
// entrance (V19): eyebrow, title, promise, paragraphs, then the video rise in as the section
// scrolls into view (reveal.js; the video only fades, its scroll growth does the rest).
// Reduced motion: no scroll growth.
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Glasses from '../v3/Glasses';
import { TITLE, Eyebrow } from '../v19/titles';
import { enter, reveal, useEntrance } from '../v19/reveal';

// "text [[marked]] text" → the marked phrase on a light violet highlight (it follows the words if they wrap).
const marked = text => text.split(/(\[\[.*?\]\])/).filter(Boolean).map((part, i) => (
  part.startsWith('[[')
    ? <mark key={i} className="rounded-[3px] bg-[#ebdcff] px-[2px] text-ink [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">{part.slice(2, -2)}</mark>
    : part
));

const PlayDot = () => (
  <span className="wf-dot grid size-11 shrink-0 place-items-center rounded-full bg-[#d1f899] sm:size-12" aria-hidden="true">
    <svg viewBox="0 0 16 16" className="ml-0.5 size-4"><path d="M4 2.6v10.8L13 8z" fill="#1a1714" /></svg>
  </span>
);

export default function WhatIsFrank({ src, poster, titleStyle = 'serif', eyebrow, description, entrance = false }) {
  const v19 = titleStyle === 'v19';
  const reduce = !!useReducedMotion();
  const frame = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'start 0.3'] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1]);
  // The opening group waits its turn behind the logos when both arrive together (reveal.js).
  const head = useRef(null);
  const go = useEntrance(head, { span: entrance ? 0.7 : 0 });
  const rv = (delay, opts) => (entrance ? enter(reduce, go, delay, opts) : {});

  return (
    <section aria-labelledby="wf-title" className="relative px-4 pb-[clamp(88px,11vw,160px)] pt-[clamp(72px,9vw,128px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div ref={head}>
        {eyebrow && <motion.div {...rv(0)}><Eyebrow align="start" className="mb-6 sm:mb-8">{eyebrow}</Eyebrow></motion.div>}
        {/* With a description (V19): the title with the promise under it, and beside them from 1024px
            the paragraphs, ending on the promise's last line. Narrower, all one column.
            Without (V18): the promise sits on the title's last line. */}
        <div className={description
          ? 'grid items-end gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-20'
          : 'grid items-end gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-16'}>
          <div>
            <motion.h2 {...rv(0.08)} id="wf-title" className={'m-0 text-[clamp(34px,4.6vw,62px)] text-ink ' + (v19
              ? TITLE + ' leading-[1.04]'
              : 'font-serif font-normal leading-[1.06] tracking-[-0.02em] max-w-[17ch] text-balance')}>
              Meet Frank{' '}
              {/* nowrap keeps the glasses and the comma together; the margins cancel the empty space in the glasses drawing */}
              <span className="whitespace-nowrap"><span className="-ml-[0.06em] -mr-[0.26em] inline-block w-[1.55em] align-[-0.1em]" aria-hidden="true">
                <Glasses pose="Ready" reduced={reduce} />
              </span>,</span>
              {/* V19 sets the three lines itself: "Meet Frank," / "the always-on agentic" / "customer interviewer" */}
              {v19 ? <><br />the always-on agentic<br />customer interviewer</> : ' the always-on agentic customer interviewer'}
            </motion.h2>
            {description && (
              <motion.p {...rv(0.16)} className="m-0 mt-6 text-[18px] leading-[1.45] text-ink-2 sm:text-[20px]">
                Set up an interview in seconds.<br />
                Get actionable insights for weeks.
              </motion.p>
            )}
          </div>
          {description ? (
            <motion.div {...rv(0.24)} className="max-w-[56ch]">
              {description.map((t, i) => (
                <p key={t} className={'m-0 text-[16px] leading-[1.6] text-ink-2 sm:text-[17px] ' + (i ? 'mt-4' : '')}>{marked(t)}</p>
              ))}
            </motion.div>
          ) : (
            <p className="m-0 max-w-[32ch] pb-[0.35em] text-[17px] leading-[1.5] text-ink-2 sm:text-[20px]">
              Set up an interview in seconds.<br />
              Get actionable insights for weeks.
            </p>
          )}
        </div>

        </div>

        <motion.div ref={frame} style={{ scale }} {...(entrance ? reveal(reduce, 0.1, { fadeOnly: true, amount: 0.15 }) : {})}
          className="relative mt-[clamp(36px,5vw,64px)] aspect-[4/5] origin-top overflow-hidden rounded-[22px] bg-[#ece1fd] ring-1 ring-inset ring-[#1a1714]/[0.06] sm:aspect-[16/9] sm:rounded-[28px]">
          {playing && src ? (
            <video src={src} poster={poster} controls autoPlay playsInline className="absolute inset-0 h-full w-full bg-[#1a1714] object-contain" />
          ) : v19 && !src ? (
            // V19: no designed poster until the real video exists, just a plain placeholder.
            <div className="absolute inset-0 grid place-items-center bg-[#f1efea] font-sans text-[14px] text-ink-3">
              Video
            </div>
          ) : (
            <>
              {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />}
              {!poster && (
                <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
                  <div className="-mt-[8%] w-[min(42%,300px)] sm:w-[min(26%,320px)]">
                    <Glasses pose="Attentive" reduced={reduce} />
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-[clamp(20px,6%,56px)] flex justify-center px-4">
                {src ? (
                  <button type="button" onClick={() => setPlaying(true)}
                    className="wf-play group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 font-sans text-[15px] font-medium text-ink transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1714] sm:text-[16px]">
                    <PlayDot />
                    Watch Frank run an interview
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 font-sans text-[15px] font-medium text-ink sm:text-[16px]">
                    <PlayDot />
                    Watch Frank run an interview
                    <span className="sr-only">(video coming soon)</span>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
