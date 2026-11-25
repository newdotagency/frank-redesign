// SpeedScenes (V21.04): the three "What Frank delivers" visuals of the Speed benefit page, redrawn in the V21.04 colours as plain HTML and SVG
// (a 520 × 578 stage; one centred column, same chat pieces as the Quality page; Frank is the glasses):
//   Launch:     "Set your interview goals" in one message, Frank's answer and the goals it set up.
//   Interviews: 100+ interviews running at once, 113 more behind them.
//   Insights:   Frank's summary of 113 interviews, the follow-up request, and the chart it drew.
import { Play } from 'lucide-react';
import { Avatar, Bars, FIG, Stage } from './GlobalScenes';
import { Ask, Column, RING, Reply, Rise, SOFT } from './QualityScenes';

// ——— 1. Launch.
export function LaunchScene({ active, reduce }) {
  const on = active;
  const goals = ['Identify drop-off moments', 'Understand what blocked users', 'Find what would help them continue'];
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Ask>We want to understand why users drop off before completing our onboarding flow.</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-3"><Reply>Got it — I’ve set up your goals and topics. Feel free to edit them before continuing.</Reply></Rise>
        <Rise on={on} reduce={reduce} at={0.32} className={'mt-5 rounded-[18px] bg-white p-4 ' + SOFT + ' ' + RING}>
          <div className="font-sans text-[13px] text-ink-2">Goals</div>
          <div className="mt-2.5 flex flex-col gap-2">
            {goals.map(g => <div key={g} className={'rounded-[11px] bg-[#fffdf3] px-3.5 py-2.5 font-sans text-[14px] text-ink ' + RING}>{g}</div>)}
          </div>
        </Rise>
      </Column>
    </Stage>
  );
}

// ——— 2. Interviews.
export function InterviewsScene({ active, reduce }) {
  const on = active;
  const rows = [['S', 0.35], ['L', 0.6], ['G', 1], ['D', 1], ['A', 1]];
  return (
    <Stage>
      <Column>
        <div className="flex flex-col gap-2.5">
          {rows.map(([c, o], i) => (
            <Rise key={c} on={on} reduce={reduce} at={i * 0.08} className=""><div className={'flex items-center gap-4 rounded-[16px] bg-white px-4 py-3 ' + SOFT + ' ' + RING} style={{ opacity: o }}>
              <Avatar c={c} size={40} /><span className="flex flex-1 justify-center"><Bars live={false} n={32} h={26} w={2.5} gap={3} /></span>
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Play className="size-3.5 fill-current" strokeWidth={0} /></span>
            </div></Rise>
          ))}
          <Rise on={on} reduce={reduce} at={0.5} className={'rounded-[16px] bg-[#fffdf3] py-3.5 text-center font-sans text-[15px] text-ink-2 ' + RING}>+113 additional interviews</Rise>
        </div>
      </Column>
    </Stage>
  );
}

// ——— 3. Insights.
export function InsightsScene({ active, reduce }) {
  const on = active;
  const bars = [100, 72, 58, 46];
  return (
    <Stage>
      <Column>
        <Rise on={on} reduce={reduce}><Reply>Based on 113 interviews, here are the top themes I found. I can go deeper on any of these.</Reply></Rise>
        <Rise on={on} reduce={reduce} at={0.15} className="mt-3"><Ask>Show me graphs for each topic with the top answers</Ask></Rise>
        <Rise on={on} reduce={reduce} at={0.32} className={'mt-5 w-[260px] rounded-[18px] bg-white p-4 ' + SOFT + ' ' + RING}>
          <div className={FIG + ' text-[15px] text-ink'}>Why users dropped off</div>
          <div className="mt-4 flex h-[110px] items-end gap-4">
            {bars.map((h, i) => <span key={i} className="block w-[30px] rounded-full" style={{ height: h + '%', background: ['#3f6b12', '#5f8f22', '#8fb85a', '#b9d68c'][i] }} />)}
          </div>
        </Rise>
      </Column>
    </Stage>
  );
}
export const SPEED_SCENES = [LaunchScene, InterviewsScene, InsightsScene];
