// Features (V21) — "A full research team, running on agents." Nineteen features, told as the job
// they add up to: four steps in order (design the study, run the interviews, understand the why,
// take it anywhere). Laid out as a list, after the
// "in numbers" pattern: each step's name and count sit on the left (staying in view from
// 1024px); its features run down the right as airy rows — icon, a large title, and what it does in
// its own column — divided by faint hairlines. Everything is visible; nothing hides behind tabs.
// Below 768px a row stacks (icon and title, the one-liner under them).
// The heading is centred. Entrance (reveal.jsx): the heading as in the other sections, then each step rises in with the scroll.
import { useReducedMotion } from 'framer-motion';
import {
  Braces, ChartColumn, Database, Languages, Layers, LayoutTemplate, MessageCircleQuestion, MousePointer2,
  MousePointerClick, Palette, Plug, Quote, Share2, ShieldCheck, TextSearch, UserRound, UsersRound, Video, WandSparkles,
} from 'lucide-react';
import { TITLE, Eyebrow } from './titles';
import { ScrubText, ScrubTitle } from './reveal';

const GROUPS = [
  { label: 'Design the study', items: [
    { icon: WandSparkles, title: 'Study design agent', text: 'Give it a goal. Get a ready study, questions and interview guide.' },
    { icon: LayoutTemplate, title: '12 interview templates', text: 'Proven starting points for churn, discovery, abandoned cart, post-purchase, feature launches and more. More released every week.' },
    { icon: Database, title: 'Personalized by your data', text: 'Pull context from your CRM, analytics, store or email tool so every question fits the person answering.' },
  ] },
  { label: 'Run the interviews', items: [
    { icon: Video, title: 'Voice and video interviews', text: 'Real, moderated conversations, hundreds running at the same time.' },
    { icon: UserRound, title: 'Interviewer avatars', text: 'Choose the face and voice your customers will talk to, from a custom library.' },
    { icon: ShieldCheck, title: 'Dual-agent moderation', text: 'One agent asks the questions. A second watches every exchange and keeps it sharp.' },
    { icon: MessageCircleQuestion, title: 'Adaptive probing', text: 'Every answer gets a follow-up, until Frank reaches the why a form never will.' },
    { icon: Languages, title: '30+ languages', text: 'Customers speak their language. You read the results in yours.' },
    { icon: MousePointerClick, title: 'Flexible triggers', text: 'Share a link, or embed inline, as a pop-up or as a floating bubble.' },
    { icon: Palette, title: 'Your brand, not ours', text: 'Style the widget so it looks like it was always part of your site.' },
    { icon: UsersRound, title: 'Managed panel', text: 'No customers yet? Interview your target market from our panel.' },
  ] },
  { label: 'Understand the why', items: [
    { icon: ChartColumn, title: 'Open answers, hard numbers', text: 'People talk freely. You still get data you can chart and compare.' },
    { icon: Layers, title: 'Automatic theme analysis', text: 'Themes, patterns and sentiment, clustered across every response.' },
    { icon: Quote, title: 'Quote-level traceability', text: 'Every theme links to the exact words behind it. No black box.' },
    { icon: MousePointer2, title: 'Click-through insights', text: 'Go from a headline theme to the moment a customer said it, in one click.' },
    { icon: TextSearch, title: 'Ask across studies', text: 'Question every study you’ve ever run in plain language, with quality-scored answers.' },
  ] },
  { label: 'Take it anywhere', items: [
    { icon: Share2, title: 'Interview sharing', text: 'Send a private link to one moment or a whole analysis.' },
    { icon: Braces, title: 'Export and API', text: 'CSV, transcripts and reports, plus a full REST API.' },
    { icon: Plug, title: 'Works with any AI, via MCP', text: 'Run studies from Claude, ChatGPT, Cursor, Dot, Instinct or any MCP client, in plain words.' },
  ] },
];

// One feature row: icon tile, title, one-liner. Hovering turns the tile lime.
function Feature({ f }) {
  return (
    <li className="group grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 py-5 sm:py-6 md:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-[12px] bg-[#f4f2ec] text-ink-2 transition-colors duration-200 ease-out group-hover:bg-[#d1f899] group-hover:text-ink">
        <f.icon className="size-[18px]" strokeWidth={1.6} />
      </span>
      <h4 className="hiw-step-title m-0 text-[19px] leading-tight text-ink sm:text-[22px]">{f.title}</h4>
      <p className="col-start-2 m-0 max-w-[44ch] font-sans text-[15px] leading-[1.5] text-ink-2 md:col-start-3 md:row-start-1">{f.text}</p>
    </li>
  );
}

export default function Features() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="ft-title" className="relative px-4 pb-[clamp(128px,15vw,232px)] sm:px-[clamp(16px,4vw,48px)]">
      <div className="mx-auto max-w-[1312px]">
        {/* Centred, like the agentic workflow section above. */}
        <div className="mx-auto max-w-[860px] text-center">
          <ScrubText reduce={reduce}><Eyebrow line={false} className="mb-6 sm:mb-8">Features</Eyebrow></ScrubText>
          <ScrubTitle reduce={reduce} id="ft-title" className={'m-0 leading-[1.04] text-ink [text-wrap:balance] ' + TITLE}
            lines={['A full research team,', 'running on agents.']} />
          <ScrubText as="p" reduce={reduce} lag={0.15} className="mx-auto mb-0 mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-ink-2 [text-wrap:balance] sm:mt-6 sm:text-[18px]">
            Every job a researcher would do, from writing the guide to presenting the findings, handled end to end. Steer it from Frank or straight from your AI agent.
          </ScrubText>
        </div>

        <div className="mt-[clamp(40px,6vw,80px)] space-y-[clamp(48px,6vw,88px)]">
          {GROUPS.map(g => (
            <ScrubText key={g.label} reduce={reduce} as="div" className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
              {/* The step, beside its list. */}
              <div className="lg:sticky lg:top-28 lg:self-start lg:pt-6">
                <h3 className="hiw-step-title m-0 text-[26px] leading-tight text-ink sm:text-[30px]">{g.label}</h3>
                <p className="m-0 mt-2 font-sans text-[14px] text-ink-3">{g.items.length} features</p>
              </div>
              <ul className="m-0 list-none divide-x-0 divide-y divide-solid divide-[#1a1714]/[0.08] p-0">
                {g.items.map(f => <Feature key={f.title} f={f} />)}
              </ul>
            </ScrubText>
          ))}
        </div>
      </div>
    </section>
  );
}
