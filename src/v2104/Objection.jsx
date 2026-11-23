// Objection (V21.04) — a section that answers one doubt, used twice right after Testimonials ("Will
// customers actually talk to an AI interviewer?", "Would you trust AI to talk to your customers?").
// An editorial split: the kicker as the page's label pill, the title, then the answer in short paragraphs;
// beside it an empty grey box where the visual will go. `flip` puts the box on the left, so the two
// sections alternate. Below 1024px they stack: text, then the box.
// Entrance (reveal.jsx): label, title line by line, paragraphs, then the box rises in with the scroll.
import { useReducedMotion } from 'framer-motion';
import { TITLE, Eyebrow } from './titles';
import { END_OFFSET, ScrubText, ScrubTitle } from './reveal';

export const OBJECTIONS = [
  {
    id: 'ob-talk', kicker: 'Users are more Frank with Frank',
    title: ['Will customers talk', 'to AI interviewers?'],
    text: [
      'Of course! People are more relaxed with Frank. When there isn’t another human there to judge them, customers open up, and share honest unfiltered feedback.',
      'Your customers want to be heard. And talking with Frank gives them that opportunity.',
    ],
  },
  {
    id: 'ob-trust', kicker: 'Scientifically moderated interviews', flip: true,
    title: ['Does AI know what', 'to ask my customers?'],
    text: [
      'Frank isn’t another robocaller or automated support bot. He’s designed to have thoughtful, goal-driven conversations that make customers feel heard, not interrogated.',
      'Frank uses tested scientific probing interview methodologies. It knows how to detect signals, recognize which ones are significant, and probe further to get deeper, richer insights.',
    ],
  },
];

export default function Objection({ o }) {
  const reduce = !!useReducedMotion();
  const titleId = o.id + '-title';
  return (
    <section aria-labelledby={titleId} className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto grid max-w-[1312px] items-center gap-x-16 gap-y-10 lg:grid-cols-2">
        <div className={o.flip ? 'lg:order-2' : ''}>
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">{o.kicker}</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id={titleId} className={'m-0 leading-[1.06] text-ink [text-wrap:balance] ' + TITLE} lines={o.title} />
          <ScrubText reduce={reduce} lag={0.15} offset={END_OFFSET} className="mt-6 max-w-[52ch] space-y-4 font-sans text-[17px] leading-[1.6] text-ink-2 sm:mt-8 sm:text-[18px]">
            {o.text.map(p => <p key={p.slice(0, 24)} className="m-0">{p}</p>)}
          </ScrubText>
        </div>
        {/* The visual: an empty grey box until the imagery is ready. */}
        <ScrubText reduce={reduce} lag={0.1} className={o.flip ? 'lg:order-1' : ''}>
          <div aria-hidden="true" className="aspect-[4/3] w-full rounded-[28px] bg-[#efeeea] lg:rounded-[32px]" />
        </ScrubText>
      </div>
    </section>
  );
}
