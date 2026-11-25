// AlwaysOnScenes (V21.04): the three "How it works" visuals of the Always on availability page, redrawn from the live page's pictures in the
// V21.04 colours as plain HTML and SVG. Each is a StepVisual `scene` ({ active, reduce }) on the card's lime:
//   Triggers: interviews start on their own: signed up, purchased, at risk of churn (all live), and "Invite manually" (ready).
//   Anytime:  conversations at any hour: a clean, open calendar, faded back so the white "Join interview now" button stands out.
//   Insights: "New insights are captured automatically", each interview with its theme.
// Drawn on a 520 × 578 stage scaled to the card's width. They play when their step becomes active; reduced motion shows them finished.
import { ChevronLeft, ChevronRight, Mail, ShoppingCart, TriangleAlert, UserPen } from 'lucide-react';
import { Avatar, CARD, FIG, Float, Stage } from './GlobalScenes';

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

// ——— 2. Conversations run 24/7: an open calendar, faded back, and one white button on top.
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const CELLS = [null, ...Array.from({ length: 31 }, (_, i) => i + 1)]; // December 2026 starts on a Tuesday
export function AnytimeScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      {/* The scheduling page: every day open, faded so the button leads. */}
      <Float on={on} reduce={reduce} at={0} className="left-[44px] top-[70px] w-[432px]">
        <div className="opacity-[0.6] blur-[1.2px]">
          <p className={FIG + ' m-0 text-[24px] font-medium tracking-[-0.02em] text-ink'}>Pick a time that works for you</p>
          <p className="m-0 mt-1.5 font-sans text-[17px] text-ink-3">Your time, your context.</p>
          <div className={CARD + ' mt-6 px-6 py-5'}>
            <div className="flex items-center justify-between text-ink">
              <ChevronLeft className="size-5" strokeWidth={1.8} />
              <span className="font-sans text-[16px]">December 2026</span>
              <ChevronRight className="size-5" strokeWidth={1.8} />
            </div>
            <div className="mt-5 grid grid-cols-7 gap-y-3.5 text-center font-sans text-[15px] text-ink">
              {DAYS.map(d => <span key={d} className="text-ink-3">{d}</span>)}
              {CELLS.map((n, i) => <span key={i} className={n === 15 ? 'rounded-[10px] bg-[#d1f899] py-1.5 font-medium text-[#2a321e]' : 'py-1.5'}>{n ?? ''}</span>)}
            </div>
          </div>
        </div>
      </Float>
      {/* A soft lime wash behind the button. */}
      <Float on={on} reduce={reduce} at={0.3} className="inset-0">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(58% 17% at 50% 56%, rgba(209,248,153,0.9), rgba(209,248,153,0) 100%)' }} />
      </Float>
      <Float on={on} reduce={reduce} at={0.45} className="left-[100px] top-[270px] w-[320px]">
        <div className="flex h-[68px] items-center justify-center gap-5 rounded-[22px] bg-white text-ink shadow-[0_30px_60px_-18px_rgba(26,23,20,0.55)] ring-1 ring-[#1a1714]/[0.06]">
          <span className={FIG + ' text-[21px] tracking-[-0.01em]'}>Join interview now</span><ChevronRight className="size-5" strokeWidth={1.8} />
        </div>
      </Float>
    </Stage>
  );
}

// ——— 3. Insights appear instantly.
export function InsightsScene({ active, reduce }) {
  const on = active;
  const rows = [['S', 'Sarah M.', 'Marketing Lead', 'Onboarding friction', GREEN], ['L', 'Luca D.', 'Project Manager', 'Feature request', VIOLET], ['D', 'Daniel L.', 'Designer', 'Pricing perception', WARM], ['A', 'Anna G.', 'Product manager', 'Dashboard value', GREEN]];
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
      {rows.map(([c, name, role, theme, tone], i) => (
        <Float key={name} on={on} reduce={reduce} at={0.32 + i * 0.14} className="left-[48px] w-[424px]" style={{ top: 160 + i * 88 }}>
          <div className={'flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-3.5 shadow-[0_8px_18px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06] ' + (i === 3 ? 'opacity-45 [mask-image:linear-gradient(to_bottom,#000,transparent)]' : '')}>
            <Avatar c={c} size={42} />
            <span className="flex flex-1 flex-col whitespace-nowrap leading-tight">
              <span className="font-sans text-[15px] font-medium text-ink">{name}</span>
              <span className="mt-0.5 font-sans text-[12px] text-ink-3">{role}</span>
            </span>
            <Tag tone={tone} className="!rounded-[9px] !px-3.5 !py-1.5 !text-[13.5px]">{theme}</Tag>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

export const ALWAYS_ON_SCENES = [TriggersScene, AnytimeScene, InsightsScene];
