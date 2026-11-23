// FAQ (V21) — after TheLevel's FAQ section (title left, questions right).
// Left, staying in view from 1024px: the label, the title and how to reach the team
// ("Email us anytime at support@hifrank.ai").
// Right: the ten questions as an accordion — hairline rows, a plus that turns to a cross when open,
// the answer opening smoothly under its question. Several can be open at once.
// Accessibility: each question is a button with aria-expanded, controlling its answer region.
// Entrance (reveal.jsx): the heading and the list rise in with the scroll.
import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const FAQS = [
  { q: 'What is Frank?',
    a: ['Frank is an agentic AI customer interviewer for SaaS and e-commerce teams. It designs an interview study from a single goal, runs voice and video interviews with your customers on your website or by link, asks follow-up questions in real time, and turns the results into themes, quotes and action items.',
      'Founders use it for churn, discovery, onboarding, pricing, feature feedback, abandoned-cart and post-purchase research without scheduling calls.'] },
  { q: 'Will my customers think less of me for sending an AI interviewer?',
    a: ['Most customers read it the opposite way: a company that asks for their opinion and actually follows up is a company that listens. Frank always introduces himself as an AI, interviews are short and optional, and the widget carries your branding and tone.',
      'Many people share more openly with Frank than on a call, because there’s no scheduling, no awkward silence and no one to impress. Try a live interview yourself and judge the experience as your customer would.'] },
  { q: 'Can AI really ask good follow-up questions and understand nuance?',
    a: ['Yes. Frank listens for what a customer means, not just the words they use. If someone sarcastically says “Sure, setup was super easy,” Frank picks up the tone and asks what got in the way.',
      'Every answer gets a follow-up chosen on the fly, and a second AI agent supervises each conversation to keep questions relevant and on goal.'] },
  { q: 'How is Frank different from a survey or feedback form?',
    a: ['A survey collects answers; Frank finds the reason behind them. Forms stop at “I cancelled because of price,” while Frank asks what price would have worked, compared to what, and what almost made them stay.',
      'You still get structured, quantified data, because Frank converts open conversations into numbers you can chart.'] },
  { q: 'Does Frank replace talking to customers myself?',
    a: ['No. Frank gives you an always-on baseline, so you know what hundreds of customers think before you get on a call. Use it to spot patterns, then spend your own time on the conversations that matter most.',
      'Every insight links to the full transcript and the exact quote, so you can always check the source.'] },
  { q: 'How long does setup take? Do I need a developer?',
    a: ['Most teams go live in minutes, with no developer. Describe what you want to learn, review the study Frank drafts, then share a link or paste one embed snippet into your site, including Shopify storefronts.',
      'The interview can appear inline, as a pop-up or as a floating bubble, styled to your brand.'] },
  { q: 'Can I run Frank from Claude, ChatGPT, Cursor or my favorite agent?',
    a: ['Yes. Frank connects to any AI assistant that supports MCP (Model Context Protocol), including Claude, ChatGPT, Cursor, Dot and Instinct.',
      'You can say “Set up a churn interview for users who cancelled this month” to your assistant, and Frank builds the study, launches it and reports the findings back there.'] },
  { q: 'How do I know the insights are accurate?',
    a: ['Every theme Frank reports traces back to the verbatim quotes and the specific interviews behind it. You can click from a top-line finding to the exact moment a customer said it, read full transcripts, and see quality scores on answers. Nothing is a black box.'] },
  { q: 'Is my customer data secure?',
    a: ['Frank is SOC 2 compliant and GDPR-compliant. You control who can see each study and share only private links.'] },
  { q: 'Who is Frank for, and what if I don’t have customers yet?',
    a: ['Frank is built for AI-native SaaS founders and Shopify store owners who need customer insight without a research team. It ships with 11 templates for situations like churn, discovery, abandoned cart, post-purchase and feature releases, and interviews in 30+ languages with transcripts translated into yours.',
      'No customers yet? Recruit interviewees from Frank’s managed panel to test an idea with your target market.'] },
];

const EASE = [0.23, 1, 0.32, 1];

function Item({ f, open, onToggle, reduce }) {
  const id = useId();
  return (
    <li className="border-0 border-b border-solid border-[#1a1714]/[0.1]">
      <h3 className="m-0">
        <button type="button" id={id + 'q'} aria-expanded={open} aria-controls={id + 'a'} onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-6 text-left font-sans text-[18px] leading-snug text-ink transition-colors duration-150 ease-out hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:py-7 sm:text-[20px]">
          {f.q}
          <span aria-hidden="true" className={'grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,transform] duration-200 ease-out '
            + (open ? 'rotate-45 bg-[#d1f899] text-ink' : 'bg-[#f4f2ec] text-ink-2 group-hover:bg-[#ebe8df]')}>
            <Plus className="size-[18px]" strokeWidth={1.75} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id + 'a'} role="region" aria-labelledby={id + 'q'} className="overflow-hidden"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.32, ease: EASE }}>
            <div className="max-w-[64ch] pb-7 pr-12 font-sans text-[16px] leading-[1.6] text-ink-2 sm:text-[17px]">
              {f.a.map((p, i) => <p key={i} className={'m-0 ' + (i ? 'mt-3' : '')}>{p}</p>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function FAQ() {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(() => new Set());
  const toggle = i => setOpen(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  return (
    <section aria-labelledby="faq-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto grid max-w-[1312px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrubText reduce={reduce}><Eyebrow align="start" className="mb-6 sm:mb-8">FAQ</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="faq-title" className={'m-0 leading-[1.04] text-ink ' + TITLE}
            lines={['Frequently asked', 'questions']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className="m-0 mt-6 font-sans text-[17px] leading-[1.5] text-ink-2 sm:mt-8 sm:text-[18px]">
            Email us anytime at{' '}
            <a href="mailto:support@hifrank.ai" className="text-ink underline decoration-[#1a1714]/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink">support@hifrank.ai</a>
          </ScrubText>
        </div>

        <ScrubText reduce={reduce} lag={0.1}>
          <ul className="m-0 list-none border-0 border-t border-solid border-[#1a1714]/[0.1] p-0">
            {FAQS.map((f, i) => <Item key={f.q} f={f} open={open.has(i)} onToggle={() => toggle(i)} reduce={reduce} />)}
          </ul>
        </ScrubText>
      </div>
    </section>
  );
}
