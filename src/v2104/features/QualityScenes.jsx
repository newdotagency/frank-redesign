// QualityScenes (V21.04): the four "What Frank delivers" visuals of the Quality benefit page, redrawn in the V21.04 colours as plain HTML and
// SVG on a 520 × 578 stage scaled to the card. Each is one centred column: related things sit close, groups are set apart by one even gap.
// Frank is the glasses, never the old wordmark.
//   Rigor:    one interview guide branching into the same structured questions, every time.
//   Evidence: "What are the main reasons users churn?" answered with themes and the quote behind each.
//   Depth:    "What do users say about the onboarding?" answered with shares, interview counts and quotes.
//   Analysis: a human interviewer's leading questions against Frank's neutral ones.
import { motion } from 'framer-motion';
import Glasses from '../../v3/Glasses';
import { Avatar, FIG, Stage } from './GlobalScenes';

const EASE = [0.23, 1, 0.32, 1];
const RING = 'ring-1 ring-[#1a1714]/[0.06]';
const SOFT = 'shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)]';
const AMBER = 'bg-[#fbf3db] text-[#8a6100]';
const Mark = ({ className = '' }) => <span className={'block ' + className}><Glasses pose="Thinking" reduced={false} /></span>;

// A block that rises in (in flow, so the column keeps its spacing).
const Rise = ({ on, reduce, at = 0, className = '', style, children }) => (
  <motion.div className={className} style={style} initial={false}
    animate={on || reduce ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 0, transform: 'translateY(14px)' }}
    transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: on && !reduce ? at : 0 }}>{children}</motion.div>
);
const Column = ({ children, className = '' }) => <div className={'absolute inset-x-[44px] inset-y-0 flex flex-col justify-center ' + className}>{children}</div>;

// ——— 1. Rigor: the same structure, every time. Guide → three branches → two questions each.
const Bar = ({ w = '60%', tone = '#d1f899' }) => <span className="block h-1.5 rounded-full" style={{ width: w, background: tone }} />;
export function RigorScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      <Column className="items-center">
        <Rise on={on} reduce={reduce} className={'grid h-[76px] w-[200px] place-items-center rounded-[18px] bg-white ' + SOFT + ' ' + RING}><Mark className="w-[58%]" /></Rise>
        <Rise on={on} reduce={reduce} at={0.12} className="h-[34px] w-px bg-[#1a1714]/25" />
        <Rise on={on} reduce={reduce} at={0.16} className="relative h-px w-[372px] bg-[#1a1714]/25">
          {[0, 50, 100].map(p => <span key={p} className="absolute top-0 h-[26px] w-px bg-[#1a1714]/25" style={{ left: p + '%' }} />)}
        </Rise>
        <div className="mt-[26px] flex w-[432px] justify-between">
          {[0, 1, 2].map(i => (
            <Rise key={i} on={on} reduce={reduce} at={0.24 + i * 0.1} className="flex w-[136px] flex-col items-center">
              <div className={'flex h-[54px] w-full items-center rounded-[13px] bg-white px-4 ' + SOFT + ' ' + RING}><Bar w="70%" tone="#5f8f22" /></div>
              <span className="h-[22px] w-px bg-[#1a1714]/25" />
              <div className="flex w-full flex-col gap-2.5">
                {[0, 1].map(j => <div key={j} className={'flex h-[44px] items-center rounded-[11px] bg-white px-4 ' + RING}><Bar w={j ? '44%' : '62%'} /></div>)}
              </div>
            </Rise>
          ))}
        </div>
      </Column>
    </Stage>
  );
}

// ——— chat pieces for 2 and 3: the question and Frank's answer sit together, the evidence below.
const Ask = ({ children }) => <div className={FIG + ' ml-auto w-fit max-w-[340px] rounded-[16px] rounded-br-[5px] bg-[#fffdf3] px-4 py-3 text-[15px] text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.08)]'}>{children}</div>;
const Reply = ({ children }) => <div className={FIG + ' w-fit max-w-[390px] rounded-[16px] rounded-bl-[5px] bg-white px-4 py-3 text-[15px] leading-snug text-ink ' + SOFT + ' ' + RING}>{children}</div>;

