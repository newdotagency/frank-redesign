// FeatureCovers (V21.04): the cover of each Platform feature (the card's picture under "Related features"), drawn as HTML and SVG from the
// live pages' covers, in the V21.04 colours: Frank's lime with its grain, and a white card cropped off the edge.
//   automated-summaries:    a participant's summary (motivations, objections…)
//   transparency-security:  a quote with "Jump to interview" floating over it
//   always-on-availability: "Conversations happen 24/7" with its two points
//   global-scalability:     the world map with people linked across it, and call controls
// Each is drawn on a 400 × 300 stage (the card's 4:3) scaled to its width.
import { useId } from 'react';
import { ArrowUpRight, Clock3, Globe, Heart, Mic, Phone, Quote, Target, Video, X, Zap } from 'lucide-react';
import { cardGrain } from '../../components/grain';
import { Stage } from './GlobalScenes';
import { LAND, LINKS } from './worldMap';

const W = 400, H = 300;
const FIG = "font-['Figtree',sans-serif]";
const CARD = 'bg-white shadow-[0_28px_60px_-26px_rgba(26,23,20,0.5)] ring-1 ring-[#1a1714]/[0.06]';

function Cover({ children }) {
  return (
    <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[#d1f899]">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={cardGrain} />
      <Stage w={W} h={H}>{children}</Stage>
    </span>
  );
}

const Tile = ({ children, size = 40, className = '' }) => (
  <span aria-hidden="true" className={'grid shrink-0 place-items-center rounded-full bg-[#f1f9e3] text-[#2a321e] ' + className} style={{ width: size, height: size }}>{children}</span>
);

// ——— Automated summaries
export function SummariesCover() {
  const rows = [[Heart, 'Motivations: clarity before commitment'], [X, 'Objections: confusing pricing structure'], [Target, 'Needs: a plan that grows with the team']];
  return (
    <Cover>
      <div className={'absolute left-[42px] top-[58px] h-[300px] w-[440px] rounded-tl-[28px] px-[22px] pt-[22px] ' + CARD}>
        <div className="flex items-center gap-4 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-4">
          <span aria-hidden="true" className={FIG + ' grid size-[58px] shrink-0 place-items-center rounded-full bg-[#d1f899] text-[24px] font-medium text-[#2a321e]'}>S</span>
          <span className="flex flex-col leading-snug">
            <span className="font-sans text-[18px] text-ink">Sarah K.</span>
            <span className="font-sans text-[15px] text-ink-3">Growth Manager</span>
          </span>
        </div>
        {rows.map(([Icon, t]) => (
          <div key={t} className="flex items-center gap-3.5 border-0 border-b border-solid border-[#1a1714]/[0.08] py-[13px]">
            <Tile size={38}><Icon className="size-[18px]" strokeWidth={1.7} /></Tile>
            <span className="whitespace-nowrap font-sans text-[14.5px] text-ink-2">{t}</span>
          </div>
        ))}
      </div>
    </Cover>
  );
}

// ——— Transparency & security
const QUOTE = '“I was spending probably 15–20 hours per week just on scheduling interviews, taking notes, and then trying to organize everything afterward. It was insane.”';
export function SecurityCover() {
  return (
    <Cover>
      <div className={'absolute left-[104px] top-[84px] h-[280px] w-[320px] rounded-tl-[22px] p-[14px] ' + CARD}>
        {[0, 1].map(i => (
          <div key={i} className="relative mb-[10px] rounded-[14px] bg-[#fffdf3] px-4 pb-3 pt-3.5 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.06)]">
            <Quote aria-hidden="true" className="absolute left-3 top-3.5 size-[14px] text-[#a0d05f]" fill="currentColor" strokeWidth={0} />
            <p className="m-0 pl-6 font-serif text-[11.5px] leading-[1.5] text-ink">{QUOTE}</p>
            <p className="m-0 mt-1.5 flex items-center gap-1 pl-6 font-sans text-[10px] text-ink-2">Jump to interview <ArrowUpRight className="size-[11px]" strokeWidth={1.8} /></p>
          </div>
        ))}
      </div>
      <div className="absolute left-[22px] top-[56px] flex items-center gap-3 rounded-[22px] bg-[#fffdf3] px-[22px] py-[15px] shadow-[0_26px_50px_-18px_rgba(26,23,20,0.5)] ring-1 ring-[#1a1714]/[0.08]">
        <span className={FIG + ' text-[20px] tracking-[-0.01em] text-ink'}>Jump to interview</span>
        <ArrowUpRight className="size-[22px] text-ink" strokeWidth={1.6} />
      </div>
    </Cover>
  );
}

// ——— Always-on availability
export function AlwaysOnCover() {
  const pts = [[Globe, 'Always on', 'Engage customers anytime, across time zones.'], [Zap, 'No back-and-forth', 'No scheduling, reminders, or manual follow-ups.']];
  return (
    <Cover>
      <div className={'absolute left-[42px] top-[58px] h-[300px] w-[440px] rounded-tl-[28px] px-[22px] pt-[22px] ' + CARD}>
        <div className="flex items-center gap-4 border-0 border-b border-solid border-[#1a1714]/[0.08] pb-4">
          <span aria-hidden="true" className="grid size-[58px] shrink-0 place-items-center rounded-[17px] bg-[#d1f899] text-[#2a321e]"><Clock3 className="size-[26px]" strokeWidth={1.6} /></span>
          <span className={FIG + ' max-w-[250px] text-[16.5px] leading-[1.4] text-ink'}>Conversations happen 24/7 — so you never miss what matters.</span>
        </div>
        {pts.map(([Icon, t, d]) => (
          <div key={t} className="flex items-center gap-3.5 pt-[15px]">
            <Tile size={42}><Icon className="size-5" strokeWidth={1.6} /></Tile>
            <span className="flex flex-col leading-snug">
              <span className={FIG + ' text-[16px] font-medium tracking-[-0.01em] text-ink'}>{t}</span>
              <span className="font-sans text-[12.5px] text-ink-2">{d}</span>
            </span>
          </div>
        ))}
      </div>
    </Cover>
  );
}

// ——— Global scalability
const PEOPLE = [[101, 110], [137, 183], [213, 128], [262, 84], [318, 130]];
export function GlobalCover() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [cx, cy, cr] = LINKS.circle, [ex, ey, erx, ery] = LINKS.ellipse;
  return (
    <Cover>
      <div className={'absolute left-[34px] top-[30px] h-[290px] w-[332px] rounded-[26px] p-[12px] ' + CARD}>
        <div className="relative h-[188px] overflow-hidden rounded-[17px] bg-[#fffdf3] shadow-[inset_0_0_0_1px_rgba(26,23,20,0.05)]">
          <svg aria-hidden="true" viewBox="2 36 396 232" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" fill="none">
            <defs>
              <pattern id={'gc' + uid} width="2.6" height="2.6" patternUnits="userSpaceOnUse"><path d="M1 0V2.6" stroke="rgba(26,23,20,0.38)" strokeWidth="0.9" /></pattern>
            </defs>
            <path d={LAND} fill={`url(#gc${uid})`} />
            <g stroke="rgba(26,23,20,0.55)" strokeWidth="1.2" strokeDasharray="5 5" strokeLinecap="round">
              <circle cx={cx} cy={cy} r={cr} /><ellipse cx={ex} cy={ey} rx={erx} ry={ery} />
            </g>
            {PEOPLE.map(([x, y]) => (
              <g key={x + '-' + y} transform={`translate(${x} ${y})`}>
                <circle r="11" fill="#2a321e" />
                <circle cy="-3" r="3" fill="#fff" /><path d="M-5.2 5.4c.6-3.2 2.6-4.6 5.2-4.6s4.6 1.4 5.2 4.6z" fill="#fff" />
              </g>
            ))}
          </svg>
        </div>
        <div className="mt-[18px] flex justify-center gap-4">
          {[[Mic, '#3f4a2e'], [Video, '#4d5a3a'], [Phone, '#1a1714']].map(([Icon, bg], i) => (
            <span key={i} aria-hidden="true" className="grid size-[42px] place-items-center rounded-full text-white" style={{ background: bg }}><Icon className={'size-[18px] ' + (i === 2 ? 'rotate-[135deg]' : '')} strokeWidth={1.7} /></span>
          ))}
        </div>
      </div>
    </Cover>
  );
}

export const COVERS = {
  'automated-summaries': SummariesCover,
  'transparency-security': SecurityCover,
  'always-on-availability': AlwaysOnCover,
  'global-scalability': GlobalCover,
};
