// SummariesGetVisuals (V21.04): the three "What you get" pictures of the Automated summaries page as plain HTML and SVG, on a 400 × 300 stage:
// an interviewee's summary (motivations, objections, needs), a question to Frank, and a customer quote with its interview.
import { Heart, Search, Send, X } from 'lucide-react';
import { Avatar, Stage } from './GlobalScenes';

const FIG = "font-['Figtree',sans-serif]";
const BOX = 'rounded-[16px] bg-white shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]';

function SummaryVisual() {
  return (
    <Stage w={400} h={300}>
      <div className="absolute left-[28px] top-[26px] flex items-center gap-4"><Avatar c="S" size={52} /><span className="flex flex-col leading-tight"><span className={FIG + ' text-[20px] text-ink'}>Sarah K.</span><span className="text-[14px] text-ink-2">Growth Manager</span></span></div>
      {[[Heart, 'Motivations: clarity before commitment'], [X, 'Objections: confusing pricing structure'], [Search, 'Needs: transparent value communication']].map(([Icon, t], i) => (
        <div key={t} className={BOX + ' absolute left-[28px] flex w-[344px] items-center gap-3 px-3 py-2.5'} style={{ top: 100 + i * 62 }}>
          <span aria-hidden="true" className="grid size-[34px] shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-[17px]" strokeWidth={1.9} /></span>
          <span className="whitespace-nowrap font-sans text-[12.5px] text-ink-2">{t}</span>
        </div>
      ))}
    </Stage>
  );
}
function ChatVisual() {
  return (
    <Stage w={400} h={300}>
      <div className="absolute left-[30px] top-[44px] flex items-center gap-3"><span aria-hidden="true" className="grid size-8 place-items-center rounded-[9px] bg-[#1a1714] font-sans text-[15px] font-semibold text-[#d1f899]">?</span><span className={FIG + ' text-[18px] text-ink'}>Frank</span></div>
      <p className={FIG + ' absolute left-[30px] top-[100px] m-0 w-[320px] text-[23px] leading-[1.25] tracking-[-0.01em] text-ink'}>What are the top reasons customers choose us?</p>
      <div className="absolute left-[30px] top-[196px] flex h-[52px] w-[340px] items-center justify-between rounded-full bg-white px-5 shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.08]"><span className="font-sans text-[13.5px] text-ink-3">Type your feedback…</span><span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Send className="size-4" strokeWidth={1.9} /></span></div>
    </Stage>
  );
}
function QuoteVisual() {
  return (
    <Stage w={400} h={300}>
      <span aria-hidden="true" className={FIG + ' absolute left-[30px] top-[22px] text-[64px] font-bold leading-none text-[#5f8f22]'}>“</span>
      <p className={FIG + ' absolute left-[30px] top-[88px] m-0 w-[330px] text-[23px] leading-[1.25] tracking-[-0.01em] text-ink'}>It’s so easy to set up, we saw value within the first week.</p>
      <div className="absolute left-[30px] top-[192px] font-sans text-[14px] text-ink-2">James M. &nbsp;·&nbsp; Product Designer</div>
      <div className="absolute left-[30px] top-[226px] rounded-full bg-[#d1f899]/60 px-4 py-2 font-sans text-[12.5px] text-ink-2">Interview #34 &nbsp;•&nbsp; 00:34:20</div>
    </Stage>
  );
}
export const SUMMARIES_GET_VISUALS = [SummaryVisual, ChatVisual, QuoteVisual];
