// AlwaysOnScenes (V21.04): the three "How it works" visuals of the Always on availability page, redrawn from the live page's pictures in the
// V21.04 colours as plain HTML and SVG. Each is a StepVisual `scene` ({ active, reduce }) on the card's lime:
//   Triggers: interviews start on their own: signed up, purchased, at risk of churn (all live), and "Invite manually" (ready).
//   Anytime:  conversations at any hour: pick a time or join now, over a list of interviews (scheduled, joined instantly with its transcript).
//   Insights: "New insights are captured automatically", each interview with its theme and time.
// Drawn on a 520 × 578 stage scaled to the card's width. They play when their step becomes active; reduced motion shows them finished.
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronRight, ChevronUp, ExternalLink, Mail, ShoppingCart, TriangleAlert, UserPen } from 'lucide-react';
import { Avatar, Bars, CARD, FIG, Float, Stage } from './GlobalScenes';

const GREEN = 'bg-[#f1f9e3] text-[#3f6b12]';
const WARM = 'bg-[#fbf3db] text-[#8a6100]';
const VIOLET = 'bg-[#ece1fd] text-[#5b3fa0]';
const Tag = ({ tone = GREEN, children, className = '' }) => (
  <span className={'inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-[13.5px] ' + tone + ' ' + className}>{children}</span>
);
const Dot = ({ color = '#5f8f22' }) => <span aria-hidden="true" className="size-2 rounded-full" style={{ background: color }} />;

// ——— 1. Interviews trigger automatically.
export function TriggersScene({ active, reduce }) {
  const on = active;
  const rows = [[UserPen, 'Signed up', 'New users after account creation'], [ShoppingCart, 'Purchased', 'Activated after first purchase'], [TriangleAlert, 'At risk of churn', 'Flagged by usage drop']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[36px] top-[56px] h-[470px] w-[448px]">
        <div className={CARD + ' size-full !rounded-[26px] overflow-hidden'} />
      </Float>
      <Float on={on} reduce={reduce} at={0.12} className="left-[60px] top-[78px]">
        <span className={'inline-flex rounded-[10px] px-4 py-1.5 font-sans text-[15px] ' + 'bg-[#1a1714]/[0.06] text-ink-2'}>Auto triggers</span>
      </Float>
      {rows.map(([Icon, t, d], i) => (
        <Float key={t} on={on} reduce={reduce} at={0.28 + i * 0.14} className="left-[56px] w-[408px]" style={{ top: 126 + i * 96 }}>
          <div className="flex items-center gap-4 rounded-[16px] bg-white px-4 py-4 shadow-[0_10px_22px_-14px_rgba(26,23,20,0.32)] ring-1 ring-[#1a1714]/[0.06]">
            <span aria-hidden="true" className="grid size-[54px] shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.6} /></span>
            <span className="flex flex-1 flex-col leading-snug">
              <span className={FIG + ' text-[18px] font-medium tracking-[-0.01em] text-ink'}>{t}</span>
              <span className="mt-0.5 font-sans text-[13px] text-ink-2">{d}</span>
            </span>
            <Tag className="gap-2"><Dot />Live</Tag>
            <ChevronRight className="size-5 shrink-0 text-ink" strokeWidth={1.8} />
          </div>
        </Float>
      ))}
      <Float on={on} reduce={reduce} at={0.75} className="left-[36px] w-[448px]" style={{ top: 424 }}>
        <div className="rounded-b-[26px] bg-[#fffdf3] px-5 py-[18px] shadow-[inset_0_1px_0_rgba(26,23,20,0.07)]">
          <div className="flex items-center gap-4 rounded-[16px] bg-white px-4 py-3.5 shadow-[0_8px_18px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]">
            <span aria-hidden="true" className="grid size-[50px] shrink-0 place-items-center rounded-full bg-[#fbf3db] text-[#8a6100]"><Mail className="size-6" strokeWidth={1.6} /></span>
            <span className="flex flex-1 flex-col leading-snug">
              <span className={FIG + ' text-[18px] font-medium tracking-[-0.01em] text-ink'}>Invite manually</span>
              <span className="mt-0.5 font-sans text-[13px] text-ink-2">Send an invite anytime</span>
            </span>
            <Tag tone={WARM} className="gap-2"><Dot color="#8a6100" />Ready</Tag>
            <ChevronRight className="size-5 shrink-0 text-ink" strokeWidth={1.8} />
          </div>
        </div>
      </Float>
    </Stage>
  );
}

