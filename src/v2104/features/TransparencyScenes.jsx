// TransparencyScenes (V21.04): the three "How it works" visuals of the Transparency & security page, redrawn in the V21.04 colours as plain
// HTML and SVG (a 520 × 578 stage scaled to the card):
//   Sourced: a key insight with the quotes behind it, "Source: 12 interviews", and "100% verified from real conversations".
//   Secure:  SOC 2, ESOMAR and GDPR beside what they cover: encryption, access controls, secure storage.
//   Yours:   Control access, Manage data use, Set retention, floating over the insights and a transcript.
import { Clock, Eye, Lock, SlidersHorizontal, Database, Users, Zap, ExternalLink, TriangleAlert } from 'lucide-react';
import { Avatar, Bars, CARD, FIG, Float, Stage } from './GlobalScenes';

const RING = 'ring-1 ring-[#1a1714]/[0.06]';
const SOFT = 'shadow-[0_10px_22px_-14px_rgba(26,23,20,0.3)]';
const Mark = ({ tone, children }) => <span className={'rounded-full px-2 py-0.5 ' + tone}>{children}</span>;
const WARM = 'bg-[#fbf3db] text-[#8a6100]', GREEN = 'bg-[#e4f5c8] text-[#3f6b12]', ROSE = 'bg-[#f6e3dc] text-[#9a4a32]';

// ——— 1. Every insight traced to its source.
export function SourcedScene({ active, reduce }) {
  const on = active;
  const rows = [['S', 'Sarah M.', 'Marketing Lead', ['“I almost didn’t upgrade because I ', 'wasn’t sure it was worth it.', ''], ROSE], ['L', 'Luca D.', 'Project Manager', ['“We pull data from ', 'five different tools', ' just to build one report.”'], GREEN]];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[44px] w-[472px]">
        <div className={CARD + ' overflow-hidden !rounded-[26px]'}>
          <div className="px-6 pb-5 pt-6">
            <div className="flex items-center gap-2.5 font-sans text-[16px] text-ink"><Zap className="size-5 text-[#8a6100]" strokeWidth={1.8} />Key Insight</div>
            <p className={FIG + ' m-0 mt-3 text-[20px] leading-[1.5] tracking-[-0.01em] text-ink'}>Customers consistently highlight <span className="rounded-full bg-[#d1f899] px-2.5 py-0.5">reporting friction</span> as a major blocker to productivity.</p>
          </div>
        </div>
      </Float>
      {rows.map(([c, n, r, q, tone], i) => (
        <Float key={n} on={on} reduce={reduce} at={0.2 + i * 0.14} className="left-[44px] w-[432px]" style={{ top: 214 + i * 96 }}>
          <div className={'flex items-center gap-3 rounded-[16px] bg-white px-4 py-3 ' + SOFT + ' ' + RING}>
            <Avatar c={c} size={44} />
            <span className="flex w-[104px] shrink-0 flex-col leading-tight"><span className={FIG + ' text-[15px] text-ink'}>{n}</span><span className="text-[12px] text-ink-2">{r}</span></span>
            <span className="font-sans text-[11.5px] leading-[1.5] text-ink-2">{q[0]}<Mark tone={tone}>{q[1]}</Mark>{q[2]}</span>
          </div>
        </Float>
      ))}
      <Float on={on} reduce={reduce} at={0.5} className="left-[24px] top-[412px] w-[472px]">
        <div className="flex items-center justify-between rounded-[18px] bg-[#fffdf3] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.07)]">
          <span className="font-sans text-[15px] text-ink-2">Source: 12 interviews</span>
          <span className={'inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2 font-sans text-[14px] text-ink ' + RING}>View all sources<ExternalLink className="size-4" strokeWidth={1.8} /></span>
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.65} className="left-[24px] top-[490px] w-[472px]">
        <div className={'flex items-center justify-center gap-3 rounded-[18px] bg-white py-4 ' + SOFT + ' ' + RING}>
          <TriangleAlert className="size-5 text-[#3f6b12]" strokeWidth={1.8} /><span className={FIG + ' text-[17px] text-ink'}>100% verified from real conversations</span>
        </div>
      </Float>
    </Stage>
  );
}

