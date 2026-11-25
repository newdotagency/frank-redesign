// QualityScenes (V21.04): the four "What Frank delivers" visuals of the Quality benefit page, redrawn in the V21.04 colours as plain HTML and
// SVG (a 520 × 578 stage scaled to the card; Frank is the glasses, never the old wordmark):
//   Rigor:    one interview guide branching into the same structured questions, every time.
//   Evidence: "What are the main reasons users churn?" answered with themes and the quotes behind them.
//   Depth:    "What do users say about the onboarding?" answered with shares, interview counts and quotes.
//   Analysis: a human interviewer's leading questions against Frank's neutral ones.
import Glasses from '../../v3/Glasses';
import { Avatar, FIG, Float, Stage } from './GlobalScenes';

const RING = 'ring-1 ring-[#1a1714]/[0.06]';
const SOFT = 'shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)]';
const Mark = ({ className = '' }) => <span className={'block ' + className}><Glasses pose="Thinking" reduced={false} /></span>;

// ——— 1. Rigor: the same structure, every time.
const BOXES = [
  [260, 70, 150, 'root'],
  [110, 190, 92], [260, 190, 92], [410, 190, 92],
  [60, 300, 78], [165, 300, 78], [270, 300, 78], [375, 300, 78], [460, 300, 70],
  [60, 400, 78], [165, 400, 78], [270, 400, 78], [375, 400, 78],
  [112, 500, 92], [262, 500, 92], [412, 500, 92],
];
const LINES = [[260, 92, 260, 150], [110, 150, 410, 150], [110, 150, 110, 170], [260, 150, 260, 170], [410, 150, 410, 170], [110, 210, 110, 240], [60, 240, 165, 240], [60, 240, 60, 280], [165, 240, 165, 280], [410, 210, 410, 240], [270, 240, 375, 240], [270, 240, 270, 280], [375, 240, 375, 280], [60, 320, 60, 380], [165, 320, 165, 380], [270, 320, 270, 380], [375, 320, 375, 380], [60, 420, 60, 450], [60, 450, 262, 450], [262, 450, 262, 480], [112, 450, 112, 480], [375, 420, 375, 450], [262, 450, 412, 450], [412, 450, 412, 480]];
export function RigorScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="inset-0">
        <svg aria-hidden="true" viewBox="0 0 520 578" className="absolute inset-0 size-full" fill="none" stroke="#1a1714" strokeOpacity="0.28" strokeWidth="1.5">
          {LINES.map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} />)}
        </svg>
      </Float>
      {BOXES.map(([x, y, w, root], i) => (
        <Float key={i} on={on} reduce={reduce} at={root ? 0.05 : 0.15 + (y / 500) * 0.5} className="" style={{ left: x - w / 2, top: y - (root ? 28 : 18), width: w }}>
          {root
            ? <div className={'grid h-[56px] place-items-center rounded-[16px] bg-white ' + SOFT + ' ' + RING}><Mark className="w-[56%]" /></div>
            : <div className={'h-[36px] rounded-[11px] bg-white ' + RING} style={{ boxShadow: '0 8px 16px -12px rgba(26,23,20,0.3)' }}><span className="m-2.5 block h-1.5 w-[55%] rounded-full bg-[#d1f899]" /></div>}
        </Float>
      ))}
    </Stage>
  );
}

// ——— shared chat pieces for 2 and 3.
const Ask = ({ children }) => <div className={FIG + ' ml-auto w-fit max-w-[360px] rounded-[18px] bg-[#fffdf3] px-5 py-3.5 text-[16px] text-ink shadow-[inset_0_0_0_1px_rgba(26,23,20,0.08)]'}>{children}</div>;
const Reply = ({ children }) => <div className={FIG + ' w-[420px] rounded-[18px] bg-white px-5 py-3.5 text-[15.5px] leading-snug text-ink ' + SOFT + ' ' + RING}>{children}</div>;

