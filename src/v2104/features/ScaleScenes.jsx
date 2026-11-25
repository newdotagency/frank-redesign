// ScaleScenes (V21.04): the four "What Frank delivers" visuals of the Scale benefit page, redrawn in the V21.04 colours as plain HTML and SVG
// (a 520 × 578 stage; one centred composition; Frank is the glasses):
//   Capacity: interviews running side by side, 113 more behind them (the Speed page's picture).
//   Data:     the interview goals Frank set up, and the topics it covers.
//   Reach:    languages around Frank.
//   Depth:    two charts drawn from 113 interviews: sentiment over time and the segment breakdown.
import { Ask, Column, Mark, RING, Reply, Rise, SOFT } from './QualityScenes';
import { InterviewsScene } from './SpeedScenes';
import { FIG, Flag, Float, Stage } from './GlobalScenes';

// ——— 2. Data.
export function DataScene({ active, reduce }) {
  const on = active;
  const topics = ['First impressions', 'Steps that caused confusion'];
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Ask>We want to understand why users drop off before completing our onboarding flow.</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-3"><Reply>Got it — I’ve set up your goals and topics. Feel free to edit them before continuing.</Reply></Rise>
        <Rise on={on} reduce={reduce} at={0.32} className={'mt-5 rounded-[18px] bg-white p-4 ' + SOFT + ' ' + RING}>
          <div className="font-sans text-[13px] text-ink-2">Topics covered</div>
          <div className="mt-2.5 flex flex-col gap-2">
            {topics.map(g => <div key={g} className={'rounded-[11px] bg-[#fffdf3] px-3.5 py-2.5 font-sans text-[14px] text-ink ' + RING}>{g}</div>)}
          </div>
        </Rise>
      </Column>
    </Stage>
  );
}

// ——— 3. Reach: languages around Frank.
export function ReachScene({ active, reduce }) {
  const on = active;
  const C = [260, 289];
  const langs = [['de', 'German', -90], ['fr', 'France', -30], ['se', 'Swedish', 30], ['no', 'Norwegian', 90], ['es', 'Spanish', 150], ['it', 'Italian', 210]];
  const R = 165;
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="inset-0">
        <svg aria-hidden="true" viewBox="0 0 520 578" className="absolute inset-0 size-full" fill="none">
          <circle cx={C[0]} cy={C[1]} r="206" fill="#fffdf3" fillOpacity="0.55" />
          {[165, 112, 72].map(r => <circle key={r} cx={C[0]} cy={C[1]} r={r} stroke="#1a1714" strokeOpacity={r === 165 ? 0.22 : 0.1} strokeWidth="1.2" strokeDasharray={r === 165 ? '4 6' : undefined} />)}
        </svg>
      </Float>
      <Float on={on} reduce={reduce} at={0.1} className="left-[200px] top-[229px]">
        <span className={'grid size-[120px] place-items-center rounded-full bg-white ' + SOFT + ' ' + RING}><Mark className="w-[70%]" /></span>
      </Float>
      {langs.map(([code, name, deg], i) => {
        const x = C[0] + R * Math.cos(deg * Math.PI / 180), y = C[1] + R * Math.sin(deg * Math.PI / 180);
        return (
          <div key={code} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
            <Rise on={on} reduce={reduce} at={0.25 + i * 0.08}>
              <span className={'flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white py-2.5 pl-3.5 pr-5 font-sans text-[15px] text-ink shadow-[0_12px_24px_-12px_rgba(26,23,20,0.4)] ' + RING}><Flag code={code} w={30} />{name}</span>
            </Rise>
          </div>
        );
      })}
    </Stage>
  );
}

// ——— 4. Depth: sentiment over time, segment breakdown.
export function DepthChartsScene({ active, reduce }) {
  const on = active;
  const pts = [[8, 66], [30, 34], [52, 52], [74, 20], [96, 38], [118, 8]];
  const donut = [['#3f6b12', 0.5], ['#8fb85a', 0.3], ['#d1f899', 0.2]];
  let acc = 0;
  const R = 34, Cc = 2 * Math.PI * R;
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Ask>Show me graphs for each topic with the top answers</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-3"><Reply>Based on 113 interviews, here are the top themes I found.</Reply></Rise>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Rise on={on} reduce={reduce} at={0.32} className={'rounded-[18px] bg-white p-4 ' + SOFT + ' ' + RING}>
            <div className={FIG + ' text-[15px] text-ink'}>Sentiment over time</div>
            <div className="font-sans text-[12.5px] text-ink-2">+49%</div>
            <svg aria-hidden="true" viewBox="0 0 126 76" className="mt-2 w-full" fill="none">
              {pts.map(([x]) => <path key={x} d={`M${x} 0 V76`} stroke="#1a1714" strokeOpacity="0.08" strokeDasharray="3 4" />)}
              <path d={pts.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ')} stroke="#3f6b12" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
              {pts.map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.2" fill="#3f6b12" />)}
            </svg>
          </Rise>
          <Rise on={on} reduce={reduce} at={0.46} className={'rounded-[18px] bg-white p-4 ' + SOFT + ' ' + RING}>
            <div className={FIG + ' text-[15px] text-ink'}>Segment breakdown</div>
            <svg aria-hidden="true" viewBox="0 0 100 100" className="mx-auto mt-3 w-[104px] -rotate-90" fill="none">
              {donut.map(([c, f], i) => { const o = acc; acc += f; return <circle key={i} cx="50" cy="50" r={R} stroke={c} strokeWidth="15" strokeDasharray={`${f * Cc - 1.5} ${Cc}`} strokeDashoffset={-o * Cc} />; })}
            </svg>
          </Rise>
        </div>
      </Column>
    </Stage>
  );
}
export const SCALE_SCENES = [InterviewsScene, DataScene, ReachScene, DepthChartsScene];
