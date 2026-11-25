// AlwaysOnGetVisuals (V21.04): the three "What you get" pictures of the Always on availability page, redrawn as plain HTML and SVG in the
// V21.04 colours, on a 400 × 300 stage (the card's 4:3) scaled to its width:
//   Signals:  "New insights are captured automatically" over three interviews, each with its theme.
//   Triggers: "Customer purchased Pro Plan · Just now" over Frank's question to that customer.
//   Downtime: "Save your time · insights continue flowing" over a dotted path through launches, sprints, holidays and off-hours.
// Cards drift gently; reduced motion holds them still.
import { Clock, ShoppingCart, TriangleAlert, Users, Rocket, Palmtree, Moon } from 'lucide-react';
import { useReducedMotion, motion } from 'framer-motion';
import { Avatar, Stage } from './GlobalScenes';

const FIG = "font-['Figtree',sans-serif]";
const CARDX = 'rounded-[18px] bg-white shadow-[0_14px_30px_-16px_rgba(26,23,20,0.38)] ring-1 ring-[#1a1714]/[0.06]';

function Drift({ reduce, dy = 4, dur = 5, delay = 0, className = '', style, children }) {
  return (
    <div className={'absolute ' + className} style={style}>
      <motion.div animate={reduce ? undefined : { y: [0, -dy, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}>{children}</motion.div>
    </div>
  );
}

const TAGS = [['bg-[#f1f9e3] text-[#3f6b12]', 'Onboarding friction'], ['bg-[#ece1fd] text-[#5b3fa0]', 'Feature requests'], ['bg-[#fbf3db] text-[#8a6100]', 'Pricing perception']];
const PEOPLE = [['S', 'Sarah M.', 'Marketing Lead'], ['G', 'Gina K.', 'CEO'], ['D', 'Daniel L.', 'Product Manager']];

function SignalsVisual() {
  const reduce = !!useReducedMotion();
  return (
    <Stage w={400} h={300}>
      <Drift reduce={reduce} dy={3} className="left-[20px] top-[16px] w-[360px]">
        <div className={CARDX + ' flex items-center justify-center gap-3 px-4 py-3'}>
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><TriangleAlert className="size-4" strokeWidth={2} /></span>
          <span className={FIG + ' whitespace-nowrap text-[15.5px] text-ink'}>New insights are captured automatically</span>
        </div>
      </Drift>
      {PEOPLE.map(([c, n, r], i) => (
        <div key={n} className="absolute left-[20px] flex w-[360px] items-center gap-3 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_8px_18px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]" style={{ top: 78 + i * 72 }}>
          <Avatar c={c} size={36} />
          <span className="flex w-[104px] shrink-0 flex-col leading-tight"><span className={FIG + ' text-[14px] text-ink'}>{n}</span><span className="text-[11.5px] text-ink-2">{r}</span></span>
          <span className={'whitespace-nowrap rounded-full px-3 py-1 font-sans text-[12.5px] ' + TAGS[i][0]}>{TAGS[i][1]}</span>
        </div>
      ))}
    </Stage>
  );
}

function TriggersVisual() {
  const reduce = !!useReducedMotion();
  return (
    <Stage w={400} h={300}>
      <Drift reduce={reduce} className="left-[20px] top-[22px] w-[360px]">
        <div className={CARDX + ' flex items-center gap-4 px-4 py-4'}>
          <span aria-hidden="true" className="grid size-[52px] shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><ShoppingCart className="size-6" strokeWidth={1.8} /></span>
          <span className="flex flex-col leading-snug"><span className={FIG + ' text-[16.5px] text-ink'}>Customer purchased Pro Plan</span><span className="text-[13px] text-ink-2">Just now</span></span>
        </div>
      </Drift>
      <div className="absolute left-[28px] top-[130px] flex items-center gap-3">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-[9px] bg-[#1a1714] font-sans text-[15px] font-semibold text-[#d1f899]">?</span>
        <span className={FIG + ' text-[18px] text-ink'}>Frank</span>
      </div>
      <p className={FIG + ' absolute left-[28px] top-[182px] m-0 w-[300px] text-[22px] leading-[1.25] tracking-[-0.01em] text-ink'}>What influenced your decision to upgrade to Pro?</p>
    </Stage>
  );
}

function DowntimeVisual() {
  const reduce = !!useReducedMotion();
  const pts = [[48, 208, Rocket, 'Launches'], [128, 160, Users, 'Sprints'], [236, 196, Palmtree, 'Holidays'], [326, 168, Moon, 'Off-hours']];
  return (
    <Stage w={400} h={300}>
      <Drift reduce={reduce} className="left-[34px] top-[18px] w-[332px]">
        <div className={CARDX + ' flex items-center gap-4 px-4 py-3.5'}>
          <span aria-hidden="true" className="grid size-[50px] shrink-0 place-items-center rounded-[12px] bg-[#d1f899] text-[#2a321e]"><Clock className="size-6" strokeWidth={1.8} /></span>
          <span className="flex flex-col leading-snug"><span className={FIG + ' text-[17px] text-ink'}>Save your time</span><span className="text-[13px] text-ink-2">insights continue flowing</span></span>
        </div>
      </Drift>
      <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 size-full">
        <path d="M-10 200 C 20 214 30 200 48 208 S 100 176 128 160 S 200 160 236 196 S 300 176 326 168 S 400 170 410 160" fill="none" stroke="#1a1714" strokeOpacity="0.28" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
      </svg>
      {pts.map(([x, y, Icon, t]) => (
        <div key={t} className="absolute flex -translate-x-1/2 flex-col items-center gap-1.5" style={{ left: x, top: y - 24 }}>
          <span aria-hidden="true" className="grid size-[46px] place-items-center rounded-full bg-[#eef2e2] text-[#3a4a2a] shadow-[0_0_0_1px_rgba(26,23,20,0.05)]"><Icon className="size-[22px]" strokeWidth={1.6} /></span>
          <span className="font-sans text-[14px] text-ink-2">{t}</span>
        </div>
      ))}
    </Stage>
  );
}

export const ALWAYS_ON_GET_VISUALS = [SignalsVisual, TriggersVisual, DowntimeVisual];