// ——— 2. Conversations run 24/7: pick a time, or join now.
function Hi({ tone, children }) {
  return <span className={'rounded-[6px] px-1.5 py-[1px] ' + tone}>{children}</span>;
}
export function AnytimeScene({ active, reduce }) {
  const on = active;
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const nums = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28]];
  return (
    <Stage>
      {/* The scheduling page, soft behind. */}
      <Float on={on} reduce={reduce} at={0} className="left-[18px] top-[70px] w-[330px]">
        <div className="opacity-[0.78] blur-[2.5px]">
          <p className={FIG + ' m-0 text-[21px] font-medium tracking-[-0.02em] text-ink'}>Pick a time that works for you</p>
          <p className="m-0 mt-1 font-sans text-[16px] text-ink-3">Your time, your context.</p>
          <div className={CARD + ' mt-5 px-5 py-4'}>
            <div className="flex items-center justify-between font-sans text-[15px] text-ink"><ChevronRight className="size-4 rotate-180" /><span>November 2026</span><span className="w-4" /></div>
            <div className="mt-4 grid grid-cols-7 gap-y-3.5 text-center font-sans text-[14px] text-ink-3">
              {days.map(d => <span key={d}>{d}</span>)}
              {nums.flat().map(n => <span key={n} className={n === 15 ? 'rounded-[9px] bg-[#d1f899] py-1 text-ink' : ''}>{n}</span>)}
            </div>
          </div>
        </div>
      </Float>
      {/* The interviews: one scheduled, one joined instantly with its transcript. */}
      <Float on={on} reduce={reduce} at={0.15} className="left-[262px] top-[34px] h-[506px] w-[242px]">
        <div className="size-full rounded-[24px] bg-[#fffdf3] p-3 shadow-[0_26px_60px_-26px_rgba(26,23,20,0.42)] ring-1 ring-[#1a1714]/[0.07]">
          {[['L', 'Luca D.', 'Project Manager'], null, ['L', 'Luca D.', 'Project Manager']].map((r, i) => r ? (
            <div key={i} className={'flex items-center gap-2 rounded-[13px] bg-white px-3 py-2.5 ring-1 ring-[#1a1714]/[0.06] ' + (i ? 'mt-2.5' : '')}>
              <Avatar c={r[0]} size={28} />
              <span className="flex flex-col whitespace-nowrap leading-tight"><span className="font-sans text-[11px] font-medium text-ink">{r[1]}</span><span className="font-sans text-[8.5px] text-ink-3">{r[2]}</span></span>
              <Tag tone={WARM} className="!px-2.5 !py-[2px] !text-[9.5px] ml-auto">Scheduled</Tag>
              <ChevronUp className="size-3 shrink-0 text-ink-3" strokeWidth={2} />
            </div>
          ) : (
            <div key={i} className="mt-2.5 rounded-[13px] bg-white p-3 ring-1 ring-[#1a1714]/[0.06]">
              <div className="flex items-center gap-2">
                <Avatar c="S" size={28} />
                <span className="flex flex-col whitespace-nowrap leading-tight"><span className="font-sans text-[11px] font-medium text-ink">Sarah M.</span><span className="font-sans text-[8.5px] text-ink-3">Marketing Lead</span></span>
                <Tag className="!px-2.5 !py-[2px] !text-[9.5px] ml-auto">Joined instantly</Tag>
                <ChevronDown className="size-3 shrink-0 text-ink-3" strokeWidth={2} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2"><Bars live={on && !reduce} n={20} h={20} w={2} gap={2.5} /><span className="font-sans text-[9.5px] tabular-nums text-ink-3">01:23:06</span></div>
              <div className="mt-2.5 rounded-[9px] bg-[#fffdf3] p-2.5 font-sans text-[9.5px] leading-[1.9] text-ink-2 ring-1 ring-[#1a1714]/[0.05]">
                Honestly, <Hi tone="bg-[#e6f3cc] text-[#3f6b12]">the team was burning hours every week on manual reporting,</Hi> so i needed <Hi tone="bg-[#e4e1f8] text-[#4a3f94]">something that pulled the data automatically.</Hi> But migrating <Hi tone="bg-[#f6e0dc] text-[#9f2f2d]">two years of recordings felt impossible.</Hi> i just froze on it for weeks.
              </div>
              <div className="mt-2 rounded-[9px] bg-[#fffdf3] p-2.5 font-sans text-[9.5px] leading-[1.8] text-ink-2 ring-1 ring-[#1a1714]/[0.05]">
                I almost didn't upgrade because i <Hi tone="bg-[#fbf3db] text-[#8a6100]">wasn't sure it was worth it.</Hi>
              </div>
              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-[7px] bg-white px-2.5 py-1 font-sans text-[9px] text-ink ring-1 ring-[#1a1714]/[0.12]">Jump to full interview <ExternalLink className="size-2.5" strokeWidth={1.8} /></span>
            </div>
          ))}
        </div>
      </Float>
      {/* The two ways in, over everything. */}
      <Float on={on} reduce={reduce} at={0.45} className="left-[70px] top-[226px] w-[300px]">
        <div className="flex h-[62px] items-center justify-center gap-5 rounded-[20px] bg-[#1a1714] text-white shadow-[0_26px_50px_-18px_rgba(26,23,20,0.6)]">
          <span className={FIG + ' text-[20px] tracking-[-0.01em]'}>Join interview now</span><ChevronRight className="size-5" strokeWidth={1.8} />
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.6} className="left-[78px] top-[304px] w-[286px]">
        <div className="flex h-[54px] items-stretch overflow-hidden rounded-[18px] bg-[#fffdf3] shadow-[0_24px_46px_-18px_rgba(26,23,20,0.5)] ring-1 ring-[#1a1714]/[0.08]">
          <span className={FIG + ' grid flex-1 place-items-center text-[19px] tracking-[-0.01em] text-ink'}>Pick a time</span>
          <span className="grid w-[66px] place-items-center border-0 border-l border-solid border-[#1a1714]/[0.1]"><Calendar className="size-[22px] text-ink" strokeWidth={1.6} /></span>
        </div>
      </Float>
    </Stage>
  );
}

