// SummariesScenes (V21.04): the three "How it works" visuals of the Automated summaries page, redrawn in the V21.04 colours as plain HTML and
// SVG (a 520 × 578 stage scaled to the card):
//   Interview: 128 interviews completed, 14 countries, 9 live, over three interviews (topic, language, live or completed).
//   Moments:   a transcript with its key moments highlighted, and the recording's player.
//   Summary:   customer quotes, each with "Jump to interview", and the floating "Jump to interview" button.
import { Check, ExternalLink, Play } from 'lucide-react';
import { Avatar, Bars, FIG, Flag, Float, Stage } from './GlobalScenes';

const RING = 'ring-1 ring-[#1a1714]/[0.06]';
const SOFT = 'shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)]';
const Mark = ({ tone, children }) => <span className={'rounded-full px-2.5 py-0.5 ' + tone}>{children}</span>;
const GREEN = 'bg-[#e4f5c8] text-[#3f6b12]', BLUE = 'bg-[#dfe8f6] text-[#3a5a8a]', ROSE = 'bg-[#f6e3dc] text-[#9a4a32]', WARM = 'bg-[#fbf3db] text-[#8a6100]';

// ——— 1. Interviews run automatically.
export function InterviewScene({ active, reduce }) {
  const on = active;
  const stats = [['128', 'interviews completed'], ['14', 'countries'], ['9', 'live right now']];
  const rows = [['S', 'Sarah M.', 'Marketing Lead', 'Onboarding friction', 'gb', 'English', true], ['L', 'Luca D.', 'Project Manager', 'Feature discovery', 'it', 'Italian', false], ['D', 'Daniel L.', 'Designer', 'Pricing perception', 'es', 'Spanish', true]];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[104px] w-[472px]">
        <div className={'flex justify-between rounded-[18px] bg-white px-5 py-4 ' + SOFT + ' ' + RING}>
          {stats.map(([n, l]) => (
            <span key={l} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Check className="size-4" strokeWidth={2.4} /></span>
              <span className="flex flex-col leading-tight"><span className={FIG + ' text-[18px] font-medium text-ink'}>{n}</span><span className="text-[11.5px] text-ink-2">{l}</span></span>
            </span>
          ))}
        </div>
      </Float>
      {rows.map(([c, n, r, t, f, lang, live], i) => (
        <Float key={n} on={on} reduce={reduce} at={0.2 + i * 0.14} className="left-[24px] w-[472px]" style={{ top: 214 + i * 94 }}>
          <div className={'flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 ' + SOFT + ' ' + RING}>
            <Avatar c={c} size={44} />
            <span className="flex w-[104px] shrink-0 flex-col leading-tight"><span className={FIG + ' text-[15px] text-ink'}>{n}</span><span className="text-[12px] text-ink-2">{r}</span></span>
            <span className="flex flex-1 flex-col leading-tight"><span className="font-sans text-[14px] text-ink">{t}</span><span className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-2"><Flag code={f} w={16} />{lang}</span></span>
            <span className={'flex items-center gap-1.5 whitespace-nowrap font-sans text-[13px] ' + (live ? 'text-[#3f6b12]' : 'text-ink-3')}><span className="size-2 rounded-full" style={{ background: live ? '#5f8f22' : '#a39d93' }} />{live ? 'Live now' : 'Completed'}</span>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

// ——— 2. Key moments, highlighted.
export function MomentsScene({ active, reduce }) {
  const on = active;
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[56px] w-[472px]">
        <div className="rounded-[24px] bg-[#fffdf3] p-4 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.07)]">
          <div className={'rounded-[16px] bg-white p-5 font-sans text-[15px] leading-[2.15] text-ink-2 ' + RING}>
            <span className="text-[13px] text-ink-3">01:34</span><br />
            Honestly, <Mark tone={GREEN}>the team was burning hours every week on manual reporting,</Mark> so I needed <Mark tone={BLUE}>something that pulled the data automatically.</Mark> But migrating <Mark tone={ROSE}>two years of recordings felt impossible.</Mark> I just froze on it for weeks.
          </div>
          <div className={'mt-3 flex items-center gap-4 rounded-[16px] bg-white px-5 py-4 font-sans text-[14.5px] text-ink-2 ' + RING}>
            <span className="text-[13px] text-ink-3">00:25</span><span>I almost didn’t upgrade because I <Mark tone={WARM}>wasn’t sure it was worth it.</Mark></span>
          </div>
          <div className={'mt-3 flex items-center gap-4 rounded-[16px] bg-white px-5 py-4 font-sans text-[14.5px] text-ink-2 opacity-50 ' + RING}>
            <span className="text-[13px] text-ink-3">01:34</span><span>I was excited at first, but the onboarding felt <Mark tone={ROSE}>overwhelming.</Mark></span>
          </div>
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.3} className="left-[24px] top-[486px] w-[472px]">
        <div className={'flex items-center gap-4 rounded-[18px] bg-white px-4 py-3.5 ' + SOFT + ' ' + RING}>
          <Avatar c="S" size={44} /><Bars live={false} n={40} h={30} w={2.5} gap={3} />
          <span aria-hidden="true" className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Play className="size-4 fill-current" strokeWidth={0} /></span>
        </div>
      </Float>
    </Stage>
  );
}

// ——— 3. Structured summaries, every quote one click from its interview.
export function SummaryScene({ active, reduce }) {
  const on = active;
  const times = ['00:45:08', '00:25:38', '00:15:08'];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[70px] w-[472px]">
        <div className="rounded-[24px] bg-[#fffdf3] p-4 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.07)]">
          <div className="flex flex-col gap-3">
            {times.map((t, i) => (
              <div key={t} className={'rounded-[16px] bg-white px-5 py-4 ' + RING} style={{ opacity: i === 1 ? 1 : 1 }}>
                <p className={FIG + ' m-0 text-[15px] leading-[1.5] text-ink'}>“I was spending probably 15–20 hours per week just on scheduling interviews, taking notes, and then trying to organize everything afterward. It was insane.”</p>
                <div className="mt-2.5 flex items-center justify-between font-sans text-[12.5px]"><span className="inline-flex items-center gap-1.5 text-[#2f6fb8]">Jump to interview<ExternalLink className="size-3.5" strokeWidth={1.8} /></span><span className="tabular-nums text-ink-2">{t}</span></div>
              </div>
            ))}
          </div>
        </div>
      </Float>
      {/* A frosted layer over the quotes, behind the button, so the button stands out. */}
      <Float on={on} reduce={reduce} at={0.3} className="left-[24px] top-[196px] h-[190px] w-[472px]">
        <div aria-hidden="true" className="size-full bg-[#fffdf3]/80 backdrop-blur-[3px]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)' }} />
      </Float>
      <Float on={on} reduce={reduce} at={0.35} className="left-[110px] top-[278px] w-[300px]">
        <div className="flex items-center justify-center gap-3 rounded-[20px] bg-white py-4 shadow-[0_22px_44px_-18px_rgba(26,23,20,0.45)] ring-1 ring-[#1a1714]/[0.07]">
          <span className={FIG + ' text-[20px] text-ink'}>Jump to interview</span><ExternalLink className="size-5 text-ink" strokeWidth={1.8} />
        </div>
      </Float>
    </Stage>
  );
}
export const SUMMARIES_SCENES = [InterviewScene, MomentsScene, SummaryScene];
