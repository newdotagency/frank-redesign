// PriceScenes (V21.04): the four "What Frank delivers" visuals of the Price benefit page, redrawn in the V21.04 colours as plain HTML and SVG
// (a 520 × 578 stage scaled to the card):
//   Cost:      one conversation the traditional way, against 100s of interviews with Frank.
//   Effort:    a busy, blurred calendar behind a clear one, and Frank taking the scheduling.
//   Iteration: Setup → Interview → Analyze, around Frank, again and again.
//   Pricing:   everything included, orbiting Frank.
import { BarChart3, Brain, Globe, MessageSquare, Phone, Play, Search, ShieldCheck, Sparkles, User, Video } from 'lucide-react';
import Glasses from '../../v3/Glasses';
import { Avatar, Bars, FIG, Float, Stage } from './GlobalScenes';

const RING = 'ring-1 ring-[#1a1714]/[0.06]';
const SOFT = 'shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)]';
const Mark = ({ className = '', pose = 'Thinking' }) => <span className={'block ' + className}><Glasses pose={pose} reduced={false} /></span>;

// ——— 1. Cost.
export function CostScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[52px] w-[472px]">
        <div className="text-center font-sans text-[15px] text-ink-2">Traditional</div>
        <div className={'mt-2 flex items-center justify-center gap-4 rounded-[20px] bg-white py-5 ' + SOFT + ' ' + RING}>
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#f1f9e3] text-[#3f6b12]"><User className="size-6" strokeWidth={1.7} /></span>
          <MessageSquare className="size-12 text-[#5f8f22]" strokeWidth={1.4} />
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-[#f1f9e3] text-[#3f6b12]"><User className="size-6" strokeWidth={1.7} /></span>
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.2} className="left-[24px] top-[218px] w-[472px]">
        <div className="text-center font-sans text-[15px] text-ink">Frank</div>
        <div className="mt-2 flex flex-col gap-2.5">
          {['S', 'L', 'G', 'D'].map((c, i) => (
            <div key={c} className={'flex items-center gap-4 rounded-[16px] bg-white px-4 py-2.5 ' + SOFT + ' ' + RING}>
              <Avatar c={c} size={38} /><span className="flex flex-1 justify-center"><Bars live={false} n={30} h={24} w={2.5} gap={3} /></span>
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Play className="size-3.5 fill-current" strokeWidth={0} /></span>
            </div>
          ))}
          <div className={'rounded-[16px] bg-[#fffdf3] py-3 text-center font-sans text-[14px] text-ink-2 ' + RING}>+113 additional interviews</div>
        </div>
      </Float>
    </Stage>
  );
}

// ——— 2. Effort.
const DAYS = [26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2];
function Cal({ busy = false, className = '' }) {
  return (
    <div className={'grid grid-cols-7 gap-y-2 text-center font-sans text-[15px] ' + className}>
      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-[12px] text-ink-3">{d}</span>)}
      {DAYS.map((d, i) => {
        const dim = i < 6 || i > 35;
        return <span key={i} className={'mx-auto grid size-8 place-items-center rounded-[9px] tabular-nums ' + (dim ? 'text-ink-3' : 'text-ink') + (busy && !dim && i % 3 !== 1 ? ' bg-[#f6e3dc]' : '')}>{d}</span>;
      })}
    </div>
  );
}
export function EffortScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[40px] top-[90px] w-[330px]">
        <div className={'rounded-[20px] bg-white p-5 opacity-60 blur-[1.5px] ' + RING}><Cal busy /></div>
      </Float>
      <Float on={on} reduce={reduce} at={0.16} className="left-[170px] top-[150px] w-[330px]">
        <div className={'rounded-[20px] bg-white p-5 shadow-[0_26px_50px_-22px_rgba(26,23,20,0.42)] ' + RING}><Cal /></div>
      </Float>
      <Float on={on} reduce={reduce} at={0.3} className="left-[18px] top-[50px]">
        <span aria-hidden="true" className={'grid size-[88px] place-items-center rounded-full bg-white text-[#9a4a32] ' + SOFT + ' ' + RING}><User className="size-10" strokeWidth={1.5} /></span>
      </Float>
      <Float on={on} reduce={reduce} at={0.42} className="left-[330px] top-[400px]">
        <span aria-hidden="true" className="grid size-[130px] place-items-center rounded-full bg-white shadow-[0_24px_40px_-18px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.08]"><Mark className="w-[84%]" /></span>
      </Float>
    </Stage>
  );
}

