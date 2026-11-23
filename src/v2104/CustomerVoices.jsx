// CustomerVoices (V21.04) — "Your customers love talking to Frank", right after the two objection sections:
// the label and the title, centred, then one wide 16:9 video of customer testimonials. Until the file is
// ready the slot is a quiet dark poster with a round play button that waits (the same treatment as the
// Customer story videos); set VIDEO.src (and optionally VIDEO.poster) to make it play with controls.
// Entrance (reveal.jsx): label, title line by line, then the video rises in with the scroll.
import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const VIDEO = { src: null, poster: null };

export default function CustomerVoices() {
  const reduce = !!useReducedMotion();
  const [on, setOn] = useState(false);
  const ready = !!VIDEO.src;
  return (
    <section aria-labelledby="cv-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        <div className="mx-auto max-w-[920px] text-center">
          <ScrubText reduce={reduce}><Eyebrow className="mb-6 sm:mb-8">What customers are saying</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="cv-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['Your customers love', 'talking to Frank']} />
        </div>

        <ScrubText reduce={reduce} lag={0.1} className="mt-[clamp(40px,6vw,72px)]">
          <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-[28px] bg-[#1d1b18] lg:rounded-[32px]">
            {on && ready ? (
              <video src={VIDEO.src} poster={VIDEO.poster || undefined} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" />
            ) : (
              <>
                {VIDEO.poster
                  ? <img src={VIDEO.poster} alt="" className="absolute inset-0 size-full object-cover" />
                  : <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,#3a362f_0%,#1d1b18_60%)]" />}
                <button type="button" onClick={() => ready && setOn(true)} aria-disabled={!ready}
                  aria-label={ready ? 'Play the customer testimonials' : 'Customer testimonials: video coming soon'}
                  className={'absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-20 aria-disabled:cursor-default'
                    + (ready ? ' hover:scale-105' : '')}>
                  <Play aria-hidden="true" className="ml-1 size-7 fill-current sm:size-8" strokeWidth={0} />
                </button>
              </>
            )}
          </figure>
        </ScrubText>
      </div>
    </section>
  );
}