// ——— 2. Secure by default.
function Badge({ kind }) {
  if (kind === 'soc') return (
    <div className="flex flex-col items-center text-center"><span className="grid size-[62px] place-items-center rounded-full border-[5px] border-[#1a1714] font-sans text-[13px] font-semibold text-ink">SOC 2</span><span className="mt-2 font-sans text-[12px] text-ink">SOC 2</span><span className="font-sans text-[9.5px] leading-tight text-ink-2">Independently audited for top-tier security and privacy.</span></div>
  );
  if (kind === 'esomar') return (
    <div className="flex flex-col items-center text-center"><span className={FIG + ' text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-ink'}>The ESOMAR<br />Awards 2025</span><span className="mt-2 font-sans text-[12px] text-ink">Award Winning Methodology</span><span className="font-sans text-[9.5px] leading-tight text-ink-2">Silver Winner for Breakthrough Research Methodology.</span></div>
  );
  return (
    <div className="flex flex-col items-center text-center"><span className="grid size-[62px] place-items-center rounded-full bg-[#2a3a2c] font-sans text-[12px] font-semibold text-[#d1f899]">GDPR</span><span className="mt-2 font-sans text-[12px] text-ink">GDPR</span><span className="font-sans text-[9.5px] leading-tight text-ink-2">Privacy built to meet EU regulations.</span></div>
  );
}
export function SecureScene({ active, reduce }) {
  const on = active;
  const rows = [['soc', Lock, 'End-to-end encryption', 'All data is encrypted in transit and at rest'], ['esomar', Users, 'Strict access controls', 'Role-based permissions and least-privilege access'], ['gdpr', Database, 'Secure storage', 'Industry-standard cloud infrastructure']];
  return (
    <Stage>
      {rows.map(([k, Icon, t, d], i) => (
        <Float key={t} on={on} reduce={reduce} at={i * 0.16} className="left-[24px] flex w-[472px] gap-3" style={{ top: 62 + i * 166 }}>
          <div className={'grid h-[148px] w-[138px] shrink-0 place-items-center rounded-[18px] bg-white p-3 ' + RING}><Badge kind={k} /></div>
          <div className={'flex h-[148px] flex-1 items-center gap-4 rounded-[20px] bg-white px-5 ' + SOFT + ' ' + RING}>
            <span aria-hidden="true" className="grid size-[48px] shrink-0 place-items-center rounded-full bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.7} /></span>
            <span className="flex flex-col leading-snug"><span className={FIG + ' text-[18px] font-medium text-ink'}>{t}</span><span className="mt-1 font-sans text-[14px] text-ink-2">{d}</span></span>
          </div>
        </Float>
      ))}
    </Stage>
  );
}

// ——— 3. Under your control.
export function YoursScene({ active, reduce }) {
  const on = active;
  const ctl = [[Eye, 'Control access'], [SlidersHorizontal, 'Manage data use'], [Clock, 'Set retention']];
  return (
    <Stage>
      <Float on={on} reduce={reduce} at={0} className="left-[24px] top-[48px] w-[330px] opacity-60">
        <div className="flex flex-col gap-4">
          {[['Sarah M.', 'Marketing Lead'], ['Luca D.', 'Project Manager'], ['Sarah M.', 'Marketing Lead']].map(([n, r], i) => (
            <div key={i} className={'rounded-[16px] bg-white px-5 py-5 ' + RING} style={{ opacity: 1 - i * 0.25 }}>
              <div className="font-sans text-[18px] text-ink-2">{n}</div><div className="font-sans text-[14px] text-ink-3">{r}</div>
            </div>
          ))}
        </div>
      </Float>
      <Float on={on} reduce={reduce} at={0.12} className="left-[236px] top-[40px] h-[480px] w-[260px]">
        <div className={'size-full rounded-[22px] bg-[#fffdf3] p-4 shadow-[inset_0_0_0_1px_rgba(26,23,20,0.07)]'}>
          <div className="flex items-center gap-3 rounded-[14px] bg-white p-2.5 opacity-70"><span className="size-9 shrink-0 rounded-[9px] bg-[#d1f899]" /><Bars live={false} n={22} h={26} w={2.5} gap={3} /></div>
          <div className="mt-4 rounded-[14px] bg-white p-4 font-sans text-[12.5px] leading-[1.9] text-ink-3 opacity-70">
            01:34<br />…hours every week on <Mark tone={GREEN}>manual reporting,</Mark><br />… <Mark tone={WARM}>wasn’t sure it was worth it.</Mark>
          </div>
        </div>
      </Float>
      {ctl.map(([Icon, t], i) => (
        <Float key={t} on={on} reduce={reduce} at={0.3 + i * 0.14} className="left-[60px] w-[290px]" style={{ top: 188 + i * 92 }}>
          <div className={'flex items-center gap-4 rounded-[18px] bg-white p-3.5 shadow-[0_18px_34px_-16px_rgba(26,23,20,0.4)] ' + RING}>
            <span aria-hidden="true" className="grid size-[58px] shrink-0 place-items-center rounded-[14px] bg-[#d1f899] text-[#2a321e]"><Icon className="size-6" strokeWidth={1.7} /></span>
            <span className={FIG + ' text-[18px] font-medium text-ink'}>{t}</span>
          </div>
        </Float>
      ))}
    </Stage>
  );
}
export const TRANSPARENCY_SCENES = [SourcedScene, SecureScene, YoursScene];