// ——— 2. Evidence.
export function EvidenceScene({ active, reduce }) {
  const on = active;
  const cards = [['Pricing confusion', 'bg-[#f6e3dc] text-[#9a4a32]', '38 interviews', '“I didn’t understand what I was paying for until the bill arrived.”', 'S', 'Sarah M. · Marketing Lead'], ['Onboarding drop-off', 'bg-[#e4f5c8] text-[#3f6b12]', '29 interviews', '“The setup took too long — I gave up after the third step.”', 'J', 'James K. · Product Designer']];
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Ask>What are the main reasons users churn?</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-2"><Reply>Across 113 interviews, 3 themes come up consistently — here’s what customers actually said:</Reply></Rise>
        <div className="mt-5 flex flex-col gap-2.5">
          {cards.map(([t, tone, n, q, c, who], i) => (
            <Rise key={t} on={on} reduce={reduce} at={0.32 + i * 0.14} className={'rounded-[16px] bg-white px-4 py-3.5 ' + SOFT + ' ' + RING}>
              <div className="flex items-center justify-between"><span className={'rounded-full px-3 py-1 font-sans text-[12.5px] ' + tone}>{t}</span><span className="font-sans text-[12px] text-ink-2">{n}</span></div>
              <p className="m-0 mt-2 font-sans text-[13.5px] leading-snug text-ink">{q}</p>
              <div className="mt-2 flex items-center gap-2 font-sans text-[12px] text-ink-2"><Avatar c={c} size={24} />{who}</div>
            </Rise>
          ))}
        </div>
      </Column>
    </Stage>
  );
}

// ——— 3. Depth.
export function DepthScene({ active, reduce }) {
  const on = active;
  const cards = [['70%', '68 interviews', 70, '“Too many steps before I could do anything useful.”', true], ['30%', '29 interviews', 30, '“I didn’t know where to start — no guidance at all.”', false]];
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Ask>What do users say about the onboarding?</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-2"><Reply>Across 97 interviews on onboarding, two answers dominate:</Reply></Rise>
        <div className="mt-5 flex flex-col gap-2.5">
          {cards.map(([pct, n, w, q, top], i) => (
            <Rise key={pct} on={on} reduce={reduce} at={0.32 + i * 0.14} className={'rounded-[16px] bg-white px-4 py-3.5 ' + SOFT + ' ' + RING}>
              <div className="flex items-center gap-2.5"><span className={FIG + ' text-[28px] leading-none ' + (top ? 'text-ink' : 'text-ink-2')}>{pct}</span><span className="font-sans text-[12px] text-ink-2">{n}</span>{top && <span className="ml-auto rounded-full bg-[#d1f899] px-3 py-1 font-sans text-[12px] text-[#2a321e]">most said</span>}</div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#1a1714]/[0.06]"><div className="h-full rounded-full" style={{ width: w + '%', background: top ? '#5f8f22' : '#c9d6b3' }} /></div>
              <p className="m-0 mt-2.5 font-sans text-[13.5px] leading-snug text-ink">{q}</p>
            </Rise>
          ))}
        </div>
        <Rise on={on} reduce={reduce} at={0.6} className="mt-3 font-sans text-[12px] text-ink-2">Based on 97 interviews · Themes cross-validated across sessions</Rise>
      </Column>
    </Stage>
  );
}

// ——— 4. Analysis: leading questions against neutral ones.
export function BiasScene({ active, reduce }) {
  const on = active;
  const human = ['“Do you always use our app while driving?”', '“How much did you love our new feature?”', '“Would you pay $50 for this?”', 'The customer said it was too expensive'];
  const frank = ['“How often do you use our app while driving?”', '“Walk me through your experience using this feature”', '“How much do you currently spend on this issue per month?”', 'The value between the Standard and Pro tiers isn’t clear'];
  const Col = ({ title, pill, items, human: h, at }) => (
    <Rise on={on} reduce={reduce} at={at} className="flex w-[212px] flex-col items-center">
      <div className="grid h-[40px] place-items-center">{title}</div>
      <span className={'mt-2 rounded-full px-3.5 py-1 font-sans text-[12.5px] ' + (h ? AMBER : 'bg-[#d1f899] text-[#2a321e]')}>{pill}</span>
      <div className="mt-4 flex w-full flex-col gap-2">
        {items.map(t => <div key={t} className={'flex h-[72px] items-center justify-center rounded-[14px] px-3 text-center font-sans text-[13.5px] leading-snug text-ink ' + (h ? 'bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(138,97,0,0.18)]' : 'bg-white ' + SOFT + ' ' + RING)}>{t}</div>)}
      </div>
    </Rise>
  );
  return (
    <Stage>
      <Column className="!inset-x-[28px]">
        <div className="flex justify-between">
          <Col title={<span className={FIG + ' text-[24px] text-ink'}>Human</span>} pill="personal bias" items={human} human at={0.05} />
          <Col title={<Mark className="w-[64px]" />} pill="no bias" items={frank} at={0.25} />
        </div>
      </Column>
    </Stage>
  );
}
export const QUALITY_SCENES = [RigorScene, EvidenceScene, DepthScene, BiasScene];
