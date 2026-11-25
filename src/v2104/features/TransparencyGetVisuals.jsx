// TransparencyGetVisuals (V21.04): the three "What you get" pictures of the Transparency & security page as plain HTML and SVG, on a 400 × 300
// stage (the card's 4:3): a quote traced to its interview, the security checklist, and a transcript with its highlighted moments.
import { Check, ExternalLink, Lock, Users, Database } from 'lucide-react';
import { Bars, Stage } from './GlobalScenes';

const FIG = "font-['Figtree',sans-serif]";
const BOX = 'rounded-[16px] bg-white shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)] ring-1 ring-[#1a1714]/[0.06]';

function TraceVisual() {
  return (
    <Stage w={400} h={300}>
      <div className="absolute left-[28px] top-[26px] flex w-[344px] justify-between font-sans text-[13px] text-ink-2"><span>James M.</span><span>Product Designer</span></div>
      <p className={FIG + ' absolute left-[28px] top-[62px] m-0 w-[344px] text-[24px] leading-[1.25] tracking-[-0.01em] text-ink'}>“It’s so easy to set up, we saw value within the first week.”</p>
      <div className="absolute left-[28px] top-[172px] flex h-[38px] w-[344px] items-center justify-center rounded-full bg-[#d1f899]/60 font-sans text-[12.5px] text-ink-2">Interview #34 &nbsp;•&nbsp; 00:34:20</div>
      <div className={BOX + ' absolute left-[28px] top-[224px] flex h-[48px] w-[344px] items-center justify-center gap-2.5 font-sans text-[15.5px] text-ink'}>Jump to interview<ExternalLink className="size-4" strokeWidth={1.8} /></div>
    </Stage>
  );
}
function ChecklistVisual() {
  return (
    <Stage w={400} h={300}>
      <div className={BOX + ' absolute left-[26px] top-[50px] w-[348px] !rounded-[20px] px-5 py-2'}>
        {[[Lock, 'End-to-end encryption'], [Users, 'Strict access controls'], [Database, 'Secure storage']].map(([Icon, t], i) => (
          <div key={t} className={'flex items-center gap-4 py-[18px] ' + (i ? 'border-t border-[#1a1714]/[0.07]' : '')}>
            <span aria-hidden="true" className="grid size-[38px] place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-[18px]" strokeWidth={1.8} /></span>
            <span className={FIG + ' flex-1 text-[16px] text-ink'}>{t}</span>
            <span aria-hidden="true" className="grid size-6 place-items-center rounded-full ring-1 ring-[#1a1714]/40"><Check className="size-3.5 text-ink" strokeWidth={2.2} /></span>
          </div>
        ))}
      </div>
    </Stage>
  );
}
function AuditVisual() {
  return (
    <Stage w={400} h={300}>
      <div className={BOX + ' absolute left-[24px] top-[22px] flex w-[352px] items-center gap-3 px-4 py-3.5'}>
        <Bars live={false} n={30} h={24} w={2.5} gap={3} /><span aria-hidden="true" className="ml-auto size-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[#5f8f22]" />
      </div>
      <div className={BOX + ' absolute left-[24px] top-[92px] w-[352px] px-4 py-4 font-sans text-[13.5px] text-ink-2'}>
        <div className="flex gap-5"><span className="tabular-nums">00:25</span><span className="leading-[2]">I almost didn’t upgrade because I <span className="rounded-full bg-[#fbf3db] px-2 py-0.5 text-[#8a6100]">wasn’t sure it was worth it.</span></span></div>
      </div>
      <div className={BOX + ' absolute left-[24px] top-[196px] w-[352px] px-4 py-4 font-sans text-[13.5px] text-ink-2'} style={{ opacity: 0.45 }}>
        Honestly, <span className="rounded-full bg-[#e4f5c8] px-2 py-0.5 text-[#3f6b12]">the team was burning</span>
      </div>
    </Stage>
  );
}
export const TRANSPARENCY_GET_VISUALS = [TraceVisual, ChecklistVisual, AuditVisual];