// ——— 3. Iteration: Setup → Interview → Analyze, in a loop.
export function IterationScene({ active, reduce }) {
  const on = active;
  const nodes = [[260, 112, '01.', 'Setup'], [410, 372, '02.', 'Interview'], [110, 372, '03.', 'Analyze']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="inset-0">
        <svg aria-hidden="true" viewBox="0 0 520 578" className="absolute inset-0 size-full" fill="none">
          <circle cx="260" cy="290" r="196" fill="#fffdf3" fillOpacity="0.6" />
          <circle cx="260" cy="290" r="196" stroke="#1a1714" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5 6" />
          {[[372, 148, 38], [330, 482, 168], [138, 208, -78]].map(([x, y, r], i) => <path key={i} d="M-9 6 L9 0 L-9 -6 Z" fill="#3f6b12" transform={`translate(${x} ${y}) rotate(${r})`} />)}
        </svg>
      </Float>
      <Float on={on} reduce={reduce} at={0.1} className="left-[170px] top-[200px]">
        <span className={'grid size-[180px] place-items-center rounded-full bg-white shadow-[0_18px_36px_-18px_rgba(26,23,20,0.35)] ' + RING}><Mark className="w-[74%]" /></span>
      </Float>
      {nodes.map(([x, y, n, t], i) => (
        <Float key={t} on={on} reduce={reduce} at={0.25 + i * 0.14} className="" style={{ left: x - 62, top: y - 62 }}>
          <span className="grid size-[124px] place-items-center rounded-full bg-white text-center shadow-[0_16px_30px_-16px_rgba(26,23,20,0.4)] ring-1 ring-[#1a1714]/[0.06]">
            <span className={FIG + ' leading-snug text-[#2a321e]'}><span className="block text-[15px] opacity-70">{n}</span><span className="block text-[18px] font-medium">{t}</span></span>
          </span>
        </Float>
      ))}
    </Stage>
  );
}

// ——— 4. Pricing: everything included.
export function PricingScene({ active, reduce }) {
  const on = active;
  const outer = [[260, 64, Video], [452, 270, BarChart3], [260, 512, Sparkles], [68, 290, ShieldCheck]];
  const inner = [[338, 180, Phone], [366, 392, Brain], [172, 408, Globe], [150, 190, Search]];
  const Node = ({ x, y, Icon, d, size = 64 }) => (
    <Float on={on} reduce={reduce} at={d} className="" style={{ left: x - size / 2, top: y - size / 2 }}>
      <span aria-hidden="true" className="grid place-items-center rounded-full bg-white text-[#2a321e] shadow-[0_12px_24px_-12px_rgba(26,23,20,0.4)] ring-1 ring-[#1a1714]/[0.08]" style={{ width: size, height: size }}><Icon className="size-[28px]" strokeWidth={1.6} /></span>
    </Float>
  );
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="inset-0">
        <svg aria-hidden="true" viewBox="0 0 520 578" className="absolute inset-0 size-full" fill="none" stroke="#1a1714" strokeOpacity="0.3" strokeWidth="1.4" strokeDasharray="4 7">
          <ellipse cx="260" cy="288" rx="196" ry="224" /><ellipse cx="260" cy="288" rx="118" ry="130" />
        </svg>
      </Float>
      <Float on={on} reduce={reduce} at={0.1} className="left-[185px] top-[213px]">
        <span className={'grid size-[150px] place-items-center rounded-full bg-white shadow-[0_18px_40px_-16px_rgba(26,23,20,0.4)] ' + RING}><Mark className="w-[78%]" /></span>
      </Float>
      {inner.map(([x, y, I], i) => <Node key={'i' + i} x={x} y={y} Icon={I} d={0.25 + i * 0.07} size={60} />)}
      {outer.map(([x, y, I], i) => <Node key={'o' + i} x={x} y={y} Icon={I} d={0.4 + i * 0.07} size={68} />)}
    </Stage>
  );
}
export const PRICE_SCENES = [CostScene, EffortScene, IterationScene, PricingScene];
