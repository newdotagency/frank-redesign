// FigmaTemplates (V19) — the "Start from a problem" template section from Frank's Figma
// (✦ Frank Design › Study Creation — Empty State, node 9287:43427), built from its components:
// Template Card (icon tile, Try outline button, title, description, slash command), Template Search
// and the two Outline Icon Buttons. Sizes, colours and type are the design's own; the icons are the
// design's SVGs (public/figma/templates). Static: it's a picture of the app inside a marketing card.
const ICONS = '/figma/templates';

// Shadcn-style tokens used by the design.
const BORDER = '#e5e5e5';
const MUTED = '#737373';
const FG = '#0a0a0a';
const SHADOW_XS = 'drop-shadow(0 1px 1.5px rgba(23,23,23,0.05))';

const TEMPLATES = [
  { title: 'Churn Reasons', description: 'Cancellation causes, ranked', slash: '/churn-reasons', tint: '#fceee7', icon: 'churn-reasons' },
  { title: 'Trial Conversion', description: 'Why trial users don’t pay', slash: '/trial-conversion', tint: '#e7f9cc', icon: 'trial-conversion' },
  { title: 'Activation Barriers', description: 'Why new users don’t start', slash: '/activation-barriers', tint: '#f5f3ff', icon: 'activation-barriers' },
];

// The icon tiles, positioned exactly as the design nests each icon's group.
function TemplateIcon({ t }) {
  const img = <img alt="" className="block size-full max-w-none" src={`${ICONS}/${t.icon}.svg`} />;
  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-[12px]" style={{ backgroundColor: t.tint }}>
      {t.icon === 'churn-reasons' && (
        <div className="absolute inset-[20%] overflow-hidden">
          <div className="absolute inset-[20.83%_15.4%_15.62%_12.5%]"><div className="absolute inset-[-4.92%_-4.33%]">{img}</div></div>
        </div>
      )}
      {t.icon === 'trial-conversion' && (
        <div className="absolute inset-[20%] overflow-hidden">
          <div className="absolute inset-[12.5%]"><div className="absolute inset-[-3.61%]">{img}</div></div>
        </div>
      )}
      {t.icon === 'activation-barriers' && (
        <div className="absolute left-1/2 top-2 size-6 -translate-x-1/2 overflow-hidden">
          <div className="absolute inset-[12.5%_7.5%]"><div className="absolute inset-[-3.61%_-3.19%]">{img}</div></div>
        </div>
      )}
    </div>
  );
}

// Template Try: Outline Button, 54×32, "Try".
const TemplateTry = () => (
  <span className="flex h-8 w-[54px] shrink-0 items-center justify-center rounded-full border border-solid bg-white px-3 py-1.5 font-sans text-[14px] font-medium leading-5"
    style={{ borderColor: BORDER, color: FG, filter: SHADOW_XS }}>Try</span>
);

// Template Card.
function TemplateCard({ t }) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-[14px] overflow-hidden rounded-[16px] border border-solid bg-white p-4" style={{ borderColor: BORDER }}>
      <div className="flex w-full items-center justify-between">
        <TemplateIcon t={t} />
        <TemplateTry />
      </div>
      <div className="flex w-full flex-col gap-0.5 font-sans">
        <p className="m-0 text-[16px] font-medium leading-6" style={{ color: FG }}>{t.title}</p>
        <p className="m-0 text-[14px] leading-5" style={{ color: MUTED }}>{t.description}</p>
      </div>
      <p className="m-0 w-full font-gmono text-[12px] font-light leading-6" style={{ color: MUTED }}>{t.slash}</p>
    </div>
  );
}

// The section at the design's own size; the caller scales it to fit.
export default function FigmaTemplates({ width = 640 }) {
  return (
    <div className="flex flex-col items-start gap-4" style={{ width }}>
      <div className="flex w-full items-center justify-between">
        <p className="m-0 whitespace-nowrap font-sans text-[16px] font-medium leading-6" style={{ color: FG }}>Start from a problem</p>
        <div className="flex items-center gap-4">
          {/* Template Search: ghost button */}
          <span className="flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-4 font-sans text-[14px] font-medium leading-5" style={{ color: MUTED }}>
            <img alt="" className="block size-4" src={`${ICONS}/search.svg`} />Search all 11
          </span>
          <span className="flex items-center gap-2">
            <span className="flex items-center justify-center rounded-full border border-solid bg-white p-2 opacity-50" style={{ borderColor: BORDER }}>
              <img alt="" className="block size-4" src={`${ICONS}/arrow-left-01.svg`} />
            </span>
            <span className="flex items-center justify-center rounded-full border border-solid bg-white p-2" style={{ borderColor: BORDER, filter: SHADOW_XS }}>
              <img alt="" className="block size-4" src={`${ICONS}/arrow-right-01.svg`} />
            </span>
          </span>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        {TEMPLATES.map(t => <TemplateCard key={t.slash} t={t} />)}
      </div>
    </div>
  );
}