// ——— 2. Evidence: themes and the words behind them.
export function EvidenceScene({ active, reduce }) {
  const on = active;
  const cards = [['Pricing confusion', 'bg-[#f6e3dc] text-[#9a4a32]', '38 interviews', '“I didn’t understand what I was paying for until the bill arrived.”', 'S', 'Sarah M. · Marketing Lead', 'Interview #47'], ['Onboarding drop-off', 'bg-[#e4f5c8] text-[#3f6b12]', '29 interviews', '“The setup took too long — I gave up after the third step.”', 'J', 'James K. · Product Designer', 'Interview #12']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[40px] top-[60px] w-[440px]"><Ask>What are the main reasons users churn?</Ask></Float>
      <Float on={on} reduce={reduce} at={0.2} className="left-[40px] top-[140px]"><Reply>Across 113 interviews, 3 themes come up consistently — here’s what customers actually said:</Reply></Float>
      {cards.map(([t, tone, n, q, c, who, id], i) => (
        <Float key={t} on={on} reduce={reduce} at={0.4 + i * 0.16} className="left-[40px] w-[420px]" style={{ top: 250 + i * 138 }}>
          <div className={'rounded-[16px] bg-white px-4 py-3.5 ' + SOFT + ' ' + RING}>
            <div className="flex items-center justify-between"><span className={'rounded-full px-3 py-1 font-sans text-[12.5px] ' + tone}>{t}</span><span className="font-sans text-[12px] text-ink-2">{n}</span></div>
            <p className="m-0 mt-2.5 font-sans text-[13.5px] text-ink">{q}</p>
            <div className="mt-2.5 flex items-center gap-2 font-sans text-[12px] text-ink-2"><Avatar c={c} size={26} />{who}<span className="ml-auto">{id}</span></div>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

// ——— 3. Depth: shares of what customers said.
export function DepthScene({ active, reduce }) {
  const on = active;
  const cards = [['70%', '68 interviews', 70, '“Too many steps before I could do anything useful.”', true], ['30%', '29 interviews', 30, '“I didn’t know where to start — no guidance at all.”', false]];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[40px] top-[60px] w-[440px]"><Ask>What do users say about the onboarding?</Ask></Float>
      <Float on={on} reduce={reduce} at={0.2} className="left-[40px] top-[140px]"><Reply>Across 97 interviews on onboarding, two answers dominate:</Reply></Float>
      {cards.map(([pct, n, w, q, top], i) => (
        <Float key={pct} on={on} reduce={reduce} at={0.4 + i * 0.16} className="left-[40px] w-[420px]" style={{ top: 236 + i * 136 }}>
          <div className={'rounded-[16px] bg-white px-5 py-4 ' + SOFT + ' ' + RING}>
            <div className="flex items-baseline gap-3"><span className={FIG + ' text-[34px] leading-none ' + (top ? 'text-ink' : 'text-ink-2')}>{pct}</span><span className="font-sans text-[12px] text-ink-2">{n}</span>{top && <span className="ml-auto rounded-full bg-[#d1f899] px-3 py-1 font-sans text-[12px] text-[#2a321e]">most said</span>}</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1a1714]/[0.06]"><div className="h-full rounded-full" style={{ width: w + '%', background: top ? '#5f8f22' : '#c9d6b3' }} /></div>
            <p className="m-0 mt-3 font-sans text-[13.5px] text-ink">{q}</p>
          </div>
        </Float>
      ))}
      <Float on={on} reduce={reduce} at={0.75} className="left-[40px] top-[512px]"><span className="font-sans text-[12.5px] text-ink-2">Based on 97 interviews · Themes cross-validated across sessions</span></Float>
    </Stage>
  );
}

// ——— 4. Analysis: leading vs neutral.
export function BiasScene({ active, reduce }) {
  const on = active;
  const human = ['“Do you always use our app while driving?”', '“How much did you love our new feature?”', '“Would you pay $50 for this?”', 'The customer said it was too expensive'];
  const frank = ['“How often do you use our app while driving?”', '“Walk me through your experience using this feature”', '“How much do you currently spend on this issue per month?”', 'The value between the Standard and Pro tiers isn’t clear'];
  const Col = ({ x, title, pill, items, rose, at }) => (
    <Float on={on} reduce={reduce} at={at} className="w-[226px]" style={{ left: x, top: 64 }}>
      <div className="text-center"><div className="grid h-[52px] place-items-center">{title}</div><span className={'mx-auto mt-3 block w-fit rounded-full px-3.5 py-1 font-sans text-[12.5px] ' + (rose ? 'bg-[#f6e3dc] text-[#9a4a32]' : 'bg-[#d1f899] text-[#2a321e]')}>{pill}</span></div>
      <div className="mt-6 flex flex-col gap-3">
        {items.map(t => <div key={t} className={'flex min-h-[86px] items-center justify-center rounded-[14px] px-3.5 py-3 text-center font-sans text-[14px] leading-snug text-ink ' + (rose ? 'bg-[#fbe9e4] ring-1 ring-[#e9b9ae]' : 'bg-white ' + SOFT + ' ' + RING)}>{t}</div>)}
      </div>
    </Float>
  );
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[259px] top-[70px] h-[440px] w-px"><div className="h-full border-l border-dashed border-[#1a1714]/15" /></Float>
      <Col x={24} title={<span className={FIG + ' text-[26px] text-ink'}>Human</span>} pill="personal bias" items={human} rose at={0.1} />
      <Col x={270} title={<Mark className="mx-auto w-[78px]" />} pill="no bias" items={frank} at={0.3} />
    </Stage>
  );
}
export const QUALITY_SCENES = [RigorScene, EvidenceScene, DepthScene, BiasScene];