// ——— 3. Insights appear instantly.
export function InsightsScene({ active, reduce }) {
  const on = active;
  const rows = [['S', 'Sarah M.', 'Marketing Lead', 'Onboarding friction', GREEN, '09:41 AM'], ['L', 'Luca D.', 'Project Manager', 'Feature request', VIOLET, '11:22 AM'], ['D', 'Daniel L.', 'Designer', 'Pricing perception', WARM, '01:05 PM'], ['A', 'Anna G.', 'Product manager', 'Dashboard value', GREEN, '03:25 PM']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0.05} className="left-[36px] top-[50px] w-[448px]">
        <div className={CARD + ' flex items-center gap-4 !rounded-[22px] px-7 py-[22px]'}>
          <TriangleAlert className="size-[26px] shrink-0 text-[#2a321e]" fill="currentColor" strokeWidth={0} />
          <span className={FIG + ' text-[19px] tracking-[-0.01em] text-ink'}>New insights are captured automatically</span>
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.2} className="left-[36px] top-[142px] h-[392px] w-[448px]">
        <div className="size-full rounded-[24px] bg-[#fffdf3] shadow-[0_26px_60px_-26px_rgba(26,23,20,0.42)] ring-1 ring-[#1a1714]/[0.07]" />
      </Float>
      {rows.map(([c, name, role, theme, tone, time], i) => (
        <Float key={name} on={on} reduce={reduce} at={0.32 + i * 0.14} className="left-[48px] w-[424px]" style={{ top: 160 + i * 88 }}>
          <div className={'flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-3.5 shadow-[0_8px_18px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06] ' + (i === 3 ? 'opacity-45 [mask-image:linear-gradient(to_bottom,#000,transparent)]' : '')}>
            <Avatar c={c} size={38} />
            <span className="flex w-[88px] shrink-0 flex-col whitespace-nowrap leading-tight">
              <span className="font-sans text-[14px] font-medium text-ink">{name}</span>
              <span className="mt-0.5 font-sans text-[11px] text-ink-3">{role}</span>
            </span>
            <Tag tone={tone} className="!rounded-[8px] !px-2.5 !py-1 !text-[12px]">{theme}</Tag>
            <span className="ml-auto whitespace-nowrap font-sans text-[12px] tabular-nums text-ink-3">{time}</span>
            <ExternalLink className="size-[18px] shrink-0 text-ink" strokeWidth={1.6} />
          </div>
        </Float>
      ))}
    </Stage>
  );
}

export const ALWAYS_ON_SCENES = [TriggersScene, AnytimeScene, InsightsScene];
